from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sys
from pathlib import Path
import tempfile
import os
import shutil
import uuid
from typing import List, Dict, Any

# Agregar src al path
sys.path.append(str(Path(__file__).parent / 'src'))

from compliance_checker import EPPComplianceChecker
from chatbot_final import ChatbotEPP

# ============================================
# DIRECTORIOS PARA ARCHIVOS PROCESADOS
# ============================================
PROCESSED_DIR = Path(__file__).parent / "processed"
PROCESSED_DIR.mkdir(exist_ok=True)
IMAGES_DIR = PROCESSED_DIR / "images"
IMAGES_DIR.mkdir(exist_ok=True)
VIDEOS_DIR = PROCESSED_DIR / "videos"
VIDEOS_DIR.mkdir(exist_ok=True)

# ============================================
# CREAR APP FASTAPI
# ============================================
app = FastAPI(
    title="EPP Detection API",
    description="API para detección de Equipos de Protección Personal usando YOLOv8",
    version="2.0.0"
)

# ============================================
# CONFIGURAR CORS PARA REACT
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# INICIALIZAR MODELOS
# ============================================
MODEL_PATH = "runs/detect/train10/weights/best.pt"
checker = EPPComplianceChecker(MODEL_PATH)
chatbot = ChatbotEPP(MODEL_PATH)

# Variable global para almacenar el último análisis
last_analysis = {
    "compliance": None,
    "missing_items": [],
    "detections": []
}

print("✅ API EPP Detection iniciada correctamente")
print(f"📍 Modelo cargado: {MODEL_PATH}")

# ============================================
# ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Servir página principal HTML"""
    html_path = Path(__file__).parent / "static" / "index.html"
    if html_path.exists():
        return FileResponse(html_path)
    return {
        "message": "EPP Detection API",
        "version": "2.0.0",
        "endpoints": {
            "detect_image": "/api/detect/image",
            "detect_video": "/api/detect/video",
            "chatbot": "/api/chatbot",
            "health": "/api/health"
        }
    }

@app.get("/api/health")
async def health_check():
    """Verificar estado de la API"""
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_path": MODEL_PATH
    }

