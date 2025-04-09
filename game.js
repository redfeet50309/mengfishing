// 遊戲狀態
const gameState = {
    status: 'ready', // ready, casting, waiting, bite, reeling, success, failed, spinning
    caughtFish: [],
    currentFish: null,
    canCatch: false,
    selectedRarity: null, // 轉盤選擇的稀有度
    wheelSpinning: false,
    currentEnvironment: '沿岸', // 預設環境
    currentTime: '早上' // 預設時間
};

// DOM元素
const elements = {
    castBtn: document.getElementById('cast-btn'),
    pullBtn: document.getElementById('pull-btn'),
    statusText: document.getElementById('status-text'),
    fishHook: document.getElementById('fish-hook'),
    floatObject: document.getElementById('float-object'),
    splash: document.getElementById('splash'),
    fishCaughtPanel: document.getElementById('fish-caught-panel'),
    caughtFishImg: document.getElementById('caught-fish-img'),
    caughtFishName: document.getElementById('caught-fish-name'),
    caughtFishRarity: document.getElementById('caught-fish-rarity'),
    caughtFishEnvironmentTime: document.getElementById('caught-fish-environment-time'),
    caughtFishDesc: document.getElementById('caught-fish-desc'),
    continueBtn: document.getElementById('continue-btn'),
    collectionBtn: document.getElementById('collection-btn'),
    collectionPanel: document.getElementById('collection-panel'),
    fishCollection: document.getElementById('fish-collection'),
    closeCollectionBtn: document.getElementById('close-collection-btn'),
    caughtFishCount: document.getElementById('caught-fish'),
    collectionCount: document.getElementById('collection-count'),
    fishShadow: document.querySelector('.fish-shadow'),
    // 轉盤元素
    wheelContainer: document.querySelector('.wheel-container'),
    wheel: document.getElementById('wheel'),
    stopWheelBtn: document.getElementById('stop-wheel'),
    wheelResult: document.querySelector('.wheel-result'),
    rarityResult: document.getElementById('rarity-result'),
    catchFishBtn: document.getElementById('catch-fish'),
    // 重新開始冒險按鈕
    restartAdventureBtn: document.getElementById('restart-adventure-btn'),
    // 環境與時間元素
    fishingArea: document.querySelector('.fishing-area'),
    environmentButtons: document.querySelectorAll('.environment-btn'),
    currentTimeDisplay: document.getElementById('current-time'),
    // 圖鑑篩選器
    filterEnvironment: document.getElementById('filter-environment'),
    filterTime: document.getElementById('filter-time'),
    filterRarity: document.getElementById('filter-rarity')
};

// 系統參數
const params = {
    castingTime: 500,
    minWaitTime: 3000,
    maxWaitTime: 15000,
    catchWindow: 1500,
    wheelMinRotations: 5, // 轉盤最少旋轉圈數
    wheelMaxRotations: 10, // 轉盤最多旋轉圈數
    timeChangeInterval: 5 * 60 * 1000 // 5分鐘切換一次時間
};

// 轉盤相關變數
let wheelSpinning = false;
let fishingStatus = null;
let currentRarity = null;
let isPointerBaseAdded = false;
let currentRotation = 0; // 初始化轉盤角度
let slowDown = false; // 初始化減速標記
let timeChangeTimer; // 時間變換計時器

