# Script para ejecutar la aplicación con el nuevo diseño integrado
# Ejecuta este archivo con: python run_integrated.py

import subprocess
import sys

print("=" * 60)
print("🛡️  EPP DETECTION SYSTEM - DISEÑO INTEGRADO")
print("=" * 60)
print()
print("Iniciando la aplicación con el nuevo diseño moderno...")
print("Inspirado en el diseño de 'Web Page Design for EPP Detection'")
print()
print("Características del nuevo diseño:")
print("  ✨ Gradientes Cyan → Blue → Purple")
print("  ✨ Efectos de partículas en el fondo")
print("  ✨ Cards flotantes con blur backdrop")
print("  ✨ Animaciones suaves y modernas")
print("  ✨ Tabs con estilo pill")
print("  ✨ Botones con efectos de elevación")
print()
print("La aplicación se abrirá en tu navegador automáticamente...")
print("=" * 60)
print()

try:
    subprocess.run([sys.executable, "-m", "streamlit", "run", "app_integrated.py"])
except KeyboardInterrupt:
    print("\n\n✅ Aplicación cerrada correctamente")
except Exception as e:
    print(f"\n❌ Error al iniciar la aplicación: {e}")
    print("\nPuedes iniciar manualmente con:")
    print("  streamlit run app_integrated.py")
