// Main JavaScript file for the application

// Function to handle form submissions with AJAX
function handleFormSubmit(formId, successCallback, errorCallback) {
    const form = document.getElementById(formId);
    
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: form.method,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success\
