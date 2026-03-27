# Download Goa Panjim Travel Images
Write-Host "Downloading Goa Panjim Travel Images..." -ForegroundColor Green
Write-Host ""

# Create images directory if it doesn't exist
$imagesDir = "src\assets\images"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
}

# Image URLs and filenames
$images = @{
    "hero-panjim.jpg" = "https://images.unsplash.com/photo-15827164773638-9b8d7f8e4a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    "tours-fontainhas.jpg" = "https://images.unsplash.com/photo-1578662939693-8b8e5b6c6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    "testimonials-mandovi.jpg" = "https://images.unsplash.com/photo-1514222400207-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    "cta-night.jpg" = "https://images.unsplash.com/photo-1533105068892-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    "texture-dark.jpg" = "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $filename = $image.Key
    $url = $image.Value
    $filepath = Join-Path $imagesDir $filename
    
    Write-Host "Downloading $filename..." -ForegroundColor Yellow
    
    try {
        # Use Invoke-WebRequest with proper headers
        $response = Invoke-WebRequest -Uri $url -OutFile $filepath -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        
        if (Test-Path $filepath) {
            $fileSize = (Get-Item $filepath).Length
            Write-Host "✅ Downloaded: $filename ($fileSize bytes)" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to download: $filename" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error downloading $filename`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All images downloaded!" -ForegroundColor Green
$location = Get-Location
Write-Host "Images saved to: $location\$imagesDir" -ForegroundColor Cyan
