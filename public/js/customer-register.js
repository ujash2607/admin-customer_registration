document.getElementById('customer-register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://localhost:4000/addCustomer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
