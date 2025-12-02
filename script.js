// =======================================================
// 全域變數/常數
// =======================================================

// 標題常數
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 工作站功能選單 | Workstation Features Menu';

// 設定密碼
const ADMIN_PASSWORD = 'ADMIN'; 
const STORAGE_KEY = 'factory_links_data';
let currentLinks = []; 
let currentMode = 'GUEST'; // 追蹤目前模式：GUEST, USER, ADMIN

// 預設連結清單
const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG 報修', url: 'https://demo.machine.ng', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit 表單', url: 'https://demo.5s.audit', icon: 'fas fa-clipboard-check' },
    { id: 3, name: '機械維修紀錄', url: 'https://demo.maintenance.record', icon: 'fas fa-tools' },
    { id: 4, name: '機械查核保養', url: 'https://demo.check.maintain', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse 庫存', url: 'https://demo.rm.warehouse', icon: 'fas fa-warehouse' }
];

// =======================================================
// 函數：標題控制
// =======================================================

/**
 * 根據當前模式設定頁面和主標題。
 */
function setTitles(mode) {
    const header = document.getElementById('mainHeader');
    const pageTitle = document.getElementById('pageTitle');
    
    switch (mode) {
        case 'GUEST':
            header.textContent = TITLE_LOGIN;
            pageTitle.textContent = TITLE_LOGIN;
            break;
        case 'USER':
            header.textContent = TITLE_USER_MODE;
            pageTitle.textContent = TITLE_USER_MODE;
            break;
        case 'ADMIN':
            header.textContent = TITLE_ADMIN_MODE;
            pageTitle.textContent = TITLE_ADMIN_MODE;
            break;
    }
}

// =======================================================
// 函數：動態渲染 (使用者模式) - 加入臨時修改邏輯
// =======================================================

/**
 * 根據 currentLinks 陣列動態生成圖形按鈕。
 */
function renderUserButtons() {
    const grid = document.getElementById('mainFeatures');
    grid.innerHTML = ''; 

    if (currentLinks.length === 0) {
        grid.innerHTML = '<p style="color:var(--primary-color);">目前沒有設定任何按鈕！請聯絡管理員新增。</p>';
        return;
    }
    
    currentLinks.forEach(link => {
        const button = document.createElement('button');
        button.className = 'icon-btn';
        button.id = `btn-${link.id}`;
        button.title = `${link.name}\n${link.url}`; // 提示完整網址
        
        const iconClass = link.icon && link.icon.trim() !== '' ? link.icon : 'fas fa-link';

        button.innerHTML = `
            <i class="${iconClass} fa-3x btn-icon-fa"></i>
            <span>${link.name}</span>
        `;
        
        // 設定點擊事件：點擊後先詢問是否要修改網址，否則直接開啟
        button.addEventListener('click', () => {
             promptForNewUrl(link);
        });

        grid.appendChild(button);
    });
}

/**
 * 點擊按鈕後彈出提示框，允許使用者輸入新網址。
 */
function promptForNewUrl(link) {
    const currentUrl = link.url;
    const newUrl = prompt(
        `[${link.name}] \n點擊「取消」或輸入空值將使用舊網址。\n\n目前網址 (Current URL):\n${currentUrl}\n\n輸入新網址 (Enter New URL):`,
        currentUrl // 舊紀錄會出現在欄位內
    );
    
    if (newUrl === null || newUrl.trim() === currentUrl.trim()) {
        // 使用者取消或網址未變更，直接開啟原網址
        if (currentUrl) {
            window.open(currentUrl, '_blank');
        } else {
            alert('此按鈕尚未設定網址！請聯絡管理員。');
        }
    } else if (newUrl.trim() !== '') {
        // 使用者輸入新網址並確認，進行修改並儲存
        const newUrlTrimmed = newUrl.trim();
        link.url = newUrlTrimmed;
        
        saveLinks(); // 儲存變更
        renderUserButtons(); // 重新渲染按鈕，更新 tooltip
        
        alert(`[${link.name}] 網址已更新並儲存！將開啟新連結: ${newUrlTrimmed}`);
        window.open(newUrlTrimmed, '_blank');
    } else {
        // 輸入為空但未按取消，視為無效輸入
        alert('網址輸入無效，請重新嘗試。');
    }
}


// ... (loadLinks, saveLinks, renderSettingsList, CRUD 操作函數保持不變) ...


// =======================================================
// 函數：模式切換 (登入/登出)
// =======================================================

/**
 * 初始化頁面狀態和標題。
 */
function initPage() {
    loadLinks();
    renderUserButtons();
    setTitles('GUEST');
    
    // 預設狀態：顯示登入，隱藏功能和登出
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
}

/**
 * 處理登入，僅用於使用者 ID 登入。
 */
function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const inputID = passwordInput.value.trim();

    if (inputID !== '') {
        // 確保 ID 輸入框清空
        passwordInput.value = ''; 
        
        enterUserMode(inputID);
    } else {
        alert('請輸入您的 ID (Please enter your ID)。');
    }
}

/**
 * 獨立的設定模式入口提示。
 */
function showAdminPrompt() {
    const password = prompt("請輸入管理員密碼 (Enter Admin Password)：");

    if (password === ADMIN_PASSWORD) {
        enterSettingsMode();
    } else if (password !== null) {
        alert("管理員密碼錯誤，無法進入設定 (Admin password incorrect)。");
    }
}

/**
 * 處理登出。
 */
function handleLogout() {
    // 無論從哪個模式退出，都回到 GUEST 狀態
    currentMode = 'GUEST';
    setTitles('GUEST');
    
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    
    alert('已成功登出 (Logged out successfully)。');
}

/**
 * 進入設定模式
 */
function enterSettingsMode() {
    currentMode = 'ADMIN';
    setTitles('ADMIN');
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none'; // 管理員模式下不顯示登出按鈕
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
    
    renderSettingsList(); 
}

/**
 * 進入使用者模式
 */
function enterUserMode(userID) {
    currentMode = 'USER';
    setTitles('USER');
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'grid';
    document.getElementById('settingsPanel').style.display = 'none';
    
    document.getElementById('welcomeMessage').textContent = `歡迎, ${userID} (Welcome, ${userID})`;
}


// =======================================================
// 初始化
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. 設置表單提交事件
    document.getElementById('editUrlForm').addEventListener('submit', handleFormSubmit);

    // 2. 啟動頁面初始化
    initPage();
});
