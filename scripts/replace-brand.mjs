import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.html') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace names
    content = content.replace(/Bank Seized Cars/g, "KJ Autos");
    content = content.replace(/Bank Seized Car/g, "Bank Repossessed Car"); // e.g. "How to Buy a Bank Seized Car"
    
    // Replace URLs
    content = content.replace(/bankseizedcars\.online/g, "kjautos.online");

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
}

walkDir('./src', replaceInFile);
replaceInFile('./index.html');
replaceInFile('./scripts/post-build.js');
console.log("Branding replacement complete!");
