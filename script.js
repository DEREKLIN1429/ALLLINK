// =======================================================
// 全域變數/常數
// =======================================================
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 工作站功能選單 | Workstation Features Menu';

const ADMIN_PASSWORD = '12345'; // 管理密碼
const STORAGE_KEY = 'factory_links_data';
let currentLinks = []; 
let currentMode = 'GUEST'; 
let currentUserID = ''; // 新增：記憶登入 ID

// 常用的 Font Awesome 圖示清單 (保持不變)
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

// 修正：預設連結清單 (加入 Extrusion-Inventory)
const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG 報修', url: 'https://dereklin1429.github.io/Machine-NG/', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit 表單', url: 'https://dereklin1429.github.io/5S-audit/', icon: 'fas fa-clipboard-check' },
    { id: 3, name: '機械維修紀錄', url: 'https://dereklin1429.github.io/repair-history/', icon: 'fas fa-tools' },
    { id: 4, name: '機械查核保養', url: 'https://dereklin1429.github.io/-MC-maintenance-check/', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse 庫存', url: 'https://chiehs1429.github.io/RM-Warehouse/', icon: 'fas fa-warehouse' },
    { id: 6, name: 'Extrusion-Inventory', url: 'https://chiehs1429.github.io/Extrusion_app/', icon: 'fas fa-chart-bar' }
];

// =======================================================
// 函數：標題控制 (保持不變)
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
// 函數：CRUD / 渲染 - 修正 renderSettingsList 使用大按鈕
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
    // ... (使用者按鈕渲染邏輯保持不變) ...
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
    if (currentMode !== 'USER') {
        alert('請先進入使用者模式才能使用此功能！');
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

function populateIconSelect(selectedValue = '') {
    // ... (下拉選單填充邏輯保持不變) ...
    const select = document.getElementById('edit-icon');
    select.innerHTML = ''; 
    
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

/**
 * 渲染設定模式下的網址清單 (大按鈕模式，一列 3 個)
 */
function renderSettingsList() { 
    const container = document.getElementById('urlListContainer');
    container.innerHTML = ''; 

    if (currentLinks.length === 0) {
        container.innerHTML = '<p style="color:var(--primary-color);">清單為空，請點擊下方「新增網址」！</p>';
        return;
    }

    currentLinks.forEach(link => {
        const item = document.createElement('div');
        item.className = 'admin-item-btn'; // 使用新的大按鈕樣式
        item.innerHTML = `
            <div class="item-name">${link.name}</div>
            <div class="item-url">${link.url}</div>
            <div class="admin-item-actions">
                <button class="edit-btn" onclick="editLink(${link.id})">編輯</button>
                <button class="delete-btn" onclick="deleteLink(${link.id})">刪除</button>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * 顯示新增/修改 Modal
 */
function showAddForm(id = null) {
    const modal = document.getElementById('editModal');
    const formTitle = document.getElementById('modalTitle');
    const nameInput = document.getElementById('edit-name');
    const urlInput = document.getElementById('edit-url');
    let selectedIconClass = '';
    
    modal.style.display = 'block'; // 顯示 Modal

    if (id !== null) {
        // 修改模式
        formTitle.textContent = '修改連結 | Edit Link';
        const link = currentLinks.find(l => l.id === id);
        if (link) {
            document.getElementById('edit-id').value = link.id;
            nameInput.value = link.name;
            urlInput.value = link.url;
            selectedIconClass = link.icon || '';
        }
    } else {
        // 新增模式
        formTitle.textContent = '新增連結 | Add New Link';
        document.getElementById('edit-id').value = '';
        nameInput.value = '';
        urlInput.value = '';
    }
    
    populateIconSelect(selectedIconClass);
}

/**
 * 隱藏 Modal
 */
function hideAddForm() {
    document.getElementById('editModal').style.display = 'none';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    const icon = document.getElementById('edit-icon').value.trim(); 

    if (id) {
        // 修改
        const index = currentLinks.findIndex(l => l.id === parseInt(id));
        if (index !== -1) {
            currentLinks[index] = { id: parseInt(id), name, url, icon };
        }
        alert(`連結 ${name} 已修改！`);
    } else {
        // 新增
        const newId = currentLinks.length > 0 ? Math.max(...currentLinks.map(l => l.id)) + 1 : 1;
        currentLinks.push({ id: newId, name, url, icon });
        alert(`連結 ${name} 已新增！`);
    }

    saveLinks(); 
    renderSettingsList(); 
    hideAddForm(); // 儲存後隱藏 Modal
}

function editLink(id) {
    showAddForm(id); // 按下編輯，顯示 Modal
}

function deleteLink(id) {
    const link = currentLinks.find(l => l.id === id);
    if (link && confirm(`確定要刪除連結 "${link.name}" 嗎？`)) {
        currentLinks = currentLinks.filter(l => l.id !== id);
        saveLinks();
        renderSettingsList();
        alert(`連結 ${link.name} 已刪除。`);
    }
}


// =======================================================
// 函數：模式切換 (登入/登出) - 修正 ID 記憶顯示
// =======================================================

function initPage() {
    loadLinks();
    renderUserButtons();
    setTitles('GUEST');
    
    document.getElementById('modeSelectSection').style.display = 'grid'; 
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'none';
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
    handleLogout(); 
    alert('已退出管理員設定畫面 (Exited Admin Setup View)。');
}


function handleLogout() {
    currentMode = 'GUEST';
    currentUserID = ''; // 重置 ID
    setTitles('GUEST');
    
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

/**
 * 進入使用者模式 (由大按鈕觸發)
 */
function enterUserMode(userID) {
    currentMode = 'USER';
    currentUserID = userID; // 記憶 ID
    setTitles('USER');
    
    document.getElementById('modeSelectSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'grid'; 
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'block'; 
    
    // 顯示記憶的 ID
    document.getElementById('welcomeMessage').textContent = `歡迎, ${currentUserID} (Welcome, ${currentUserID})`;
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editUrlForm').addEventListener('submit', handleFormSubmit);
    initPage();

    // 關閉 Modal 的額外處理：點擊 Modal 外的區域
    window.onclick = function(event) {
      const modal = document.getElementById('editModal');
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
});
