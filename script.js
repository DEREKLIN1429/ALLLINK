// =======================================================
// 函數：模式切換 (登入/登出)
// =======================================================

function initPage() {
    loadLinks();
    renderUserButtons();
    setTitles('GUEST');
    
    // 修正: 頁面初始化時，檢查是否有 currentUserID (來自 localStorage)
    const userIDInput = document.getElementById('userIDInput');
    if (currentUserID) {
        userIDInput.value = currentUserID;
    }

    document.getElementById('modeSelectSection').style.display = 'grid'; 
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'none';
}

function handleLogin() {
    const userIDInput = document.getElementById('userIDInput');
    const inputID = userIDInput.value.trim();

    if (inputID !== '') {
        currentUserID = inputID;
        localStorage.setItem(USER_ID_KEY, inputID); // 將 ID 儲存到 localStorage
        enterUserMode(inputID);
    } else {
        alert('請輸入您的 ID (Please enter your ID)。');
    }
}

function showAdminPrompt() {
    const password = prompt("請輸入管理員密碼 (Enter Admin Password)：");

    if (password === ADMIN_PASSWORD) {
        enterSettingsMode();
    } else if (password !== null) {
        alert("管理員密碼錯誤，無法進入設定 (Admin password incorrect)。");
    }
}

function exitAdminView() {
    // 從 Admin 模式退出時，不清除 ID
    handleLogout(false); 
    alert('已退出管理員設定畫面 (Exited Admin Setup View)。');
}

// 修正後的 handleLogout 函數：無論是從 User 登出還是 Admin 退出，都保留 ID
function handleLogout(clearID = false) { 
    if (clearID) {
        localStorage.removeItem(USER_ID_KEY);
        currentUserID = '';
    }

    // 獲取儲存的 ID，如果未清除則為上次登入的值
    const savedID = localStorage.getItem(USER_ID_KEY) || '';

    currentMode = 'GUEST';
    setTitles('GUEST');
    
    // 關鍵修正：將輸入欄位的值設為 savedID
    document.getElementById('userIDInput').value = savedID;

    document.getElementById('modeSelectSection').style.display = 'grid'; 
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'none';
}

function enterSettingsMode() {
    currentMode = 'ADMIN';
    setTitles('ADMIN');
    
    document.getElementById('modeSelectSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none'; 
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block'; 
    document.getElementById('hrDivider').style.display = 'block'; 
    
    renderSettingsList(); 
}

function enterUserMode(userID) {
    currentMode = 'USER';
    setTitles('USER');
    
    document.getElementById('modeSelectSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'grid'; 
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'block'; 
    
    document.getElementById('welcomeMessage').textContent = `歡迎, ${userID} (Welcome, ${userID})`;
    
    // 綁定登出按鈕事件：點擊「登出」按鈕時，不清除 ID (符合您的需求)
    document.getElementById('logoutBtn').onclick = () => handleLogout(false); 
}
