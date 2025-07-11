document.addEventListener('DOMContentLoaded', () => {
    const contactFormHostinger = document.getElementById('contactFormHostinger');
    const messageDiv = document.getElementById('message');

    contactFormHostinger.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the browser from submitting the form traditionally

        // Collect form data as an object
        const formData = {
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            motivo_consulta: document.getElementById('motivo_consulta').value,
        };

        try {
            // Send data as JSON
            const response = await fetch('submit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // We're sending JSON
                },
                body: JSON.stringify(formData), // Convert JS object to JSON string
            });

            const result = await response.json(); // Parse the JSON response from PHP

            if (result.success) {
                messageDiv.textContent = result.message;
                messageDiv.classList.remove('hidden');
                messageDiv.classList.add('visible');
                messageDiv.style.backgroundColor = 'rgba(212, 237, 218, 0.95)'; // Green for success
                messageDiv.style.color = '#155724';
                messageDiv.style.borderColor = 'rgba(195, 230, 203, 0.95)';
                contactFormHostinger.reset(); // Clear the form fields
            } else {
                messageDiv.textContent = result.message || 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
                messageDiv.classList.remove('hidden');
                messageDiv.classList.add('visible');
                messageDiv.style.backgroundColor = 'rgba(248, 215, 218, 0.95)'; // Red for error
                messageDiv.style.color = '#721c24';
                messageDiv.style.borderColor = 'rgba(245, 198, 203, 0.95)';
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
            messageDiv.textContent = 'Ocurrió un error de conexión. Por favor, verifica tu conexión e inténtalo de nuevo.';
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('visible');
            messageDiv.style.backgroundColor = 'rgba(248, 215, 218, 0.95)'; // Red for error
            messageDiv.style.color = '#721c24';
            messageDiv.style.borderColor = 'rgba(245, 198, 203, 0.95)';
        }
    });
});