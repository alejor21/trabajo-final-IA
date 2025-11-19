# Script de instalación y verificación
# Ejecuta este archivo con: python setup.py

import subprocess
import sys
import os

print("=" * 70)
print("🛡️  EPP DETECTION SYSTEM - INSTALACIÓN Y VERIFICACIÓN")
print("=" * 70)
print()

# Verificar que estamos en el directorio correcto
if not os.path.exists('requirements.txt'):
    print("❌ Error: No se encuentra requirements.txt")
    print("   Asegúrate de ejecutar este script desde la carpeta IA_Final")
    sys.exit(1)

print("📦 Paso 1/4: Instalando dependencias...")
print("-" * 70)

try:
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    print("✅ Dependencias instaladas correctamente")
except subprocess.CalledProcessError:
    print("❌ Error al instalar dependencias")
    print("   Intenta manualmente: pip install -r requirements.txt")
    sys.exit(1)

print()
print("🔍 Paso 2/4: Verificando instalación de Streamlit...")
print("-" * 70)

try:
    import streamlit
    print(f"✅ Streamlit {streamlit.__version__} instalado correctamente")
except ImportError:
    print("❌ Streamlit no está instalado")
    sys.exit(1)

print()
print("🔍 Paso 3/4: Verificando modelo YOLO...")
print("-" * 70)

model_path = "runs/detect/train10/weights/best.pt"
if os.path.exists(model_path):
    print(f"✅ Modelo encontrado en: {model_path}")
else:
    print(f"⚠️  ADVERTENCIA: No se encuentra el modelo en {model_path}")
    print("   La aplicación necesita este modelo para funcionar")
    print("   Asegúrate de entrenar el modelo o colocarlo en la ruta correcta")

print()
print("🔍 Paso 4/4: Verificando archivos fuente...")
print("-" * 70)

required_files = [
    "src/chatbot_final.py",
    "src/compliance_checker.py",
    "src/video_analyzer.py",
    "app_integrated.py",
    "app.py"
]

all_files_ok = True
for file in required_files:
    if os.path.exists(file):
        print(f"✅ {file}")
    else:
        print(f"❌ {file} - NO ENCONTRADO")
        all_files_ok = False

print()
print("=" * 70)

if all_files_ok:
    print("✅ VERIFICACIÓN COMPLETADA - Todo listo!")
    print()
    print("🚀 Para ejecutar la aplicación, usa uno de estos comandos:")
    print()
    print("   Versión integrada (nuevo diseño):")
    print("   → streamlit run app_integrated.py")
    print()
    print("   Versión original:")
    print("   → streamlit run app.py")
    print()
    print("   O usa el script helper:")
    print("   → python run_integrated.py")
else:
    print("❌ FALTAN ALGUNOS ARCHIVOS")
    print()
    print("   Verifica que todos los archivos estén en su lugar")

print("=" * 70)
