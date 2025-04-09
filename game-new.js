// 遊戲狀態
const gameState = {
    status: 'ready', // ready, fishing, spinning, result
    caughtFish: [],
    currentFish: null,
    selectedRarity: null,
    currentEnvironment: '沿岸',
    currentTime: '早上',
    fishingEvents: [
        "魚兒靠近了！",
        "有東西在咬餌！",
        "水面出現漣漪...",
        "感覺有大魚在游動！",
        "釣竿微微彎曲！",
        "浮標輕輕晃動！",
        "有動靜！",
        "魚兒似乎很感興趣！",
        "浮標沉入水中！",
        "魚餌被咬住了！"
    ],
    randomFishAppearance: {
        enabled: true,
        timer: null,
        interval: [5000, 15000] // 隨機魚出現的時間區間(毫秒)
    }
};

// DOM元素
const elements = {
    castBtn: document.getElementById('cast-btn'),
    pullBtn: document.getElementById('pull-btn'),
    statusText: document.getElementById('status-text'),
    fishHook: document.getElementById('fish-hook'),
    floatObject: document.getElementById('float-object'),
    splash: document.getElementById('splash'),
    fishShadow: document.querySelector('.fish-shadow'),
    fishingArea: document.querySelector('.fishing-area'),
    wheelContainer: document.getElementById('rarity-wheel-app'),
    fishCaughtPanel: document.getElementById('fish-caught-panel'),
    caughtFishImg: document.getElementById('caught-fish-img'),
    caughtFishName: document.getElementById('caught-fish-name'),
    caughtFishRarity: document.getElementById('caught-fish-rarity'),
    caughtFishEnvironmentTime: document.getElementById('caught-fish-environment-time'),
    caughtFishDesc: document.getElementById('caught-fish-desc'),
    continueBtn: document.getElementById('continue-btn'),
    currentTime: document.getElementById('current-time'),
    gameStatus: document.getElementById('game-status'),
    collectionBtn: document.getElementById('collection-btn'),
    collectionPanel: document.getElementById('collection-panel'),
    collectionCount: document.getElementById('collection-count'),
    fishCollection: document.getElementById('fish-collection'),
    closeCollection: document.getElementById('close-collection-btn'),
    environmentBtns: document.querySelectorAll('.environment-btn'),
    restartBtn: document.getElementById('restart-adventure-btn'),
    caughtCounter: document.getElementById('caught-fish')
};

let playerFish = [];
let rarityResult = null;

// 初始化 Vue 應用和轉盤組件
let rarityWheelApp;

