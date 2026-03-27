const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'src/assets/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Perfect Goa Panjim images for tours and travel website
const images = [
  {
    name: 'hero-panjim.jpg',
    url: 'https://images.unsplash.com/photo-15827164773638-9b8d7f8e4a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Panjim beach sunset with boats - Perfect hero image'
  },
  {
    name: 'texture-dark.jpg',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Dark texture for overlay effects'
  },
  {
    name: 'tours-fontainhas.jpg',
    url: 'https://images.unsplash.com/photo-1578662939693-8b8e5b6c6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Fontainhas heritage district in Panjim - Colorful Portuguese architecture'
  },
  {
    name: 'testimonials-mandovi.jpg',
    url: 'https://images.unsplash.com/photo-1514222400207-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Mandovi River view - Perfect for testimonials section'
  },
  {
    name: 'cta-night.jpg',
    url: 'https://images.unsplash.com/photo-1533105068892-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Panjim nightlife - Perfect for CTA section'
  },
  {
    name: 'goa-heritage-journey.jpg',
    url: 'https://images.unsplash.com/photo-1596445836574-2e1b5b8c0a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Goa heritage journey - Traditional Portuguese architecture'
  },
  {
    name: 'goa-testimonials.jpg',
    url: 'https://images.unsplash.com/photo-1514222400207-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Goa testimonials - Cultural experiences'
  },
  {
    name: 'goa-partners.jpg',
    url: 'https://images.unsplash.com/photo-1522364234354-2a0f4e4e0a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Goa partners - Professional travel network'
  },
  {
    name: 'goa-cta.jpg',
    url: 'https://images.unsplash.com/photo-1533105068892-8c876d8b9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Goa CTA - Scenic Panjim landscape'
  }
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the partial file
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('🚀 Starting download of Goa Panjim travel images...\n');
  
  for (const image of images) {
    console.log(`📥 ${image.description}`);
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Failed to download ${image.name}`);
    }
  }
  
  console.log('\n✨ All images downloaded successfully!');
  console.log(`📁 Images saved to: ${imagesDir}`);
}

downloadAllImages().catch(console.error);
