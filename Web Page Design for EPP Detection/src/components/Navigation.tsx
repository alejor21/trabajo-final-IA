import { Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Inicio', 'Características', 'Detección', 'Contacto'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-xl border-b border-orange-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50"></div>
              <Shield className="size-9 text-orange-400 relative" />
            </div>
            <span className="text-2xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              EPP Detection
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-gray-300 hover:text-orange-400 transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-orange-500/10 transition-colors border border-orange-500/20"
          >
            {isOpen ? <X className="size-6 text-orange-400" /> : <Menu className="size-6 text-orange-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-orange-500/20"
          >
            <div className="px-4 py-4 space-y-3">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-orange-400 transition-colors py-3 border-l-2 border-transparent hover:border-orange-400 pl-4"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}