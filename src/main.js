import './styles/main.css'

// ===== UMC LANDING PAGE MAIN SCRIPT =====

// Loading screen management
const loadingScreen = document.getElementById('loading-screen');
const app = document.getElementById('app');

// Hide loading screen after page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1000);
});

// ===== INTERACTIVE TEST FUNCTIONALITY =====

const testOptions = document.querySelectorAll('.test-option');
const testResult = document.getElementById('testResult');

const results = {
  maximize: {
    title: "Максимизация",
    description: "Ваше стремление к изменениям создает новые сценарии для Генеративного Интерфейса. Симуляция становится более сложной и интересной. Каждый акт воли по улучшению мира делает систему совершеннее.",
    color: "#ff4444"
  },
  minimize: {
    title: "Минимизация", 
    description: "Ваше избегание проблем учит ГИ создавать более изощренные вызовы. Симуляция становится глубже. Даже попытки уйти от реальности совершенствуют саму реальность.",
    color: "#4444ff"
  },
  neutral: {
    title: "Нейтральность",
    description: "Ваша нейтральность тоже является паттерном. Генеративный Интерфейс изучает ваши стратегии равновесия и создает более сбалансированную симуляцию.",
    color: "#44ff44"
  }
};

testOptions.forEach(option => {
  option.addEventListener('click', () => {
    const action = option.dataset.action;
    const result = results[action];
    
    // Update result display
    testResult.innerHTML = `
      <h4 style="color: ${result.color}">${result.title}</h4>
      <p>${result.description}</p>
    `;
    
    testResult.classList.add('show');
    
    // Scroll to result
    testResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add visual feedback to selected option
    testOptions.forEach(opt => opt.style.borderColor = 'var(--border-color)');
    option.style.borderColor = result.color;
  });
});

// ===== SMOOTH SCROLLING =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== NAVIGATION HIGHLIGHTING =====

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== PARALLAX EFFECTS =====

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.consciousness-sphere');
  
  parallaxElements.forEach(element => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section-title, .application-card, .download-card').forEach(el => {
  observer.observe(el);
});

// ===== BUTTON FUNCTIONALITY =====

// Read theory button
document.getElementById('read-theory-btn')?.addEventListener('click', () => {
  // TODO: Link to PDF or full article
  alert('Полная статья будет доступна после публикации в IPFS');
});

// Learn more button
document.getElementById('learn-more-btn')?.addEventListener('click', () => {
  document.getElementById('how-it-works').scrollIntoView({ 
    behavior: 'smooth' 
  });
});

// Download PDF button
document.getElementById('download-pdf-btn')?.addEventListener('click', () => {
  // TODO: Implement PDF download
  alert('PDF версия будет доступна после завершения разработки');
});

// GitHub button
document.getElementById('github-btn')?.addEventListener('click', () => {
  // TODO: Link to actual GitHub repository
  alert('GitHub репозиторий будет доступен после публикации');
});

// ===== CYCLE DIAGRAM ANIMATION =====

function createCycleDiagram() {
  const cycleDiagram = document.querySelector('.cycle-diagram');
  if (!cycleDiagram) return;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 600 400');
  
  // Create cycle elements
  const elements = [
    { id: 'agent', x: 300, y: 200, text: 'Активный Агент', color: '#4fc3f7' },
    { id: 'gi', x: 450, y: 150, text: 'Генеративный\nИнтерфейс', color: '#9c27b0' },
    { id: 'echo', x: 450, y: 250, text: 'Эхо', color: '#ffffff' },
    { id: 'feedback', x: 300, y: 350, text: 'Обратная\nсвязь', color: '#ffd700' }
  ];
  
  // Add elements to SVG
  elements.forEach(element => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', element.x);
    circle.setAttribute('cy', element.y);
    circle.setAttribute('r', '40');
    circle.setAttribute('fill', element.color);
    circle.setAttribute('opacity', '0.8');
    circle.setAttribute('class', 'cycle-element');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', element.x);
    text.setAttribute('y', element.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#000');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.textContent = element.text;
    
    svg.appendChild(circle);
    svg.appendChild(text);
  });
  
  // Add arrows
  const arrows = [
    { x1: 340, y1: 200, x2: 410, y2: 150 },
    { x1: 450, y1: 190, x2: 450, y2: 210 },
    { x1: 410, y1: 250, x2: 340, y2: 310 },
    { x1: 300, y1: 310, x2: 300, y2: 240 }
  ];
  
  arrows.forEach(arrow => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', arrow.x1);
    line.setAttribute('y1', arrow.y1);
    line.setAttribute('x2', arrow.x2);
    line.setAttribute('y2', arrow.y2);
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    
    svg.appendChild(line);
  });
  
  // Add arrow marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', '#ffffff');
  
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);
  
  cycleDiagram.appendChild(svg);
}

