# PowerShell script to download high-quality Goa images
Write-Host "🚀 Downloading high-quality Goa images..." -ForegroundColor Green

# Create images directory if it doesn't exist
$imagesDir = "src\assets\images"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
    Write-Host "📁 Created directory: $imagesDir" -ForegroundColor Yellow
}

# High-quality Goa images
$images = @(
    @{
        filename = "hero-goa-beach.jpg"
        url = "https://images.unsplash.com/photo-1512452445409-9f0a3f1c2c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Beautiful Goa beach with palm trees - Perfect hero image"
    },
    @{
        filename = "tours-goa-churches.jpg"
        url = "https://images.unsplash.com/photo-1605538108776-81d6b5d0a5b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Historic Goa churches and Portuguese architecture"
    },
    @{
        filename = "testimonials-goa-backwaters.jpg"
        url = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Scenic Goa backwaters and rivers"
    },
    @{
        filename = "cta-goa-sunset.jpg"
        url = "https://images.unsplash.com/photo-1549180030-48bf07a7321c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Stunning Goa sunset over water"
    },
    @{
        filename = "partners-goa-texture.jpg"
        url = "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Goa texture pattern for backgrounds"
    },
    @{
        filename = "contact-goa-scenic.jpg"
        url = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90"
        description = "Beautiful scenic Goa landscape for contact page"
    }
)

# Download each image
foreach ($image in $images) {
    try {
        Write-Host "📥 $($image.description)" -ForegroundColor Cyan
        $outputPath = Join-Path $imagesDir $image.filename
        
        # Download using Invoke-WebRequest
        Invoke-WebRequest -Uri $image.url -OutFile $outputPath -ErrorAction Stop
        
        # Check if file was downloaded successfully
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length / 1KB
            Write-Host "✅ Downloaded: $($image.filename) ($([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to download: $($image.filename)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Error downloading $($image.filename): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✨ All Goa images downloaded!" -ForegroundColor Green
Write-Host "📁 Saved to: $((Resolve-Path $imagesDir).Path)" -ForegroundColor Yellow

Write-Host "`n📝 Update your Home.jsx to use local paths:" -ForegroundColor Cyan
Write-Host "// Replace URL constants with imports:" -ForegroundColor Gray
Write-Host "import heroImage from '../../assets/images/hero-goa-beach.jpg';" -ForegroundColor White
Write-Host "import toursImage from '../../assets/images/tours-goa-churches.jpg';" -ForegroundColor White
Write-Host "import testimonialsImage from '../../assets/images/testimonials-goa-backwaters.jpg';" -ForegroundColor White
Write-Host "import ctaImage from '../../assets/images/cta-goa-sunset.jpg';" -ForegroundColor White
Write-Host "import textureImage from '../../assets/images/partners-goa-texture.jpg';" -ForegroundColor White
Write-Host "import contactPageImage from '../../assets/images/contact-goa-scenic.jpg';" -ForegroundColor White
