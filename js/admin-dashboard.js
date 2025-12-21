// Dashboard Page Functionality

document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Initializing dashboard...");
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

    const bookingsCount = document.getElementById("bookingsCount");
    if (bookingsCount) {
      bookingsCount.textContent = stats.pending || 0;
    }

    console.log("[v0] Dashboard stats updated successfully");
  } catch (error) {
    console.error("[v0] Error loading dashboard stats:", error);
    showError(
      `Unable to load dashboard statistics. ${error.message || ""}`,
      error.hint ||
        'Make sure MongoDB is running and the server is started with "npm run dev"'
    );
  }
}

async function loadRecentBookings() {
  try {
    console.log("[v0] Loading recent bookings...");
    const stats = await window.API.request("/bookings/stats/summary");
    const recentBookings = stats.recentBookings;
    const tableBody = document.getElementById("recentBookingsTable");

    if (recentBookings.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="7">
            <i class="fas fa-calendar-times"></i>
            <p>No bookings yet</p>
            <p style="font-size: 14px; color: var(--gray-500); margin-top: 8px;">
              Bookings will appear here once submitted
            </p>
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
          }')" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn btn-update" onclick="updateStatus('${
            booking._id
          }')" title="Update Status">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");

    console.log("[v0] Recent bookings loaded successfully");
  } catch (error) {
    console.error("[v0] Error loading recent bookings:", error);
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
    console.error("[v0] Error updating status:", error);
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

function showError(message, hint) {
  const container = document.querySelector(".admin-content");
  if (!container) return;

  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    background: #fee2e2;
    border: 2px solid #ef4444;
    border-radius: 8px;
    padding: 20px;
    margin: 0 0 20px 0;
    color: #991b1b;
  `;
  errorDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i>
      <div>
        <h4 style="margin: 0 0 8px 0; font-weight: 600;">Connection Error</h4>
        <p style="margin: 0;">${message}</p>
        ${
          hint
            ? `<p style="margin: 8px 0 0 0; font-size: 14px;"><strong>Fix:</strong> ${hint}</p>`
            : ""
        }
      </div>
    </div>
  `;
  container.insertBefore(errorDiv, container.firstChild);
}
