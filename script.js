// =======================================================
// 函數：模式切換 (統一控制顯示/隱藏)
// =======================================================

function updateUI(mode) {
    // 儲存當前模式
    currentMode = mode;
    setTitles(mode);

    // 取得所有主要 UI 區塊
    const modeSelect = document.getElementById('modeSelectSection');
    const logout = document.getElementById('logoutSection');
    const mainFeatures = document.getElementById('mainFeatures');
    const settingsPanel = document.getElementById('settingsPanel');
    const hrDivider = document.getElementById('hrDivider');
    
    // 重設所有區塊顯示狀態為隱藏
    modeSelect.style.display = 'none';
    logout.style.display = 'none';
    mainFeatures.style.display = 'none';
    settingsPanel.style.display = 'none';
    hrDivider.style.display = 'none';

    // 根據模式設定顯示狀態
    switch (mode) {
        case 'GUEST':
            modeSelect.style.display = 'grid';
            break;
        case 'USER':
            logout.style.display = 'flex';
            mainFeatures.style.display = 'grid';
            hrDivider.style.display = 'block';
            break;
        case 'ADMIN':
            settingsPanel.style.display = 'block';
            hrDivider.style.display = 'block';
            renderSettingsList();
            break;
    }
}

// =======================================================
// 函數：模式切換 (公開調用) - 引用上述新函數
// =======================================================

function initPage() {
    loadLinks();
    renderUserButtons();
    updateUI('GUEST'); // 使用新的統一函數
    // 其餘不變
}

function handleLogout(clearID = false) { 
    if (clearID) {
        localStorage.removeItem(USER_ID_KEY);
        currentUserID = '';
    }
    updateUI('GUEST'); // 使用新的統一函數
}

function enterSettingsMode() {
    updateUI('ADMIN'); // 使用新的統一函數
}

function enterUserMode() { 
    updateUI('USER'); // 使用新的統一函數
    
    // 保持 welcomeMessage 的邏輯不變
    const actualUserID = '訪客';
    document.getElementById('welcomeMessage').textContent = `歡迎, ${actualUserID} (Welcome, ${actualUserID})`;
}
