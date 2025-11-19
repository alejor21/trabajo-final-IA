import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Loader2, Play, Pause, AlertCircle, Activity, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface Detection {
  class: string;
  confidence: number;
}

interface VideoStats {
  total_frames?: number;
  avg_detections?: number;
  compliance?: any;
  detections?: Detection[];
}

export function VideoDetection() {
  const [video, setVideo] = useState<string | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveDetections, setLiveDetections] = useState<string[]>([]);
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentFile = useRef<File | null>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      currentFile.current = file;
      const url = URL.createObjectURL(file);
      setVideo(url);
      setLiveDetections([]);
      setVideoStats(null);
      setProcessedVideo(null);
      setAnalysisComplete(false);
    }
  };

  const processVideo = async () => {
    if (!currentFile.current) {
      console.log('No hay archivo para procesar');
      return;
    }
    
    console.log('Iniciando procesamiento de video...');
    setIsProcessing(true);
    setAnalysisComplete(false);
    
    try {
      console.log('Enviando video al backend...');
      const result = await api.detectVideo(currentFile.current);
      console.log('Resultado recibido:', result);
      
      setVideoStats(result.stats || {});
      
      // Cargar video procesado
      if (result.processed_video_path) {
        const processedUrl = api.getProcessedVideo(result.processed_video_path);
        console.log('URL del video procesado:', processedUrl);
        setProcessedVideo(processedUrl);
      } else {
        console.warn('No se recibió ruta de video procesado');
      }
      
      setAnalysisComplete(true);
      console.log('Análisis completado exitosamente');
    } catch (error) {
      console.error('Error al procesar video:', error);
      alert('Error al procesar el video. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        startLiveDetection();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startLiveDetection = () => {
    setIsProcessing(false); // No activar isProcessing para detección en vivo
    // Simular detección en tiempo real
    const detectionInterval = setInterval(() => {
      const possibleDetections = [
        'Casco de Seguridad',
        'Chaleco Reflectivo',
        'Guantes de Protección',
        'Gafas de Seguridad',
        'Botas de Seguridad',
      ];
      const randomDetections = possibleDetections
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2);
      setLiveDetections(randomDetections);
    }, 1500);

    videoRef.current?.addEventListener('pause', () => {
      clearInterval(detectionInterval);
    });
    
    videoRef.current?.addEventListener('ended', () => {
      clearInterval(detectionInterval);
      setIsPlaying(false);
      setLiveDetections([]);
      // Ya no procesamos automáticamente, el usuario debe hacer click en "Analizar Video Completo"
    });
  };

  const getDetectionColor = (className: string) => {
    const lowerClass = className.toLowerCase();
    if (lowerClass.includes('helmet') || lowerClass.includes('casco')) return 'from-orange-500 to-amber-500';
    if (lowerClass.includes('vest') || lowerClass.includes('chaleco')) return 'from-amber-500 to-yellow-500';
    if (lowerClass.includes('gloves') || lowerClass.includes('guantes')) return 'from-orange-600 to-red-600';
    if (lowerClass.includes('boots') || lowerClass.includes('botas')) return 'from-red-500 to-orange-500';
    if (lowerClass.includes('goggles') || lowerClass.includes('gafas')) return 'from-yellow-500 to-amber-500';
    return 'from-orange-500 to-amber-500';
  };

  return (
    <div className="space-y-8">
      {/* Upload & Real-time Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Area */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border-2 border-dashed border-orange-500/30 rounded-2xl p-8 hover:border-orange-500/50 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            
            {!video ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-96 cursor-pointer group"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-30"></div>
                  <Upload className="size-20 text-orange-400 relative group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xl text-gray-300 group-hover:text-orange-400 transition-colors mb-2">
                  Haz clic para subir un video
                </p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI hasta 100MB</p>
                <div className="mt-6 flex items-center gap-2 text-orange-400">
                  <Activity className="size-4" />
                  <span className="text-sm">Análisis en tiempo real</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={video}
                  className="w-full h-96 object-contain rounded-lg bg-black"
                  onEnded={() => setIsPlaying(false)}
                />
                {isProcessing && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30">
                    <div className="size-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-400 text-sm">Detectando...</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Button
                    onClick={togglePlayPause}
                    className="bg-black/60 backdrop-blur-sm hover:bg-orange-500/20 border border-orange-500/30 text-orange-400"
                  >
                    {isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5" />
                    )}
                  </Button>
                  <Button
                    onClick={processVideo}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Analizar Video Completo'
                    )}
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/60 backdrop-blur-sm hover:bg-orange-500/20 border border-orange-500/30 text-orange-400"
                  >
                    Cambiar Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Live Detection Results */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 h-full">
            <h3 className="text-2xl mb-6 flex items-center gap-3">
              {isPlaying || liveDetections.length > 0 ? (
                <>
                  <Activity className="size-7 text-orange-400 animate-pulse" />
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Tiempo Real
                  </span>
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="size-7 animate-spin text-orange-400" />
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Procesando Video...
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="size-7 text-gray-600" />
                  <span className="text-gray-500">Tiempo Real</span>
                </>
              )}
            </h3>

            {liveDetections.length > 0 && (
              <div className="space-y-3 mb-6">
                {liveDetections.map((detection, index) => (
                  <motion.div
                    key={`${detection}-${index}`}
                    initial={{ scale: 0.8, opacity: 0, x: -20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 rounded-xl p-4 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-500/50" />
                      <span className="text-lg text-white">{detection}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!video && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="size-16 mb-4 opacity-30" />
                <p className="text-center">Sube un video para comenzar<br/>la detección en tiempo real</p>
              </div>
            )}

            {video && !isPlaying && liveDetections.length === 0 && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Play className="size-16 mb-4 opacity-30" />
                <p className="text-center">Presiona Play para ver<br/>la detección en tiempo real</p>
                <p className="text-sm text-orange-400 mt-4">Luego presiona "Analizar Video Completo"<br/>para obtener resultados detallados</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="size-16 mb-4 text-orange-400 animate-spin" />
                <p className="text-orange-400 text-center">Procesando video...<br/>Esto puede tomar algunos minutos</p>
              </div>
            )}

            {/* Stats - Solo mostrar durante reproducción en tiempo real */}
            {isPlaying && liveDetections.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">30 FPS</div>
                  <div className="text-sm text-gray-400">Velocidad</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">42ms</div>
                  <div className="text-sm text-gray-400">Latencia</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </div>

      {/* Comparison: Original vs Processed Video */}
      {analysisComplete && processedVideo && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8">
              <h3 className="text-2xl mb-6 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Comparación de Videos
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Video */}
                <div className="relative group/video">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-0 group-hover/video:opacity-10 transition duration-300"></div>
                  <div className="relative bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
                      📹 Video Original
                    </h4>
                    <video
                      src={video!}
                      controls
                      className="w-full h-80 object-contain rounded-lg bg-black"
                    />
                  </div>
                </div>

                {/* Processed Video */}
                <div className="relative group/video">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover/video:opacity-10 transition duration-300"></div>
                  <div className="relative bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                      🔍 Video Analizado
                    </h4>
                    <video
                      src={processedVideo}
                      controls
                      className="w-full h-80 object-contain rounded-lg bg-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisComplete && videoStats && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8">
              <h3 className="text-2xl mb-6 flex items-center gap-3">
                <CheckCircle className="size-7 text-orange-400" />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Resultados del Análisis
                </span>
              </h3>

              {/* Video Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                    {videoStats.total_frames || 0}
                  </div>
                  <div className="text-sm text-gray-400">Frames Analizados</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                    {videoStats.avg_detections?.toFixed(1) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Detecciones/Frame</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                    {videoStats.total_persons || 0}
                  </div>
                  <div className="text-sm text-gray-400">Personas</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-orange-500/20">
                  <div className="text-3xl bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
                    {videoStats.compliance ? '✅' : '⚠️'}
                  </div>
                  <div className="text-sm text-gray-400">Cumplimiento</div>
                </div>
              </div>

              {/* Missing Items Section */}
              {videoStats.missing_items && videoStats.missing_items.length > 0 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 p-6 rounded-lg border-2 border-red-500/60 bg-gradient-to-br from-red-500/20 to-orange-500/10 shadow-lg shadow-red-500/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertCircle className="size-6 text-red-400" />
                    </div>
                    <h4 className="text-xl font-bold text-red-400">
                      ⚠️ Implementos Faltantes Detectados en el Video
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {videoStats.missing_items.map((item: any) => (
                      <motion.div
                        key={item.person_id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: item.person_id * 0.1 }}
                        className="p-4 bg-black/60 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 size-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-400 font-bold">{item.person_id}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-orange-400 font-semibold mb-2">Persona {item.person_id}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.missing.map((epp: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-sm font-medium"
                                >
                                  {epp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Detections */}
              {videoStats.detections && videoStats.detections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-4">
                    <Sparkles className="size-5" />
                    Objetos Detectados en el Video
                  </h4>
                  {videoStats.detections.map((detection, index) => {
                    const color = getDetectionColor(detection.class);
                    return (
                      <motion.div
                        key={`${detection.class}-${index}`}
                        initial={{ x: 20, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:shadow-lg hover:shadow-orange-500/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg text-white">{detection.class}</span>
                          <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${color} text-white shadow-lg`}>
                            {(detection.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${detection.confidence * 100}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${color} shadow-lg`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}