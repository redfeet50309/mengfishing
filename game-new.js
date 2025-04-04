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
    wheelContainer: document.querySelector('.wheel-container'),
    wheel: document.getElementById('wheel'),
    wheelResult: document.querySelector('.wheel-result'),
    rarityResult: document.getElementById('rarity-result'),
    stopWheel: document.getElementById('stop-wheel'),
    catchFish: document.getElementById('catch-fish'),
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

// 遊戲參數
const params = {
    timeChangeInterval: 5 * 60 * 1000, // 時間變化間隔，5分鐘
    wheelSpinTime: {
        min: 400, // 最短轉動時間(毫秒)，縮短80%
        max: 800  // 最長轉動時間(毫秒)，縮短80%
    },
    fishShadowInterval: {
        min: 5000,  // 最小間隔(毫秒)
        max: 15000  // 最大間隔(毫秒)
    }
};

// 轉盤相關變數
let wheelSpinning = false;
let currentRotation = 0;
let rotationSpeed = 0;

// 稀有度機率和角度範圍
const RARITY_CONFIG = {
    // 稀有度設定: 機率 + 角度範圍 (從頂部0度順時針)
    1: { name: "普通", weight: 50, color: "#4CAF50", angles: [0, 180] },
    2: { name: "高級", weight: 30, color: "#2196F3", angles: [180, 288] },
    3: { name: "稀有", weight: 15, color: "#9C27B0", angles: [288, 342] },
    4: { name: "傳說", weight: 5, color: "#FFC107", angles: [342, 360] }
};

// 初始化遊戲
function initGame() {
    loadCaughtFish();
    updateCaughtCounter();
    setupEventListeners();
    initEnvironments();
    startTimeChangeCycle();
    
    console.log('遊戲初始化完成');
}

// 更新事件監聽器
function setupEventListeners() {
    // 釣魚按鈕
    elements.castBtn.addEventListener('click', startFishing);
    
    // 轉盤相關
    elements.stopWheel.addEventListener('click', stopWheel);
    elements.catchFish.addEventListener('click', handleContinueFishing);
    elements.continueBtn.addEventListener('click', handleContinueFishing);
    
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
    
    gameState.status = 'fishing';
    elements.castBtn.disabled = true;
    elements.castBtn.textContent = '釣魚中...';
    
    updateStatusMessage('甩出釣竿...');
    
    // 顯示釣魚動畫
    elements.fishHook.classList.remove('hidden');
    elements.floatObject.classList.remove('hidden');
    setTimeout(() => {
        elements.splash.classList.remove('hidden');
        setTimeout(() => elements.splash.classList.add('hidden'), 100);
    }, 60);
    
    // 短暫等待後顯示轉盤
    setTimeout(() => {
        // 停止魚影顯示
        stopRandomFishAppearance();
        
        // 顯示轉盤
        elements.wheelContainer.classList.remove('hidden');
        
        // 啟動轉盤
        startWheelSpin();
        
        // 更新提示
        updateStatusMessage('轉動稀有度轉盤！點擊停止獲得魚！');
        
        // 更新按鈕文字
        updateWheelButtonStyle('active');
    }, 500);
}

// 啟動轉盤
function startWheelSpin() {
    console.log('開始轉動轉盤');
    
    // 確保轉盤元素已重置
    elements.wheel.style.transition = 'none';
    elements.wheel.classList.remove('spinning', 'slowing-down');
    elements.wheel.style.transform = 'rotate(0deg)';
    
    // 強制重繪元素以應用上述更改
    elements.wheel.offsetHeight;
    
    // 隱藏之前的結果
    elements.wheelResult.style.display = 'none';
    
    // 開始轉動
    wheelSpinning = true;
    currentRotation = 0;
    
    // 初始化轉盤配置
    window.wheelConfig = {
        startTime: Date.now(),
        initialSpeed: 25,
        finalSpeed: 5,
        autoStopTime: 15000, // 最長15秒後自動停止
        isSlowingDown: false
    };
    
    // 添加轉動樣式
    elements.wheel.classList.add('spinning');
    elements.wheel.style.transition = 'transform 0.1s linear';
    
    // 開始轉盤動畫
    requestAnimationFrame(animateWheel);
    
    // 更新按鈕文字
    elements.stopWheel.textContent = '點擊停止轉盤';
    elements.stopWheel.disabled = false;
    
    // 設置自動停止計時器
    setTimeout(() => {
        if (wheelSpinning && !window.wheelConfig.isSlowingDown) {
            stopWheel();
        }
    }, window.wheelConfig.autoStopTime);
}

