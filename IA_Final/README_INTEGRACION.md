# 🛡️ EPP Detection System - Versión Integrada

## 🎨 Diseño Integrado

Este archivo (`app_integrated.py`) integra el diseño moderno de la carpeta "Web Page Design for EPP Detection" con la funcionalidad completa de tu aplicación de detección EPP en Streamlit.

## ✨ Características del Nuevo Diseño

### Paleta de Colores
- **Gradientes modernos**: Cyan → Blue → Purple (inspirado en el diseño React)
- **Fondo oscuro**: Slate 950/900 con efectos de partículas simulados
- **Acentos vibrantes**: Cyan (#06b6d4) y Blue (#3b82f6)

### Componentes Mejorados
1. **Hero Section** - Título con gradiente animado y estadísticas flotantes
2. **Feature Cards** - 6 tarjetas con íconos degradados y efectos hover
3. **Tabs Modernos** - Estilo pill con animaciones suaves
4. **Botones Mejorados** - Gradientes cyan-blue con efectos de elevación
5. **Métricas Flotantes** - Cards con blur backdrop y animaciones
6. **File Uploader** - Diseño con bordes punteados y hover effects
7. **Chat Mejorado** - Mensajes con blur backdrop

## 🚀 Cómo Ejecutar

### Opción 1: Usar el nuevo diseño integrado (Recomendado)
```bash
streamlit run app_integrated.py
```

### Opción 2: Usar el diseño original
```bash
streamlit run app.py
```

## 📦 Dependencias

Asegúrate de tener instaladas todas las dependencias:

```bash
pip install -r requirements.txt
```

Las dependencias principales son:
- `streamlit` - Framework web
- `ultralytics` - YOLOv8
- `torch`, `torchvision`, `torchaudio` - PyTorch
- `opencv-python` - Procesamiento de video
- `pillow` - Procesamiento de imágenes
- `numpy`, `pandas` - Manipulación de datos
- `plotly` - Visualizaciones

## 🎯 Funcionalidad Mantenida

✅ **Detección de Imágenes** - Análisis completo de EPP en imágenes estáticas
✅ **Análisis de Videos** - Procesamiento frame por frame con estadísticas
✅ **Chatbot EPP** - Asistente virtual con conocimiento de normativas
✅ **Reportes Detallados** - Estadísticas y cumplimiento por persona
✅ **Descarga de Videos** - Exportar videos con detecciones

## 🎨 Diferencias Visuales

### Diseño Original (`app.py`)
- Gradiente verde neón (#00ff88)
- Fondo morado oscuro
- Estilo "cyberpunk"

### Diseño Integrado (`app_integrated.py`)
- Gradiente cyan-blue-purple
- Fondo slate oscuro con partículas
- Estilo "moderno profesional"
- Efectos de blur backdrop
- Animaciones suaves
- Cards flotantes con sombras

## 🔧 Personalización

Si quieres ajustar los colores, busca estas secciones en `app_integrated.py`:

```python
# Colores principales
--color-cyan-400: #06b6d4
--color-blue-500: #3b82f6
--color-purple-500: #8b5cf6

# Gradientes
linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)
```

## 📱 Responsive

El diseño se adapta automáticamente a diferentes tamaños de pantalla gracias a:
- Contenedores fluidos
- Columnas responsivas de Streamlit
- Tamaños de fuente escalables

## 🌟 Próximas Mejoras Sugeridas

1. **Modo claro/oscuro** - Toggle para cambiar tema
2. **Exportar reportes PDF** - Generar PDF con los análisis
3. **Histórico de análisis** - Guardar análisis previos
4. **Comparación de videos** - Comparar dos videos lado a lado
5. **Dashboard analítico** - Gráficos de tendencias

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verifica que streamlit esté instalado
pip install streamlit --upgrade
```

### Error de modelo no encontrado
```bash
# Verifica que exista el modelo en:
# runs/detect/train10/weights/best.pt
```

### Estilos no se aplican correctamente
- Limpia el caché del navegador (Ctrl + Shift + R)
- Reinicia el servidor de Streamlit

## 📞 Soporte

Si encuentras algún problema, verifica:
1. Todas las dependencias están instaladas
2. El modelo YOLO está en la ruta correcta
3. Los archivos en `src/` están accesibles

## 🎓 Tecnologías Utilizadas

- **Frontend**: Streamlit + Custom CSS
- **Backend**: Python 3.x
- **IA/ML**: YOLOv8 (Ultralytics)
- **Procesamiento**: OpenCV, PIL
- **Diseño**: Inspirado en React + TailwindCSS

---

**Desarrollado con ❤️ usando Streamlit y YOLOv8**
