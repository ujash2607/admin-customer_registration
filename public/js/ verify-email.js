document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    try {
        const response = await fetch(`http://localhost:4000/verify-email?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();
        const messageElement = document.getElementById('message');
        if (data.success) {
            messageElement.textContent = 'Email verified successfully!';
        } else {
            messageElement.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
