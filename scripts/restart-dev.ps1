# Script de PowerShell para reiniciar el servidor y limpiar caché

Write-Host "🔄 Reiniciando servidor y limpiando caché..." -ForegroundColor Cyan

# Detener procesos de Node.js si están ejecutándose
Write-Host "🛑 Deteniendo procesos de Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Limpiar caché de Next.js
Write-Host "🧹 Limpiando caché de Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Limpiar caché de npm
Write-Host "🧹 Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host "   Ejecuta: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📋 Para probar la autenticación:" -ForegroundColor Magenta
Write-Host "   1. Ve a http://localhost:3000/auth-test" -ForegroundColor White
Write-Host "   2. Intenta iniciar sesión con:" -ForegroundColor White
Write-Host "      - admin@estrellasur.com" -ForegroundColor Gray
Write-Host "      - supervisor@estrellasur.com" -ForegroundColor Gray
Write-Host "      - tecnico@estrellasur.com" -ForegroundColor Gray
Write-Host "   3. Contrasena: password123" -ForegroundColor Gray
