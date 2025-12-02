// =======================================================
// 全域變數/常數
// =======================================================
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 工作站功能選單 | Workstation Features Menu';

const ADMIN_PASSWORD = '12345'; 
const STORAGE_KEY = 'factory_links_data';
const USER_ID_KEY = 'current_user_id'; // 移除 ID 登入功能，但保留 KEY 以防誤讀
let currentLinks = []; 
let currentMode = 'GUEST'; 
let currentUserID = ''; 

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
    { class: 'fas fa-cogs', name: 'Mixing/Extrusion (Cogs)' },
    { class: 'fas fa-compress-arrows-alt', name: 'Calendering (Press)' },
    { class: 'fas fa-cut', name: 'Cutting (Scissors)' },
];

const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG\n機械故障', url: 'https://dereklin1429.github.io/Machine-NG/', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit\n5S 查核', url: 'https://dereklin1429.github.io/5S-audit/', icon: 'fas fa-clipboard-check' },
    { id: 3, name: 'Maintenance Record\n機械維修紀錄', url: 'https://dereklin1429.github.io/repair-history/', icon: 'fas fa-tools' },
    { id: 4, name: 'Machinery Upkeep\n機械查核保養', url: 'https://dereklin1429.github.io/-MC-maintenance-check/', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse\n原管倉庫', url: 'https://chiehs1429.github.io/RM-Warehouse/', icon: 'fas fa-warehouse' },
    { id: 6, name: 'Extrusion-Inventory', url: 'https://chiehs1429.github.io/Extrusion_app/', icon: 'fas fa-chart-bar' },
    { id: 7, name: 'Mixing\n混練工程', url: 'https://chiehs1429.github.io/Mixing/', icon: 'fas fa-cogs' },
    { id: 8, name: 'Extrusion\n押出工程', url: 'https://chiehs1429.github.io/Extrusion_app/', icon: 'fas fa-cogs' },
    { id: 9, name: 'Calendering\n上膠工程', url: 'https://chiehs1429.github.io/Calendering/', icon: 'fas fa-compress-arrows-alt' },
    { id: 10, name: 'CUTTING\n裁斷工程', url: 'https://chiehs1429.github.io/CUTTING-Inventory/', icon: 'fas fa-cut' }
];

// =======================================================
// 函數：標題控制 & 儲存/載入
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

function loadLinks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        currentLinks = JSON.parse(data);
    } else {
        currentLinks = DEFAULT_LINKS;
    }
    // 移除 ID 相關讀取，因為功能已移除
    // currentUserID = localStorage.getItem(USER_ID_KEY) || ''; 
}

function saveLinks() {
    // 移除 ID 儲存，因為功能已移除
    // localStorage.setItem(USER_ID_KEY, currentUserID); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLinks));
}

// =======================================================
// 函數：動態渲染 (使用者模式 & 管理模式)
// =======================================================

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
        
        // 使用者模式點擊後直接連結
        button.addEventListener('click', () => {
             if (link.url) {
                window.open(link.url, '_blank');
            } else {
                alert('此按鈕尚未設定網址！請聯絡管理員。');
            }
        });

        grid.appendChild(button);
    });
}

