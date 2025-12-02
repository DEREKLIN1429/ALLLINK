// =======================================================
// 全域變數/常數
// =======================================================
const TITLE_LOGIN = '生產智能系統彙整 登入 | Production Intelligence System Login';
const TITLE_USER_MODE = '生產智能系統彙整 | Production Intelligence System Integration';
const TITLE_ADMIN_MODE = '🛠️ 工作站功能選單 | Workstation Features Menu';

const ADMIN_PASSWORD = '12345'; 
const STORAGE_KEY = 'factory_links_data';
const USER_ID_KEY = 'current_user_id'; 
let currentLinks = []; 
let currentMode = 'GUEST'; 
let currentUserID = ''; 

// ... (ICON_OPTIONS 保持不變) ...

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

// 修正：DEFAULT_LINKS 使用最新的中英文標題和網址
const DEFAULT_LINKS = [
    { id: 1, name: 'Machine-NG\n機械故障', url: 'https://dereklin1429.github.io/Machine-NG/', icon: 'fas fa-exclamation-triangle' },
    { id: 2, name: '5S Audit\n5S 查核', url: 'https://dereklin1429.github.io/5S-audit/', icon: 'fas fa-clipboard-check' },
    { id: 3, name: 'Maintenance Record\n機械維修紀錄', url: 'https://dereklin1429.github.io/repair-history/', icon: 'fas fa-tools' },
    { id: 4, name: 'Machinery Upkeep\n機械查核保養', url: 'https://dereklin1429.github.io/-MC-maintenance-check/', icon: 'fas fa-calendar-alt' },
    { id: 5, name: 'RM Warehouse\n原管倉庫', url: 'https://chiehs1429.github.io/RM-Warehouse/', icon: 'fas fa-warehouse' },
    { id: 6, name: 'Mixing\n混練工程', url: 'https://chiehs1429.github.io/Mixing/', icon: 'fas fa-cogs' },
    { id: 7, name: 'Extrusion\n押出工程', url: 'https://chiehs1429.github.io/Extrusion_app/', icon: 'fas fa-cogs' },
    { id: 8, name: 'Calendering\n上膠工程', url: 'https://chiehs1429.github.io/Calendering/', icon: 'fas fa-compress-arrows-alt' },
    { id: 9, name: 'CUTTING\n裁斷工程', url: 'https://chiehs1429.github.io/CUTTING-Inventory/', icon: 'fas fa-cut' },
    // 原始項目 Extrusion-Inventory (ID 6) 與新的 Extrusion 項目 (ID 8) 網址相同，為了保持 ID 唯一性，我們只保留新的。
    // 如果您需要額外的項目，請自行調整。
];

// ... (後續所有函數保持不變) ...
