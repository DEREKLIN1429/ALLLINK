// =======================================================
// 全域變數/常數
// =======================================================

// 標題常數
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 工作站功能選單 | Workstation Features Menu'; // 管理員模式標題

// 登入/設定常數
const ADMIN_PASSWORD = 'ADMIN'; 
const USER_LOGIN_ID = 'USER'; // 只有這個ID才能進入使用者介面
const STORAGE_KEY = 'factory_links_data';
let currentLinks = []; 
let currentMode = 'GUEST'; 

// 常用的 Font Awesome 圖示清單 (ID: 圖示類別, Value: 顯示名稱)
const ICON_OPTIONS = [
    { class: 'fas fa-link', name: '預設/連結 (Link)' },
    { class: 'fas fa-exclamation-triangle', name: '警示/報修 (Warning)' },
    { class: 'fas fa-clipboard-check', name: '檢查清單/審核 (Audit)' },
    { class: 'fas fa-tools', name: '維修/工具 (Tools)' },
    { class: 'fas fa-calendar-alt', name: '排程/日期 (Calendar)' },
    { class: 'fas fa-warehouse', name: '倉庫/庫存 (Warehouse)' },
    { class: 'fas fa-chart-bar', name: '報告/圖表 (Chart)' },
    { class: 'fas fa-wrench', name: '機械/維護 (Wrench)' },
    { class: 'fas fa-users', name: '人員/團隊 (Users)' },
];

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
// 函數：圖示選單
// =======================================================

/**
 * 動態填充圖示下拉選單的選項。
 */
function populateIconSelect(selectedValue = '') {
    const select = document.getElementById('edit-icon');
    select.innerHTML = ''; // 清空現有選項
    
    // 預設選項
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '--- 請選擇圖示 (Select Icon) ---';
    select.appendChild(defaultOption);

    ICON_OPTIONS.forEach(icon => {
        const option = document.createElement('option');
        option.value = icon.class;
        option.textContent = `${icon.name} (${icon.class})`;
        option.selected = (icon.class === selectedValue);
        select.appendChild(option);
    });
}

// =======================================================
// 函數：動態渲染 (使用者模式) - 加入臨時修改邏輯 (其餘保持不變)
// =======================================================

function loadLinks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        currentLinks = JSON.parse(data);
    } else {
        currentLinks = DEFAULT_LINKS;
    }
}

function saveLinks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLinks));
}

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
        button.title = `${link.name}\n${link.url}`; 
        
        const iconClass = link.icon && link.icon.trim() !== '' ? link.icon : 'fas fa-link';

        button.innerHTML = `
            <i class="${iconClass} fa-3x btn-icon-fa"></i>
            <span>${link.name}</span>
        `;
        
        button.addEventListener('click', () => {
             promptForNewUrl(link);
        });

        grid.appendChild(button);
    });
}

function promptForNewUrl(link) {
    // 只有在 USER 模式下才能執行
    if (currentMode !== 'USER') {
        alert('請先以 USER ID 登入才能使用此功能！');
        return;
    }

    const currentUrl = link.url;
    const newUrl = prompt(
        `[${link.name}] \n點擊「取消」或輸入空值將使用舊網址。\n\n目前網址 (Current URL):\n${currentUrl}\n\n輸入新網址 (Enter New URL):`,
        currentUrl 
    );
    
    if (newUrl === null || newUrl.trim() === currentUrl.trim()) {
        if (currentUrl) {
            window.open(currentUrl, '_blank');
        } else {
            alert('此按鈕尚未設定網址！請聯絡管理員。');
        }
    } else if (newUrl.trim() !== '') {
        const newUrlTrimmed = newUrl.trim();
        link.url = newUrlTrimmed;
        
        saveLinks(); 
        renderUserButtons(); 
        
        alert(`[${link.name}] 網址已更新並儲存！將開啟新連結: ${newUrlTrimmed}`);
        window.open(newUrlTrimmed, '_blank');
    } else {
        alert('網址輸入無效，請重新嘗試。');
    }
}

// ... (renderSettingsList, saveLinks, loadLinks 保持不變) ...

function showAddForm(id = null) {
    const form = document.getElementById('editUrlForm');
    const nameInput = document.getElementById('edit-name');
    const urlInput = document.getElementById('edit-url');
    let selectedIconClass = '';
    
    form.style.display = 'block';

    if (id !== null) {
        const link = currentLinks.find(l => l.id === id);
        if (link) {
            document.getElementById('edit-id').value = link.id;
            nameInput.value = link.name;
            urlInput.value = link.url;
            selectedIconClass = link.icon || '';
        }
    } else {
        document.getElementById('edit-id').value = '';
        nameInput.value = '';
        urlInput.value = '';
    }
    
    // 在顯示表單時，填充圖示下拉選單並設定選中值
    populateIconSelect(selectedIconClass);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    // 從下拉選單獲取值
    const icon = document.getElementById('edit-icon').value.trim(); 

    if (id) {
        const index = currentLinks.findIndex(l => l.id === parseInt(id));
        if (index !== -1) {
            currentLinks[index] = { id: parseInt(id), name, url, icon };
        }
        alert(`連結 ${name} 已修改！`);
    } else {
        const newId = currentLinks.length > 0 ? Math.max(...currentLinks.map(l => l.id)) + 1 : 1;
        currentLinks.push({ id: newId, name, url, icon });
        alert(`連結 ${name} 已新增！`);
    }

    saveLinks(); 
    renderSettingsList(); 
    hideAddForm(); 
}

// ... (editLink, deleteLink, hideAddForm 保持不變) ...

// =======================================================
// 函數：模式切換 (登入/登出)
// =======================================================

function initPage() {
    loadLinks();
    renderUserButtons();
    setTitles('GUEST');
    
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
}

function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const inputID = passwordInput.value.trim().toUpperCase();

    if (inputID === USER_LOGIN_ID) {
        // 特定 ID 進入使用者模式
        passwordInput.value = ''; 
        enterUserMode(inputID);
    } else if (inputID !== '') {
        // 其他 ID 登入成功，但停留在 GUEST 畫面
        alert(`ID ${inputID} 登入成功！但此 ID 不具備介面存取權限。請使用 ${USER_LOGIN_ID} 登入。`);
        passwordInput.value = ''; 
        // 停留在 GUEST 模式
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

/**
 * 退出管理員設定模式，回到登入畫面。
 * 這是在設定模式下，管理員唯一能做的 "退出" 行為。
 */
function exitAdminView() {
    currentMode = 'GUEST';
    setTitles('GUEST');
    
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'none';
    
    alert('已退出管理員設定畫面 (Exited Admin Setup View)。');
}


function handleLogout() {
    // 退出使用者模式，回到 GUEST 狀態
    currentMode = 'GUEST';
    setTitles('GUEST');
    
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    
    alert('已成功登出 (Logged out successfully)。');
}

function enterSettingsMode() {
    currentMode = 'ADMIN';
    setTitles('ADMIN');
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none'; 
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
    
    renderSettingsList(); 
}

function enterUserMode(userID) {
    currentMode = 'USER';
    setTitles('USER');
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'grid';
    document.getElementById('settingsPanel').style.display = 'none';
    
    document.getElementById('welcomeMessage').textContent = `歡迎, ${userID} (Welcome, ${userID})`;
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editUrlForm').addEventListener('submit', handleFormSubmit);
    initPage();
});