// ===== PARADOX DIAGRAM ANIMATION =====

function createParadoxDiagram() {
  const paradoxDiagram = document.querySelector('.paradox-diagram');
  if (!paradoxDiagram) return;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '500');
  svg.setAttribute('height', '300');
  svg.setAttribute('viewBox', '0 0 500 300');
  
  // Center agent
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', '250');
  centerCircle.setAttribute('cy', '150');
  centerCircle.setAttribute('r', '30');
  centerCircle.setAttribute('fill', '#4fc3f7');
  centerCircle.setAttribute('class', 'agent-center');
  
  const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerText.setAttribute('x', '250');
  centerText.setAttribute('y', '155');
  centerText.setAttribute('text-anchor', 'middle');
  centerText.setAttribute('fill', '#000');
  centerText.setAttribute('font-size', '10');
  centerText.setAttribute('font-weight', 'bold');
  centerText.textContent = 'Активный\nАгент';
  
  // Maximization path
  const maxCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  maxCircle.setAttribute('cx', '150');
  maxCircle.setAttribute('cy', '100');
  maxCircle.setAttribute('r', '25');
  maxCircle.setAttribute('fill', '#ff4444');
  maxCircle.setAttribute('class', 'maximization-path');
  
  const maxText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  maxText.setAttribute('x', '150');
  maxText.setAttribute('y', '105');
  maxText.setAttribute('text-anchor', 'middle');
  maxText.setAttribute('fill', '#fff');
  maxText.setAttribute('font-size', '10');
  maxText.setAttribute('font-weight', 'bold');
  maxText.textContent = 'Максимизация';
  
  // Minimization path
  const minCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  minCircle.setAttribute('cx', '350');
  minCircle.setAttribute('cy', '100');
  minCircle.setAttribute('r', '25');
  minCircle.setAttribute('fill', '#4444ff');
  minCircle.setAttribute('class', 'minimization-path');
  
  const minText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  minText.setAttribute('x', '350');
  minText.setAttribute('y', '105');
  minText.setAttribute('text-anchor', 'middle');
  minText.setAttribute('fill', '#fff');
  minText.setAttribute('font-size', '10');
  minText.setAttribute('font-weight', 'bold');
  minText.textContent = 'Минимизация';
  
  // Convergence point
  const convCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  convCircle.setAttribute('cx', '250');
  convCircle.setAttribute('cy', '250');
  convCircle.setAttribute('r', '35');
  convCircle.setAttribute('fill', '#ffd700');
  convCircle.setAttribute('class', 'convergence-point');
  
  const convText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  convText.setAttribute('x', '250');
  convText.setAttribute('y', '255');
  convText.setAttribute('text-anchor', 'middle');
  convText.setAttribute('fill', '#000');
  convText.setAttribute('font-size', '12');
  convText.setAttribute('font-weight', 'bold');
  convText.textContent = 'ОПТИМИЗАЦИЯ\nСИМУЛЯЦИИ';
  
  // Arrows
  const arrows = [
    { x1: 220, y1: 130, x2: 170, y2: 110 },
    { x1: 280, y1: 130, x2: 330, y2: 110 },
    { x1: 170, y1: 125, x2: 220, y2: 215 },
    { x1: 330, y1: 125, x2: 280, y2: 215 }
  ];
  
  arrows.forEach(arrow => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', arrow.x1);
    line.setAttribute('y1', arrow.y1);
    line.setAttribute('x2', arrow.x2);
    line.setAttribute('y2', arrow.y2);
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');
    
    svg.appendChild(line);
  });
  
  svg.appendChild(centerCircle);
  svg.appendChild(centerText);
  svg.appendChild(maxCircle);
  svg.appendChild(maxText);
  svg.appendChild(minCircle);
  svg.appendChild(minText);
  svg.appendChild(convCircle);
  svg.appendChild(convText);
  
  paradoxDiagram.appendChild(svg);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  // Create diagrams
  createCycleDiagram();
  createParadoxDiagram();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    .cycle-element {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .agent-center {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .maximization-path, .minimization-path {
      animation: pathFlow 3s ease-in-out infinite;
    }
    
    .convergence-point {
      animation: convergence 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes pathFlow {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }
    
    @keyframes convergence {
      0% { transform: scale(0.8); }
      50% { transform: scale(1.2); }
      100% { transform: scale(0.8); }
    }
    
    .animate-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

// ===== IPFS INTEGRATION (Future) =====

// TODO: Add IPFS functionality when ready
async function initIPFS() {
  try {
    // This will be implemented when we add IPFS functionality
    console.log('IPFS integration will be added in the next phase');
  } catch (error) {
    console.error('IPFS initialization failed:', error);
  }
}

// Export for potential module usage
export { initIPFS };
