// System Status Checker

const statusResults = {
  backend: false,
  mongodb: false,
  api: false,
  data: false,
};

document.addEventListener("DOMContentLoaded", () => {
  runDiagnostics();
});

async function runDiagnostics() {
  console.log("[v0] Running system diagnostics...");

  // Reset all status
  resetStatus();

  // Run checks
  await checkBackendServer();
  await checkMongoConnection();
  await checkAPIEndpoints();
  await checkDataStatus();

  // Update diagnostic info
  updateDiagnosticInfo();
}

function resetStatus() {
  const cards = document.querySelectorAll(".status-card");
  cards.forEach((card) => {
    card.querySelector(".status-text").textContent = "Checking...";
    card.querySelector(".status-detail").textContent = "";
    card.querySelector(".status-indicator").className = "status-indicator";
  });
}

async function checkBackendServer() {
  const card = document.getElementById("backendStatus");
  const statusText = card.querySelector(".status-text");
  const statusDetail = card.querySelector(".status-detail");
  const indicator = card.querySelector(".status-indicator");

  try {
    console.log("[v0] Checking backend server at:", window.API.baseUrl);
    const response = await fetch(`${window.API.baseUrl}/health`, {
      method: "GET",
    });

    if (response.ok) {
      statusResults.backend = true;
      statusText.textContent = "✅ Online";
      statusDetail.textContent = `Connected to ${window.API.baseUrl}`;
      indicator.classList.add("status-success");
      console.log("[v0] Backend server is online");
    } else {
      throw new Error(`Server returned status ${response.status}`);
    }
  } catch (error) {
    statusResults.backend = false;
    statusText.textContent = "❌ Offline";
    statusDetail.textContent = error.message.includes("Failed to fetch")
      ? "Cannot connect to server. Make sure server is running."
      : error.message;
    indicator.classList.add("status-error");
    console.error("[v0] Backend server check failed:", error);
  }
}

