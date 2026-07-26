async function loadComponent(componentName, targetSelector) {
  const container = document.querySelector(targetSelector);
  if (!container) return;

  // Load Component CSS
  const cssPath = `./components/${componentName}/${componentName}.css`;
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }

  try {
    const response = await fetch(`./components/${componentName}/${componentName}.html`);
    if (response.ok) {
      container.innerHTML = await response.text();
    }
  } catch (err) {
    console.warn(`Local fetch warning for ${componentName}:`, err);
  }

  // Load Component JS
  return new Promise((resolve) => {
    const jsPath = `./components/${componentName}/${componentName}.js`;
    const script = document.createElement('script');
    script.src = jsPath;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}
