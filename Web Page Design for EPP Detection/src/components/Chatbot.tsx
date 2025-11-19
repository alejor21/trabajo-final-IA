import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { api } from '../lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  hasAnalysis?: boolean;
}

const quickReplies = [
  '¿Qué es EPP?',
  'Normativas de seguridad',
  '¿Cómo funciona el sistema?',
  'Tipos de cascos',
  'Importancia del chaleco',
  'Protección de manos',
];

const analysisQuickReplies = [
  '¿Qué le falta a la persona que no cumple?',
  '¿Cómo puedo mejorar el cumplimiento?',
  'Muestra detalles del último análisis',
];

export function Chatbot({ isOpen, onToggle, hasAnalysis = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente virtual del sistema de detección EPP. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.chatbot(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || 'Lo siento, no pude procesar tu pregunta.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu pregunta.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 size-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-2xl shadow-orange-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="size-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="size-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-6 z-50 w-96 h-[600px] bg-black/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-2xl shadow-orange-500/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white blur-lg opacity-30"></div>
                <div className="relative size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="size-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white text-lg">Asistente EPP</h3>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-white/90">En línea</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black/40 to-black/60">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`size-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="size-5 text-white" />
                    ) : (
                      <Bot className="size-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-gray-800/80 text-gray-200 border border-orange-500/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="size-9 bg-gray-700 rounded-full flex items-center justify-center">
                    <Bot className="size-5 text-white" />
                  </div>
                  <div className="bg-gray-800/80 border border-orange-500/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="size-2 bg-orange-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="size-2 bg-orange-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="size-2 bg-orange-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-orange-500/20 bg-black/60">
              {/* Quick Reply Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {(hasAnalysis ? analysisQuickReplies : quickReplies).map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-2 text-xs bg-gray-800/60 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 text-gray-300 hover:text-orange-400 rounded-lg transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="bg-gray-900/60 border-orange-500/30 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                />
                <Button
                  onClick={() => handleSend()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/20"
                >
                  <Send className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}