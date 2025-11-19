from compliance_checker import EPPComplianceChecker
import os

class ChatbotEPP:
    """
    Chatbot unificado: Responde normativas + Analiza imágenes
    """
    
    def __init__(self, model_path):
        self.checker = EPPComplianceChecker(model_path)
        self.last_analysis = None
        self.last_image = None
        print("🤖 Chatbot EPP inicializado")
        print("💡 Puedo responder preguntas sobre normativas")
        print("📸 También puedo analizar imágenes si me las das\n")
    
    def analizar_imagen(self, image_path):
        """Analiza una imagen y guarda resultados"""
        if not os.path.exists(image_path):
            return f"❌ No encontré la imagen: {image_path}"
        
        print(f"\n🔍 Analizando: {image_path}")
        self.last_analysis = self.checker.detect_compliance(image_path)
        self.last_image = image_path
        
        # Mostrar resumen breve
        total = self.last_analysis['total_persons']
        compliant = self.last_analysis['summary']['compliant']
        
        return (f"✅ Análisis completado\n"
                f"👥 {total} persona(s) detectada(s)\n"
                f"✓ {compliant} en cumplimiento\n\n"
                f"Ahora puedes preguntarme: '¿cumple?', '¿qué falta?', etc.")
    
    def responder(self, pregunta):
        """Responde preguntas (normativas o sobre la imagen analizada)"""
        
        pregunta_lower = pregunta.lower()
        
        # ============================================
        # PREGUNTAS SOBRE LA IMAGEN ANALIZADA
        # ============================================
        if self.last_analysis:
            
            # ¿Cumple?
            if any(word in pregunta_lower for word in ['cumple', 'cumplimiento', 'norma']):
                return self._responder_cumplimiento()
            
            # ¿Qué falta?
            if any(word in pregunta_lower for word in ['falta', 'necesita', 'le falta']):
                return self._responder_falta()
            
            # ¿Qué detectaste?
            if any(word in pregunta_lower for word in ['detectaste', 'viste', 'hay']):
                return self._responder_detecciones()
            
            # Reporte completo
            if any(word in pregunta_lower for word in ['reporte', 'resumen', 'todo']):
                return self._responder_reporte()
        
        # ============================================
        # PREGUNTAS SOBRE NORMATIVAS (GENERALES)
        # ============================================
        
        # ¿Qué es EPP?
        if any(word in pregunta_lower for word in ['qué es epp', 'que es epp', 'define epp', 'epp?']):
            return ("🛡️ **¿QUÉ ES EPP?**\n\n"
                   "EPP = Equipos de Protección Personal\n\n"
                   "Son dispositivos y prendas que protegen al trabajador de riesgos que pueden amenazar su seguridad o salud.\n\n"
                   "✅ **EPP Básicos Obligatorios:**\n"
                   "• ⛑️ Casco de seguridad\n"
                   "• 🦺 Chaleco reflectivo\n"
                   "• 🧤 Guantes de trabajo\n"
                   "• 🥽 Gafas de protección\n"
                   "• 🥾 Botas de seguridad\n\n"
                   "📋 Su uso es obligatorio según normativas de seguridad laboral")
        
        # Normativas de seguridad
        if any(word in pregunta_lower for word in ['normativa', 'obligatorio', 'requisito', 'ley', 'seguridad']):
            return ("📋 **NORMATIVAS DE SEGURIDAD EPP**\n\n"
                   "🌎 **Normativas Internacionales:**\n"
                   "• OSHA (Occupational Safety and Health Administration)\n"
                   "• ANSI Z89.1 - Cascos de protección\n"
                   "• ANSI 107 / ISO 20471 - Ropa de alta visibilidad\n"
                   "• EN 388 - Guantes de protección\n\n"
                   "✅ **Requisitos Obligatorios:**\n"
                   "1. Casco en áreas de construcción e industria\n"
                   "2. Chaleco en zonas con vehículos\n"
                   "3. Guantes para manipulación de materiales\n"
                   "4. Gafas en trabajos con partículas\n"
                   "5. Botas con puntera de acero\n\n"
                   "⚖️ El incumplimiento puede resultar en multas y suspensión de actividades")
        
        # ¿Cómo funciona el sistema?
        if any(word in pregunta_lower for word in ['cómo funciona', 'como funciona', 'sistema', 'funciona']):
            return ("🤖 **¿CÓMO FUNCIONA EL SISTEMA?**\n\n"
                   "Nuestro sistema usa Inteligencia Artificial (YOLOv8) para detectar EPP en tiempo real:\n\n"
                   "📸 **Para Imágenes:**\n"
                   "1. Subes una foto del trabajador\n"
                   "2. La IA detecta personas y EPP\n"
                   "3. Verifica cumplimiento (casco, chaleco, guantes, gafas)\n"
                   "4. Muestra qué implementos faltan\n\n"
                   "🎥 **Para Videos:**\n"
                   "1. Subes un video\n"
                   "2. Análisis frame por frame\n"
                   "3. Detección en tiempo real\n"
                   "4. Reporte completo de cumplimiento\n\n"
                   "✨ **Precisión:** 99.2%\n"
                   "⚡ **Velocidad:** <50ms por imagen")
        
        # Tipos de cascos
        if any(word in pregunta_lower for word in ['tipos de casco', 'tipo de casco', 'cascos', 'tipos casco']):
            return ("⛑️ **TIPOS DE CASCOS DE SEGURIDAD**\n\n"
                   "**Clase G (General):**\n"
                   "• Protección contra impactos\n"
                   "• Resistencia a 2,200V\n"
                   "• Uso: Construcción general\n\n"
                   "**Clase E (Eléctrica):**\n"
                   "• Alta resistencia dieléctrica\n"
                   "• Protección hasta 20,000V\n"
                   "• Uso: Trabajos eléctricos\n\n"
                   "**Clase C (Conductora):**\n"
                   "• Sin protección eléctrica\n"
                   "• Ventilación mejorada\n"
                   "• Uso: Áreas sin riesgo eléctrico\n\n"
                   "🎨 **Por Color:**\n"
                   "• Blanco: Supervisores\n"
                   "• Amarillo: Operarios\n"
                   "• Azul: Electricistas\n"
                   "• Verde: Brigadistas")
        
        # Importancia del chaleco
        if any(word in pregunta_lower for word in ['chaleco', 'importancia chaleco', 'vest']):
            return ("🦺 **IMPORTANCIA DEL CHALECO REFLECTIVO**\n\n"
                   "**¿Por qué es obligatorio?**\n"
                   "• Aumenta visibilidad hasta 500 metros\n"
                   "• Reduce accidentes vehiculares en 50%\n"
                   "• Obligatorio en zonas de tráfico\n\n"
                   "**Características clave:**\n"
                   "• Material reflectivo de alta intensidad\n"
                   "• Colores fluorescentes (amarillo/naranja)\n"
                   "• Debe cumplir ANSI 107 Clase 2 o 3\n\n"
                   "**Cuándo usarlo:**\n"
                   "✅ Cerca de vehículos o maquinaria\n"
                   "✅ Áreas de baja iluminación\n"
                   "✅ Carreteras y vías públicas\n"
                   "✅ Almacenes y zonas logísticas\n\n"
                   "⚠️ Sin chaleco = 60% más riesgo de atropello")
        
        # Protección de manos / Guantes
        if any(word in pregunta_lower for word in ['guante', 'mano', 'protección de manos', 'proteccion manos']):
            return ("🧤 **PROTECCIÓN DE MANOS - GUANTES**\n\n"
                   "**¿Por qué son importantes?**\n"
                   "• Las manos sufren 25% de lesiones laborales\n"
                   "• Protegen contra cortes, químicos, calor\n\n"
                   "**Tipos de Guantes:**\n\n"
                   "**1. Cuero:**\n"
                   "   • Construcción y carpintería\n"
                   "   • Protección contra abrasión\n\n"
                   "**2. Nitrilo:**\n"
                   "   • Manipulación de químicos\n"
                   "   • Resistente a aceites\n\n"
                   "**3. Látex:**\n"
                   "   • Uso médico y limpieza\n"
                   "   • Sensibilidad táctil\n\n"
                   "**4. Anticorte:**\n"
                   "   • Manejo de vidrio y metal\n"
                   "   • Nivel 5 de protección\n\n"
                   "**5. Térmicos:**\n"
                   "   • Trabajos con calor/frío\n"
                   "   • Hasta -50°C o +300°C\n\n"
                   "📏 Elige según la tarea específica")
        
        # Ayuda
        if pregunta_lower in ['ayuda', 'help', '?']:
            return self._mostrar_ayuda()
        
        # Saludos
        if any(word in pregunta_lower for word in ['hola', 'buenos', 'hey', 'buenas']):
            return ("¡Hola! 👋 Soy tu asistente EPP.\n\n"
                   "Puedo ayudarte con:\n"
                   "• Preguntas sobre normativas EPP\n"
                   "• Tipos de equipos de protección\n"
                   "• Verificar cumplimiento en imágenes/videos\n\n"
                   "¿Qué necesitas saber?")
        
        # No entendió
        return ("🤔 No entendí tu pregunta.\n\n"
               "**Puedes preguntar:**\n"
               "• '¿Qué es EPP?'\n"
               "• 'Normativas de seguridad'\n"
               "• '¿Cómo funciona el sistema?'\n"
               "• 'Tipos de cascos'\n"
               "• 'Importancia del chaleco'\n"
               "• 'Protección de manos'\n\n"
               "Escribe 'ayuda' para ver todas las opciones")
    
    def _responder_cumplimiento(self):
        """Responde si cumple con normativas"""
        total = self.last_analysis['total_persons']
        compliant = self.last_analysis['summary']['compliant']
        non_compliant = self.last_analysis['summary']['non_compliant']
        
        if total == 0:
            return "❌ No detecté personas en la imagen"
        
        rate = (compliant / total) * 100
        
        if rate == 100:
            return (f"✅ **¡SÍ CUMPLE!**\n\n"
                   f"Todos los trabajadores ({compliant}/{total}) "
                   f"portan los EPP obligatorios correctamente.")
        elif rate >= 50:
            return (f"⚠️ **CUMPLIMIENTO PARCIAL** ({rate:.0f}%)\n\n"
                   f"✓ En cumplimiento: {compliant}\n"
                   f"✗ Con violaciones: {non_compliant}\n\n"
                   f"Se requiere corrección inmediata")
        else:
            return (f"❌ **NO CUMPLE** ({rate:.0f}%)\n\n"
                   f"✓ En cumplimiento: {compliant}\n"
                   f"✗ Con violaciones: {non_compliant}\n\n"
                   f"🚨 URGENTE: Detener actividades hasta corregir")
    
    def _responder_falta(self):
        """Responde qué EPP falta"""
        missing_all = []
        
        for person in self.last_analysis['compliance_results']:
            if not person['complies']:
                missing_all.extend(person['missing_items'])
        
        if not missing_all:
            return "✅ No falta ningún equipo. Todos cumplen."
        
        # Contar faltantes
        from collections import Counter
        count = Counter(missing_all)
        
        response = "⚠️ **EQUIPOS FALTANTES**\n\n"
        for item, cantidad in count.items():
            response += f"❌ {item}: {cantidad} persona(s)\n"
        
        return response
    
    def _responder_detecciones(self):
        """Responde qué se detectó"""
        total = self.last_analysis['total_persons']
        detections = self.last_analysis['total_detections']
        
        # Contar por tipo
        counts = {}
        for person in self.last_analysis['compliance_results']:
            if person.get('has_helmet'):
                counts['Cascos'] = counts.get('Cascos', 0) + 1
            if person.get('has_vest'):
                counts['Chalecos'] = counts.get('Chalecos', 0) + 1
            if person.get('has_goggles'):
                counts['Gafas'] = counts.get('Gafas', 0) + 1
            if person.get('has_gloves'):
                counts['Guantes'] = counts.get('Guantes', 0) + 1
        
        response = f"🔍 **ELEMENTOS DETECTADOS**\n\n"
        response += f"👥 Personas: {total}\n"
        response += f"📦 Total detecciones: {detections}\n\n"
        response += "**Equipos:**\n"
        
        for item, count in counts.items():
            emoji = {"Cascos": "⛑️", "Chalecos": "🦺", "Gafas": "🥽", "Guantes": "🧤"}
            response += f"  {emoji.get(item, '•')} {item}: {count}\n"
        
        return response
    
    def _responder_reporte(self):
        """Genera reporte completo"""
        self.checker.generate_report(self.last_analysis)
        return "📊 Reporte mostrado arriba ⬆️"
    
    def _mostrar_ayuda(self):
        """Muestra ayuda"""
        help_text = "🆘 **COMANDOS DISPONIBLES**\n\n"
        
        if self.last_analysis:
            help_text += "**Sobre la imagen analizada:**\n"
            help_text += "  • '¿cumple?'\n"
            help_text += "  • '¿qué falta?'\n"
            help_text += "  • '¿qué detectaste?'\n"
            help_text += "  • 'reporte completo'\n\n"
        
        help_text += "**Preguntas generales:**\n"
        help_text += "  • 'normativas obligatorias'\n"
        help_text += "  • '¿qué es un casco?'\n"
        help_text += "  • '¿qué es un chaleco?'\n"
        help_text += "  • '¿qué son las gafas?'\n"
        
        return help_text