// 轉盤動畫函數
function animateWheel(timestamp) {
    if (!wheelSpinning) return;
    
    const config = window.wheelConfig;
    if (!config) return;
    
    // 如果已經在減速階段，使用CSS過渡
    if (config.isSlowingDown) return;
    
    // 正常旋轉階段
    elements.wheel.classList.add('spinning');
    
    // 計算轉盤速度和角度
    const speed = config.initialSpeed;
    currentRotation += speed;
    elements.wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    // 繼續動畫
    requestAnimationFrame(animateWheel);
}

// 停止轉盤
function stopWheel() {
    console.log('停止轉盤');
    
    if (!wheelSpinning || !window.wheelConfig || window.wheelConfig.isSlowingDown) {
        return;
    }
    
    // 標記減速開始
    window.wheelConfig.isSlowingDown = true;
    
    // 減速效果
    elements.wheel.classList.remove('spinning');
    elements.wheel.classList.add('slowing-down');
    
    // 計算目標角度（再轉1-2圈）
    const extraRotation = 360 + Math.random() * 360;
    const targetAngle = currentRotation + extraRotation;
    
    // 設置過渡效果
    elements.wheel.style.transition = 'transform 1.5s cubic-bezier(0.33, 1, 0.68, 1)';
    elements.wheel.style.transform = `rotate(${targetAngle}deg)`;
    
    // 禁用按鈕
    elements.stopWheel.disabled = true;
    elements.stopWheel.textContent = '轉盤減速中...';
    
    // 更新提示
    updateStatusMessage('轉盤正在停止...');
    
    // 轉盤停止後處理結果
    setTimeout(() => {
        // 更新角度
        currentRotation = targetAngle;
        
        // 結束轉盤
        wheelSpinning = false;
        
        // 計算稀有度
        determineResult();
    }, 1500);
}

// 計算轉盤結果
function determineResult() {
    // 標準化角度（0-360度）
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    
    // 映射到稀有度，使用頂部為0度的方式計算
    // 傳說: 5% -> 0-18°
    // 稀有: 15% -> 18-72°
    // 高級: 30% -> 72-180°
    // 普通: 50% -> 180-360°
    const angleFromTop = (360 - normalizedRotation + 90) % 360;
    
    let rarityValue = 1;
    
    if (angleFromTop < 18) {
        rarityValue = 4; // 傳說
    } else if (angleFromTop < 72) {
        rarityValue = 3; // 稀有
    } else if (angleFromTop < 180) {
        rarityValue = 2; // 高級
    } else {
        rarityValue = 1; // 普通
    }
    
    // 保存結果
    gameState.selectedRarity = rarityValue;
    
    // 顯示結果文字
    const rarityText = ['', '普通', '高級', '稀有', '傳說'];
    elements.rarityResult.innerText = rarityText[rarityValue];
    elements.rarityResult.className = `rarity-${rarityValue}`;
    
    // 顯示結果面板
    elements.wheelResult.style.display = 'block';
    
    console.log(`轉盤停止，角度: ${angleFromTop}°，稀有度: ${rarityText[rarityValue]}`);
    
    // 選擇魚
    const fish = selectFishByRarity(rarityValue);
    gameState.currentFish = fish;
    
    // 更新狀態
    updateStatusMessage(`你獲得了${rarityText[rarityValue]}稀有度！點擊繼續釣魚！`);
}

