// Global Navigation and Utility Functions

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle")
  const navMenu = document.getElementById("navMenu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")

      // Animate hamburger icon
      const spans = navToggle.querySelectorAll("span")
      spans.forEach((span, index) => {
        if (navMenu.classList.contains("active")) {
          if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)"
          if (index === 1) span.style.opacity = "0"
          if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)"
        } else {
          span.style.transform = ""
          span.style.opacity = ""
        }
      })
    })
  }

  // Mobile Dropdown Functionality
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")

    if (toggle) {
      toggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault()
          dropdown.classList.toggle("active")
        }
      })
    }
  })

  // Smooth Scroll for Anchor Links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && href.length > 1) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu && navToggle) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          const spans = navToggle.querySelectorAll("span")
          spans.forEach((span) => {
            span.style.transform = ""
            span.style.opacity = ""
          })
        }
      }
    }
  })
})
