// =======================================================
// 全域變數/常數
// =======================================================

// 設定密碼 (已更新為 'ADMIN')
const ADMIN_PASSWORD = 'ADMIN'; 
const DUMMY_PASSWORD = '1234'; // 這是您指定不能進入設定的密碼
const STORAGE_KEY = 'factory_links_data';
// ... (其他常數不變)


// ... (其他函數邏輯不變)


// =======================================================
// 函數：模式切換
// =======================================================

/**
 * 處理登入，切換使用者/管理員模式
 */
function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim().toUpperCase(); // 轉大寫以方便管理

    document.getElementById('passwordInput').value = ''; // 清空輸入欄

    if (password === ADMIN_PASSWORD) {
        // 輸入 ADMIN 進入管理員模式
        enterSettingsMode();
    } else if (password === DUMMY_PASSWORD) {
        // 輸入 1234 不進入設定，視為一般的 ID 登入
        alert('此密碼不具備管理員權限，已視為一般 ID 登入。');
        enterUserMode();
    } else if (password !== '') {
        // 其他非空輸入視為使用者 ID
        enterUserMode();
    } else {
        alert('請輸入 ID 或管理密碼。');
    }
}

// ... (後續函數邏輯不變)
