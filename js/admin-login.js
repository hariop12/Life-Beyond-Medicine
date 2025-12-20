// Admin Login Functionality

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const passwordToggle = document.getElementById("passwordToggle")
  const passwordInput = document.getElementById("password")
  const errorMessage = document.getElementById("errorMessage")
  const errorText = document.getElementById("errorText")

  // Password toggle
  if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password"
      passwordInput.type = type
      passwordToggle.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>'
    })
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value.trim()
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember").checked
      const submitBtn = loginForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML

      try {
        // Show loading state
        submitBtn.disabled = true
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'

        const response = await window.API.request("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        })

        // Store session
        sessionStorage.setItem("admin_logged_in", "true")
        sessionStorage.setItem("admin_token", response.token)
        sessionStorage.setItem("admin_name", response.admin.name)
        sessionStorage.setItem("admin_username", response.admin.username)

        if (remember) {
          localStorage.setItem("admin_remember", "true")
          localStorage.setItem("admin_token", response.token)
        }

        // Store last login time
        localStorage.setItem("last_login", new Date().toISOString())

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } catch (error) {
        // Show error
        errorText.textContent = error.message || "Invalid username or password"
        errorMessage.style.display = "flex"

        // Hide error after 5 seconds
        setTimeout(() => {
          errorMessage.style.display = "none"
        }, 5000)

        // Re-enable submit button
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      }
    })
  }

  // Check if already logged in
  const isLoggedIn = sessionStorage.getItem("admin_logged_in")
  const rememberMe = localStorage.getItem("admin_remember")

  if (isLoggedIn === "true" || rememberMe === "true") {
    window.location.href = "dashboard.html"
  }
})
