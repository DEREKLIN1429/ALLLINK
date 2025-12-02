// =======================================================
// 全域變數/常數
// =======================================================

// 設定密碼 (用於獨立的「管理設定」按鈕)
const ADMIN_PASSWORD = 'ADMIN'; 
const STORAGE_KEY = 'factory_links_data';
let currentLinks = []; 

// 預設連結清單
const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG 報修', url: 'https://demo.machine.ng', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit 表單', url: 'https://demo.5s.audit', icon: 'fas fa-clipboard-check' },
    { id: 3, name: '機械維修紀錄', url: 'https://demo.maintenance.record', icon: 'fas fa-tools' },
    { id: 4, name: '機械查核保養', url: 'https://demo.check.maintain', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse 庫存', url: 'https://demo.rm.warehouse', icon: 'fas fa-warehouse' }
];

// =======================================================
// 函數：儲存與載入
// =======================================================

/**
 * 從 localStorage 載入資料，如果沒有則使用預設清單。
 */
function loadLinks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        currentLinks = JSON.parse(data);
    } else {
        currentLinks = DEFAULT_LINKS;
    }
}

/**
 * 將 currentLinks 陣列儲存到 localStorage。
 */
function saveLinks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLinks));
}

// =======================================================
// 函數：動態渲染 (使用者模式)
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
        button.setAttribute('data-url', link.url);
        
        button.title = link.name;
        
        const iconClass = link.icon && link.icon.trim() !== '' ? link.icon : 'fas fa-link';

        button.innerHTML = `
            <i class="${iconClass} fa-3x btn-icon-fa"></i>
            <span>${link.name}</span>
        `;
        
        // 設定點擊事件
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

// =======================================================
// 函數：設定模式 (CRUD 渲染)
// =======================================================

/**
 * 渲染設定模式下的網址清單。
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
        item.className = 'url-item';
        item.innerHTML = `
            <div class="url-details">
                <strong>${link.name}</strong>
                <span>${link.url}</span>
            </div>
            <div class="url-actions">
                <button class="edit-btn" onclick="editLink(${link.id})">編輯</button>
                <button class="delete-btn" onclick="deleteLink(${link.id})">刪除</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// =======================================================
// 函數：CRUD 操作
// =======================================================

/**
 * 顯示新增/修改表單。
 */
function showAddForm(id = null) {
    const form = document.getElementById('editUrlForm');
    const nameInput = document.getElementById('edit-name');
    const urlInput = document.getElementById('edit-url');
    const iconInput = document.getElementById('edit-icon');
    
    form.style.display = 'block';

    if (id !== null) {
        // 修改模式
        const link = currentLinks.find(l => l.id === id);
        if (link) {
            document.getElementById('edit-id').value = link.id;
            nameInput.value = link.name;
            urlInput.value = link.url;
            iconInput.value = link.icon || '';
        }
    } else {
        // 新增模式
        document.getElementById('edit-id').value = '';
        nameInput.value = '';
        urlInput.value = '';
        iconInput.value = '';
    }
}

/**
 * 隱藏新增/修改表單。
 */
function hideAddForm() {
    document.getElementById('editUrlForm').style.display = 'none';
}

/**
 * 處理新增或修改連結的邏輯。
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    const icon = document.getElementById('edit-icon').value.trim();

    if (id) {
        // 修改現有連結
        const index = currentLinks.findIndex(l => l.id === parseInt(id));
        if (index !== -1) {
            currentLinks[index] = { id: parseInt(id), name, url, icon };
        }
        alert(`連結 ${name} 已修改！`);
    } else {
        // 新增連結
        const newId = currentLinks.length > 0 ? Math.max(...currentLinks.map(l => l.id)) + 1 : 1;
        currentLinks.push({ id: newId, name, url, icon });
        alert(`連結 ${name} 已新增！`);
    }

    saveLinks(); 
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
        renderSettingsList();
        alert(`連結 ${link.name} 已刪除。`);
    }
}

// =======================================================
// 函數：模式切換
// =======================================================

/**
 * 處理登入，僅用於使用者 ID 登入。
 */
function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const inputID = passwordInput.value.trim();

    if (inputID !== '') {
        alert(`ID ${inputID} 登入成功！`);
        enterUserMode();
    } else {
        alert('請輸入您的 ID。');
    }
}

/**
 * 獨立的設定模式入口提示。
 */
function showAdminPrompt() {
    const password = prompt("請輸入管理員密碼：");

    if (password === ADMIN_PASSWORD) {
        // 輸入 ADMIN 進入管理員設定模式
        enterSettingsMode();
    } else if (password !== null) {
        // 密碼錯誤
        alert("管理員密碼錯誤，無法進入設定。");
    }
}

/**
 * 進入設定模式
 */
function enterSettingsMode() {
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
    document.querySelector('.mode-selection-section').style.display = 'none'; 
    document.querySelector('h1').textContent = '⚙️ 管理員設定模式';
    renderSettingsList(); 
}

/**
 * 進入使用者模式
 */
function enterUserMode() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('mainFeatures').style.display = 'grid';
    document.querySelector('.mode-selection-section').style.display = 'none'; 
    document.querySelector('h1').textContent = '🛠️ 工作站功能選單';
}

/**
 * 退出設定模式
 */
function exitSettings() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.querySelector('.mode-selection-section').style.display = 'flex'; 
    document.querySelector('h1').textContent = '🛠️ 工作站功能選單';
    
    // 重新渲染按鈕以確保最新設定生效
    loadLinks();
    renderUserButtons();
}


// =======================================================
// 初始化
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化時載入網址資料
    loadLinks();
    
    // 2. 預設顯示使用者按鈕
    renderUserButtons();
    
    // 3. 設定表單提交事件
    document.getElementById('editUrlForm').addEventListener('submit', handleFormSubmit);

    // 4. 將登入區塊設定為 Flex 顯示
    document.querySelector('.mode-selection-section').style.display = 'flex';
});
