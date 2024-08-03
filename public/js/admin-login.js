document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://localhost:4000/adminLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            alert('Login successful');
            // Optionally, save the token and redirect to the admin dashboard
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