// 繼續釣魚（同一處理兩個按鈕的點擊）
function handleContinueFishing() {
    console.log('繼續釣魚');
    
    // 隱藏面板
    elements.wheelContainer.classList.add('hidden');
    elements.fishCaughtPanel.classList.add('hidden');
    
    // 添加魚到收藏
    if (gameState.currentFish) {
        const fish = gameState.currentFish;
        
        // 判斷是否是新魚
        const isNewFish = !gameState.caughtFish.some(f => f.id === fish.id);
        
        // 添加到捕獲列表（如果是新魚）
        if (isNewFish) {
            gameState.caughtFish.push(fish);
            saveCaughtFish();
            updateCaughtCounter();
            
            // 顯示獲得新魚的通知
            showFishNotification(fish, true);
        } else {
            // 顯示捕獲魚的通知
            showFishNotification(fish, false);
        }
    }
    
    // 重置釣魚狀態
    resetFishingState();
}

// 顯示魚捕獲通知
function showFishNotification(fish, isNew) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = 'fish-notification';
    
    const rarityText = ['', '普通', '高級', '稀有', '傳說'][fish.rarity];
    
    notification.innerHTML = `
        <img src="${fish.image}" alt="${fish.name}">
        <div class="notification-content">
            <h3>${isNew ? '發現新魚！' : '釣到魚了！'}</h3>
            <div class="fish-name">${fish.name}</div>
            <div class="fish-rarity rarity-${fish.rarity}">${rarityText}</div>
        </div>
    `;
    
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

// 重置釣魚狀態
function resetFishingState() {
    gameState.status = 'ready';
    gameState.currentFish = null;
    
    // 隱藏釣魚元素
    elements.fishHook.classList.add('hidden');
    elements.floatObject.classList.add('hidden');
    
    // 重置按鈕
    elements.castBtn.textContent = '釣魚！';
    elements.castBtn.disabled = false;
    
    // 更新提示文字
    updateStatusMessage('準備開始釣魚吧！');
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

function updateStatusMessage(message) {
    elements.statusText.textContent = message;
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
    
    // 卡片內容
    let cardHTML = `
        <div class="fish-card-image">
            ${isCaught 
                ? `<img src="${fish.image}" alt="${fish.name}">`
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
    card.innerHTML = cardHTML;
    
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

// 顯示提示工具提示
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
    
    // 設置內容
    tooltip.innerHTML = `
        <div>
            <strong>捕獲提示:</strong><br>
            環境: ${fish.environment}<br>
            時間: ${fish.time}<br>
            稀有度: ${['', '普通', '高級', '稀有', '傳說'][fish.rarity]}
        </div>
    `;
    
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
    elements.stopWheel.disabled = false;
    
    // 修復: 重置轉盤相關狀態
    elements.wheel.style.transform = 'rotate(0deg)';
    currentRotation = 0;
    wheelSpinning = false;
    window.wheelIsSlowingDown = false;
    
    // 移除原有的重置代碼，已在finishWheelSpin中處理
    
    updateStatusMessage('準備開始釣魚吧！');
}

// 更新轉盤按鈕樣式
function updateWheelButtonStyle(state) {
    const btn = elements.stopWheel;
    if (!btn) return;
    
    switch (state) {
        case 'active':
            // 可點擊的活躍狀態
            btn.disabled = false;
            btn.style.backgroundColor = '#f44336';
            btn.style.color = 'white';
            btn.style.animation = 'pulse 1s infinite';
            btn.style.cursor = 'pointer';
            btn.textContent = '點擊停止轉盤';
            break;
            
        case 'disabled':
            // 禁用狀態
            btn.disabled = true;
            btn.style.backgroundColor = '#888';
            btn.style.color = '#ddd';
            btn.style.animation = 'none';
            btn.style.cursor = 'default';
            btn.textContent = '轉盤減速中...';
            break;
            
        case 'ready':
            // 準備狀態
            btn.disabled = false;
            btn.style.backgroundColor = '#f44336';
            btn.style.color = 'white';
            btn.style.animation = 'none';
            btn.style.cursor = 'pointer';
            btn.textContent = '停止轉盤';
            break;
    }
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
