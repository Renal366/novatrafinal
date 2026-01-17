const API_URL = 'https://novatra.vercel.app/api'; 

document.getElementById('mainBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Perbaikan: Pakai includes supaya lebih akurat deteksi mode-nya
    const isSignup = document.getElementById('mainBtn').innerText.toLowerCase().includes('sign');
    const endpoint = isSignup ? '/register' : '/login';

    try {
        // Gabungan ini hasilnya: https://novatra.vercel.app/api/register
        const res = await fetch(`${API_URL}${endpoint}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Cek dulu kalau responnya OK (bukan 404 atau 500)
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server Error: ${res.status}`);
        }

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
        alert("Gagal terhubung ke server. Pastikan koneksi internet aman.");
    }
});
