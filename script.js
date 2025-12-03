// =======================================================
// 全域變數/常數
// =======================================================
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 網址連結設定 (管理員模式)';
const ADMIN_PASSWORD = '12345'; // ⚠️ 注意：在前端硬編碼密碼非常不安全，僅供測試用途。

const STORAGE_KEY = 'factory_links_data';
const USER_ID_KEY = 'current_user_id'; 
let currentLinks = []; 
let currentMode = 'GUEST'; 
let currentUserID = ''; 

// 【新增】彩蛋相關常數與變數
let exitClickCount = 0; // 追蹤退出按鈕的連續點擊次數
let clickTimer = null; // 用來在點擊間隔太長時重設計數
const CLICK_THRESHOLD = 500; // 500 毫秒內算連續點擊

const DEREK_ID = 10;
const LAI_ID = 11;


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
    // 【新增】圖示選項
    { class: 'fas fa-book', name: '筆記 (Book)' },
    { class: 'fas fa-feather-alt', name: '記事本 (Feather)' },
];

const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG\n機械故障', url: 'https://dereklin1429.github.io/Machine-NG/', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit\n5S 查核', url: 'https://dereklin1429.github.io/5S-audit/', icon: 'fas fa-clipboard-check' },
    { id: 3, name: 'Repair Record\n機械維修紀錄', url: 'https://dereklin1429.github.io/repair-history/', icon: 'fas fa-tools' },
    { id: 4, name: 'Machinery Upkeep\n機械查核保養', url: 'https://dereklin1429.github.io/-MC-maintenance-check/', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse\n原管倉庫', url: 'https://chiehs1429.github.io/RM-Warehouse/', icon: 'fas fa-warehouse' },
    { id: 6, name: 'Mixing\n混練工程', url: 'https://chiehs1429.github.io/Mixing/', icon: 'fas fa-cogs' },
    { id: 7, name: 'Extrusion\n押出工程', url: 'https://chiehs1429.github.io/Extrusion_app/', icon: 'fas fa-cogs' },
    { id: 8, name: 'Calendering\n上膠工程', url: 'https://chiehs1429.github.io/Calendering/', icon: 'fas fa-compress-arrows-alt' },
    { id: 9, name: 'CUTTING\n裁斷工程', url: 'https://chiehs1429.github.io/CUTTING-Inventory/', icon: 'fas fa-cut' },
    // 【新增】彩蛋網址
    { id: DEREK_ID, name: 'DEREK Notes\n筆記彙整', url: 'https://dereklin1429.github.io/DEREK-Notes/', icon: 'fas fa-book' },
    { id: LAI_ID, name: '賴桑記事本\n記事本', url: 'https://dereklin1429.github.io/LAI/', icon: 'fas fa-feather-alt' },
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
            header.textContent = '管理員模式 | Admin Mode'; 
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
    currentUserID = localStorage.getItem(USER_ID_KEY) || '';
}

function saveLinks() {
    localStorage.setItem(USER_ID_KEY, currentUserID); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLinks));
}

// =======================================================
// 函數：動態渲染 (使用者模式 & 管理模式)
// =======================================================

