// Bookings Management Page

document.addEventListener("DOMContentLoaded", () => {
  loadAllBookings();
  initFilters();
  initModal();
  initExport();
  initClearAll();
  initSelectAll();

  // Check if viewing specific booking
  const urlParams = new URLSearchParams(window.location.search);
  const viewId = urlParams.get("view");
  if (viewId) {
    viewBookingDetails(viewId);
  }
});

async function loadAllBookings(filters = {}) {
  try {
    console.log("[v0] Loading bookings with filters:", filters);

    const queryParams = new URLSearchParams();

    if (filters.status && filters.status !== "all") {
      queryParams.append("status", filters.status);
    }
    if (filters.service && filters.service !== "all") {
      queryParams.append("service", filters.service);
    }
    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    const bookings = await window.API.request(
      `/bookings?${queryParams.toString()}`
    );
    console.log("[v0] Loaded bookings:", bookings.length);

    // Update table
    const tableBody = document.getElementById("bookingsTableBody");

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="10">
            <i class="fas fa-calendar-times"></i>
            <p>No bookings found</p>
            <p style="font-size: 14px; color: var(--gray-500); margin-top: 8px;">
              ${
                filters.search ||
                filters.status !== "all" ||
                filters.service !== "all"
                  ? "Try adjusting your filters"
                  : "Bookings will appear here once submitted through the contact form"
              }
            </p>
          </td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = bookings
        .map(
          (booking, index) => `
        <tr>
          <td><input type="checkbox" class="booking-checkbox" data-id="${
            booking._id
          }"></td>
          <td>#${index + 1}</td>
          <td>${formatDate(booking.createdAt)}</td>
          <td>${booking.name}</td>
          <td>
            <div>${booking.email}</div>
            <div style="font-size: 12px; color: var(--gray-500);">${
              booking.phone
            }</div>
          </td>
          <td>${booking.service}</td>
          <td>
            <div>${formatDate(booking.preferredDate)}</div>
            <div style="font-size: 12px; color: var(--gray-500);">${
              booking.preferredTime
            }</div>
          </td>
          <td>Online</td>
          <td><span class="status-badge status-${booking.status}">${
            booking.status
          }</span></td>
          <td>
            <button class="action-btn btn-view" onclick="viewBookingDetails('${
              booking._id
            }')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn btn-update" onclick="quickUpdateStatus('${
              booking._id
            }')" title="Update Status">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn btn-delete" onclick="confirmDeleteBooking('${
              booking._id
            }')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `
        )
        .join("");
    }

    // Update counts
    const allBookings = await window.API.request("/bookings");
    document.getElementById("showingCount").textContent = bookings.length;
    document.getElementById("totalCount").textContent = allBookings.length;

    console.log("[v0] Bookings table updated successfully");
  } catch (error) {
    console.error("[v0] Error loading bookings:", error);

    const tableBody = document.getElementById("bookingsTableBody");
    tableBody.innerHTML = `
      <tr class="empty-state">
        <td colspan="10">
          <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 48px; margin-bottom: 16px;"></i>
          <p style="font-weight: 600; color: #991b1b;">Unable to Load Bookings</p>
          <p style="font-size: 14px; color: var(--gray-600); margin-top: 8px;">
            ${error.message || "Backend server is not responding"}
          </p>
          <p style="font-size: 14px; color: var(--gray-600); margin-top: 8px;">
            <strong>Solution:</strong> ${
              error.hint ||
              'Make sure MongoDB is running and start the server with "npm run dev"'
            }
          </p>
        </td>
      </tr>
    `;
  }
}

// Initialize filters
function initFilters() {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const serviceFilter = document.getElementById("serviceFilter");

  const applyFilters = () => {
    const filters = {
      search: searchInput.value,
      status: statusFilter.value,
      service: serviceFilter.value,
    };
    loadAllBookings(filters);
  };

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  serviceFilter.addEventListener("change", applyFilters);
}

