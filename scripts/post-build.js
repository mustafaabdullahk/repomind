const fs = require('fs');
const path = require('path');

// Create out directory if it doesn't exist
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy the original 404.html to the out directory
const source404 = path.join(process.cwd(), 'public', '404.html');
const target404 = path.join(outDir, '404.html');

try {
  const content = fs.readFileSync(source404, 'utf8');
  fs.writeFileSync(target404, content);
  console.log('✅ 404.html copied to out directory');
} catch (error) {
  console.error('Error copying 404.html:', error);
  process.exit(1);
} 