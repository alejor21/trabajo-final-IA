# Script para iniciar el backend API
Write-Host "🚀 Iniciando Backend API (FastAPI)..." -ForegroundColor Cyan
Write-Host "📍 API disponible en: http://localhost:8000" -ForegroundColor Green
Write-Host "📖 Documentación: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""

Set-Location "c:\Users\Braya\Desktop\trabajo ia final\IA_Final"
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