// Initialize modal
function initModal() {
  const modal = document.getElementById("bookingModal");
  const closeModal = document.getElementById("closeModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

async function viewBookingDetails(id) {
  try {
    const booking = await window.API.request(`/bookings/${id}`);

    const modal = document.getElementById("bookingModal");
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `
      <div style="display: grid; gap: 20px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <strong style="color: var(--gray-700);">Booking ID:</strong>
            <p>#${booking._id.slice(-8)}</p>
          </div>
          <div>
            <strong style="color: var(--gray-700);">Status:</strong>
            <p><span class="status-badge status-${booking.status}">${
      booking.status
    }</span></p>
          </div>
          <div>
            <strong style="color: var(--gray-700);">Submitted:</strong>
            <p>${formatDate(booking.createdAt)}</p>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--gray-200);">

        <div>
          <h3 style="margin-bottom: 15px; color: var(--gray-900);">
            <i class="fas fa-user"></i> Personal Information
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
              <strong style="color: var(--gray-700);">Name:</strong>
              <p>${booking.name}</p>
            </div>
            <div>
              <strong style="color: var(--gray-700);">Email:</strong>
              <p>${booking.email}</p>
            </div>
            <div>
              <strong style="color: var(--gray-700);">Phone:</strong>
              <p>${booking.phone}</p>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--gray-200);">

        <div>
          <h3 style="margin-bottom: 15px; color: var(--gray-900);">
            <i class="fas fa-calendar-alt"></i> Appointment Details
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
              <strong style="color: var(--gray-700);">Service:</strong>
              <p>${booking.service}</p>
            </div>
            <div>
              <strong style="color: var(--gray-700);">Date:</strong>
              <p>${formatDate(booking.preferredDate)}</p>
            </div>
            <div>
              <strong style="color: var(--gray-700);">Time:</strong>
              <p>${booking.preferredTime}</p>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--gray-200);">

        <div>
          <h3 style="margin-bottom: 15px; color: var(--gray-900);">
            <i class="fas fa-comment-medical"></i> Additional Information
          </h3>
          <p style="padding: 15px; background: var(--gray-50); border-radius: 8px; line-height: 1.6;">
            ${booking.message || "No additional message provided"}
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid var(--gray-200);">

        <div>
          <h3 style="margin-bottom: 15px; color: var(--gray-900);">
            <i class="fas fa-cog"></i> Update Status
          </h3>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-secondary" onclick="changeBookingStatus('${
              booking._id
            }', 'pending')">
              <i class="fas fa-clock"></i> Pending
            </button>
            <button class="btn-primary" onclick="changeBookingStatus('${
              booking._id
            }', 'confirmed')">
              <i class="fas fa-check"></i> Confirmed
            </button>
            <button class="btn-secondary" onclick="changeBookingStatus('${
              booking._id
            }', 'completed')">
              <i class="fas fa-check-double"></i> Completed
            </button>
            <button class="btn-warning" onclick="changeBookingStatus('${
              booking._id
            }', 'cancelled')">
              <i class="fas fa-times"></i> Cancelled
            </button>
            <button class="btn-danger" onclick="confirmDeleteFromModal('${
              booking._id
            }')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
  } catch (error) {
    console.error("Error viewing booking:", error);
    alert("Failed to load booking details");
  }
}

async function changeBookingStatus(id, status) {
  try {
    await window.API.request(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    loadAllBookings();
    viewBookingDetails(id);
    alert(`Status updated to "${status}"`);
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status");
  }
}

async function quickUpdateStatus(id) {
  try {
    const booking = await window.API.request(`/bookings/${id}`);

    const statuses = ["pending", "confirmed", "completed", "cancelled"];
    const currentIndex = statuses.indexOf(booking.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    await window.API.request(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });

    loadAllBookings();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status");
  }
}

async function confirmDeleteBooking(id) {
  if (
    confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    )
  ) {
    try {
      await window.API.request(`/bookings/${id}`, {
        method: "DELETE",
      });

      loadAllBookings();
      alert("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  }
}

async function confirmDeleteFromModal(id) {
  if (
    confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    )
  ) {
    try {
      await window.API.request(`/bookings/${id}`, {
        method: "DELETE",
      });

      document.getElementById("bookingModal").classList.remove("active");
      loadAllBookings();
      alert("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  }
}

function initExport() {
  const exportBtn = document.getElementById("exportBtn");

  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      try {
        const bookings = await window.API.request("/bookings");
        exportToCSV(bookings);
      } catch (error) {
        console.error("Error exporting:", error);
        alert("Failed to export bookings");
      }
    });
  }
}

function initClearAll() {
  const clearAllBtn = document.getElementById("clearAllBtn");

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", async () => {
      if (
        confirm(
          "Are you sure you want to delete ALL bookings? This action cannot be undone and will delete all booking data permanently."
        )
      ) {
        if (confirm("Please confirm again. This will delete EVERYTHING.")) {
          try {
            const bookings = await window.API.request("/bookings");

            for (const booking of bookings) {
              await window.API.request(`/bookings/${booking._id}`, {
                method: "DELETE",
              });
            }

            loadAllBookings();
            alert("All bookings have been deleted.");
          } catch (error) {
            console.error("Error clearing bookings:", error);
            alert("Failed to delete all bookings");
          }
        }
      }
    });
  }
}

// Initialize select all
function initSelectAll() {
  const selectAll = document.getElementById("selectAll");

  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      const checkboxes = document.querySelectorAll(".booking-checkbox");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
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

function exportToCSV(bookings) {
  const headers = [
    "ID",
    "Date",
    "Name",
    "Email",
    "Phone",
    "Service",
    "Preferred Date",
    "Time",
    "Status",
  ];
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
      ].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
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
