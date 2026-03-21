// Carousel functionality
function initCarousel() {
  const carousel = document.querySelector('[data-carousel]')
  if (!carousel) return

  const slides = carousel.querySelectorAll('[data-carousel-slide]')
  const indicators = carousel.querySelectorAll('[data-carousel-indicator]')
  const prevBtn = carousel.querySelector('[data-carousel-prev]')
  const nextBtn = carousel.querySelector('[data-carousel-next]')
  let currentSlide = 0
  let autoPlayInterval = null

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0'
      slide.style.zIndex = i === index ? '10' : '0'
    })
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index)
      ind.style.backgroundColor = i === index ? 'white' : 'rgba(255,255,255,0.5)'
    })
    currentSlide = index
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length)
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay() })
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay() })

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => { showSlide(i); resetAutoPlay() })
  })

  function resetAutoPlay() {
    clearInterval(autoPlayInterval)
    autoPlayInterval = setInterval(nextSlide, 5000)
  }

  showSlide(0)
  autoPlayInterval = setInterval(nextSlide, 5000)
}

// Modal functionality
function initModals() {
  // Open modal on double click
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

    if (img && img.hasAttribute('data-modal-target')) {
      e.preventDefault()
      e.stopPropagation()
      const modalId = img.getAttribute('data-modal-target')
      const modal = document.getElementById(modalId)
      if (modal) {
        openModal(modal)
      }
    }
  })

  // Close modal on close button
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('[data-modal]')
      if (modal) closeModal(modal)
    })
  })

  // Close modal on backdrop click
  document.querySelectorAll('[data-modal]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[data-modal]').forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          closeModal(modal)
        }
      })
    }
  })

  // Modal swipe simulation from modal buttons
  document.querySelectorAll('[data-modal]').forEach(modal => {
    const modalId = modal.id

    const nopeBtn = modal.querySelector('.modal-nope-btn')
    if (nopeBtn) {
      nopeBtn.addEventListener('click', () => {
        closeModal(modal)
        setTimeout(() => simulateSwipe(false, modalId), 150)
      })
    }

    const likeBtn = modal.querySelector('.modal-like-btn')
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        closeModal(modal)
        setTimeout(() => simulateSwipe(true, modalId), 150)
      })
    }
  })
}

function openModal(modal) {
  modal.classList.remove('hidden')
  modal.classList.add('flex')
  document.body.style.overflow = 'hidden'
}

function closeModal(modal) {
  modal.classList.add('hidden')
  modal.classList.remove('flex')
  document.body.style.overflow = ''
}

function simulateSwipe(goRight, modalId) {
  const cards = document.querySelector('.cards')
  if (!cards) return

  let actualCard = null
  const allCards = cards.querySelectorAll('article')

  for (const card of allCards) {
    const cardImg = card.querySelector('.poem-card-img')
    if (cardImg && cardImg.getAttribute('data-modal-target') === modalId) {
      actualCard = card
      break
    }
  }

  if (!actualCard) return

  actualCard.classList.add(goRight ? 'go-right' : 'go-left')

  const choiceEl = goRight
    ? actualCard.querySelector('.choice.like')
    : actualCard.querySelector('.choice.nope')

  if (choiceEl) {
    choiceEl.style.opacity = 1
  }

  actualCard.addEventListener('transitionend', () => {
    actualCard.remove()
  }, { once: true })
}

// Popover functionality
function initPopovers() {
  let currentPopover = null

  document.querySelectorAll('[data-popover-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()

      // Remove existing popover
      if (currentPopover) {
        currentPopover.remove()
        currentPopover = null
      }

      const title = trigger.getAttribute('data-popover-title')
      const content = trigger.getAttribute('data-popover-content')

      const popover = document.createElement('div')
      popover.className = 'absolute z-50 bg-gray-800 text-white rounded-lg shadow-xl border border-white/10 p-3 min-w-[200px] bottom-full left-1/2 -translate-x-1/2 mb-2'
      popover.innerHTML = `
        <div class="font-bold text-sm mb-1 text-white border-b border-white/10 pb-1">${title}</div>
        <div class="text-xs text-white/70">${content}</div>
        <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
      `

      trigger.style.position = 'relative'
      trigger.appendChild(popover)
      currentPopover = popover
    })
  })

  // Close popover on click outside
  document.addEventListener('click', () => {
    if (currentPopover) {
      currentPopover.remove()
      currentPopover = null
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel()
  initModals()
  initPopovers()
})
