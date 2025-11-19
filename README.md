# EPP DETECTION SYSTEM - GUÍA DE INICIO RÁPIDO

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────┐
│   FRONTEND (React + TypeScript)    │
│   Web Page Design for EPP Detection│
│   Puerto: 5173                      │
│   - UI/UX Moderna                   │
│   - Animaciones Framer Motion       │
│   - Componentes Interactivos        │
└──────────────┬──────────────────────┘
               │
               │ HTTP Requests (API Calls)
               │
┌──────────────▼──────────────────────┐
│   BACKEND (Python + FastAPI)       │
│   IA_Final                          │
│   Puerto: 8000                      │
│   - YOLOv8 Detection                │
│   - Video Analysis                  │
│   - EPP Chatbot                     │
└─────────────────────────────────────┘
```

## 🚀 CÓMO EJECUTAR EL PROYECTO

### Opción 1: Ejecutar TODO automáticamente

```powershell
# En la raíz del proyecto
.\start_all.ps1
```

### Opción 2: Ejecutar manualmente (2 terminales)

**Terminal 1 - Backend API:**
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
.\start_backend.ps1
```

**Terminal 2 - Frontend React:**
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\Web Page Design for EPP Detection"
.\start_frontend.ps1
```

## 📡 ENDPOINTS DE LA API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Info de la API |
| GET | `/api/health` | Estado del servicio |
| POST | `/api/detect/image` | Detectar EPP en imagen |
| POST | `/api/detect/video` | Detectar EPP en video |
| POST | `/api/chatbot` | Consultar chatbot |
| GET | `/api/stats` | Estadísticas del modelo |
| GET | `/api/image/{filename}` | Obtener imagen procesada |
| GET | `/api/video/{filename}` | Obtener video procesado |

## 🌐 URLS IMPORTANTES

- **Frontend React**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentación API (Swagger)**: http://localhost:8000/docs
- **Documentación API (ReDoc)**: http://localhost:8000/redoc

## 📦 ESTRUCTURA DEL PROYECTO

```
trabajo ia final/
├── IA_Final/                          # ✅ BACKEND (API)
│   ├── api.py                         # FastAPI application
│   ├── src/
│   │   ├── compliance_checker.py      # YOLOv8 image detection
│   │   ├── video_analyzer.py          # Video processing
│   │   └── chatbot_final.py           # EPP chatbot
│   ├── runs/detect/train10/weights/   # Modelo YOLOv8
│   ├── requirements.txt               # Dependencias Python
│   └── start_backend.ps1              # Script de inicio

└── Web Page Design for EPP Detection/ # ✅ FRONTEND (React)
    ├── src/
    │   ├── components/                # React components
    │   │   ├── ImageDetection.tsx     # Detección de imágenes (conectado a API)
    │   │   ├── VideoDetection.tsx     # Detección de videos
    │   │   ├── Chatbot.tsx            # Chat interface
    │   │   └── Hero.tsx               # Landing page
    │   ├── lib/
    │   │   └── api.ts                 # ✅ API client (conecta con backend)
    │   └── App.tsx                    # Main application
    ├── package.json                   # Dependencias Node.js
    └── start_frontend.ps1             # Script de inicio
```

## 🔧 INSTALACIÓN DE DEPENDENCIAS

### Backend (Python):
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
pip install -r requirements.txt
```

### Frontend (Node.js):
```powershell
cd "c:\Users\Braya\Desktop\trabajo ia final\Web Page Design for EPP Detection"
npm install
```

## 🎯 FUNCIONALIDADES

### ✅ Detección de EPP en Imágenes
- Sube una imagen desde el frontend
- El backend procesa con YOLOv8
- Retorna detecciones con confianza
- Muestra imagen procesada con bounding boxes

### ✅ Análisis de Videos
- Sube videos para análisis frame-by-frame
- Estadísticas de detección
- Video procesado con anotaciones

### ✅ Chatbot EPP
- Consultas sobre normativas
- Información sobre EPP
- Respuestas basadas en conocimiento

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "API no responde"
- Verifica que el backend esté corriendo en el puerto 8000
- Revisa la consola del backend por errores

### Error: "CORS"
- El backend ya está configurado para aceptar requests desde localhost:5173
- Verifica que ambos servicios estén corriendo

### Error: "Modelo no encontrado"
- Asegúrate de que exista: `runs/detect/train10/weights/best.pt`
- Descarga o entrena el modelo YOLOv8

## 📝 NOTAS IMPORTANTES

1. **Siempre ejecutar BACKEND primero**, luego el frontend
2. El frontend se conecta automáticamente a `http://localhost:8000`
3. Los archivos temporales se guardan en el sistema
4. La API tiene documentación interactiva en `/docs`

## 🎨 TECNOLOGÍAS USADAS

### Frontend:
- ⚛️ React 19
- 📘 TypeScript
- 🎨 TailwindCSS
- ✨ Framer Motion
- ⚡ Vite

### Backend:
- 🐍 Python 3.11
- ⚡ FastAPI
- 🤖 YOLOv8 (Ultralytics)
- 🎥 OpenCV
- 🖼️ PIL (Pillow)

## 👨‍💻 DESARROLLO

Para desarrollo, ambos servidores tienen hot-reload:
- Backend: Cambios en `.py` recargan automáticamente
- Frontend: Cambios en `.tsx` actualizan el navegador

---

**¡Listo para usar! 🚀**
