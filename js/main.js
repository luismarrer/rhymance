// @ts-check

/**
 * Bootstrap JS import
 * Importamos el bundle completo que incluye Popper.js
 */
import * as bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'

// Hacer bootstrap disponible globalmente (opcional, útil para debugging)
// @ts-ignore - Evitar conflictos de tipos entre bootstrap runtime y @types/bootstrap
window.bootstrap = bootstrap

// Inicializar componentes si es necesario
document.addEventListener('DOMContentLoaded', () => {
  // Los componentes como Carousel y Scrollspy se inicializan automáticamente
  // con los atributos data-bs-* en el HTML
  
  console.log('Bootstrap JS cargado correctamente')
})
