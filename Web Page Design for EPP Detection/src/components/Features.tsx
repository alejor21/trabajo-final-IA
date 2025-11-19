import { motion, useScroll, useTransform } from 'motion/react';
import { Image, Video, Brain, Zap, Shield, Eye } from 'lucide-react';
import { useRef } from 'react';

export function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);

  const features = [
    {
      icon: Image,
      title: 'Detección en Imágenes',
      description: 'Analiza imágenes estáticas con precisión milimétrica y resultados instantáneos',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Video,
      title: 'Análisis de Video',
      description: 'Procesamiento en tiempo real de streams de video con múltiples objetos',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Brain,
      title: 'IA Avanzada',
      description: 'Algoritmos YOLO v8 de última generación para máxima precisión',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Zap,
      title: 'Súper Rápido',
      description: 'Resultados en menos de 50 milisegundos por frame procesado',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Shield,
      title: 'Alta Precisión',
      description: '99.2% de tasa de detección correcta en condiciones reales',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Eye,
      title: 'Múltiples EPP',
      description: 'Detecta cascos, guantes, chalecos, botas y mucho más',
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  return (
    <section ref={ref} id="características" className="py-32 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 mb-6"
          >
            <span className="text-orange-400">Características</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Potencia y Precisión
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tecnología de vanguardia para garantizar la seguridad en tu lugar de trabajo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/10 group-hover:border-orange-500/30 rounded-2xl p-8 h-full transition-all duration-300">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} blur-xl opacity-50`}></div>
                  <div className={`relative inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="size-7 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-orange-500/20 rounded-tr-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative line */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-left"
        ></motion.div>
      </div>
    </section>
  );
}