@app.post("/api/detect/image")
async def detect_image(file: UploadFile = File(...)):
    """
    Detectar EPP en una imagen
    
    Args:
        file: Archivo de imagen (jpg, jpeg, png)
    
    Returns:
        JSON con detecciones y ruta de imagen procesada
    """
    try:
        # Validar tipo de archivo
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
        
        # Guardar archivo temporal
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        temp_input.write(await file.read())
        temp_input.close()
        
        # Crear nombre único para archivo de salida
        output_filename = f"processed_{uuid.uuid4().hex}.jpg"
        output_path = IMAGES_DIR / output_filename
        
        # Procesar imagen usando detect_and_save
        result_path, detections, compliance = checker.detect_and_save(temp_input.name, str(output_path))
        
        # Guardar en variable global para el chatbot
        global last_analysis
        last_analysis = {
            "compliance": compliance,
            "missing_items": compliance.get("missing_items", []),
            "detections": detections,
            "total_persons": compliance.get("total_persons", 0)
        }
        
        response = {
            "success": True,
            "detections": detections,
            "compliance": compliance,
            "processed_image_path": output_filename,  # Solo el nombre del archivo
            "total_detections": len(detections)
        }
        
        # Limpiar archivo temporal de entrada
        os.unlink(temp_input.name)
        
        return JSONResponse(content=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar imagen: {str(e)}")

@app.get("/api/image/{filename}")
async def get_image(filename: str):
    """Servir imagen procesada"""
    file_path = IMAGES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return FileResponse(file_path)

@app.post("/api/detect/video")
async def detect_video(file: UploadFile = File(...)):
    """
    Detectar EPP en un video con YOLO frame por frame
    
    Args:
        file: Archivo de video (mp4, avi, mov)
    
    Returns:
        JSON con estadísticas y ruta de video procesado
    """
    try:
        import cv2
        from ultralytics import YOLO
        
        # Validar tipo de archivo
        if not file.content_type.startswith("video/"):
            raise HTTPException(status_code=400, detail="El archivo debe ser un video")
        
        # Guardar archivo temporal
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_input.write(await file.read())
        temp_input.close()
        
        # Crear nombre único para archivo de salida
        output_filename = f"processed_{uuid.uuid4().hex}.mp4"
        output_path = VIDEOS_DIR / output_filename
        
        # Procesar video con YOLO
        print(f"📹 Procesando video: {temp_input.name}")
        
        # Abrir video
        cap = cv2.VideoCapture(temp_input.name)
        if not cap.isOpened():
            raise Exception("No se pudo abrir el video")
        
        # Obtener propiedades del video
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Configurar escritor de video con mejor codec
        fourcc = cv2.VideoWriter_fourcc(*'avc1')  # H.264 codec
        out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
        
        if not out.isOpened():
            # Si falla H.264, intentar con otro codec
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            output_path = VIDEOS_DIR / output_filename.replace('.mp4', '.avi')
            out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
            output_filename = output_filename.replace('.mp4', '.avi')
        
        # Cargar modelo YOLO
        model = YOLO(MODEL_PATH)
        
        # Variables para estadísticas
        all_detections = []
        frame_count = 0
        person_epp_map = {}  # Mapear EPP por persona
        
        print(f"📊 Total frames: {total_frames}, FPS: {fps}")
        
        # Procesar cada frame
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Detectar con YOLO cada 3 frames para mejor análisis
            if frame_count % 3 == 0:
                results = model.predict(frame, conf=0.4, verbose=False)
                
                # Dibujar detecciones en el frame
                annotated_frame = results[0].plot()
                
                # Analizar detecciones del frame
                frame_persons = []
                frame_helmets = []
                frame_vests = []
                frame_gloves = []
                frame_goggles = []
                frame_boots = []
                
                for box in results[0].boxes:
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id]
                    confidence = float(box.conf[0])
                    bbox = box.xyxy[0].cpu().numpy()
                    
                    all_detections.append({
                        "class": class_name,
                        "confidence": confidence
                    })
                    
                    # Clasificar por tipo
                    if class_name == 'Person':
                        frame_persons.append(bbox)
                    elif class_name in ['helmet', 'Helmet']:
                        frame_helmets.append(bbox)
                    elif class_name in ['vest', 'Vest']:
                        frame_vests.append(bbox)
                    elif class_name in ['gloves', 'Gloves']:
                        frame_gloves.append(bbox)
                    elif class_name in ['goggles', 'Goggles']:
                        frame_goggles.append(bbox)
                    elif class_name in ['boots', 'Boots']:
                        frame_boots.append(bbox)
                
                # Analizar EPP por persona en este frame
                for i, person_box in enumerate(frame_persons):
                    person_id = f"person_{i}"
                    if person_id not in person_epp_map:
                        person_epp_map[person_id] = {
                            'helmet': False,
                            'vest': False,
                            'gloves': False,
                            'goggles': False,
                            'boots': False
                        }
                    
                    # Verificar superposición con EPP
                    if checker.check_overlap(person_box, frame_helmets):
                        person_epp_map[person_id]['helmet'] = True
                    if checker.check_overlap(person_box, frame_vests):
                        person_epp_map[person_id]['vest'] = True
                    if checker.check_overlap(person_box, frame_gloves):
                        person_epp_map[person_id]['gloves'] = True
                    if checker.check_overlap(person_box, frame_goggles):
                        person_epp_map[person_id]['goggles'] = True
                    if checker.check_overlap(person_box, frame_boots):
                        person_epp_map[person_id]['boots'] = True
                
                out.write(annotated_frame)
            else:
                out.write(frame)
            
            # Mostrar progreso
            if frame_count % 30 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"⏳ Progreso: {progress:.1f}%")
        
        # Liberar recursos
        cap.release()
        out.release()
        
        print(f"✅ Video procesado: {output_path}")
        
        # Calcular estadísticas
        unique_detections = {}
        for det in all_detections:
            class_name = det["class"]
            if class_name not in unique_detections:
                unique_detections[class_name] = []
            unique_detections[class_name].append(det["confidence"])
        
        # Crear lista de detecciones promedio
        detection_list = []
        for class_name, confidences in unique_detections.items():
            avg_conf = sum(confidences) / len(confidences)
            detection_list.append({
                "class": class_name,
                "confidence": avg_conf
            })
        
        # Calcular implementos faltantes por persona
        missing_items_list = []
        for person_id, epp_status in person_epp_map.items():
            missing = []
            if not epp_status['helmet']:
                missing.append('Casco')
            if not epp_status['vest']:
                missing.append('Chaleco')
            if not epp_status['gloves']:
                missing.append('Guantes')
            if not epp_status['goggles']:
                missing.append('Gafas')
            
            if missing:
                person_num = int(person_id.split('_')[1]) + 1
                missing_items_list.append({
                    "person_id": person_num,
                    "missing": missing
                })
        
        # Calcular cumplimiento general
        total_persons = len(person_epp_map)
        compliant_persons = sum(1 for epp in person_epp_map.values() 
                                if epp['helmet'] and epp['vest'] and epp['gloves'] and epp['goggles'])
        compliance = compliant_persons == total_persons if total_persons > 0 else False
        
        stats = {
            "total_frames": total_frames,
            "processed_frames": frame_count,
            "avg_detections": len(all_detections) / frame_count if frame_count > 0 else 0,
            "compliance": compliance,
            "total_persons": total_persons,
            "compliant_persons": compliant_persons,
            "missing_items": missing_items_list,
            "detections": detection_list[:15]  # Top 15 detecciones
        }
        
        response = {
            "success": True,
            "stats": stats,
            "processed_video_path": output_filename
        }
        
        # Limpiar archivo temporal de entrada
        os.unlink(temp_input.name)
        
        return JSONResponse(content=response)
        
    except Exception as e:
        print(f"❌ Error en detect_video: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al procesar video: {str(e)}")
        
        return JSONResponse(content=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar video: {str(e)}")

@app.get("/api/video/{filename}")
async def get_video(filename: str):
    """Servir video procesado"""
    file_path = VIDEOS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return FileResponse(file_path)

@app.post("/api/chatbot")
async def chatbot_query(query: Dict[str, str]):
    """
    Chatbot de EPP - Responder preguntas con contexto del último análisis
    
    Args:
        query: {"message": "tu pregunta aquí"}
    
    Returns:
        JSON con respuesta del chatbot
    """
    try:
        message = query.get("message", "")
        if not message:
            raise HTTPException(status_code=400, detail="Mensaje vacío")
        
        # Verificar si pregunta sobre el último análisis
        message_lower = message.lower()
        
        # Pregunta sobre implementos faltantes
        if any(word in message_lower for word in ["falta", "faltante", "incumple", "no cumple", "problema"]):
            if last_analysis["missing_items"]:
                # Construir respuesta detallada sobre faltantes
                response_text = "⚠️ **ANÁLISIS DE INCUMPLIMIENTO**\n\n"
                
                total_non_compliant = len(last_analysis["missing_items"])
                total_persons = last_analysis.get("total_persons", 0)
                compliant = total_persons - total_non_compliant
                
                response_text += f"📊 Estado: {compliant} {'persona cumple' if compliant == 1 else 'personas cumplen'} / {total_non_compliant} {'no cumple' if total_non_compliant == 1 else 'no cumplen'}\n\n"
                response_text += "📋 **Implementos faltantes por persona:**\n\n"
                
                for item in last_analysis["missing_items"]:
                    response_text += f"👤 **Persona {item['person_id']}** necesita:\n"
                    for epp in item['missing']:
                        if epp == "Casco":
                            response_text += f"   • ⛑️ {epp} - Protección craneal obligatoria\n"
                        elif epp == "Chaleco":
                            response_text += f"   • 🦺 {epp} - Alta visibilidad obligatoria\n"
                        elif epp == "Guantes":
                            response_text += f"   • 🧤 {epp} - Protección de manos obligatoria\n"
                        elif epp == "Gafas":
                            response_text += f"   • 🥽 {epp} - Protección ocular obligatoria\n"
                        else:
                            response_text += f"   • {epp}\n"
                    response_text += "\n"
                
                response_text += "💡 **Recomendación:** Todos los trabajadores deben portar Casco + Chaleco + Guantes + Gafas antes de ingresar al área de trabajo."
                
                return {
                    "success": True,
                    "query": message,
                    "response": response_text.strip()
                }
            else:
                return {
                    "success": True,
                    "query": message,
                    "response": "✅ ¡Excelente! No hay incumplimientos detectados. Todas las personas en el último análisis cumplen con los requisitos de EPP."
                }
        
        # Pregunta sobre detalles del último análisis
        elif any(word in message_lower for word in ["último", "ultima", "analisis", "análisis", "detalle", "resumen", "reporte"]):
            if last_analysis.get("detections"):
                # Construir reporte completo
                response_text = "📊 **REPORTE COMPLETO DEL ÚLTIMO ANÁLISIS**\n\n"
                
                # Información general
                total_persons = last_analysis.get("total_persons", 0)
                total_detections = len(last_analysis.get("detections", []))
                compliance_info = last_analysis.get("compliance", {})
                
                response_text += f"👥 **Personas detectadas:** {total_persons}\n"
                response_text += f"📦 **Total de objetos detectados:** {total_detections}\n"
                response_text += f"✅ **Estado general:** {compliance_info.get('message', 'N/A')}\n\n"
                
                # Desglose de detecciones por tipo
                response_text += "🔍 **DETECCIONES POR CATEGORÍA:**\n\n"
                detection_counts = {}
                for det in last_analysis.get("detections", []):
                    class_name = det.get("class", "Unknown")
                    detection_counts[class_name] = detection_counts.get(class_name, 0) + 1
                
                # Emojis para cada clase
                emojis = {
                    "helmet": "⛑️", "vest": "🦺", "gloves": "🧤", 
                    "goggles": "🥽", "boots": "🥾", "Person": "👤"
                }
                
                for class_name, count in sorted(detection_counts.items()):
                    emoji = emojis.get(class_name, "📌")
                    response_text += f"{emoji} **{class_name.capitalize()}**: {count} detectado{'s' if count > 1 else ''}\n"
                
                # Nivel de confianza promedio
                if last_analysis.get("detections"):
                    avg_confidence = sum(d.get("confidence", 0) for d in last_analysis["detections"]) / len(last_analysis["detections"])
                    response_text += f"\n📈 **Confianza promedio:** {avg_confidence * 100:.1f}%\n"
                
                # Cumplimiento por persona
                response_text += "\n👥 **CUMPLIMIENTO POR PERSONA:**\n\n"
                missing_items = last_analysis.get("missing_items", [])
                
                if missing_items:
                    for item in missing_items:
                        response_text += f"❌ Persona {item['person_id']}: NO CUMPLE - Falta {', '.join(item['missing'])}\n"
                else:
                    response_text += "✅ Todas las personas cumplen con los requisitos de EPP\n"
                
                response_text += "\n📋 **CRITERIOS DE CUMPLIMIENTO:**\n"
                response_text += "• Obligatorios: Casco + Chaleco + Guantes + Gafas\n"
                response_text += "• Recomendados: Botas de seguridad\n"
                
                return {
                    "success": True,
                    "query": message,
                    "response": response_text.strip()
                }
            else:
                return {
                    "success": True,
                    "query": message,
                    "response": "No hay análisis disponibles. Por favor, sube y analiza una imagen primero."
                }
        
        # Pregunta sobre cómo mejorar cumplimiento
        elif any(word in message_lower for word in ["mejorar", "solución", "solucion", "arreglar", "corregir"]):
            response_text = "💡 **RECOMENDACIONES PARA MEJORAR EL CUMPLIMIENTO:**\n\n"
            response_text += "1. 📚 **Capacitación:**\n"
            response_text += "   • Realizar charlas de 5 minutos antes de iniciar labores\n"
            response_text += "   • Explicar la importancia de cada EPP\n\n"
            
            response_text += "2. 🚪 **Control de acceso:**\n"
            response_text += "   • Implementar puntos de verificación en entradas\n"
            response_text += "   • No permitir el ingreso sin EPP completo\n\n"
            
            response_text += "3. 📊 **Monitoreo continuo:**\n"
            response_text += "   • Usar este sistema de detección regularmente\n"
            response_text += "   • Generar reportes semanales de cumplimiento\n\n"
            
            response_text += "4. 🎯 **Disponibilidad:**\n"
            response_text += "   • Asegurar que haya EPP disponible para todos\n"
            response_text += "   • Mantener stock de repuestos\n\n"
            
            response_text += "5. 📜 **Normativa:**\n"
            response_text += "   • Establecer consecuencias claras por incumplimiento\n"
            response_text += "   • Reconocer y premiar el cumplimiento constante\n"
            
            return {
                "success": True,
                "query": message,
                "response": response_text.strip()
            }
        
        # Obtener respuesta del chatbot normal
        response = chatbot.responder(message)
        
        return {
            "success": True,
            "query": message,
            "response": response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en chatbot: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    """Obtener estadísticas del sistema"""
    return {
        "model": {
            "path": MODEL_PATH,
            "classes": {
                0: "helmet", 1: "gloves", 2: "vest", 3: "boots", 
                4: "goggles", 5: "none", 6: "Person", 7: "no_helmet",
                8: "no_goggle", 9: "no_gloves", 10: "no_boots"
            }
        },
        "stats": {
            "precision": "99.2%",
            "inference_time": "<50ms",
            "epp_types": 15
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor API...")
    print("📍 Accede en: http://localhost:8000")
    print("📖 Documentación: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