function renderUserButtons() {
    const grid = document.getElementById('mainFeatures');
    grid.innerHTML = '';    

    // 【修改點】過濾掉彩蛋連結 (ID 10 和 ID 11)，只渲染一般使用者連結
    const userLinks = currentLinks.filter(link => 
        link.id !== DEREK_ID && link.id !== LAI_ID
    );

    if (userLinks.length === 0) {
        grid.innerHTML = '<p style="color:var(--primary-color);">目前沒有設定任何按鈕！請聯絡管理員新增。</p>';
        return;
    }
        
    userLinks.forEach(link => {
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
    
    // 【新增】檢查彩蛋按鈕是否已存在，如果是，則在渲染完畢後重新添加回去
    const container = document.getElementById('mainFeatures');
    const laiLink = currentLinks.find(l => l.id === LAI_ID);
    const derekLink = currentLinks.find(l => l.id === DEREK_ID);
    
    // 如果彩蛋按鈕之前被點出來了，重新載入時要再放回去
    if (laiLink && document.getElementById('laiLink')) {
        container.appendChild(createHiddenLinkButton(laiLink, 'laiLink'));
    }
    if (derekLink && document.getElementById('derekLink')) {
        container.appendChild(createHiddenLinkButton(derekLink, 'derekLink'));
    }
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
        container.innerHTML = '<p style="color:var(--primary-color);">清單為空，請點擊上方「新增網址」！</p>';
        return;
    }

    currentLinks.forEach(link => {
        const item = document.createElement('div');
        item.className = 'admin-item-btn'; 

        // 點擊整個大按鈕，排除點擊動作按鈕時，彈出編輯介面
        item.addEventListener('click', (e) => {
             // 確保只有點擊非 action 按鈕區域時才觸發 edit
             if (!e.target.closest('.admin-item-actions') && !e.target.closest('button')) {
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
// 函數：模式切換 (統一控制顯示/隱藏) - 【修改點】使用統一函數
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
            renderUserButtons(); // 確保進入 USER 模式時重新渲染按鈕
            break;
        case 'ADMIN':
            settingsPanel.style.display = 'block';
            hrDivider.style.display = 'block';
            renderSettingsList();
            break;
    }
}

function initPage() {
    loadLinks();
    renderUserButtons();
    updateUI('GUEST'); // 使用新的統一函數
}

function showAdminPrompt() {
    // ... 安全性警告不變
    const password = prompt("請輸入管理員密碼 (Enter Admin Password)：\n(注意：此密碼在前端程式碼中寫死，僅供測試用途)");

    if (password === ADMIN_PASSWORD) {
        enterSettingsMode();
    } else if (password !== null) {
        alert("管理員密碼錯誤，無法進入設定 (Admin password incorrect)。");
    }
}

function exitAdminView() {
    // 從 Admin 退出時，回到 GUEST 模式 (首頁)
    handleLogout(false); 
    alert('已退出管理員設定畫面 (Exited Admin Setup View)。');
}

function handleLogout(clearID = false) { 
    // 登出後回到 GUEST 首頁
    if (clearID) {
        localStorage.removeItem(USER_ID_KEY);
        currentUserID = '';
    }

    // 重設彩蛋計數
    exitClickCount = 0;
    if (clickTimer) clearTimeout(clickTimer);
    
    // 隱藏彩蛋按鈕 (以防它們顯示在 GUEST 模式)
    document.getElementById('laiLink')?.remove();
    document.getElementById('derekLink')?.remove();

    updateUI('GUEST'); 
}

function enterSettingsMode() {
    updateUI('ADMIN');
}

function enterUserMode() { 
    updateUI('USER');
    
    // 由於 ID 登入已移除，這裡顯示預設的 '訪客'
    const actualUserID = '訪客';
    document.getElementById('welcomeMessage').textContent = `歡迎, ${actualUserID} (Welcome, ${actualUserID})`;
}

// =======================================================
// 函數：彩蛋功能 (連續點擊邏輯) - 【新增】
// =======================================================

/**
 * 處理連續點擊事件並觸發隱藏按鈕的顯示/隱藏
 */
function handleExitClick() {
    // 雖然按鈕不再是退出功能，但為了不讓使用者困惑，依然彈出提示
    alert('此按鈕目前無作用，請選擇「進入系統」或「管理設定」。');
    
    clearTimeout(clickTimer); // 清除舊的計時器
    exitClickCount++; // 增加計數

    // 重設計時器：如果 500ms 內沒有下次點擊，則重設計數
    clickTimer = setTimeout(() => {
        exitClickCount = 0;
        console.log('點擊間隔過長，計數已重設。');
    }, CLICK_THRESHOLD);
    
    // 檢查 "賴桑記事本" (ID 11, 點擊 5 次)
    handleHiddenLink(LAI_ID, 5, 'laiLink');

    // 檢查 "DEREK Notes" (ID 10, 點擊 10 次)
    handleHiddenLink(DEREK_ID, 10, 'derekLink');

    // 如果點擊次數超過最大閾值，重設計數（避免無窮遞增）
    if (exitClickCount > 10) {
        exitClickCount = 0;
    }
}

/**
 * 通用處理隱藏連結的顯示和隱藏
 * @param {number} linkId - 連結的 ID (DEREK_ID 或 LAI_ID)
 * @param {number} threshold - 觸發顯示/隱藏的點擊次數
 * @param {string} elementId - 按鈕元素的 ID
 */
function handleHiddenLink(linkId, threshold, elementId) {
    const link = currentLinks.find(l => l.id === linkId);
    if (!link) return;

    const container = document.getElementById('mainFeatures');
    let button = document.getElementById(elementId);
    
    // 點擊次數達到閾值
    if (exitClickCount === threshold) {
        if (!button) {
            // 達到閾值且按鈕不存在：顯示按鈕 (彩蛋開啟)
            button = createHiddenLinkButton(link, elementId);
            container.appendChild(button);
            // 確保按鈕區塊在彩蛋觸發時顯示
            document.getElementById('mainFeatures').style.display = 'grid';
            alert(`恭喜您觸發了隱藏彩蛋！${link.name} 現已顯示！`);
        } else {
            // 達到閾值且按鈕已存在：隱藏按鈕 (彩蛋關閉)
            button.remove();
            alert(`${link.name} 按鈕已隱藏。`);
        }
        exitClickCount = 0; // 觸發後重設計數
    }
}

/**
 * 建立隱藏連結的按鈕元素 (與 renderUserButtons 共享邏輯)
 */
function createHiddenLinkButton(link, elementId) {
    const button = document.createElement('button');
    button.className = 'icon-btn';
    button.id = elementId;
    button.title = `${link.name}\n${link.url}`; 

    const iconClass = link.icon && link.icon.trim() !== '' ? link.icon : 'fas fa-link';

    button.innerHTML = `
        <i class="${iconClass} fa-3x btn-icon-fa"></i>
        <span>${link.name}</span>
    `;

    button.addEventListener('click', () => {
         if (link.url) {
            window.open(link.url, '_blank');
        } else {
            alert('此按鈕尚未設定網址！請聯絡管理員。');
        }
    });
    return button;
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
    
    // 【新增】為退出按鈕添加事件監聽器
    const exitBtn = document.getElementById('exitButton');
    if (exitBtn) {
        exitBtn.addEventListener('click', handleExitClick);
    }
});
