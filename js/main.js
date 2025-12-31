

import '../scss/custom.scss';
import '../css/styles.css';
import '../css/swipe.css';

import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap

document.addEventListener('DOMContentLoaded', () => {
  const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.forEach((popoverTriggerEl) => {
    new bootstrap.Popover(popoverTriggerEl)
  })

  const modalElementList = Array.from(document.querySelectorAll('.modal'))
  modalElementList.forEach((modalEl) => {
    new bootstrap.Modal(modalEl)
  })

  document.addEventListener('dblclick', (e) => {
    let img = null
    
    if (e.target.classList.contains('poem-card-img')) {
      img = e.target
    } else {
      const article = e.target.closest('article')
      if (article) {
        img = article.querySelector('.poem-card-img')
      }
    }
    
    if (img && img.hasAttribute('data-bs-target')) {
      e.preventDefault()
      e.stopPropagation()
      const modalSelector = img.getAttribute('data-bs-target')
      if (modalSelector) {
        const modalElement = document.querySelector(modalSelector)
        if (modalElement) {
          const modal = bootstrap.Modal.getOrCreateInstance(modalElement)
          modal.show()
        }
      }
    }
  })

  // Función para simular el swipe desde los botones del modal
  function simulateSwipe(goRight, modalId) {
    const cards = document.querySelector('.cards')
    if (!cards) return
    
    // Buscar la tarjeta que corresponde al modal específico
    let actualCard = null
    const allCards = cards.querySelectorAll('article')
    
    for (const card of allCards) {
      const cardImg = card.querySelector('.poem-card-img')
      if (cardImg && cardImg.getAttribute('data-bs-target') === '#' + modalId) {
        actualCard = card
        break
      }
    }
    
    if (!actualCard) return

    // Añadir la clase correspondiente para la animación
    actualCard.classList.add(goRight ? 'go-right' : 'go-left')
    
    // Mostrar el indicador de choice correspondiente
    const choiceEl = goRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope')
    
    if (choiceEl) {
      choiceEl.style.opacity = 1
    }

    // Remover la tarjeta después de la animación
    actualCard.addEventListener('transitionend', () => {
      actualCard.remove()
    }, { once: true })
  }

  // Event listeners para los botones de los modales
  document.querySelectorAll('.modal-footer').forEach(footer => {
    const modal = footer.closest('.modal')
    const modalId = modal ? modal.id : null
    
    // Botón Nope
    const nopeBtn = footer.querySelector('.btn-outline-secondary')
    if (nopeBtn) {
      nopeBtn.addEventListener('click', () => {
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal)
          if (modalInstance) {
            modalInstance.hide()
          }
        }
        // Pequeño delay para que el modal se cierre primero
        setTimeout(() => {
          simulateSwipe(false, modalId)
        }, 150)
      })
    }

    // Botón Me gusta
    const likeBtn = footer.querySelector('.btn-danger')
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal)
          if (modalInstance) {
            modalInstance.hide()
          }
        }
        // Pequeño delay para que el modal se cierre primero
        setTimeout(() => {
          simulateSwipe(true, modalId)
        }, 150)
      })
    }
  })
})