function populateIconSelect(selectedValue = '') {
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

function renderSettingsList() { 
    const container = document.getElementById('urlListContainer');
    container.innerHTML = ''; 

    if (currentLinks.length === 0) {
        container.innerHTML = '<p style="color:var(--primary-color);">清單為空，請點擊下方「新增網址」！</p>';
        return;
    }

    currentLinks.forEach(link => {
        const item = document.createElement('div');
        item.className = 'admin-item-btn'; 

        // 點擊整個大按鈕，排除點擊動作按鈕時，彈出編輯介面
        item.addEventListener('click', (e) => {
            if (e.target.closest('.admin-item-actions') === null) {
                editLink(link.id);
            }
        });

        item.innerHTML = `
            <div class="item-name">${link.name}</div>
            <div class="item-url">${link.url}</div>
            <div class="admin-item-actions">
                <button class="edit-btn" onclick="editLink(${link.id}); event.stopPropagation();">編輯 | Edit</button>
                <button class="delete-btn" onclick="deleteLink(${link.id}); event.stopPropagation();">刪除 | Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// =======================================================
// 函數：CRUD 操作 (使用 Modal)
// =======================================================

function showAddForm(id = null) {
    const modal = document.getElementById('editModal');
    const formTitle = document.getElementById('modalTitle');
    const nameInput = document.getElementById('edit-name');
    const urlInput = document.getElementById('edit-url');
    let selectedIconClass = '';
    
    // 顯示時設為 flex
    modal.style.display = 'flex'; 

    if (id !== null) {
        formTitle.textContent = '修改連結 | Edit Link';
        const link = currentLinks.find(l => l.id === id);
        if (link) {
            document.getElementById('edit-id').value = link.id;
            nameInput.value = link.name;
            urlInput.value = link.url;
            selectedIconClass = link.icon || '';
        }
    } else {
        formTitle.textContent = '新增連結 | Add New Link';
        document.getElementById('edit-id').value = '';
        nameInput.value = '';
        urlInput.value = '';
    }
    
    populateIconSelect(selectedIconClass);
}

function hideAddForm() {
    // 隱藏時設為 none
    document.getElementById('editModal').style.display = 'none'; 
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const url = document.getElementById('edit-url').value.trim();
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
    renderUserButtons(); 
    renderSettingsList(); 
    hideAddForm(); 
}

function editLink(id) {
    showAddForm(id); 
}

function deleteLink(id) {
    const link = currentLinks.find(l => l.id === id);
    if (link && confirm(`確定要刪除連結 "${link.name}" 嗎？`)) {
        currentLinks = currentLinks.filter(l => l.id !== id);
        saveLinks();
        renderUserButtons(); 
        renderSettingsList();
        alert(`連結 ${link.name} 已刪除。`);
    }
}


// =======================================================
// 函數：模式切換 (登入/登出)
// =======================================================

function initPage() {
    loadLinks();
    renderUserButtons();
    setTitles('GUEST');
    
    // 移除 ID 輸入欄位的預填邏輯
    // const userIDInput = document.getElementById('userIDInput');
    // if (currentUserID) {
    //     userIDInput.value = currentUserID;
    // }

    document.getElementById('modeSelectSection').style.display = 'grid'; 
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'none';
}

/* 移除 handleLogin 函數，功能被 enterUserMode 吸收 */
/*
function handleLogin() {
    const userIDInput = document.getElementById('userIDInput');
    const inputID = userIDInput.value.trim();

    if (inputID !== '') {
        currentUserID = inputID;
        localStorage.setItem(USER_ID_KEY, inputID); 
        enterUserMode(inputID);
    } else {
        alert('請輸入您的 ID (Please enter your ID)。');
    }
}
*/

function showAdminPrompt() {
    const password = prompt("請輸入管理員密碼 (Enter Admin Password)：");

    if (password === ADMIN_PASSWORD) {
        enterSettingsMode();
    } else if (password !== null) {
        alert("管理員密碼錯誤，無法進入設定 (Admin password incorrect)。");
    }
}

function exitAdminView() {
    // Admin 退出時，回到 GUEST 模式，不清除數據
    handleLogout(false); 
    alert('已退出管理員設定畫面 (Exited Admin Setup View)。');
}

function handleLogout(clearID = false) { 
    // 修正: 由於 ID 登入已移除，此函數用於模式重置
    if (clearID) {
        localStorage.removeItem(USER_ID_KEY);
        currentUserID = '';
    }

    currentMode = 'GUEST';
    setTitles('GUEST');
    
    // 移除 ID 輸入欄位的值設定，因為 ID 輸入欄位已被移除 (或不再是登入的主要方式)
    // document.getElementById('userIDInput').value = ''; 

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
    // 修正: 由於 ID 登入已移除，這裡將 userID 預設為 '訪客'
    const actualUserID = userID || '訪客';
    currentMode = 'USER';
    setTitles('USER');
    
    document.getElementById('modeSelectSection').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    document.getElementById('mainFeatures').style.display = 'grid'; 
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('hrDivider').style.display = 'block'; 
    
    document.getElementById('welcomeMessage').textContent = `歡迎, ${actualUserID} (Welcome, ${actualUserID})`;
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editUrlForm').addEventListener('submit', handleFormSubmit);
    initPage();

    window.onclick = function(event) {
      const modal = document.getElementById('editModal');
      // 確保 Modal 隱藏時，點擊外部區域也能將其關閉
      if (modal.style.display === 'flex' && event.target === modal) {
        modal.style.display = "none";
      }
    }
});
