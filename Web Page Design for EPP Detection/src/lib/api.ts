const API_BASE_URL = 'http://localhost:8000';

export const api = {
  async detectImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/detect/image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar la imagen');
    }
    
    return response.json();
  },
  
  async detectVideo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/detect/video`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar el video');
    }
    
    return response.json();
  },
  
  async chatbot(message: string) {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar mensaje');
    }
    
    return response.json();
  },
  
  getProcessedImage(filename: string) {
    return `${API_BASE_URL}/api/image/${filename}`;
  },
  
  getProcessedVideo(filename: string) {
    return `${API_BASE_URL}/api/video/${filename}`;
  },
};
