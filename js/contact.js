// Contact Form Functionality

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("consultationForm");
  const successMessage = document.getElementById("successMessage");

  if (form) {
    // Set minimum date to today
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }

    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Basic validation
      if (!validateForm(data)) {
        return;
      }

      try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        await submitBooking(data);

        // Show success message
        form.style.display = "none";
        successMessage.style.display = "block";

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

        // Reset form after 5 seconds
        setTimeout(() => {
          form.reset();
          form.style.display = "block";
          successMessage.style.display = "none";
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 5000);
      } catch (error) {
        let errorMessage =
          "Failed to submit booking. Please try again or contact us directly.";

        if (error.hint) {
          errorMessage = `${error.message}\n\n${error.hint}`;
        } else if (error.details) {
          errorMessage = `${error.message}\n\nDetails: ${error.details}`;
        } else if (error.serverMessage) {
          errorMessage = error.serverMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        alert(errorMessage);
        console.error("Booking submission error:", error);

        // Re-enable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane"></i> Book Consultation';
      }
    });
  }

  function validateForm(data) {
    // Check required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "service",
      "date",
      "time",
      "message",
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        alert(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`
        );
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Validate phone
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(data.phone)) {
      alert("Please enter a valid phone number.");
      return false;
    }

    // Check terms acceptance
    if (!data.terms) {
      alert("Please accept the terms and conditions to proceed.");
      return false;
    }

    return true;
  }

  async function submitBooking(data) {
    const serviceMap = {
      naturopath: "Naturopath",
      yoga: "Yoga Therapist",
      nutritionist: "Nutritionist",
      sujok: "Sujok Smile Healer",
      meditation: "Smile Meditation",
      holistic: "Holistic Healer",
      counselor: "CPA Counselor",
    };

    const bookingData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      service: serviceMap[data.service] || data.service,
      preferredDate: data.date,
      preferredTime: data.time,
      message: `Consultation Type: ${
        data.consultationType || "in-person"
      }\nFirst Visit: ${data.firstVisit === "on" ? "Yes" : "No"}\n\nMessage: ${
        data.message
      }`,
    };

    console.log("[v0] Submitting booking data:", bookingData);

    const response = await window.API.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });

    console.log("[v0] Booking response:", response);

    return response;
  }
});