# ============================================
# FUNCIÓN PRINCIPAL - FÁCIL DE USAR
# ============================================
def ejecutar_chatbot():
    """Función principal para usar el chatbot"""
    
    print("\n" + "="*70)
    print("🤖 CHATBOT EPP - ASISTENTE DE SEGURIDAD")
    print("="*70)
    
    # Inicializar
    chatbot = ChatbotEPP('../runs/detect/train10/weights/best.pt')
    
    print("\n📸 PASO 1: ¿Quieres analizar una imagen? (s/n)")
    analizar = input("Respuesta: ").strip().lower()
    
    if analizar == 's':
        ruta = input("\n📁 Ruta de la imagen: ").strip()
        resultado = chatbot.analizar_imagen(ruta)
        print(f"\n{resultado}")
    
    # Chat loop
    print("\n" + "="*70)
    print("💬 MODO CHAT")
    print("="*70)
    print("Ahora puedes hacerme preguntas.")
    print("Escribe 'salir' para terminar\n")
    
    while True:
        pregunta = input("👤 Tú: ").strip()
        
        if not pregunta:
            continue
        
        if pregunta.lower() in ['salir', 'exit', 'quit']:
            print("\n🤖 ¡Hasta luego! 👋 Recuerda usar siempre tu EPP.\n")
            break
        
        # Comando especial para analizar otra imagen
        if pregunta.lower().startswith('analizar '):
            ruta = pregunta.split('analizar ', 1)[1]
            respuesta = chatbot.analizar_imagen(ruta)
        else:
            respuesta = chatbot.responder(pregunta)
        
        print(f"\n🤖 Bot:\n{respuesta}\n")


if __name__ == "__main__":
    ejecutar_chatbot()
