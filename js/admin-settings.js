// Settings Page Functionality

document.addEventListener("DOMContentLoaded", () => {
  initAccountForm()
  initPasswordForm()
  initDataActions()
  loadSystemInfo()
})

function initAccountForm() {
  const form = document.getElementById("accountForm")

  if (form) {
    loadAccountInfo()

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("adminUsername").value.trim()
      const email = document.getElementById("adminEmail").value.trim()

      if (!name) {
        alert("Name cannot be empty")
        return
      }

      try {
        await window.API.request("/auth/profile", {
          method: "PATCH",
          body: JSON.stringify({ name, email }),
        })

        sessionStorage.setItem("admin_name", name)
        alert("Account settings updated successfully!")
        updateAdminName()
      } catch (error) {
        console.error("Error updating profile:", error)
        alert("Failed to update profile")
      }
    })
  }
}

async function loadAccountInfo() {
  try {
    const admin = await window.API.request("/auth/profile")
    document.getElementById("adminUsername").value = admin.name
    document.getElementById("adminEmail").value = admin.email
  } catch (error) {
    console.error("Error loading account info:", error)
  }
}

function initPasswordForm() {
  const form = document.getElementById("passwordForm")

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const currentPassword = document.getElementById("currentPassword").value
      const newPassword = document.getElementById("newPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match")
        return
      }

      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long")
        return
      }

      try {
        await window.API.request("/auth/change-password", {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword }),
        })

        alert("Password updated successfully!")
        form.reset()
      } catch (error) {
        console.error("Error changing password:", error)
        alert(error.message || "Failed to change password")
      }
    })
  }
}

function initDataActions() {
  const exportAllBtn = document.getElementById("exportAllBtn")
  const clearOldBtn = document.getElementById("clearOldBtn")
  const resetAllBtn = document.getElementById("resetAllBtn")

  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", async () => {
      try {
        const bookings = await window.API.request("/bookings")
        exportToCSV(bookings)
        alert("Bookings exported successfully!")
      } catch (error) {
        console.error("Error exporting:", error)
        alert("Failed to export bookings")
      }
    })
  }

  if (clearOldBtn) {
    clearOldBtn.addEventListener("click", async () => {
      if (confirm("This will delete bookings older than 6 months. Continue?")) {
        try {
          await window.API.request("/bookings/cleanup/old", {
            method: "DELETE",
          })

          alert("Old bookings cleared successfully")
          loadSystemInfo()
        } catch (error) {
          console.error("Error clearing old bookings:", error)
          alert("Failed to clear old bookings")
        }
      }
    })
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", async () => {
      if (confirm("⚠️ WARNING: This will delete ALL data including bookings. This cannot be undone!")) {
        if (confirm("Are you absolutely sure? Type YES in the next prompt to confirm.")) {
          const confirmation = prompt("Type YES to confirm deletion of all data:")

          if (confirmation === "YES") {
            try {
              const bookings = await window.API.request("/bookings")

              for (const booking of bookings) {
                await window.API.request(`/bookings/${booking._id}`, {
                  method: "DELETE",
                })
              }

              alert("All data has been reset.")
              loadSystemInfo()
            } catch (error) {
              console.error("Error resetting data:", error)
              alert("Failed to reset data")
            }
          }
        }
      }
    })
  }
}

async function loadSystemInfo() {
  try {
    const stats = await window.API.request("/bookings/stats/summary")

    document.getElementById("totalBookingsInfo").textContent = stats.total

    const lastLogin = localStorage.getItem("last_login")
    if (lastLogin) {
      document.getElementById("lastLoginInfo").textContent = formatDate(lastLogin)
    }

    document.getElementById("storageInfo").textContent = "MongoDB"
  } catch (error) {
    console.error("Error loading system info:", error)
  }
}

function updateAdminName() {
  const adminNameElement = document.getElementById("adminName")
  if (adminNameElement) {
    adminNameElement.textContent = sessionStorage.getItem("admin_name") || "Admin"
  }
}

function exportToCSV(bookings) {
  const headers = ["ID", "Date", "Name", "Email", "Phone", "Service", "Preferred Date", "Time", "Status"]
  const csvContent = [
    headers.join(","),
    ...bookings.map((b) => {
      return [
        b._id.slice(-8),
        formatDate(b.createdAt),
        `"${b.name}"`,
        b.email,
        b.phone,
        `"${b.service}"`,
        formatDate(b.preferredDate),
        b.preferredTime,
        b.status,
      ].join(",")
    }),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `all_bookings_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}