// 遊戲初始化
function initGame() {
    // 載入已捕獲的魚類
    loadCaughtFish();
    
    // 更新UI
    updateCaughtFishCount();
    
    // 綁定按鈕事件
    elements.castBtn.addEventListener('click', castLine);
    elements.continueBtn.addEventListener('click', () => {
        elements.fishCaughtPanel.classList.add('hidden');
        resetFishing(); // 點擊繼續按鈕後立即重置釣魚狀態
    });
    elements.collectionBtn.addEventListener('click', showCollection);
    elements.closeCollectionBtn.addEventListener('click', () => {
        elements.collectionPanel.classList.add('hidden');
    });
    
    // 綁定轉盤停止按鈕
    if (elements.stopWheelBtn) {
        console.log('綁定轉盤停止按鈕');
        // 移除可能存在的舊事件監聽器
        elements.stopWheelBtn.removeEventListener('click', stopWheelHandler);
        // 添加新的事件監聽器
        elements.stopWheelBtn.addEventListener('click', stopWheelHandler);
    }
    
    // 綁定繼續釣魚按鈕事件 - 修復轉盤結果後的繼續按鈕
    if (elements.catchFishBtn) {
        console.log('綁定繼續釣魚按鈕');
        elements.catchFishBtn.addEventListener('click', () => {
            console.log('點擊繼續釣魚按鈕');
            elements.wheelContainer.classList.add('hidden');
            startFishing(gameState.selectedRarity);
        });
    }
    
    // 綁定重新開始冒險按鈕事件
    elements.restartAdventureBtn.addEventListener('click', restartAdventure);
    
    // 綁定環境選擇按鈕事件
    elements.environmentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const environment = button.getAttribute('data-environment');
            changeEnvironment(environment);
        });
    });
    
    // 綁定圖鑑篩選器事件
    elements.filterEnvironment.addEventListener('change', filterCollection);
    elements.filterTime.addEventListener('change', filterCollection);
    elements.filterRarity.addEventListener('change', filterCollection);
    
    // 生成釣魚鉤和浮標
    positionFishingElements();
    
    // 處理視窗大小改變
    window.addEventListener('resize', positionFishingElements);
    
    // 隱藏魚影
    elements.fishShadow.classList.add('hidden');
    
    // 添加轉盤指針底座和說明文字
    if (!isPointerBaseAdded) {
        // 檢查是否已經存在指針底座
        if (!document.querySelector('.pointer-base')) {
            const pointerBase = document.createElement('div');
            pointerBase.className = 'pointer-base';
            document.querySelector('.wheel-area').appendChild(pointerBase);
        }
        
        isPointerBaseAdded = true;
    }
    
    // 初始設定轉盤旋轉為0度
    elements.wheel.style.transform = 'rotate(0deg)';
    
    // 隱藏結果區域
    elements.wheelResult.style.display = 'none';
    
    // 重置指針樣式
    const pointer = document.querySelector('.wheel-pointer');
    pointer.classList.remove('active');
    pointer.style.backgroundColor = '#f44336';
    
    // 初始化時間與環境
    initTimeCycle();
    updateEnvironmentVisuals();
    updateTimeVisuals();

    updateStatusMessage('準備開始釣魚吧！');
}

// 停止轉盤處理函數
function stopWheelHandler() {
    console.log('點擊停止轉盤按鈕');
    if (wheelSpinning) {
        slowDown = true;
    }
}

// 初始化時間循環系統
function initTimeCycle() {
    // 清除之前的計時器
    if (timeChangeTimer) {
        clearInterval(timeChangeTimer);
    }
    
    // 隨機設定初始時間
    const times = ['早上', '中午', '晚上'];
    gameState.currentTime = times[Math.floor(Math.random() * times.length)];
    updateTimeDisplay();
    updateTimeVisuals();
    
    // 設定時間變化計時器
    timeChangeTimer = setInterval(() => {
        // 按順序循環時間
        const currentIndex = times.indexOf(gameState.currentTime);
        const nextIndex = (currentIndex + 1) % times.length;
        gameState.currentTime = times[nextIndex];
        
        // 更新UI
        updateTimeDisplay();
        updateTimeVisuals();
        
        // 顯示通知
        showTimeChangeNotification();
    }, params.timeChangeInterval);

    // 測試模式：短間隔時間變化（開發時使用）
    /*
    setTimeout(() => {
        gameState.currentTime = times[(times.indexOf(gameState.currentTime) + 1) % times.length];
        updateTimeDisplay();
        updateTimeVisuals();
        showTimeChangeNotification();
    }, 10000);
    */
}

// 更新時間顯示
function updateTimeDisplay() {
    elements.currentTimeDisplay.textContent = gameState.currentTime;
    
    // 移除舊的時間圖標類
    elements.currentTimeDisplay.classList.remove('time-morning', 'time-noon', 'time-evening');
    
    // 添加新的時間圖標類
    switch (gameState.currentTime) {
        case '早上':
            elements.currentTimeDisplay.classList.add('time-morning');
            document.querySelector('.time-icon i').className = 'fas fa-sun';
            break;
        case '中午':
            elements.currentTimeDisplay.classList.add('time-noon');
            document.querySelector('.time-icon i').className = 'fas fa-sun';
            break;
        case '晚上':
            elements.currentTimeDisplay.classList.add('time-evening');
            document.querySelector('.time-icon i').className = 'fas fa-moon';
            break;
    }
}

// 顯示時間變化通知
function showTimeChangeNotification() {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.classList.add('time-change-notification');
    notification.textContent = `時間變成 ${gameState.currentTime} 了！`;
    document.body.appendChild(notification);
    
    // 3秒後移除通知
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 1000);
    }, 3000);
}

