document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        const password = urlParams.get('password');
        
        if (!username || !password) {
            throw new Error('Missing TURN credentials');
        }

        const turnConfig = {
            username: username,
            password: password,
            timestamp: Date.now()
        };
        
        localStorage.setItem('turnConfig', JSON.stringify(turnConfig));
        statusElement.textContent = 'TURN server access granted!';
        statusElement.style.color = 'green';
        
        setTimeout(() => {
            window.location.href = '../landing.html';
        }, 3000);

    } catch (error) {
        statusElement.textContent = 'Error: ' + error.message;
        statusElement.style.color = 'red';
         
        setTimeout(() => {
            window.location.href = '../landing.html';
        }, 3000);
    }
});