document.addEventListener('DOMContentLoaded', () => {
    const configStatus = document.getElementById('config-server');
    const resetBtn = document.getElementById('reset-config');
    
    function updateConfigStatus() {
        try {
            const turnConfig = JSON.parse(localStorage.getItem('turnConfig'));
            if (turnConfig?.username && turnConfig?.password) {
                configStatus.textContent = ' CUSTOM';
                configStatus.style.color = '#00ff00';
            } else {
                configStatus.textContent = ' DEFAULT';
                configStatus.style.color = '#ff0000';
            }
        } catch (error) {
            configStatus.textContent = ' DEFAULT';
            configStatus.style.color = '#ff0000';
        }
    }
    
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('turnConfig');
        updateConfigStatus();
    });
    
    // Initial status check
    updateConfigStatus();
});