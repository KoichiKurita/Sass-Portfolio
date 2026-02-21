import './scss/main.scss'

const toggle = document.getElementById('theme-toggle')
const fadeElements = document.querySelectorAll('.c-card, section')
const header = document.querySelector('.l-header')

if (toggle) {
  toggle.addEventListener('click', () => {
    const html = document.documentElement
    html.dataset.theme =
      html.dataset.theme === 'dark' ? 'light' : 'dark'
  })
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
    }
  })
}, { threshold: 0.2 })

fadeElements.forEach(el => observer.observe(el))

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('is-scrolled')
  } else {
    header.classList.remove('is-scrolled')
  }
})