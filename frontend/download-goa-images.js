const fs = require('fs');
const https = require('https');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// High-quality Goa images for travel website
const goaImages = [
  {
    filename: 'hero-goa-beach.jpg',
    url: 'https://images.unsplash.com/photo-1512452445409-9f0a3f1c2c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Beautiful Goa beach with palm trees - Perfect hero image'
  },
  {
    filename: 'tours-goa-churches.jpg',
    url: 'https://images.unsplash.com/photo-1605538108776-81d6b5d0a5b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Historic Goa churches and Portuguese architecture'
  },
  {
    filename: 'testimonials-goa-backwaters.jpg',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Scenic Goa backwaters and rivers'
  },
  {
    filename: 'cta-goa-sunset.jpg',
    url: 'https://images.unsplash.com/photo-1549180030-48bf07a7321c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Stunning Goa sunset over water'
  },
  {
    filename: 'partners-goa-texture.jpg',
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Goa texture pattern for backgrounds'
  },
  {
    filename: 'contact-goa-scenic.jpg',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=90',
    description: 'Beautiful scenic Goa landscape for contact page'
  }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.error(`❌ Failed to download: ${filename}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('🚀 Downloading high-quality Goa images...\n');
  
  for (const image of goaImages) {
    try {
      console.log(`📥 ${image.description}`);
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Failed to download ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✨ All Goa images downloaded successfully!');
  console.log(`📁 Saved to: ${imagesDir}`);
  console.log('\n📝 Update your Home.jsx to use local paths:');
  console.log('// Replace the URL constants with:');
  console.log('import heroImage from \'../../assets/images/hero-goa-beach.jpg\';');
  console.log('import toursImage from \'../../assets/images/tours-goa-churches.jpg\';');
  console.log('import testimonialsImage from \'../../assets/images/testimonials-goa-backwaters.jpg\';');
  console.log('import ctaImage from \'../../assets/images/cta-goa-sunset.jpg\';');
  console.log('import textureImage from \'../../assets/images/partners-goa-texture.jpg\';');
  console.log('import contactPageImage from \'../../assets/images/contact-goa-scenic.jpg\';');
}

downloadAllImages().catch(console.error);
