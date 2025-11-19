import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} id="inicio" className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20"
            >
              <Sparkles className="size-4 text-orange-400" />
              <span className="text-orange-400">Powered by YOLO AI</span>
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl leading-tight"
            >
              <span className="block text-gray-100">Detección</span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Inteligente
              </span>
              <span className="block text-gray-100">de EPP</span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-400 max-w-xl leading-relaxed"
            >
              Sistema avanzado de detección de Equipos de Protección Personal en tiempo real usando tecnología YOLO de última generación.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg group shadow-lg shadow-orange-500/20"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 px-8 py-6 text-lg backdrop-blur-sm"
              >
                <Zap className="mr-2 size-5" />
                Ver Demo
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { label: 'Precisión', value: '99.2%' },
                { label: 'Velocidad', value: '<50ms' },
                { label: 'Categorías', value: '15+' },
              ].map((stat, index) => (
                <div key={stat.label} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4">
                    <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Visual element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Animated rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-orange-500/20 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 border-2 border-amber-500/20 rounded-full border-dashed"
              ></motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-16 border-2 border-orange-500/30 rounded-full"
              ></motion.div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 blur-3xl opacity-50"></div>
                  <Shield className="size-32 text-orange-400 relative drop-shadow-2xl" strokeWidth={1.5} />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="size-16 text-amber-300" />
                  </motion.div>
                </div>
              </div>

              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(i) * 10, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className="absolute"
                  style={{
                    top: `${15 + Math.sin(i * 60) * 40}%`,
                    left: `${15 + Math.cos(i * 60) * 40}%`,
                  }}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-lg shadow-orange-500/50"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-sm">Scroll</span>
          <div className="w-6 h-10 border-2 border-orange-500/30 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-orange-400 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}