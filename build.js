const fs = require('fs');
const path = require('path');

function compileTemplate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /<!-- @import "([^"]+)" -->/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    const absolutePath = path.resolve(path.dirname(filePath), importPath);
    if (fs.existsSync(absolutePath)) {
      return compileTemplate(absolutePath);
    } else {
      console.warn(`Warning: Import file not found: ${absolutePath}`);
      return `<!-- Error: ${importPath} not found -->`;
    }
  });

  return content;
}

function build() {
  try {
    console.log('Building index.html, legal.html, about.html, contact.html, team.html, blog.html...');
    
    const pages = ['index.html', 'legal.html', 'about.html', 'contact.html', 'team.html', 'blog.html'];
    pages.forEach(page => {
      const srcPath = path.join(__dirname, 'src', page);
      const destPath = path.join(__dirname, page);
      fs.writeFileSync(destPath, compileTemplate(srcPath), 'utf8');
    });
    
    console.log(`[${new Date().toLocaleTimeString()}] Successfully compiled all pages!`);
  } catch (error) {
    console.error('Build compilation failed:', error);
  }
}

// Run initial build
build();

// Watch mode if requested
if (process.argv.includes('--watch')) {
  console.log('Watching directories components/ and src/ for changes...');
  
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const rebuild = debounce(() => {
    build();
  }, 100);

  // Watch components directory
  fs.watch(path.join(__dirname, 'components'), { recursive: true }, (eventType, filename) => {
    if (filename) rebuild();
  });

  // Watch src directory
  fs.watch(path.join(__dirname, 'src'), { recursive: true }, (eventType, filename) => {
    if (filename) rebuild();
  });
}
