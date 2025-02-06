document.addEventListener('DOMContentLoaded', () => {
    const configStatus = document.getElementById('config-server');
    const resetBtn = document.getElementById('reset-config');
    
    function updateConfigStatus() {
        try {
            const turnConfig = JSON.parse(localStorage.getItem('turnConfig'));
            if (turnConfig?.username && turnConfig?.password) {
                configStatus.textContent = 'TURN';
            } else {
                configStatus.textContent = 'STUN';
            }
        } catch (error) {
            configStatus.textContent = 'STUN';
        }
    }
    
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('turnConfig');
        updateConfigStatus();
    });
    
    // Initial status check
    updateConfigStatus();
});