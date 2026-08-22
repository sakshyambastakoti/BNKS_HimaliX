@echo off
title OffPay PlatformIO Upload Tool
echo ========================================================
echo   OffPay Terminal: PlatformIO Auto-Uploader (ESP8266)
echo ========================================================
echo.

set PIO_EXE=%USERPROFILE%\.platformio\penv\Scripts\pio.exe

if not exist "%PIO_EXE%" (
    echo [ERROR] PlatformIO executable not found at:
    echo %PIO_EXE%
    echo Please make sure the PlatformIO extension is installed in VS Code.
    echo.
    pause
    exit /b 1
)

echo PlatformIO Core detected!
echo.
echo Select an action:
echo  [1] Upload Firmware (USB)
echo  [2] Upload Web UI to LittleFS Flash (USB)
echo  [3] Upload BOTH Firmware + Web UI (USB)
echo  [4] Open Serial Monitor (115200 baud)
echo  [5] Wireless OTA Upload (Over Wi-Fi)
echo.

set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo [1/1] Flashing Firmware over USB...
    "%PIO_EXE%" run -d "%~dp0." -t upload
)

if "%choice%"=="2" (
    echo.
    echo [1/1] Flashing Web UI (LittleFS) over USB...
    "%PIO_EXE%" run -d "%~dp0." -t uploadfs
)

if "%choice%"=="3" (
    echo.
    echo [1/2] Flashing Firmware over USB...
    "%PIO_EXE%" run -d "%~dp0." -t upload
    echo.
    echo [2/2] Flashing Web UI (LittleFS) over USB...
    "%PIO_EXE%" run -d "%~dp0." -t uploadfs
)

if "%choice%"=="4" (
    echo.
    echo Opening Serial Monitor...
    "%PIO_EXE%" device monitor -d "%~dp0."
)

if "%choice%"=="5" (
    echo.
    set /p ota_ip="Enter ESP IP Address (e.g. 192.168.1.100): "
    echo Flashing over Wi-Fi to %ota_ip%...
    "%PIO_EXE%" run -d "%~dp0." -t upload -e nodemcu_ota --upload-port %ota_ip%
)

echo.
echo ========================================================
echo Done!
echo ========================================================
pause