function initializeRarityWheel() {
    // 檢查是否已有 Vue
    if (typeof Vue === 'undefined') {
        console.error('Vue 未載入！無法初始化轉盤。');
        return;
    }
    
    console.log('初始化轉盤組件...');
    
    // 創建樣式
    const style = document.createElement('style');
    style.textContent = `
        #app-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            width: 80%;
            max-width: 400px;
            height: auto;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            display: block;
        }
        
        .rarity-wheel-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    // 確保已有容器元素
    let appContainer = document.getElementById('app-container');
    if (!appContainer) {
        appContainer = document.createElement('div');
        appContainer.id = 'app-container';
        document.body.appendChild(appContainer);
        console.log('創建轉盤容器元素');
    }
    
    // 創建 Vue 應用
    try {
        rarityWheelApp = Vue.createApp({
            template: `
                <div class="rarity-wheel-wrapper">
                    <rarity-wheel 
                        :visible="true" 
                        @result="handleResult"
                    />
                </div>
            `,
            data() {
                return {
                    showWheel: true
                };
            },
            methods: {
                handleResult(result) {
                    console.log('轉盤結果:', result);
                    
                    // 處理轉盤結果
                    if (typeof window.handleRarityResult === 'function') {
                        window.handleRarityResult(result.label);
                    }
                },
                showWheel() {
                    console.log('啟動顯示轉盤');
                    this.showWheel = true;
                    
                    // 顯示容器
                    const container = document.getElementById('app-container');
                    if (container) {
                        container.style.display = 'block';
                    }
                }
            },
            mounted() {
                console.log('Vue 應用已掛載');
            }
        });
        
        // 全局註冊轉盤組件
        if (typeof RarityWheel !== 'undefined') {
            rarityWheelApp.component('rarity-wheel', RarityWheel);
            console.log('註冊 RarityWheel 組件成功');
        } else {
            console.error('RarityWheel 組件未定義');
            
            // 嘗試通過腳本標籤加載組件
            const script = document.createElement('script');
            script.src = './components/RarityWheel.js';
            script.onload = () => {
                console.log('RarityWheel 組件已載入');
                if (typeof RarityWheel !== 'undefined') {
                    rarityWheelApp.component('rarity-wheel', RarityWheel);
                    console.log('延遲註冊 RarityWheel 組件成功');
                    
                    // 重新掛載應用
                    if (!rarityWheelApp._instance) {
                        rarityWheelApp.mount('#app-container');
                    }
                }
            };
            document.head.appendChild(script);
        }
        
        // 掛載 Vue 應用
        rarityWheelApp.mount('#app-container');
        console.log('轉盤應用掛載到 #app-container');
        
        // 初始隱藏轉盤容器
        const container = document.getElementById('app-container');
        if (container) {
            container.style.display = 'none';
        }
        
        // 保存引用以便後續使用
        elements.wheelContainer = {
            showWheel: function() {
                if (rarityWheelApp && rarityWheelApp._instance) {
                    const vm = rarityWheelApp._instance.proxy;
                    vm.showWheel();
                } else {
                    console.error('轉盤應用實例不存在');
                    
                    // 嘗試直接顯示容器
                    const container = document.getElementById('app-container');
                    if (container) {
                        container.style.display = 'block';
                    }
                }
            }
        };
        
        console.log('轉盤組件初始化完成');
    } catch (error) {
        console.error('初始化轉盤時發生錯誤:', error);
    }
}

// 顯示稀有度轉盤
function showRarityWheel() {
    console.log('顯示稀有度輪盤');
    
    // 隱藏釣魚結果面板
    document.getElementById('fishCapturePanel').style.display = 'none';
    
    // 創建並顯示輪盤組件
    if (!window.rarityWheelInstance) {
        const RarityWheelComponent = Vue.defineComponent(RarityWheel);
        
        // 創建輪盤容器
        const wheelContainer = document.createElement('div');
        wheelContainer.id = 'rarityWheelContainer';
        document.body.appendChild(wheelContainer);
        
        // 使用Vue創建輪盤組件
        const app = Vue.createApp({
            components: {
                RarityWheelComponent
            },
            template: `
                <RarityWheelComponent 
                    ref="wheelRef"
                    :visible="isWheelVisible" 
                    @result="handleResult"
                />
            `,
            setup() {
                const isWheelVisible = Vue.ref(false);
                const wheelRef = Vue.ref(null);
                
                // 處理結果
                const handleResult = (result) => {
                    console.log('輪盤結果:', result);
                    // 結果會被 handleRarityResult 全局函數處理
                };
                
                // 暴露方法給外部調用
                Vue.onMounted(() => {
                    window.rarityWheelAPI = {
                        show: () => {
                            console.log('顯示輪盤');
                            isWheelVisible.value = true;
                        },
                        hide: () => {
                            console.log('隱藏輪盤');
                            isWheelVisible.value = false;
                        },
                        reset: () => {
                            console.log('重置輪盤');
                            if (wheelRef.value) {
                                wheelRef.value.resetWheel();
                            }
                        }
                    };
                });
                
                return {
                    isWheelVisible,
                    wheelRef,
                    handleResult
                };
            }
        });
        
        // 掛載Vue應用
        window.rarityWheelInstance = app.mount('#rarityWheelContainer');
    }
    
    // 顯示輪盤
    if (window.rarityWheelAPI) {
        window.rarityWheelAPI.show();
    }
}

// 處理稀有度結果
function handleRarityResult(rarity) {
    console.log('處理稀有度結果:', rarity);
    
    // 等待一段時間後隱藏輪盤
    setTimeout(() => {
        if (window.rarityWheelAPI) {
            window.rarityWheelAPI.hide();
        }
        
        // 將中文稀有度轉換為數值
        let rarityValue;
        switch (rarity) {
            case '傳說':
                rarityValue = 3;
                break;
            case '稀有':
                rarityValue = 2;
                break;
            case '進階':
                rarityValue = 1;
                break;
            default:
                rarityValue = 0; // 普通
        }
        
        // 從數據中找出對應稀有度的魚
        const availableFish = fishDatabase.filter(fish => fish.rarity === rarityValue);
        
        if (availableFish.length > 0) {
            // 隨機選擇一條該稀有度的魚
            const randomIndex = Math.floor(Math.random() * availableFish.length);
            const selectedFish = availableFish[randomIndex];
            
            // 更新遊戲狀態
            console.log('選中的魚:', selectedFish.name);
            
            // 添加到捕獲的魚列表
            const isNewCatch = addCaughtFish(selectedFish);
            
            // 顯示捕獲通知
            showCatchNotification(selectedFish, isNewCatch);
            
            // 更新UI
            updateCaughtFishCount();
            
            // 延遲一段時間後重置釣魚狀態
            setTimeout(() => {
                resetFishingState();
            }, 3000);
        } else {
            console.error('無法找到匹配該稀有度的魚:', rarity);
            resetFishingState();
        }
    }, 2000);
}

// 重置釣魚狀態
function resetFishingState() {
    console.log('重置釣魚狀態');
    
    // 隱藏釣魚元素
    document.getElementById('fishingLine').style.display = 'none';
    document.getElementById('float').style.display = 'none';
    document.getElementById('caughtFish').style.display = 'none';
    
    // 確保應用容器已隱藏
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.style.display = 'none';
    }
    
    // 重置按鈕文字
    document.getElementById('castButton').textContent = '甩竿';
    
    // 更新狀態文字
    updateStatusText('準備釣魚');
    
    // 啟用按鈕
    document.getElementById('castButton').disabled = false;
    
    // 重置狀態
    isFishing = false;
    currentFish = null;
}

// 初始化遊戲
function initGame() {
    loadCaughtFish();
    updateCaughtCounter();
    setupEventListeners();
    initEnvironments();
    startTimeChangeCycle();
    
    // 初始化轉盤組件
    initializeRarityWheel();
    
    console.log('遊戲初始化完成');
}

// 更新事件監聽器
function setupEventListeners() {
    // 釣魚按鈕
    elements.castBtn.addEventListener('click', startFishing);
    
    // 圖鑑相關
    elements.collectionBtn.addEventListener('click', () => {
        elements.collectionPanel.classList.remove('hidden');
        renderFishCollection();
    });
    
    elements.closeCollection.addEventListener('click', () => {
        elements.collectionPanel.classList.add('hidden');
    });
    
    // 環境選擇
    elements.environmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const environment = btn.getAttribute('data-environment');
            changeEnvironment(environment);
        });
    });
    
    // 篩選器
    document.getElementById('filter-environment').addEventListener('change', renderFishCollection);
    document.getElementById('filter-time').addEventListener('change', renderFishCollection);
    document.getElementById('filter-rarity').addEventListener('change', renderFishCollection);
    
    // 重新開始
    elements.restartBtn.addEventListener('click', confirmRestart);
}

// 釣魚流程 - 單一入口
function startFishing() {
    console.log('開始釣魚');
    
    if (gameState.status !== 'ready') return;
    
    gameState.status = 'spinning'; // 設置遊戲狀態為旋轉中
    elements.castBtn.disabled = true;
    elements.castBtn.textContent = '轉盤旋轉中...';
    
    updateStatusMessage('甩出釣竿... 轉盤出現！');
    
    // 顯示釣魚動畫
    elements.fishHook.classList.remove('hidden');
    elements.floatObject.classList.remove('hidden');
    setTimeout(() => {
        elements.splash.classList.remove('hidden');
        setTimeout(() => elements.splash.classList.add('hidden'), 100);
    }, 60);
    
    // 顯示轉盤並自動旋轉
    stopRandomFishAppearance();
    
    // 顯示輪盤容器
    document.getElementById('wheel-container').classList.remove('hidden');
    
    // 使用 RarityWheelApp API 顯示並旋轉輪盤
    if (window.RarityWheelApp && typeof window.RarityWheelApp.show === 'function') {
        window.RarityWheelApp.show();
    } else {
        console.error('轉盤應用未初始化');
        resetFishingState();
    }
}

// 處理稀有度結果
window.handleRarityResult = function(rarity) {
    console.log('收到稀有度結果:', rarity);
    
    // 將中文稀有度轉換為數值
    const rarityMap = {
        '普通': 1,
        '進階': 2,
        '稀有': 3,
        '傳說': 4
    };
    
    const rarityValue = rarityMap[rarity];
    if (!rarityValue) {
        console.error('無法識別的稀有度:', rarity);
        resetFishingState(); // 發生錯誤時重置狀態
        return;
    }
    
    // 清晰的狀態更新
    updateStatusMessage(`<span style="color:${getRarityColor(rarityValue)}">恭喜獲得 ${rarity} 稀有度！</span>`);
    
    // 根據稀有度選擇魚
    const selectedFish = selectFishByRarity(rarityValue);
    if (!selectedFish) {
        console.error('無法找到符合稀有度的魚');
        updateStatusMessage('釣魚失敗，請再試一次！');
        resetFishingState(); // 發生錯誤時重置狀態
        return;
    }
    
    // 更新遊戲狀態
    gameState.currentFish = selectedFish;
    gameState.status = 'result';
    
    // 播放音效
    playRaritySound(rarityValue);
    
    // 判斷是否是新魚
    const isNewFish = !gameState.caughtFish.some(fish => fish.id === selectedFish.id);
    
    // 顯示結果
    showFishNotification(selectedFish, isNewFish);
    
    // 如果是新魚，添加到已捕獲列表
    if (isNewFish) {
        gameState.caughtFish.push({...selectedFish}); // 創建副本以避免引用問題
        saveCaughtFish();
        updateCaughtCounter();
    }
    
    // 延遲重置釣魚狀態，讓玩家有時間看到結果
    setTimeout(() => {
        resetFishingState();
    }, 3000); // 延長時間到 3 秒
};

// 獲取稀有度對應的顏色
function getRarityColor(rarityValue) {
    const colorMap = {
        1: '#7E8287', // 普通 - 灰色
        2: '#45AAFF', // 高級 - 藍色
        3: '#FF6B8E', // 稀有 - 粉紅色
        4: '#FFD700'  // 傳說 - 金色
    };
    return colorMap[rarityValue] || '#FFFFFF';
}

// 修改 resetFishingState
function resetFishingState() {
    console.log("重置釣魚狀態");
    gameState.status = 'ready';
    gameState.currentFish = null;

    // 隱藏釣魚元素
    elements.fishHook.classList.add('hidden');
    elements.floatObject.classList.add('hidden');
    
    // 隱藏輪盤容器
    document.getElementById('wheel-container').classList.add('hidden');
    
    // 使用 API 隱藏輪盤
    if (window.RarityWheelApp && typeof window.RarityWheelApp.hide === 'function') {
        window.RarityWheelApp.hide();
    }

    // 重置按鈕
    elements.castBtn.textContent = '甩竿'; // 恢復原始文字
    elements.castBtn.disabled = false;

    // 更新提示文字
    updateStatusMessage('準備開始釣魚吧！');
    
    // 重新開始魚影
    startRandomFishAppearance();
}

// 更新狀態訊息函數 - 支援 HTML
function updateStatusMessage(message) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.innerHTML = message; // 使用 innerHTML 支援 HTML
    }
}

// 顯示魚捕獲通知
function showFishNotification(fish, isNew) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = 'fish-notification';
    
    const rarityText = ['', '普通', '高級', '稀有', '傳說'][fish.rarity];
    
    // 創建內容結構
    const imgElement = document.createElement('img');
    imgElement.alt = fish.name;
    imgElement.src = fish.image;
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = window.defaultFishImage;
    };
    
    // 添加圖片
    notification.appendChild(imgElement);
    
    // 添加文字內容
    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';
    
    const heading = document.createElement('h3');
    heading.textContent = isNew ? '發現新魚！' : '釣到魚了！';
    contentDiv.appendChild(heading);
    
    const fishNameDiv = document.createElement('div');
    fishNameDiv.className = 'fish-name';
    fishNameDiv.textContent = fish.name;
    contentDiv.appendChild(fishNameDiv);
    
    const fishRarityDiv = document.createElement('div');
    fishRarityDiv.className = `fish-rarity rarity-${fish.rarity}`;
    fishRarityDiv.textContent = rarityText;
    contentDiv.appendChild(fishRarityDiv);
    
    // 添加內容區域到通知
    notification.appendChild(contentDiv);
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 兩秒後淡出
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 1000);
    }, 2000);
}

// 播放稀有度對應的音效
function playRaritySound(rarity) {
    // 可以根據不同稀有度播放不同音效
    // 這裡只做簡單的控制台輸出
    console.log(`播放稀有度 ${rarity} 的音效`);
    // 如果將來添加音效，可以在這裡實現
}

// 時間循環
function initTimeCycle() {
    if (timeChangeTimer) clearInterval(timeChangeTimer);
    
    const times = ['早上', '中午', '晚上'];
    gameState.currentTime = times[Math.floor(Math.random() * times.length)];
    updateTimeDisplay();
    updateTimeVisuals();
    
    timeChangeTimer = setInterval(() => {
        const currentIndex = times.indexOf(gameState.currentTime);
        const nextIndex = (currentIndex + 1) % times.length;
        gameState.currentTime = times[nextIndex];
        
        updateTimeDisplay();
        updateTimeVisuals();
        showTimeChangeNotification();
    }, params.timeChangeInterval);
}

// 更新時間顯示
function updateTimeDisplay() {
    elements.currentTime.textContent = gameState.currentTime;
    
    elements.currentTime.classList.remove('time-morning', 'time-noon', 'time-evening');
    
    const timeIcon = document.querySelector('.time-icon i');
    switch (gameState.currentTime) {
        case '早上':
            elements.currentTime.classList.add('time-morning');
            timeIcon.className = 'fas fa-sun';
            break;
        case '中午':
            elements.currentTime.classList.add('time-noon');
            timeIcon.className = 'fas fa-sun';
            break;
        case '晚上':
            elements.currentTime.classList.add('time-evening');
            timeIcon.className = 'fas fa-moon';
            break;
    }
}

// 顯示時間變化通知
function showTimeChangeNotification() {
    const notification = document.createElement('div');
    notification.classList.add('time-change-notification');
    notification.textContent = `時間變成 ${gameState.currentTime} 了！`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) document.body.removeChild(notification);
        }, 1000);
    }, 3000);
}

// 更改釣魚環境
function changeEnvironment(environment) {
    gameState.currentEnvironment = environment;
    
    elements.environmentBtns.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-environment') === environment);
    });
    
    updateEnvironmentVisuals();
    resetGame();
    updateStatusMessage(`已切換到 ${environment} 環境！`);
}

// 更新環境視覺效果
function updateEnvironmentVisuals() {
    elements.fishingArea.classList.remove('coastal', 'sea', 'freshwater', 'lake');
    
    switch (gameState.currentEnvironment) {
        case '沿岸':
            elements.fishingArea.classList.add('coastal');
            break;
        case '海水':
            elements.fishingArea.classList.add('sea');
            break;
        case '淡水':
            elements.fishingArea.classList.add('freshwater');
            break;
        case '湖泊':
            elements.fishingArea.classList.add('lake');
            break;
    }
}

// 更新時間視覺效果
function updateTimeVisuals() {
    elements.fishingArea.classList.remove('morning', 'noon', 'evening');
    
    switch (gameState.currentTime) {
        case '早上':
            elements.fishingArea.classList.add('morning');
            break;
        case '中午':
            elements.fishingArea.classList.add('noon');
            break;
        case '晚上':
            elements.fishingArea.classList.add('evening');
            break;
    }
}

// 定位釣魚元素
function positionFishingElements() {
    const fishingArea = document.querySelector('.fishing-area');
    const fisherman = document.querySelector('.fisherman');
    
    const fishermanRect = fisherman.getBoundingClientRect();
    const areaRect = fishingArea.getBoundingClientRect();
    
    const hookStartX = fishermanRect.left + fishermanRect.width - areaRect.left;
    const hookStartY = fishermanRect.top - areaRect.top;
    
    elements.fishHook.style.top = `${hookStartY}px`;
    elements.fishHook.style.left = `${hookStartX}px`;
    elements.fishHook.style.height = `${areaRect.height - hookStartY - 20}px`;
    
    elements.floatObject.style.top = `${hookStartY + 50}px`;
    elements.floatObject.style.left = `${hookStartX - 5}px`;
    
    elements.splash.style.top = `${hookStartY + 45}px`;
    elements.splash.style.left = `${hookStartX - 15}px`;
}

// 資料管理
function loadCaughtFish() {
    const savedFish = localStorage.getItem('caughtFish');
    if (savedFish) {
        gameState.caughtFish = JSON.parse(savedFish);
    }
}

function saveCaughtFish() {
    localStorage.setItem('caughtFish', JSON.stringify(gameState.caughtFish));
}

function updateCaughtCounter() {
    elements.caughtCounter.textContent = `已捕獲: ${gameState.caughtFish.length}/80`;
    elements.collectionCount.textContent = `(${gameState.caughtFish.length}/80)`;
}

// 顯示圖鑑
function showCollection() {
    console.log('顯示圖鑑');
    
    elements.collectionPanel.classList.remove('hidden');
    loadCollection();
}

// 載入圖鑑
function loadCollection() {
    // 清空圖鑑容器
    elements.fishCollection.innerHTML = '';
    
    // 獲取篩選條件
    const environmentFilter = document.getElementById('filter-environment').value;
    const timeFilter = document.getElementById('filter-time').value;
    const rarityFilter = document.getElementById('filter-rarity').value;
    
    // 獲取捕獲的魚的ID
    const caughtFishIds = gameState.caughtFish.map(fish => fish.id);
    
    // 篩選顯示所有魚
    let visibleFish = fishDatabase.filter(fish => {
        if (environmentFilter !== 'all' && fish.environment !== environmentFilter) return false;
        if (timeFilter !== 'all' && fish.time !== timeFilter) return false;
        if (rarityFilter !== 'all' && fish.rarity !== parseInt(rarityFilter)) return false;
        return true;
    });
    
    // 排序魚類: 優先顯示已捕獲的，然後按稀有度、再按ID排序
    visibleFish.sort((a, b) => {
        const aIsCaught = caughtFishIds.includes(a.id);
        const bIsCaught = caughtFishIds.includes(b.id);
        
        // 首先按捕獲與否排序
        if (aIsCaught && !bIsCaught) return -1;
        if (!aIsCaught && bIsCaught) return 1;
        
        // 然後按稀有度排序
        if (a.rarity !== b.rarity) return b.rarity - a.rarity;
        
        // 最後按ID排序
        return a.id - b.id;
    });
    
    // 生成魚卡片
    visibleFish.forEach(fish => {
        const isCaught = caughtFishIds.includes(fish.id);
        const card = createFishCard(fish, isCaught);
        elements.fishCollection.appendChild(card);
    });
    
    // 更新圖鑑計數
    elements.collectionCount.textContent = `(${caughtFishIds.length}/${fishDatabase.length})`;
}

// 創建魚卡片
function createFishCard(fish, isCaught) {
    const card = document.createElement('div');
    card.className = `fish-card ${isCaught ? 'caught' : 'locked'}`;
    
    // 卡片內容 - 先創建HTML結構
    let cardHTML = `
        <div class="fish-card-image">
            ${isCaught 
                ? '' // 圖片將在後面動態添加
                : `<div class="fish-card-image-overlay"><i class="fas fa-question"></i></div>`
            }
            <div class="fish-card-rarity rarity-${fish.rarity}"></div>
        </div>
        <div class="fish-card-info">
            <div class="fish-card-name">${isCaught ? fish.name : '???'}</div>
            <div class="fish-card-attributes">
                ${isCaught 
                    ? `${fish.environment} | ${fish.time}`
                    : `<span class="fish-hint">提示: ${getFishHint(fish)}</span>`
                }
            </div>
    `;
    
    // 添加提示圖標
    if (!isCaught) {
        cardHTML += `<div class="fish-card-hint" data-fish-id="${fish.id}"><i class="fas fa-info-circle"></i></div>`;
    }
    
    cardHTML += `</div>`;
    
    // 設置卡片的HTML內容
    card.innerHTML = cardHTML;
    
    // 對於已捕獲的魚，動態創建並添加圖片元素，避免HTML字符串顯示問題
    if (isCaught) {
        const imgContainer = card.querySelector('.fish-card-image');
        const img = document.createElement('img');
        img.src = fish.image;
        img.alt = fish.name;
        img.onerror = function() { 
            this.onerror = null; 
            this.src = window.defaultFishImage;
        };
        // 將圖片插入到容器的最前面
        imgContainer.insertBefore(img, imgContainer.firstChild);
    }
    
    // 添加提示事件
    if (!isCaught) {
        const hintIcon = card.querySelector('.fish-card-hint');
        if (hintIcon) {
            hintIcon.addEventListener('mouseenter', showFishHintTooltip);
            hintIcon.addEventListener('mouseleave', hideFishHintTooltip);
        }
    }
    
    return card;
}

// 獲取魚類提示工具提示
function showFishHintTooltip(event) {
    const fishId = parseInt(event.currentTarget.getAttribute('data-fish-id'));
    const fish = fishDatabase.find(f => f.id === fishId);
    
    if (!fish) return;
    
    // 創建工具提示元素
    let tooltip = document.getElementById('fish-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'fish-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    // 設置內容 - 使用DOM API而不是innerHTML，避免XSS和編碼問題
    tooltip.innerHTML = ''; // 清空內容
    
    const contentDiv = document.createElement('div');
    
    const strongEl = document.createElement('strong');
    strongEl.textContent = '捕獲提示:';
    contentDiv.appendChild(strongEl);
    
    contentDiv.appendChild(document.createElement('br'));
    
    const envText = document.createTextNode(`環境: ${fish.environment}`);
    contentDiv.appendChild(envText);
    contentDiv.appendChild(document.createElement('br'));
    
    const timeText = document.createTextNode(`時間: ${fish.time}`);
    contentDiv.appendChild(timeText);
    contentDiv.appendChild(document.createElement('br'));
    
    const rarityText = document.createTextNode(`稀有度: ${['', '普通', '高級', '稀有', '傳說'][fish.rarity]}`);
    contentDiv.appendChild(rarityText);
    
    tooltip.appendChild(contentDiv);
    
    // 定位工具提示
    const rect = event.currentTarget.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 5 + 'px';
    
    // 顯示工具提示
    tooltip.classList.add('visible');
}

// 隱藏提示工具提示
function hideFishHintTooltip() {
    const tooltip = document.getElementById('fish-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

// 獲取魚類提示
function getFishHint(fish) {
    let hint = '';
    
    // 基於環境的提示
    switch (fish.environment) {
        case '沿岸':
            hint += '靠近海岸的淺水區';
            break;
        case '海水':
            hint += '深海水域';
            break;
        case '淡水':
            hint += '河流中';
            break;
        case '湖泊':
            hint += '寧靜的湖泊';
            break;
    }
    
    // 添加時間提示
    hint += ` ${fish.time}出沒`;
    
    return hint;
}

// 圖鑑相關
function filterCollection() {
    loadCollection();
}

// 重新開始冒險
function confirmRestart() {
    if (confirm('確定要重新開始冒險嗎？所有捕獲的魚類都將被清除！')) {
        gameState.caughtFish = [];
        saveCaughtFish();
        updateCaughtCounter();
        resetGame();
        updateStatusMessage('冒險已重新開始！所有記錄已清除。');
    }
}

// 更新收集進度
function updateCollectionProgress() {
    // 全局收集進度
    const totalCount = fishDatabase.length;
    const caughtCount = gameState.caughtFish.length;
    const percentage = Math.floor((caughtCount / totalCount) * 100);
    
    // 更新全局進度指示器
    updateCaughtCounter();
    
    // 按環境更新收集進度
    updateEnvironmentProgress();
}

// 更新每個環境的收集進度
function updateEnvironmentProgress() {
    // 定義環境
    const environments = ['沿岸', '海水', '淡水', '湖泊'];
    
    // 為每個環境計算收集率
    for(const env of environments) {
        // 計算該環境的總魚數
        const envFishCount = fishDatabase.filter(fish => fish.environment === env).length;
        
        // 計算已捕獲的該環境的魚數
        const caughtEnvFishCount = gameState.caughtFish.filter(
            fish => fishDatabase.find(f => f.id === fish.id)?.environment === env
        ).length;
        
        // 計算百分比
        const percentage = envFishCount > 0 ? Math.floor((caughtEnvFishCount / envFishCount) * 100) : 0;
        
        // 更新環境按鈕上的進度
        const envButton = Array.from(elements.environmentBtns).find(
            button => button.getAttribute('data-environment') === env
        );
        
        if(envButton) {
            // 移除舊的進度顯示
            const oldProgress = envButton.querySelector('.env-progress');
            if(oldProgress) oldProgress.remove();
            
            // 創建新的進度顯示
            const progressElement = document.createElement('span');
            progressElement.className = 'env-progress';
            progressElement.textContent = `${caughtEnvFishCount}/${envFishCount}`;
            envButton.appendChild(progressElement);
        }
    }
}

// 重置遊戲
function resetGame() {
    gameState.status = 'ready';
    gameState.currentFish = null;
    gameState.selectedRarity = null;
    
    // 隱藏所有釣魚元素
    elements.fishHook.classList.add('hidden');
    elements.floatObject.classList.add('hidden');
    elements.splash.classList.add('hidden');
    elements.wheelContainer.classList.add('hidden');
    
    // 重置按鈕
    elements.castBtn.textContent = '釣魚！';
    elements.castBtn.disabled = false;
    
    // 更新提示文字
    updateStatusMessage('準備開始釣魚吧！');
}

// 開始隨機顯示魚影
function startRandomFishAppearance() {
    // 清除可能存在的舊計時器
    if(gameState.randomFishAppearance.timer) {
        clearTimeout(gameState.randomFishAppearance.timer);
    }
    
    // 創建魚影元素(如果不存在)
    let fishShadow = document.querySelector('.fish-shadow');
    if(!fishShadow) {
        fishShadow = document.createElement('div');
        fishShadow.className = 'fish-shadow hidden';
        elements.fishingArea.appendChild(fishShadow);
    }
    
    // 設置下一次魚影出現的計時器 (縮短間隔80%)
    const setNextFishAppearance = () => {
        const minTime = gameState.randomFishAppearance.interval[0] * 0.2; // 縮短80%
        const maxTime = gameState.randomFishAppearance.interval[1] * 0.2; // 縮短80%
        const delay = minTime + Math.random() * (maxTime - minTime);
        
        gameState.randomFishAppearance.timer = setTimeout(() => {
            if(gameState.status === 'fishing') {
                showFishShadow();
                setNextFishAppearance();
            }
        }, delay);
    };
    
    setNextFishAppearance();
}

// 顯示魚影
function showFishShadow() {
    const fishShadow = document.querySelector('.fish-shadow');
    if(!fishShadow) return;
    
    // 隨機位置
    const minLeft = 10;
    const maxLeft = elements.fishingArea.offsetWidth - 100;
    const left = minLeft + Math.random() * (maxLeft - minLeft);
    
    // 設置魚影大小和位置
    const size = 30 + Math.random() * 50; // 30-80px
    fishShadow.style.width = `${size}px`;
    fishShadow.style.height = `${size * 0.6}px`;
    fishShadow.style.left = `${left}px`;
    
    // 顯示魚影
    fishShadow.classList.remove('hidden');
    
    // 魚影動畫
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    fishShadow.style.animationName = `fish-swim-${direction}`;
    fishShadow.style.animationDuration = `${0.2 + Math.random() * 0.4}s`; // 縮短80%，從1-3s到0.2-0.6s
    
    // 一段時間後隱藏
    setTimeout(() => {
        fishShadow.classList.add('hidden');
    }, 400); // 縮短80%，從2000ms到400ms
}

// 停止魚影顯示
function stopRandomFishAppearance() {
    if(gameState.randomFishAppearance.timer) {
        clearTimeout(gameState.randomFishAppearance.timer);
        gameState.randomFishAppearance.timer = null;
    }
    
    // 隱藏現有魚影
    const fishShadow = document.querySelector('.fish-shadow');
    if(fishShadow) {
        fishShadow.classList.add('hidden');
    }
}

// 新函數：根據稀有度嚴格選擇魚
function selectFishByRarity(targetRarity) {
    // 先嘗試完全匹配條件的魚
    const perfectMatchFish = fishDatabase.filter(fish => 
        fish.rarity === targetRarity && 
        fish.environment === gameState.currentEnvironment &&
        fish.time === gameState.currentTime
    );
    
    if (perfectMatchFish.length > 0) {
        // 有完全匹配的魚，隨機選擇一條
        const selected = perfectMatchFish[Math.floor(Math.random() * perfectMatchFish.length)];
        console.log('找到完全匹配的魚:', selected.name, 
                   '稀有度:', selected.rarity, 
                   '環境:', selected.environment, 
                   '時間:', selected.time);
        return selected;
    } 
    
    // 退而求其次，只匹配稀有度
    const rarityMatchFish = fishDatabase.filter(fish => fish.rarity === targetRarity);
    
    if (rarityMatchFish.length > 0) {
        const selected = rarityMatchFish[Math.floor(Math.random() * rarityMatchFish.length)];
        console.log('找到稀有度匹配的魚:', selected.name, 
                   '稀有度:', selected.rarity, 
                   '(環境/時間不匹配)');
        return selected;
    } 
    
    // 最後備選：隨機選一條魚，但修改其稀有度以匹配轉盤結果
    const randomFish = {...fishDatabase[Math.floor(Math.random() * fishDatabase.length)]};
    randomFish.rarity = targetRarity; // 強制設置稀有度與轉盤結果一致
    console.log('無匹配魚，使用修改稀有度的備選魚:', randomFish.name, 
               '原稀有度:', fishDatabase.find(f => f.id === randomFish.id).rarity,
               '調整為:', targetRarity);
    
    return randomFish;
}

// 渲染魚類圖鑑
function renderFishCollection() {
    // 清空圖鑑容器
    elements.fishCollection.innerHTML = '';
    
    // 獲取篩選條件
    const environmentFilter = document.getElementById('filter-environment').value;
    const timeFilter = document.getElementById('filter-time').value;
    const rarityFilter = document.getElementById('filter-rarity').value;
    
    // 獲取捕獲的魚的ID
    const caughtFishIds = gameState.caughtFish.map(fish => fish.id);
    
    // 篩選顯示所有魚
    let visibleFish = fishDatabase.filter(fish => {
        if (environmentFilter !== 'all' && fish.environment !== environmentFilter) return false;
        if (timeFilter !== 'all' && fish.time !== timeFilter) return false;
        if (rarityFilter !== 'all' && fish.rarity !== parseInt(rarityFilter)) return false;
        return true;
    });
    
    // 排序魚類: 優先顯示已捕獲的，然後按稀有度、再按ID排序
    visibleFish.sort((a, b) => {
        const aIsCaught = caughtFishIds.includes(a.id);
        const bIsCaught = caughtFishIds.includes(b.id);
        
        // 首先按捕獲與否排序
        if (aIsCaught && !bIsCaught) return -1;
        if (!aIsCaught && bIsCaught) return 1;
        
        // 然後按稀有度排序
        if (a.rarity !== b.rarity) return b.rarity - a.rarity;
        
        // 最後按ID排序
        return a.id - b.id;
    });
    
    // 生成魚卡片
    visibleFish.forEach(fish => {
        const isCaught = caughtFishIds.includes(fish.id);
        const card = createFishCard(fish, isCaught);
        elements.fishCollection.appendChild(card);
    });
    
    // 更新圖鑑計數
    elements.collectionCount.textContent = `(${caughtFishIds.length}/${fishDatabase.length})`;
}

// 初始化環境
function initEnvironments() {
    // 設置初始環境
    const initialEnv = '沿岸';
    gameState.currentEnvironment = initialEnv;
    
    // 更新環境按鈕
    elements.environmentBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-environment') === initialEnv);
    });
    
    // 更新視覺效果
    updateEnvironmentVisuals();
    
    // 初始化環境收集進度
    updateEnvironmentProgress();
}

// 開始時間變化循環
function startTimeChangeCycle() {
    // 清除可能存在的舊計時器
    if (window.timeChangeTimer) {
        clearInterval(window.timeChangeTimer);
    }
    
    const times = ['早上', '中午', '晚上'];
    gameState.currentTime = times[Math.floor(Math.random() * times.length)];
    updateTimeDisplay();
    updateTimeVisuals();
    
    // 設置時間變化定時器
    window.timeChangeTimer = setInterval(() => {
        const currentIndex = times.indexOf(gameState.currentTime);
        const nextIndex = (currentIndex + 1) % times.length;
        gameState.currentTime = times[nextIndex];
        
        updateTimeDisplay();
        updateTimeVisuals();
        showTimeChangeNotification();
    }, params.timeChangeInterval);
}

// 頁面載入時初始化遊戲
window.addEventListener('DOMContentLoaded', initGame);
