// =======================================================
// 全域變數/常數
// =======================================================

// 設定密碼 (已更新為 1234)
const ADMIN_PASSWORD = '1234'; 
const STORAGE_KEY = 'factory_links_data';
let currentLinks = []; // 用於儲存當前所有網址按鈕的資料 (名稱, 網址, 圖示)

// 預設連結清單 (如果 localStorage 中沒有資料)
const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG 報修', url: 'https://demo.machine.ng', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit 表單', url: 'https://demo.5s.audit', icon: 'fas fa-clipboard-check' },
    { id: 3, name: '機械維修紀錄', url: 'https://demo.maintenance.record', icon: 'fas fa-tools' },
    { id: 4, name: 'RM Warehouse 庫存', url: 'https://demo.rm.warehouse', icon: 'fas fa-warehouse' }
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
        // 如果沒有儲存的數據，使用預設值
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
    grid.innerHTML = ''; // 清空現有內容
    grid.style.display = 'grid'; // 確保按鈕區顯示

    if (currentLinks.length === 0) {
        grid.innerHTML = '<p style="color:red;">目前沒有設定任何按鈕！請聯絡管理員新增。</p>';
        return;
    }
    
    currentLinks.forEach(link => {
        const button = document.createElement('button');
        button.className = 'icon-btn';
        button.id = `btn-${link.id}`;
        button.setAttribute('data-url', link.url);
        
        // 使用 name 作為按鈕的文字和 title
        button.title = link.name;
        
        // 確保圖示有預設值，避免錯誤
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
                alert('此按鈕尚未設定網址！');
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
    container.innerHTML = ''; // 清空現有清單

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
 * @param {number} id - 待編輯的連結 ID，如果為 null 則表示新增。
 */
function showAddForm(id = null) {
    const form = document.getElementById('editUrlForm');
    const nameInput = document.getElementById('edit-name');
    const urlInput = document.getElementById('edit-url');
    const iconInput = document.getElementById('edit-icon');
    
    form.style.display = 'block';

    if (id !== null) {
        // 修改模式：載入資料
        const link = currentLinks.find(l => l.id === id);
        if (link) {
            document.getElementById('edit-id').value = link.id;
            nameInput.value = link.name;
            urlInput.value = link.url;
            iconInput.value = link.icon || '';
        }
    } else {
        // 新增模式：清空表單
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

    saveLinks(); // 儲存到 localStorage
    renderSettingsList(); // 更新清單
    hideAddForm(); // 隱藏表單
}

/**
 * 點擊編輯按鈕。
 */
function editLink(id) {
    showAddForm(id);
}

/**
 * 點擊刪除按鈕。
 */
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
 * 處理登入，切換使用者/管理員模式
 */
function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();
    
    document.getElementById('passwordInput').value = ''; // 清空輸入欄

    if (password === ADMIN_PASSWORD) {
        // 管理員模式
        enterSettingsMode();
    } else if (password !== '') {
        // 使用者模式 (ID 輸入)
        enterUserMode();
    } else {
        alert('請輸入 ID 或管理密碼。');
    }
}

/**
 * 進入設定模式
 */
function enterSettingsMode() {
    document.getElementById('mainFeatures').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
    document.querySelector('.mode-selection-section').style.display = 'none'; // 隱藏登入區
    document.querySelector('h1').textContent = '⚙️ 管理員設定模式';
    renderSettingsList(); // 渲染 CRUD 清單
}

/**
 * 進入使用者模式
 */
function enterUserMode() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('mainFeatures').style.display = 'grid';
    document.querySelector('.mode-selection-section').style.display = 'none'; // 隱藏登入區
    document.querySelector('h1').textContent = '🛠️ 工作站功能選單';
    // 按鈕已在 DOMContentLoaded 中渲染
}

/**
 * 退出設定模式
 */
function exitSettings() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.querySelector('.mode-selection-section').style.display = 'flex'; // 重新顯示登入區
    document.querySelector('h1').textContent = '🛠️ 工作站功能選單';
    
    // 儲存並重新渲染按鈕以確保最新設定生效
    saveLinks(); 
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

    // 4. 預設進入使用者模式 (因為沒有 ID/密碼輸入，所以先顯示按鈕)
    document.getElementById('settingsPanel').style.display = 'none';
    
    // 5. 將登入區塊設定為 Flex 顯示
    document.querySelector('.mode-selection-section').style.display = 'flex';
});
