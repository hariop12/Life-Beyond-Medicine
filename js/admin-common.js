// Common Admin Panel Functionality

document.addEventListener("DOMContentLoaded", () => {
  checkBackendConnection();

  // Check authentication
  checkAuth();

  // Initialize UI components
  initSidebar();
  initLogout();
  updateBookingsCount();
  updateAdminName();
});

async function checkBackendConnection() {
  const connectionStatus = document.createElement("div");
  connectionStatus.id = "connectionStatus";
  connectionStatus.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none;
  `;
  document.body.appendChild(connectionStatus);

  try {
    console.log("[v0] Checking backend connection...");
    await window.API.request("/bookings/stats/summary");
    console.log("[v0] Backend connected successfully");

    // Show success message briefly
    connectionStatus.style.display = "block";
    connectionStatus.style.background = "#10b981";
    connectionStatus.style.color = "white";
    connectionStatus.innerHTML =
      '<i class="fas fa-check-circle"></i> Backend Connected';

    setTimeout(() => {
      connectionStatus.style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("[v0] Backend connection failed:", error);

    // Show error message
    connectionStatus.style.display = "block";
    connectionStatus.style.background = "#ef4444";
    connectionStatus.style.color = "white";
    connectionStatus.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <div style="font-weight: 600;">Backend Not Connected</div>
          <div style="font-size: 12px; margin-top: 4px;">
            ${error.hint || 'Run "npm run dev" to start the server'}
          </div>
        </div>
      </div>
    `;
  }
}

// Check if user is authenticated
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem("admin_logged_in");
  const rememberMe = localStorage.getItem("admin_remember");

  if (isLoggedIn !== "true" && rememberMe !== "true") {
    window.location.href = "login.html";
  }
}

// Initialize sidebar functionality
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileToggle = document.getElementById("mobileToggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove("active");
      }
    }
  });
}

// Initialize logout functionality
function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_remember");
        window.location.href = "login.html";
      }
    });
  }
}

// Update bookings count in sidebar
async function updateBookingsCount() {
  try {
    const stats = await window.API.request("/bookings/stats/summary");
    const pendingCount = stats.pending || 0;

    const countElements = document.querySelectorAll("#bookingsCount");
    countElements.forEach((el) => {
      el.textContent = pendingCount;
      // Add animation
      el.style.transform = "scale(1.2)";
      setTimeout(() => {
        el.style.transform = "scale(1)";
      }, 200);
    });
  } catch (error) {
    console.error("[v0] Error updating bookings count:", error);
    // Don't show alert, just log error
  }
}

// Update admin name
function updateAdminName() {
  const adminName = sessionStorage.getItem("admin_name") || "Admin";
  const nameElements = document.querySelectorAll("#adminName");

  nameElements.forEach((el) => {
    el.textContent = adminName;
  });
}

// Get all bookings from API
async function getBookings() {
  try {
    return await window.API.request("/bookings");
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error);
    return [];
  }
}

// Save bookings to API (not needed in this version)
// function saveBookings(bookings) {
//   localStorage.setItem("consultations", JSON.stringify(bookings))
//   updateBookingsCount()
// }

// Delete a booking
async function deleteBooking(id) {
  const bookings = await getBookings();
  const updatedBookings = bookings.filter((b) => b.id !== id);
  // Save updated bookings to API
  try {
    await window.API.request("/bookings", {
      method: "POST",
      body: JSON.stringify(updatedBookings),
    });
    updateBookingsCount();
  } catch (error) {
    console.error("[v0] Error deleting booking:", error);
  }
}

// Update booking status
async function updateBookingStatus(id, status) {
  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === id);

  if (booking) {
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    // Save updated bookings to API
    try {
      await window.API.request("/bookings", {
        method: "POST",
        body: JSON.stringify(bookings),
      });
      updateBookingsCount();
    } catch (error) {
      console.error("[v0] Error updating booking status:", error);
    }
  }
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Format time
function formatTime(timeString) {
  return timeString;
}

// Get service display name
function getServiceName(value) {
  const services = {
    naturopath: "Naturopathy",
    yoga: "Yoga Therapy",
    nutritionist: "Holistic Nutrition",
    sujok: "Sujok Smile Healing",
    meditation: "Smile Meditation",
    holistic: "Holistic Healing",
    counselor: "CPA Counseling",
  };
  return services[value] || value;
}

// Export bookings to CSV
function exportToCSV() {
  const bookings = getBookings();

  if (bookings.length === 0) {
    alert("No bookings to export");
    return;
  }

  // CSV headers
  const headers = [
    "ID",
    "Submitted Date",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Service",
    "Appointment Date",
    "Time",
    "Type",
    "Status",
    "Message",
  ];

  // Convert bookings to CSV rows
  const rows = bookings.map((booking) => [
    booking.id,
    formatDate(booking.submittedAt),
    booking.firstName,
    booking.lastName,
    booking.email,
    booking.phone,
    getServiceName(booking.service),
    booking.date,
    booking.time,
    booking.consultationType,
    booking.status,
    `"${booking.message.replace(/"/g, '""')}"`,
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `bookings_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