// 更改釣魚環境
function changeEnvironment(environment) {
    // 更新當前環境
    gameState.currentEnvironment = environment;
    
    // 更新UI
    elements.environmentButtons.forEach(button => {
        if (button.getAttribute('data-environment') === environment) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // 更新視覺效果
    updateEnvironmentVisuals();
    
    // 重置釣魚狀態
    resetFishing();
    
    // 顯示環境變更提示
    updateStatusMessage(`已切換到 ${environment} 環境！`);
}

// 更新環境視覺效果
function updateEnvironmentVisuals() {
    // 移除所有環境類別
    elements.fishingArea.classList.remove('coastal', 'sea', 'freshwater', 'lake');
    
    // 添加對應環境類別
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
    // 移除所有時間類別
    elements.fishingArea.classList.remove('morning', 'noon', 'evening');
    
    // 添加對應時間類別
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
    const areaWidth = fishingArea.offsetWidth;
    const areaHeight = fishingArea.offsetHeight;
    const fisherman = document.querySelector('.fisherman');
    
    // 獲取漁夫的位置
    const fishermanRect = fisherman.getBoundingClientRect();
    const areaRect = fishingArea.getBoundingClientRect();
    
    // 計算魚鉤起始位置（從漁夫頂部）
    const hookStartX = fishermanRect.left + fishermanRect.width - areaRect.left;
    const hookStartY = fishermanRect.top - areaRect.top;
    
    // 設置釣魚鉤的垂直線
    elements.fishHook.style.top = `${hookStartY}px`;
    elements.fishHook.style.left = `${hookStartX}px`;
    elements.fishHook.style.height = `${areaHeight - hookStartY - 20}px`;
    
    // 設置浮標位置
    elements.floatObject.style.top = `${hookStartY + 50}px`;
    elements.floatObject.style.left = `${hookStartX - 5}px`;
    
    // 設置水花位置
    elements.splash.style.top = `${hookStartY + 45}px`;
    elements.splash.style.left = `${hookStartX - 15}px`;
    
    console.log('釣魚元素位置已更新:', {
        hookStartX,
        hookStartY,
        fishermanRect,
        areaRect
    });
}

// 從本地儲存載入已捕獲的魚
function loadCaughtFish() {
    const savedFish = localStorage.getItem('caughtFish');
    if (savedFish) {
        gameState.caughtFish = JSON.parse(savedFish);
    }
}

// 保存捕獲的魚
function saveCaughtFish() {
    localStorage.setItem('caughtFish', JSON.stringify(gameState.caughtFish));
}

// 更新捕獲數量顯示
function updateCaughtFishCount() {
    elements.caughtFishCount.textContent = `已捕獲: ${gameState.caughtFish.length}/80`;
    elements.collectionCount.textContent = `(${gameState.caughtFish.length}/80)`;
}

// 甩竿
function castLine() {
    console.log('甩竿');
    
    // 只有在ready狀態才能甩竿
    if (gameState.status !== 'ready') {
        console.log('不在ready狀態，無法甩竿，當前狀態:', gameState.status);
        // 如果卡在其他狀態，嘗試重置
        resetFishing();
        return;
    }
    
    // 切換到轉盤狀態
    gameState.status = 'spinning';
    console.log('切換到轉盤狀態');
    
    // 顯示轉盤容器
    if (elements.wheelContainer) {
        elements.wheelContainer.classList.remove('hidden');
        elements.wheelContainer.style.display = 'flex';
        console.log('顯示轉盤容器');
    }
    
    // 啟動轉盤
    spinWheel();
    
    // 更新狀態信息
    updateStatusMessage('釣魚輪盤轉動中...請點擊停止按鈕！');
}

// 轉動轉盤
function spinWheel() {
    // 如果轉盤正在旋轉，不重複啟動
    if (wheelSpinning) return;
    
    console.log('開始轉動轉盤');
    
    // 更新轉盤狀態
    wheelSpinning = true;
    slowDown = false;
    gameState.wheelSpinning = true;
    
    // 啟用停止按鈕
    elements.castBtn.disabled = false;
    elements.castBtn.textContent = '點擊停止';
    elements.castBtn.removeEventListener('click', castLine);
    elements.castBtn.addEventListener('click', () => {
        console.log('點擊釣魚按鈕停止轉盤');
        slowDown = true;
    });
    
    // 設定轉盤旋轉動畫
    const minDegPerFrame = 5; // 最小旋轉速度
    const maxDegPerFrame = 15; // 最大旋轉速度
    const slowDownFactor = 0.95; // 減速因子
    const minRotationSpeed = 0.5; // 最低速度閾值
    
    let rotationSpeed = maxDegPerFrame;
    
    // 隨機魚兒
    const willGetFish = Math.random() > 0.2; // 80%的機會釣到魚
    
    // 重置轉盤角度，確保從0開始
    currentRotation = 0;
    elements.wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    function rotate() {
        // 更新轉盤角度 - 順時針旋轉
        currentRotation += rotationSpeed;
        elements.wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        // 處理減速
        if (slowDown) {
            rotationSpeed *= slowDownFactor;
            
            // 當速度低於閾值，停止旋轉
            if (rotationSpeed < minRotationSpeed) {
                finishWheelSpin(willGetFish);
                return;
            }
        }
        
        // 繼續旋轉
        requestAnimationFrame(rotate);
    }
    
    // 開始旋轉
    rotate();
    
    // 移除自動停止計時器 - 確保只有玩家手動點擊才能停止
}

// 完成轉盤旋轉
function finishWheelSpin(willGetFish) {
    console.log('完成轉盤旋轉，將獲得魚:', willGetFish);
    
    // 確保轉盤已經停止旋轉
    if(!slowDown) {
        console.log('轉盤尚未被手動停止，不執行結束操作');
        return;
    }
    
    wheelSpinning = false;
    gameState.wheelSpinning = false;
    
    // 移除釣魚按鈕的停止轉盤事件
    elements.castBtn.removeEventListener('click', () => {
        slowDown = true;
    });
    
    // 標準化角度到0-360度之間
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    console.log('原始轉盤角度:', currentRotation, '標準化角度:', normalizedRotation);
    
    // 更新後的角度分配 (以順時針方向計算):
    // 0-180度：普通 (綠色) - 50%
    // 180-288度：高級 (藍色) - 30%
    // 288-342度：稀有 (紫色) - 15%
    // 342-360度：傳說 (金色) - 5%
    let rarityValue;
    let rarityColor;
    
    if (normalizedRotation >= 0 && normalizedRotation < 180) {
        rarityValue = 1; // 普通 - 綠色區域 (50%)
        rarityColor = "#4CAF50";
    } else if (normalizedRotation >= 180 && normalizedRotation < 288) {
        rarityValue = 2; // 高級 - 藍色區域 (30%)
        rarityColor = "#2196F3";
    } else if (normalizedRotation >= 288 && normalizedRotation < 342) {
        rarityValue = 3; // 稀有 - 紫色區域 (15%)
        rarityColor = "#9C27B0";
    } else {
        rarityValue = 4; // 傳說 - 金色區域 (5%)
        rarityColor = "#FFC107";
    }
    
    console.log('轉盤最終結果計算:', {
        '轉盤角度': normalizedRotation,
        '對應稀有度': rarityValue,
        '稀有度文字': ['', '普通', '高級', '稀有', '傳說'][rarityValue],
        '對應顏色': rarityColor,
        '角度區域': (normalizedRotation >= 0 && normalizedRotation < 180) ? "0-180度 (普通)" :
                  (normalizedRotation >= 180 && normalizedRotation < 288) ? "180-288度 (高級)" :
                  (normalizedRotation >= 288 && normalizedRotation < 342) ? "288-342度 (稀有)" :
                  "342-360度 (傳說)"
    });
    
    // 儲存選中的稀有度以供後續使用
    gameState.selectedRarity = rarityValue;
    
    // 轉換稀有度為文字
    const rarityText = ['', '普通', '高級', '稀有', '傳說'];
    
    // 設置稀有度對應的樣式
    elements.rarityResult.textContent = rarityText[rarityValue];
    elements.rarityResult.className = ''; // 清除之前的類
    elements.rarityResult.classList.add(`rarity-${rarityValue}`); // 添加對應稀有度的樣式類
    
    // 顯示結果區域
    elements.wheelResult.style.display = 'block';
    
    // 直接釣魚按鈕
    if (willGetFish) {
        // 移除舊的按鈕事件，創建新按鈕
        if (elements.catchFishBtn) {
            const oldCatchBtn = elements.catchFishBtn;
            const newCatchBtn = oldCatchBtn.cloneNode(true);
            oldCatchBtn.parentNode.replaceChild(newCatchBtn, oldCatchBtn);
            elements.catchFishBtn = newCatchBtn;
            
            // 添加新事件
            elements.catchFishBtn.addEventListener('click', function() {
                console.log('點擊直接釣魚按鈕');
                // 隱藏轉盤容器
                if (elements.wheelContainer) {
                    elements.wheelContainer.classList.add('hidden');
                    elements.wheelContainer.style.display = 'none';
                }
                // 開始直接釣魚過程
                directFishing(rarityValue);
            });
        }
        
        // 更新主釣魚按鈕同樣行為
        if (elements.castBtn) {
            elements.castBtn.textContent = '釣魚！';
            
            // 移除舊的按鈕事件，創建新按鈕
            const oldElement = elements.castBtn;
            const newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
            elements.castBtn = newElement;
            
            // 添加新事件
            elements.castBtn.addEventListener('click', function() {
                console.log('點擊主釣魚按鈕');
                // 隱藏轉盤容器
                if (elements.wheelContainer) {
                    elements.wheelContainer.classList.add('hidden');
                    elements.wheelContainer.style.display = 'none';
                }
                // 開始直接釣魚過程
                directFishing(rarityValue);
            });
        }
    } else {
        // 釣魚失敗，重新開始按鈕
        if (elements.castBtn) {
            elements.castBtn.textContent = '重新開始';
            
            // 移除舊的按鈕事件，創建新按鈕
            const oldElement = elements.castBtn;
            const newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
            elements.castBtn = newElement;
            
            // 添加新事件
            elements.castBtn.addEventListener('click', function() {
                if (elements.wheelContainer) {
                    elements.wheelContainer.classList.add('hidden');
                    elements.wheelContainer.style.display = 'none';
                }
                resetFishing();
            });
        }
        updateStatusMessage('釣魚失敗，沒有魚上鉤！');
    }
}

// 直接釣魚過程（簡化版）
function directFishing(rarityValue) {
    console.log('開始直接釣魚過程，稀有度:', rarityValue);
    
    // 確保隱藏轉盤容器
    if (elements.wheelContainer) {
        elements.wheelContainer.classList.add('hidden');
        elements.wheelContainer.style.display = 'none';
    }
    
    // 設置遊戲狀態為施放釣竿
    gameState.status = 'casting';
    updateStatusMessage('拋出釣魚線...');
    
    // 顯示釣魚線和浮標
    elements.fishHook.classList.remove('hidden');
    elements.floatObject.classList.remove('hidden');
    
    // 播放水花動畫
    elements.splash.classList.remove('hidden');
    setTimeout(() => {
        elements.splash.classList.add('hidden');
    }, 500);
    
    // 簡化流程，直接選擇魚並完成釣魚
    setTimeout(() => {
        const fish = selectRandomFish(rarityValue);
        if (fish) {
            // 保存選中的魚
            gameState.currentFish = fish;
            // 直接進入釣魚成功
            gameState.status = 'reeling';
            updateStatusMessage('拉起釣魚線...');
            
            // 短暫延遲後顯示釣到魚
        setTimeout(() => {
                fishCaught();
            }, 1000);
        } else {
            // 沒有合適的魚，釣魚失敗
            failFishing('沒有發現匹配稀有度的魚...');
        }
    }, params.castingTime);
}

// 開始釣魚過程
function startFishing(rarityValue) {
    // 使用統一的簡化流程
    directFishing(rarityValue);
}

// 選擇一條適合稀有度、環境和時間的隨機魚
function selectRandomFish(rarityValue) {
    // 篩選符合條件的魚
    const eligibleFish = fishDatabase.filter(fish => 
        fish.rarity === rarityValue && 
        fish.environment === gameState.currentEnvironment &&
        fish.time === gameState.currentTime
    );
    
    if (eligibleFish.length === 0) {
        console.log('找不到符合條件的魚', {
            稀有度: rarityValue,
            環境: gameState.currentEnvironment,
            時間: gameState.currentTime
        });
        
        // 作為備選，嘗試只根據稀有度匹配
        const backupFish = fishDatabase.filter(fish => fish.rarity === rarityValue);
        if (backupFish.length > 0) {
            const randomIndex = Math.floor(Math.random() * backupFish.length);
            console.log('使用備選魚:', backupFish[randomIndex].name);
            return backupFish[randomIndex];
        }
        
        return null;
    }
    
    // 計算總概率
    const totalProbability = eligibleFish.reduce((sum, fish) => sum + fish.probability, 0);
    
    // 隨機選擇（根據概率權重）
    let randomValue = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    
    for (const fish of eligibleFish) {
        cumulativeProbability += fish.probability;
        if (randomValue <= cumulativeProbability) {
            console.log('選擇到的魚:', fish.name);
            return fish;
        }
    }
    
    // 保險起見，返回列表中的第一條魚
    console.log('預設選擇第一條魚:', eligibleFish[0].name);
    return eligibleFish[0];
}

// 顯示魚兒上鉤
function showFishBite() {
    console.log('魚兒上鉤，當前狀態:', gameState.status);
    
    if (gameState.status !== 'waiting') {
        console.log('狀態不正確，無法顯示魚上鉤');
        return;
    }
    
    // 切換到魚上鉤狀態
    gameState.status = 'bite';
    gameState.canCatch = true;
    
    // 播放浮標上鉤動畫
    if (elements.floatObject) {
        elements.floatObject.classList.add('bobbing');
    }
    
    // 顯示魚影
    if (elements.fishShadow) {
        elements.fishShadow.classList.remove('hidden');
        positionFishShadow();
    }
    
    // 更新遊戲狀態文字
    updateStatusMessage('魚兒上鉤了！快點擊拉起！');
    
    // 顯示拉起按鈕
    if (elements.pullBtn) {
        // 清除舊按鈕，避免重複綁定
        const oldPullBtn = elements.pullBtn;
        const newPullBtn = oldPullBtn.cloneNode(true);
        oldPullBtn.parentNode.replaceChild(newPullBtn, oldPullBtn);
        elements.pullBtn = newPullBtn;
        
        // 顯示按鈕並添加拉起事件
        elements.pullBtn.classList.remove('hidden');
        elements.pullBtn.addEventListener('click', reelIn);
        console.log('已添加拉起按鈕監聽器');
    } else {
        console.error('拉起按鈕元素不存在!');
    }
    
    // 設定魚逃跑的時間窗口
        setTimeout(() => {
        console.log('檢查魚是否逃跑，當前狀態:', gameState.status);
            if (gameState.status === 'bite') {
            console.log('魚兒逃跑了');
                gameState.canCatch = false;
            failFishing('魚兒逃跑了！');
            }
        }, params.catchWindow);
    }

// 隨機放置魚影
function positionFishShadow() {
    const fishingArea = document.querySelector('.fishing-area');
    const areaWidth = fishingArea.offsetWidth;
    const areaHeight = fishingArea.offsetHeight;
    
    // 水中區域（下半部分）
    const waterAreaTop = areaHeight * 0.4;
    const waterAreaHeight = areaHeight - waterAreaTop;
    
    // 隨機位置
    const randomLeft = Math.random() * (areaWidth - 100) + 50;
    const randomTop = waterAreaTop + Math.random() * (waterAreaHeight - 100);
    
    // 設置魚影位置
    elements.fishShadow.style.left = `${randomLeft}px`;
    elements.fishShadow.style.top = `${randomTop}px`;
}

// 拉起釣魚線
function reelIn() {
    console.log('嘗試拉起魚線，當前狀態:', gameState.status, '可捕獲:', gameState.canCatch);
    
    if (gameState.status !== 'bite' || !gameState.canCatch) {
        console.log('無法拉起魚線，狀態或捕獲條件不符');
        return;
    }
    
    // 設置遊戲狀態為拉起中
    gameState.status = 'reeling';
    console.log('開始拉起魚線');
    
    // 隱藏拉起按鈕並移除事件監聽器
    if (elements.pullBtn) {
        elements.pullBtn.classList.add('hidden');
        elements.pullBtn.removeEventListener('click', reelIn);
    }
    
    // 停止浮標動畫
    if (elements.floatObject) {
        elements.floatObject.classList.remove('bobbing');
    }
    
    // 隱藏魚影
    if (elements.fishShadow) {
        elements.fishShadow.classList.add('hidden');
    }
    
    // 更新狀態
    updateStatusMessage('拉起釣魚線...');
    
    // 延遲顯示釣到魚的結果
    setTimeout(() => {
        fishCaught();
    }, 1000);
}

// 釣到魚
function fishCaught() {
    // 設置遊戲狀態為成功
        gameState.status = 'success';
    
    // 獲取當前釣到的魚
    const fish = gameState.currentFish;
    
    if (!fish) {
        console.error('錯誤: 沒有選擇到魚!');
        failFishing('釣魚失敗，請重試');
        return;
    }
    
    console.log('成功釣到魚:', fish.name);
    
    // 檢查是否是新捕獲的魚
    const isNewFish = !gameState.caughtFish.includes(fish.id);
    
    // 更新已捕獲的魚清單
    if (isNewFish) {
        gameState.caughtFish.push(fish.id);
        saveCaughtFish();
        updateCaughtFishCount();
    }
    
    // 確保捕獲面板可見
    if (elements.fishCaughtPanel) {
        elements.fishCaughtPanel.style.display = 'block';
        elements.fishCaughtPanel.classList.remove('hidden');
    }
    
    // 設置魚的圖片
    if (elements.caughtFishImg) {
        elements.caughtFishImg.src = fish.image;
        elements.caughtFishImg.alt = fish.name;
        console.log('設置魚圖片:', fish.image);
    }
    
    // 設置魚的名稱
    if (elements.caughtFishName) {
        elements.caughtFishName.textContent = fish.name;
    }
    
    // 設置魚的稀有度
    const rarityText = ['', '普通', '高級', '稀有', '傳說'];
    if (elements.caughtFishRarity) {
        elements.caughtFishRarity.textContent = `稀有度: ${rarityText[fish.rarity]}`;
        elements.caughtFishRarity.className = '';
        elements.caughtFishRarity.classList.add(`rarity-${fish.rarity}`);
    }
    
    // 設置魚的環境和時間
    if (elements.caughtFishEnvironmentTime) {
        elements.caughtFishEnvironmentTime.textContent = `區域: ${fish.environment} | 時間: ${fish.time}`;
    }
    
    // 設置魚的描述
    if (elements.caughtFishDesc) {
        elements.caughtFishDesc.textContent = fish.description;
    }
    
    // 移除所有舊的新魚標識
    const oldBadges = document.querySelectorAll('.new-fish');
    oldBadges.forEach(badge => {
        if (badge.parentNode) badge.parentNode.removeChild(badge);
    });
    
    // 如果是新魚，添加新魚標識
    if (isNewFish) {
        const fishInfoElement = elements.fishCaughtPanel.querySelector('.fish-info');
        if (fishInfoElement) {
            const newFishBadge = document.createElement('div');
            newFishBadge.className = 'new-fish';
            newFishBadge.textContent = '新!';
            fishInfoElement.appendChild(newFishBadge);
        }
    }
    
    // 修改繼續按鈕文字和事件
    if (elements.continueBtn) {
        elements.continueBtn.textContent = isNewFish ? '查看圖鑑' : '繼續釣魚';
        
        // 清除舊的事件監聽器
        const oldBtn = elements.continueBtn;
        const newBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        elements.continueBtn = newBtn;
        
        // 添加新的點擊事件
        elements.continueBtn.addEventListener('click', function() {
            console.log('點擊繼續按鈕');
            elements.fishCaughtPanel.classList.add('hidden');
            
            if (isNewFish) {
                // 顯示圖鑑，並設置篩選器以顯示該魚
                elements.filterEnvironment.value = fish.environment;
                elements.filterTime.value = fish.time;
                elements.filterRarity.value = fish.rarity.toString();
                showCollection();
                
                // 在圖鑑中突出顯示該魚
                setTimeout(() => {
                    const fishItems = document.querySelectorAll('.fish-item');
                    fishItems.forEach(item => {
                        const fishName = item.querySelector('h3').textContent;
                        if (fishName === fish.name) {
                            item.classList.add('new-fish');
                            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                }, 300);
            } else {
                // 如果不是新魚，直接重置釣魚狀態
                resetFishing();
            }
        });
    }
    
    // 隱藏釣魚元素
    elements.fishHook.classList.add('hidden');
    elements.floatObject.classList.add('hidden');
    
    // 更新狀態
    updateStatusMessage('恭喜釣到魚！');
}

// 釣魚失敗
function failFishing(message) {
    gameState.status = 'failed';
    
    // 更新狀態文字
    updateStatusMessage(message);
    
    // 隱藏釣魚相關元素
    if (elements.fishHook) elements.fishHook.classList.add('hidden');
    if (elements.floatObject) {
        elements.floatObject.classList.add('hidden');
        elements.floatObject.classList.remove('bobbing');
    }
    if (elements.pullBtn) {
        elements.pullBtn.classList.add('hidden');
        elements.pullBtn.removeEventListener('click', reelIn);
    }
    if (elements.fishShadow) elements.fishShadow.classList.add('hidden');
    
    // 稍後重置釣魚狀態
    setTimeout(resetFishing, 3000);
}

// 重置釣魚狀態
function resetFishing() {
    console.log('重置釣魚狀態');
    
    // 重置遊戲狀態
    gameState.status = 'ready';
    gameState.currentFish = null;
    gameState.canCatch = false;
    
    // 隱藏釣魚相關元素
    if (elements.fishHook) elements.fishHook.classList.add('hidden');
    if (elements.floatObject) {
    elements.floatObject.classList.add('hidden');
        elements.floatObject.classList.remove('bobbing');
    }
    if (elements.pullBtn) elements.pullBtn.classList.add('hidden');
    if (elements.fishShadow) elements.fishShadow.classList.add('hidden');
    if (elements.wheelContainer) {
        elements.wheelContainer.classList.add('hidden');
        elements.wheelContainer.style.display = 'none';
    }
    if (elements.fishCaughtPanel) {
        elements.fishCaughtPanel.classList.add('hidden');
    }
    
    // 重置釣魚按鈕
    if (elements.castBtn) {
        elements.castBtn.textContent = '釣魚!';
        elements.castBtn.disabled = false;
        
        // 清除所有現有事件並創建新按鈕
        const oldElement = elements.castBtn;
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
        elements.castBtn = newElement;
        
        // 添加新的甩竿事件
        elements.castBtn.addEventListener('click', castLine);
    }
    
    // 更新狀態
    updateStatusMessage('準備好釣魚了嗎？');
    
    // 移除新魚標識
    const newFishBadges = document.querySelectorAll('.new-fish');
    newFishBadges.forEach(badge => {
        if (badge && badge.parentNode) {
            badge.parentNode.removeChild(badge);
        }
    });
    
    console.log('釣魚狀態已重置，目前狀態:', gameState.status);
}

// 顯示圖鑑
function showCollection() {
    // 清空現有圖鑑內容
    elements.fishCollection.innerHTML = '';
    
    // 獲取篩選條件
    const envFilter = elements.filterEnvironment.value;
    const timeFilter = elements.filterTime.value;
    const rarityFilter = elements.filterRarity.value;
    
    // 篩選並排序魚類
    let fishesToShow = [...fishDatabase];
    
    // 應用篩選條件
    if (envFilter !== 'all') {
        fishesToShow = fishesToShow.filter(fish => fish.environment === envFilter);
    }
    if (timeFilter !== 'all') {
        fishesToShow = fishesToShow.filter(fish => fish.time === timeFilter);
    }
    if (rarityFilter !== 'all') {
        fishesToShow = fishesToShow.filter(fish => fish.rarity === parseInt(rarityFilter));
    }
    
    // 按ID排序
    fishesToShow.sort((a, b) => a.id - b.id);
    
    // 為每條魚創建圖鑑條目
    fishesToShow.forEach(fish => {
        const fishElement = document.createElement('div');
        fishElement.className = 'fish-item';
        
        // 檢查是否已捕獲
        const isCaught = gameState.caughtFish.includes(fish.id);
        
        // 如果已捕獲，顯示完整信息；否則，只顯示未知魚的輪廓
        if (isCaught) {
            // 稀有度顏色設置
            const rarityClass = `rarity-${fish.rarity}`;
            fishElement.classList.add(rarityClass);
            
            // 魚的HTML結構
            fishElement.innerHTML = `
                <img src="${fish.image}" alt="${fish.name}">
                <div class="fish-info">
                    <h3>${fish.name}</h3>
                    <p class="fish-rarity ${rarityClass}">稀有度: ${getRarityText(fish.rarity)}</p>
                    <p class="fish-location">${fish.environment} | ${fish.time}</p>
                    <p class="fish-desc">${fish.description}</p>
                </div>
            `;
        } else {
            // 未捕獲的魚，顯示問號
            fishElement.classList.add('uncaught');
            fishElement.innerHTML = `
                <img src="images/unknown-fish.png" alt="未知魚類">
                <div class="fish-info">
                    <h3>???</h3>
                    <p class="fish-rarity">稀有度: ???</p>
                    <p class="fish-location">??? | ???</p>
                    <p class="fish-desc">尚未發現的神秘魚類...</p>
                </div>
            `;
        }
        
        elements.fishCollection.appendChild(fishElement);
    });
    
    // 顯示圖鑑面板
    elements.collectionPanel.classList.remove('hidden');
}

// 篩選圖鑑
function filterCollection() {
    showCollection();
}

// 獲取稀有度文字
function getRarityText(rarity) {
    const rarityTexts = ['', '普通', '高級', '稀有', '傳說'];
    return rarityTexts[rarity] || '未知';
}

// 隨機等待時間
function getRandomWaitTime() {
    return Math.random() * (params.maxWaitTime - params.minWaitTime) + params.minWaitTime;
}

// 更新狀態信息
function updateStatusMessage(message) {
    elements.statusText.textContent = message;
}

// 重新開始冒險（重置捕獲的魚）
function restartAdventure() {
    if (confirm('確定要重新開始冒險嗎？所有已捕獲的魚將被清除！')) {
        gameState.caughtFish = [];
        saveCaughtFish();
        updateCaughtFishCount();
        showCollection(); // 重新顯示空的圖鑑
    }
}

// 遊戲啟動
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});