# 🚀 Sistema de Detección EPP - Instrucciones

## ✅ Mejoras Implementadas

### 1. **Implementos Faltantes por Persona**
- Ahora al analizar una imagen, el sistema muestra qué EPP le falta a cada persona detectada
- Ejemplo: "Persona 1: Falta Casco, Guantes, Gafas"

### 2. **Chatbot con Botones de Respuesta Rápida**
- 6 botones predefinidos con preguntas comunes:
  - ❓ ¿Qué es EPP?
  - 📋 Normativas
  - ⚙️ Funcionamiento
  - 🪖 Cascos
  - 🦺 Chalecos
  - 🧤 Guantes

### 3. **Interfaz Mejorada**
- Diseño moderno con gradientes morados
- Visualización lado a lado: Detección + Chatbot
- Comparación de imagen original vs procesada

---

## 🎯 Cómo Ejecutar la Aplicación

### Opción 1: Interfaz HTML Simple (RECOMENDADO para presentación)

#### Paso 1: Iniciar Backend
Abre PowerShell y ejecuta:
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

#### Paso 2: Abrir en Navegador
Ve a: **http://localhost:8000**

✅ ¡Listo! La aplicación está funcionando con todas las mejoras.

---

### Opción 2: Si tienes el nuevo diseño React

Cuando copies el nuevo diseño en la carpeta "Web Page Design for EPP Detection":

#### Terminal 1 - Backend:
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend:
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\Web Page Design for EPP Detection"
npm install
npm run dev
```

Luego abre: **http://localhost:3001** (o el puerto que indique)

---

## 🎓 Para Mostrarle al Profesor

### Funcionalidades Destacadas:

1. **Detección Inteligente**
   - Sube una imagen
   - El sistema detecta: casco, chaleco, guantes, gafas, botas
   - Muestra imagen original vs imagen procesada con cuadros de detección

2. **Análisis de Cumplimiento**
   - Indica cuántas personas cumplen/no cumplen
   - **NUEVO:** Lista específica de qué implemento falta por cada persona

3. **Chatbot Interactivo**
   - **NUEVO:** Botones de respuesta rápida
   - Preguntas sobre normativas y EPP
   - Respuestas basadas en el modelo entrenado

4. **Análisis de Videos** (disponible vía API)
   - Procesa videos frame por frame
   - Estadísticas completas

---

## 🔧 Estructura de Archivos

```
IA_Final/
├── api.py                 # Backend FastAPI
├── static/
│   └── index.html        # Interfaz web con todas las mejoras
├── processed/
│   ├── images/           # Imágenes procesadas
│   └── videos/           # Videos procesados
├── src/
│   ├── compliance_checker.py  # Detección EPP (ACTUALIZADO)
│   ├── video_analyzer.py      # Análisis de videos
│   └── chatbot_final.py       # Chatbot
└── runs/detect/train10/weights/best.pt  # Modelo YOLO

Web Page Design for EPP Detection/
└── (Actualmente vacía - pendiente nuevo diseño)
```

---

## 📊 API Endpoints

- `GET /` - Interfaz web principal
- `POST /api/detect/image` - Detectar EPP en imagen
- `POST /api/detect/video` - Analizar video
- `POST /api/chatbot` - Consultar chatbot
- `GET /api/image/{filename}` - Obtener imagen procesada
- `GET /api/video/{filename}` - Obtener video procesado

---

## 🆘 Solución de Problemas

### Error "Connection refused"
```powershell
# Verifica que el backend esté corriendo:
cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### El backend no inicia
```powershell
# Reinstala dependencias:
pip install fastapi uvicorn python-multipart ultralytics opencv-python
```

### Sobre el nuevo diseño
- La carpeta "Web Page Design for EPP Detection" está vacía
- Copia el nuevo diseño allí cuando lo tengas
- Ejecuta `npm install` y luego `npm run dev`

---

## 🎉 ¡Todo Listo!

Para la presentación, simplemente:
1. Abre PowerShell
2. Ejecuta: `cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"`
3. Ejecuta: `python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000`
4. Abre: http://localhost:8000

¡La aplicación tiene todas las funcionalidades solicitadas! 🚀
