// 確認 ID 的函數
function checkID() {
    const userIDInput = document.getElementById('userID');
    const mainFeaturesDiv = document.getElementById('mainFeatures');
    const confirmBtn = document.getElementById('confirmBtn');

    if (userIDInput.value.trim() !== '') {
        // ID 有輸入 (您可以根據需求在這裡加入更複雜的 ID 驗證邏輯)
        
        // 1. 顯示主功能區
        mainFeaturesDiv.style.display = 'grid'; 

        // 2. 鎖定 ID 輸入區 (可選)
        userIDInput.disabled = true;
        confirmBtn.disabled = true;
        confirmBtn.textContent = '已確認';
        
        alert(`ID ${userIDInput.value.trim()} 確認成功！功能選單已啟用。`);

    } else {
        // ID 未輸入
        alert('請先輸入您的 ID 才能啟用功能選單！');
    }
}

// 設定圖形按鈕的點擊事件
document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有的圖形按鈕
    const iconButtons = document.querySelectorAll('.icon-btn');
    
    // 確保所有按鈕一開始是禁用的 (當 mainFeaturesDiv 隱藏時，這樣做只是額外的保障)
    // 這裡我們主要依賴 CSS (mainFeaturesDiv.style.display = 'none') 
    // 但為了讓邏輯更完整，我們依然為每個按鈕加上事件監聽。
    
    iconButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 只有在功能區顯示時才執行導向
            const mainFeaturesDiv = document.getElementById('mainFeatures');
            if (mainFeaturesDiv.style.display === 'grid') {
                // 從按鈕的 data-url 屬性中獲取目標網址
                const targetUrl = button.getAttribute('data-url');
                if (targetUrl) {
                    // 在新視窗/標籤頁中打開網址
                    window.open(targetUrl, '_blank');
                } else {
                    console.error('此按鈕未設定網址連結 (data-url 遺失)');
                }
            } else {
                 alert('請先輸入並確認 ID 才能使用此功能！');
            }
        });
    });
});