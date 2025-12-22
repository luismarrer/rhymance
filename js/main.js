// @ts-check

/**
 * Importar estilos
 */
import '../scss/custom.scss';
import '../css/styles.css';
import '../css/swipe.css';

/**
 * Bootstrap JS import
 * Importamos el bundle completo que incluye Popper.js
 */
import * as bootstrap from 'bootstrap';

// Hacer bootstrap disponible globalmente (opcional, útil para debugging)
// @ts-ignore - Evitar conflictos de tipos entre bootstrap runtime y @types/bootstrap
window.bootstrap = bootstrap

// Inicializar componentes si es necesario
document.addEventListener('DOMContentLoaded', () => {
  // Los componentes como Carousel y Scrollspy se inicializan automáticamente
  // con los atributos data-bs-* en el HTML
  
  // Habilitar popovers para botones con data-bs-toggle="popover"
  const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.forEach((popoverTriggerEl) => {
    // eslint-disable-next-line no-new
    new bootstrap.Popover(popoverTriggerEl)
  })

  console.log('Bootstrap JS cargado correctamente')
})

