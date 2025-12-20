// Dashboard Page Functionality

// Declare variables before using them
const getBookings = () => {
  // Placeholder for getBookings function
  return [
    {
      id: 1,
      date: "2023-10-01",
      firstName: "John",
      lastName: "Doe",
      service: "Service A",
      time: "10:00",
      consultationType: "Online",
      status: "pending",
      email: "john@example.com",
    },
    {
      id: 2,
      date: "2023-10-02",
      firstName: "Jane",
      lastName: "Smith",
      service: "Service B",
      time: "11:00",
      consultationType: "In-person",
      status: "confirmed",
      email: "jane@example.com",
    },
    // Add more bookings as needed
  ];
};

const getServiceName = (serviceId) => {
  // Placeholder for getServiceName function
  const services = {
    "Service A": "Service A",
    "Service B": "Service B",
    // Add more services as needed
  };
  return services[serviceId] || "Unknown Service";
};

const updateBookingStatus = (id, newStatus) => {
  // Placeholder for updateBookingStatus function
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === id);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = newStatus;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardStats();
  loadRecentBookings();
});

async function loadDashboardStats() {
  try {
    console.log("[v0] Loading dashboard stats...");
    const stats = await window.API.request("/bookings/stats/summary");
    console.log("[v0] Stats loaded:", stats);

    // Update stat cards
    document.getElementById("totalBookings").textContent = stats.total || 0;
    document.getElementById("pendingBookings").textContent = stats.pending || 0;
    document.getElementById("confirmedBookings").textContent =
      stats.confirmed || 0;

    // Calculate unique clients from recent bookings
    const uniqueEmails = new Set(stats.recentBookings.map((b) => b.email));
    document.getElementById("totalClients").textContent = uniqueEmails.size;

    console.log("[v0] Dashboard stats updated successfully");
  } catch (error) {
    console.error("[v0] Error loading dashboard stats:", error);

    showError(
      "Unable to load dashboard statistics. Please ensure the backend server is running."
    );
  }
}

async function loadRecentBookings() {
  try {
    const stats = await window.API.request("/bookings/stats/summary");
    const recentBookings = stats.recentBookings;
    const tableBody = document.getElementById("recentBookingsTable");

    if (recentBookings.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="7">
            <i class="fas fa-calendar-times"></i>
            <p>No bookings yet</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = recentBookings
      .map(
        (booking) => `
      <tr>
        <td>${formatDate(booking.preferredDate)}</td>
        <td>${booking.name}</td>
        <td>${booking.service}</td>
        <td>${booking.preferredTime}</td>
        <td>Online</td>
        <td><span class="status-badge status-${booking.status}">${
          booking.status
        }</span></td>
        <td>
          <button class="action-btn btn-view" onclick="viewBooking('${
            booking._id
          }')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn btn-update" onclick="updateStatus('${
            booking._id
          }')">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading recent bookings:", error);
  }
}

// View booking details
function viewBooking(id) {
  window.location.href = `bookings.html?view=${id}`;
}

async function updateStatus(id) {
  try {
    const booking = await window.API.request(`/bookings/${id}`);

    const statuses = ["pending", "confirmed", "completed", "cancelled"];
    const currentIndex = statuses.indexOf(booking.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    if (confirm(`Change status to "${nextStatus}"?`)) {
      await window.API.request(`/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      loadDashboardStats();
      loadRecentBookings();
      alert("Status updated successfully!");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status");
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function showError(message) {
  const container =
    document.querySelector(".dashboard-stats") ||
    document.querySelector(".dashboard-content");
  if (!container) return;

  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    background: #fee2e2;
    border: 2px solid #ef4444;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #991b1b;
  `;
  errorDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i>
      <div>
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">Connection Error</h4>
        <p style="margin: 0;">${message}</p>
        <p style="margin: 8px 0 0 0; font-size: 14px;">
          <strong>Fix:</strong> Run <code style="background: #fca5a5; padding: 2px 6px; border-radius: 4px;">npm run dev</code> in your terminal
        </p>
      </div>
    </div>
  `;
  container.insertBefore(errorDiv, container.firstChild);
}
