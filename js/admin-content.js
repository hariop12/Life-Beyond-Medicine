// Content Manager Functionality

document.addEventListener("DOMContentLoaded", () => {
  initPageSelector()
  initEditorActions()
})

// Initialize page selector
function initPageSelector() {
  const pageSelect = document.getElementById("pageSelect")

  if (pageSelect) {
    pageSelect.addEventListener("change", (e) => {
      const page = e.target.value

      if (page) {
        loadPageContent(page)
      } else {
        document.getElementById("editorSection").style.display = "none"
        document.getElementById("instructionsSection").style.display = "block"
      }
    })
  }
}

// Load page content for editing
function loadPageContent(page) {
  const editorSection = document.getElementById("editorSection")
  const instructionsSection = document.getElementById("instructionsSection")
  const currentPage = document.getElementById("currentPage")
  const editorBody = document.getElementById("editorBody")

  const contentTemplates = {
    home: `
      <div class="content-form">
        <h3 style="margin-bottom: 20px;">Home Page Content</h3>
        
        <div class="form-group">
          <label>Main Heading</label>
          <input type="text" id="homeHeading" class="content-input" value="Life Beyond Medicine" />
        </div>
        
        <div class="form-group">
          <label>Subheading</label>
          <input type="text" id="homeSubheading" class="content-input" value="Holistic Healing for Body, Mind & Spirit" />
        </div>
        
        <div class="form-group">
          <label>Hero Description</label>
          <textarea id="homeDescription" class="content-textarea" rows="4">Discover the power of Ayurveda, Naturopathy, Yoga, and holistic therapies to transform your health naturally.</textarea>
        </div>
        
        <div class="form-group">
          <label>About Section Title</label>
          <input type="text" id="aboutTitle" class="content-input" value="Embrace Holistic Wellness" />
        </div>
        
        <div class="form-group">
          <label>About Section Text</label>
          <textarea id="aboutText" class="content-textarea" rows="6">Our approach integrates ancient wisdom with modern understanding to provide comprehensive care for your wellbeing. We believe in treating the root cause, not just symptoms.</textarea>
        </div>
      </div>
    `,
    about: `
      <div class="content-form">
        <h3 style="margin-bottom: 20px;">About Page Content</h3>
        
        <div class="form-group">
          <label>Page Heading</label>
          <input type="text" id="aboutHeading" class="content-input" value="About Life Beyond Medicine" />
        </div>
        
        <div class="form-group">
          <label>Mission Statement</label>
          <textarea id="mission" class="content-textarea" rows="4">To empower individuals on their journey to optimal health through natural, holistic healing modalities.</textarea>
        </div>
        
        <div class="form-group">
          <label>Vision Statement</label>
          <textarea id="vision" class="content-textarea" rows="4">Creating a world where holistic wellness is accessible to all, bridging ancient wisdom with modern healthcare.</textarea>
        </div>
        
        <div class="form-group">
          <label>Story/Background</label>
          <textarea id="story" class="content-textarea" rows="8">Your journey and story of how Life Beyond Medicine came to be...</textarea>
        </div>
      </div>
    `,
    contact: `
      <div class="content-form">
        <h3 style="margin-bottom: 20px;">Contact Information</h3>
        
        <div class="form-group">
          <label>Address Line 1</label>
          <input type="text" id="address1" class="content-input" value="123 Wellness Avenue" />
        </div>
        
        <div class="form-group">
          <label>Address Line 2</label>
          <input type="text" id="address2" class="content-input" value="Holistic Health Center" />
        </div>
        
        <div class="form-group">
          <label>City, State ZIP</label>
          <input type="text" id="cityState" class="content-input" value="City, State 12345" />
        </div>
        
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="phone" class="content-input" value="+1 (555) 123-4567" />
        </div>
        
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="email" class="content-input" value="info@lifebeyondmedicine.com" />
        </div>
        
        <div class="form-group">
          <label>Support Email</label>
          <input type="email" id="supportEmail" class="content-input" value="support@lifebeyondmedicine.com" />
        </div>
        
        <div class="form-group">
          <label>Office Hours</label>
          <textarea id="hours" class="content-textarea" rows="3">Mon-Fri: 9AM - 6PM
Sat: 10AM - 4PM
Sun: Closed</textarea>
        </div>
      </div>
    `,
    services: `
      <div class="content-form">
        <h3 style="margin-bottom: 20px;">Services Overview</h3>
        
        <div class="form-group">
          <label>Services Section Title</label>
          <input type="text" id="servicesTitle" class="content-input" value="Our Professional Services" />
        </div>
        
        <div class="form-group">
          <label>Services Description</label>
          <textarea id="servicesDesc" class="content-textarea" rows="4">Explore our comprehensive range of holistic healing services designed to address your unique health needs.</textarea>
        </div>
        
        <div class="form-group">
          <label>Call to Action Text</label>
          <input type="text" id="ctaText" class="content-input" value="Ready to start your healing journey?" />
        </div>
      </div>
    `,
  }

  editorBody.innerHTML = contentTemplates[page] || "<p>Content editor for this page is coming soon.</p>"
  editorBody.innerHTML += `
    <style>
      .content-form { display: grid; gap: 20px; }
      .content-input, .content-textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--gray-200);
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
      }
      .content-input:focus, .content-textarea:focus {
        outline: none;
        border-color: var(--primary-green);
      }
      .form-group label {
        display: block;
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 8px;
      }
    </style>
  `

  currentPage.textContent = page.charAt(0).toUpperCase() + page.slice(1)
  editorSection.style.display = "block"
  instructionsSection.style.display = "none"

  // Load saved content if exists
  loadSavedContent(page)
}

async function loadSavedContent(page) {
  try {
    const response = await window.API.request(`/content/${page}`)
    const content = response.data

    Object.keys(content).forEach((key) => {
      const element = document.getElementById(key)
      if (element) {
        element.value = content[key]
      }
    })
  } catch (error) {
    console.log("No saved content found for this page")
  }
}

// Initialize editor actions
function initEditorActions() {
  const saveBtn = document.getElementById("saveBtn")
  const cancelBtn = document.getElementById("cancelBtn")
  const pageSelect = document.getElementById("pageSelect")

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const page = pageSelect.value

      if (!page) return

      // Collect all input values
      const inputs = document.querySelectorAll(".content-input, .content-textarea")
      const content = {}

      inputs.forEach((input) => {
        content[input.id] = input.value
      })

      try {
        await window.API.request(`/content/${page}`, {
          method: "PUT",
          body: JSON.stringify({ data: content }),
        })

        alert("Changes saved successfully!")
      } catch (error) {
        console.error("Error saving content:", error)
        alert("Failed to save changes")
      }
    })
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (confirm("Are you sure? Any unsaved changes will be lost.")) {
        pageSelect.value = ""
        document.getElementById("editorSection").style.display = "none"
        document.getElementById("instructionsSection").style.display = "block"
      }
    })
  }
}
