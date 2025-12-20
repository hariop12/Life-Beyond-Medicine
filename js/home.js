// Home Page Carousel Functionality

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide")
  const indicators = document.querySelectorAll(".indicator")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  let currentSlide = 0
  let autoSlideInterval

  // Show specific slide
  function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active"))
    indicators.forEach((indicator) => indicator.classList.remove("active"))

    // Add active class to current slide and indicator
    slides[index].classList.add("active")
    indicators[index].classList.add("active")
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length
    showSlide(currentSlide)
  }

  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length
    showSlide(currentSlide)
  }

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000)
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval)
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoSlide()
      nextSlide()
      startAutoSlide()
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoSlide()
      prevSlide()
      startAutoSlide()
    })
  }

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      stopAutoSlide()
      currentSlide = index
      showSlide(currentSlide)
      startAutoSlide()
    })
  })

  // Pause auto-slide on hover
  const carouselContainer = document.querySelector(".hero-carousel")
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoSlide)
    carouselContainer.addEventListener("mouseleave", startAutoSlide)
  }

  // Start auto-slide
  startAutoSlide()
})