async function checkMongoConnection() {
  const card = document.getElementById("mongoStatus");
  const statusText = card.querySelector(".status-text");
  const statusDetail = card.querySelector(".status-detail");
  const indicator = card.querySelector(".status-indicator");

  if (!statusResults.backend) {
    statusText.textContent = "⚠️ Cannot Check";
    statusDetail.textContent = "Backend server must be online first";
    indicator.classList.add("status-warning");
    return;
  }

  try {
    console.log("[v0] Checking MongoDB connection...");
    const response = await window.API.request("/health/db");

    if (response.connected) {
      statusResults.mongodb = true;
      statusText.textContent = "✅ Connected";
      statusDetail.textContent = `Database: ${
        response.database || "life-beyond-medicine"
      }`;
      indicator.classList.add("status-success");
      console.log("[v0] MongoDB is connected");
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    statusResults.mongodb = false;
    statusText.textContent = "❌ Not Connected";
    statusDetail.textContent =
      "MongoDB connection failed. Check if MongoDB is running.";
    indicator.classList.add("status-error");
    console.error("[v0] MongoDB check failed:", error);
  }
}

async function checkAPIEndpoints() {
  const card = document.getElementById("apiStatus");
  const statusText = card.querySelector(".status-text");
  const statusDetail = card.querySelector(".status-detail");
  const indicator = card.querySelector(".status-indicator");

  if (!statusResults.backend || !statusResults.mongodb) {
    statusText.textContent = "⚠️ Cannot Check";
    statusDetail.textContent = "Backend and MongoDB must be online first";
    indicator.classList.add("status-warning");
    return;
  }

  try {
    console.log("[v0] Testing API endpoints...");
    // Test multiple endpoints
    const tests = await Promise.all([
      window.API.request("/bookings/stats/summary").catch(() => null),
      window.API.request("/bookings").catch(() => null),
    ]);

    const successCount = tests.filter((t) => t !== null).length;

    if (successCount === tests.length) {
      statusResults.api = true;
      statusText.textContent = "✅ All Working";
      statusDetail.textContent = `${successCount}/${tests.length} endpoints responding`;
      indicator.classList.add("status-success");
      console.log("[v0] All API endpoints working");
    } else if (successCount > 0) {
      statusResults.api = true;
      statusText.textContent = "⚠️ Partial";
      statusDetail.textContent = `${successCount}/${tests.length} endpoints responding`;
      indicator.classList.add("status-warning");
      console.warn("[v0] Some API endpoints failed");
    } else {
      throw new Error("All endpoints failed");
    }
  } catch (error) {
    statusResults.api = false;
    statusText.textContent = "❌ Failed";
    statusDetail.textContent = "API endpoints not responding correctly";
    indicator.classList.add("status-error");
    console.error("[v0] API endpoints check failed:", error);
  }
}

async function checkDataStatus() {
  const card = document.getElementById("dataStatus");
  const statusText = card.querySelector(".status-text");
  const statusDetail = card.querySelector(".status-detail");
  const indicator = card.querySelector(".status-indicator");

  if (!statusResults.api) {
    statusText.textContent = "⚠️ Cannot Check";
    statusDetail.textContent = "API must be working first";
    indicator.classList.add("status-warning");
    return;
  }

  try {
    console.log("[v0] Checking data status...");
    const stats = await window.API.request("/bookings/stats/summary");

    statusResults.data = true;
    statusText.textContent = "✅ Accessible";
    statusDetail.textContent = `${stats.total || 0} total bookings in database`;
    indicator.classList.add("status-success");
    console.log("[v0] Data status checked:", stats);
  } catch (error) {
    statusResults.data = false;
    statusText.textContent = "❌ Issue Detected";
    statusDetail.textContent = "Cannot retrieve data from database";
    indicator.classList.add("status-error");
    console.error("[v0] Data status check failed:", error);
  }
}

function updateDiagnosticInfo() {
  const diagnosticDiv = document.getElementById("diagnosticInfo");

  const allGood = Object.values(statusResults).every((v) => v);

  let html = "";

  if (allGood) {
    html = `
      <div style="padding: 20px; background: #d1fae5; border: 2px solid #10b981; border-radius: 8px; color: #065f46;">
        <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-check-circle" style="font-size: 24px;"></i>
          All Systems Operational
        </h3>
        <p style="margin: 0;">Your Life Beyond Medicine admin panel is fully operational and ready to use!</p>
      </div>
    `;
  } else {
    html = `
      <div style="padding: 20px; background: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; color: #991b1b;">
        <h3 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
          Issues Detected
        </h3>
        <p style="margin: 0 0 15px 0;">Some components are not working properly. See issues below:</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${
            !statusResults.backend
              ? "<li><strong>Backend Server:</strong> Not running. Run <code>npm run dev</code></li>"
              : ""
          }
          ${
            !statusResults.mongodb
              ? "<li><strong>MongoDB:</strong> Not connected. Make sure MongoDB is installed and running</li>"
              : ""
          }
          ${
            !statusResults.api
              ? "<li><strong>API:</strong> Endpoints not responding. Check server logs</li>"
              : ""
          }
          ${
            !statusResults.data
              ? "<li><strong>Data:</strong> Cannot access database. Check MongoDB connection</li>"
              : ""
          }
        </ul>
      </div>
    `;
  }

  // Add detailed info
  html += `
    <div style="margin-top: 20px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
      <h4 style="margin: 0 0 15px 0;">Technical Details</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #d1d5db;">
          <td style="padding: 10px; font-weight: 600;">API Base URL:</td>
          <td style="padding: 10px;"><code>${window.API.baseUrl}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid #d1d5db;">
          <td style="padding: 10px; font-weight: 600;">Browser:</td>
          <td style="padding: 10px;">${navigator.userAgent
            .split(" ")
            .slice(-2)
            .join(" ")}</td>
        </tr>
        <tr style="border-bottom: 1px solid #d1d5db;">
          <td style="padding: 10px; font-weight: 600;">Last Check:</td>
          <td style="padding: 10px;">${new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: 600;">Status Summary:</td>
          <td style="padding: 10px;">
            Backend: ${statusResults.backend ? "✅" : "❌"} | 
            MongoDB: ${statusResults.mongodb ? "✅" : "❌"} | 
            API: ${statusResults.api ? "✅" : "❌"} | 
            Data: ${statusResults.data ? "✅" : "❌"}
          </td>
        </tr>
      </table>
    </div>
  `;

  diagnosticDiv.innerHTML = html;
}
