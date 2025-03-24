const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to draw the icon on a canvas
function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#e74c3c'; // Red background
  ctx.fillRect(0, 0, size, size);
  
  // Border
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.strokeRect(0, 0, size, size);
  
  // Draw a "no" symbol (circle with diagonal line)
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // Circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.stroke();
  
  // Diagonal line
  ctx.beginPath();
  ctx.moveTo(centerX - radius * 0.7, centerY - radius * 0.7);
  ctx.lineTo(centerX + radius * 0.7, centerY + radius * 0.7);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.stroke();
  
  return canvas.toBuffer('image/png');
}

// Create the images directory if it doesn't exist
if (!fs.existsSync('./images')) {
  fs.mkdirSync('./images');
}

// Generate icons of different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const buffer = drawIcon(size);
  fs.writeFileSync(`./images/icon${size}.png`, buffer);
  console.log(`Created icon${size}.png`);
});

console.log('All icons generated successfully!');
