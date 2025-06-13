// Main JavaScript file for the application

// Import necessary libraries
const bootstrap = window.bootstrap
const $ = window.jQuery

// Function to handle form submissions with AJAX
function handleFormSubmit(formId, successCallback, errorCallback) {
  const form = document.getElementById(formId)

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault()

      const formData = new FormData(form)

      fetch(form.action, {
        method: form.method,
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (typeof successCallback === "function") {
              successCallback(data)
            }
          } else {
            if (typeof errorCallback === "function") {
              errorCallback(data)
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          if (typeof errorCallback === "function") {
            errorCallback({ success: false, message: "An error occurred. Please try again." })
          }
        })
    })
  }
}

// Function to show a toast notification
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container")

  if (!toastContainer) {
    const container = document.createElement("div")
    container.id = "toast-container"
    container.className = "position-fixed bottom-0 end-0 p-3"
    document.body.appendChild(container)
  }

  const toastId = "toast-" + Date.now()
  const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === "success" ? "success" : "danger"}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `

  document.getElementById("toast-container").innerHTML += toastHtml

  const toastElement = document.getElementById(toastId)
  const toast = new bootstrap.Toast(toastElement)
  toast.show()

  // Remove the toast after it's hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove()
  })
}

// Function to initialize date pickers
function initDatePickers() {
  const dateInputs = document.querySelectorAll(".datepicker")

  if (dateInputs.length > 0) {
    dateInputs.forEach((input) => {
      new bootstrap.Datepicker(input, {
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
      })
    })
  }
}

// Function to initialize data tables
function initDataTables() {
  const tables = document.querySelectorAll(".datatable")

  if (tables.length > 0 && typeof $.fn.DataTable !== "undefined") {
    tables.forEach((table) => {
      $(table).DataTable({
        responsive: true,
      })
    })
  }
}

// Initialize components when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initDatePickers()
  initDataTables()

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))
})
