// GANTI BARIS PERTAMA INI:
const API_URL = 'https://novatra.vercel.app/api'; 

// Handle Klik Tab (Sign Up / Login)
document.getElementById('tabSignup').addEventListener('click', () => {
    document.getElementById('tabSignup').className = 'tab active';
    document.getElementById('tabLogin').className = 'tab inactive';
    document.getElementById('mainBtn').innerText = 'Sign up';
});

document.getElementById('tabLogin').addEventListener('click', () => {
    document.getElementById('tabLogin').className = 'tab active';
    document.getElementById('tabSignup').className = 'tab inactive';
    document.getElementById('mainBtn').innerText = 'Login';
});

// Handle Submit Tombol Utama
document.getElementById('mainBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mode = document.getElementById('mainBtn').innerText.toLowerCase().replace(" ", ""); 
    
    const endpoint = mode === 'signup' ? '/register' : '/login';

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            alert(mode.toUpperCase() + " BERHASIL!");
            if (mode === 'login') {
                localStorage.setItem('id_user', data.id_user);
                window.location.href = 'dashboard.html';
            }
        } else {
            alert("Gagal: " + (data.message || "Periksa data lo!"));
        }
    } catch (err) {
        // Pesan error gue ganti dikit biar lebih profesional pas udah online bro
        alert("Gagal terhubung ke server. Pastikan koneksi internet aman.");
    }
});