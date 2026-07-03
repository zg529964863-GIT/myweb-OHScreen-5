const Components = {
  tag(type, text, dot = false) {
    const span = document.createElement('span');
    span.className = `tag tag--${type}${dot ? ' tag--dot' : ''}`;
    span.textContent = text;
    return span;
  },

  icon(name, size = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    if (size) svg.classList.add(`icon--${size}`);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `assets/icons.svg#${name}`);
    svg.appendChild(use);
    return svg;
  }
};

window.Components = Components;
