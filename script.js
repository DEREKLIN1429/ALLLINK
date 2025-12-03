// =======================================================
// 函數：精簡的常數 (只保留必要的)
// =======================================================
const TITLE_STATIC = '生產作業系統彙整 | PIS Integration';
const DEREK_ID = 10;
const LAI_ID = 11;

// 只需要這兩個連結的資料
const FIXED_LINKS = [
    { id: DEREK_ID, name: 'DEREK Notes\n筆記彙整', url: 'https://dereklin1429.github.io/DEREK-Notes/', icon: 'fas fa-book' },
    { id: LAI_ID, name: '賴桑記事本\n記事本', url: 'https://dereklin1429.github.io/LAI/', icon: 'fas fa-feather-alt' },
];


// =======================================================
// 函數：只渲染固定按鈕
// =======================================================

function renderFixedButtons() {
    const grid = document.getElementById('mainFeatures');
    grid.innerHTML = '';    // 清空舊內容
    
    // 【關鍵邏輯】確保 grid 顯示為網格
    grid.style.display = 'grid'; 

    FIXED_LINKS.forEach(link => {
        const button = document.createElement('button');
        button.className = 'icon-btn';
        button.id = `btn-${link.id}`;
        button.title = `${link.name}\n${link.url}`; 
        
        const iconClass = link.icon && link.icon.trim() !== '' ? link.icon : 'fas fa-link';

        button.innerHTML = `
            <i class="${iconClass} fa-3x btn-icon-fa"></i>
            <span>${link.name}</span>
        `;
        
        // 點擊後直接開啟連結
        button.addEventListener('click', () => {
             if (link.url) {
                 window.open(link.url, '_blank');
             }
        });

        grid.appendChild(button);
    });
}


// =======================================================
// 函數：初始化 (只設置標題和渲染按鈕)
// =======================================================
function initPage() {
    // 設置固定標題
    document.getElementById('mainHeader').textContent = TITLE_STATIC;
    document.getElementById('pageTitle').textContent = TITLE_STATIC;
    
    // 渲染兩個固定按鈕
    renderFixedButtons();
}


document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

// 移除所有模式切換、彩蛋、CRUD 函數，使程式碼極簡化
