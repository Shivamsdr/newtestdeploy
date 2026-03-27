@echo off
echo Downloading Goa Panjim Travel Images...
echo.

REM Create images directory if it doesn't exist
if not exist "src\assets\images" mkdir "src\assets\images"

REM Download hero image
echo Downloading hero-panjim.jpg...
curl -o "src\assets\images\hero-panjim.jpg" "https://images.unsplash.com/photo-15827164773638-9b8d7f8e4a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

REM Download tours image
echo Downloading tours-fontainhas.jpg...
curl -o "src\assets\images\tours-fontainhas.jpg" "https://images.unsplash.com/photo-1578662939693-8b8e5b6c6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

REM Download testimonials image
echo Downloading testimonials-mandovi.jpg...
curl -o "src\assets\images\testimonials-mandovi.jpg" "https://images.unsplash.com/photo-1514222400207-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

REM Download CTA image
echo Downloading cta-night.jpg...
curl -o "src\assets\images\cta-night.jpg" "https://images.unsplash.com/photo-1533105068892-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

REM Download texture image
echo Downloading texture-dark.jpg...
curl -o "src\assets\images\texture-dark.jpg" "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

echo.
echo All images downloaded successfully!
echo Images saved to: src\assets\images\
pause
