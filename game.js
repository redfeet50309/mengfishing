// 遊戲狀態
const gameState = {
    status: 'ready', // ready, casting, waiting, bite, reeling, success, failed, spinning
    caughtFish: [],
    currentFish: null,
    canCatch: false,
    selectedRarity: null, // 轉盤選擇的稀有度
    wheelSpinning: false
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
    restartAdventureBtn: document.getElementById('restart-adventure-btn')
};

// 系統參數
const params = {
    castingTime: 500,
    minWaitTime: 3000,
    maxWaitTime: 15000,
    catchWindow: 1500,
    wheelMinRotations: 5, // 轉盤最少旋轉圈數
    wheelMaxRotations: 10 // 轉盤最多旋轉圈數
};

// 轉盤相關變數
let wheelSpinning = false;
let fishingStatus = null;
let currentRarity = null;
let isPointerBaseAdded = false;
let currentRotation = 0; // 初始化轉盤角度
let slowDown = false; // 初始化減速標記

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
    
    // 綁定重新開始冒險按鈕事件
    elements.restartAdventureBtn.addEventListener('click', restartAdventure);
    
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
        
        // 檢查是否已經存在轉盤說明
        if (!document.querySelector('.wheel-instruction')) {
            const wheelInstruction = document.createElement('div');
            wheelInstruction.className = 'wheel-instruction';
            wheelInstruction.textContent = '點擊拉起魚竿按鈕決定魚的稀有度';
            document.querySelector('.wheel-container').appendChild(wheelInstruction);
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

    updateStatusMessage('準備開始釣魚吧！');
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
    elements.caughtFishCount.textContent = `已捕獲: ${gameState.caughtFish.length}/20`;
    elements.collectionCount.textContent = `(${gameState.caughtFish.length}/20)`;
}

// 甩竿
function castLine() {
    if (gameState.status !== 'ready') return;
    
    gameState.status = 'casting';
    updateStatus('正在甩竿...');
    
    // 禁用甩竿按鈕
    elements.castBtn.disabled = true;
    
    // 顯示釣魚線
    elements.fishHook.classList.remove('hidden');
    
    // 延遲後直接進入轉盤環節，跳過等待和咬鉤階段
    setTimeout(() => {
        elements.floatObject.classList.remove('hidden');
        
        gameState.status = 'spinning';
        updateStatus('開始釣魚...');
        
        // 短暫延遲後顯示轉盤
        setTimeout(() => {
            // 隱藏釣魚相關元素
            elements.floatObject.classList.add('hidden');
            elements.fishHook.classList.add('hidden');
            
            // 顯示轉盤
            showWheel();
        }, 1000);
    }, params.castingTime);
}

// 顯示隨機魚影
function showRandomFishShadow() {
    if (gameState.status !== 'waiting') return;
    
    // 有50%機率顯示魚影
    if (Math.random() > 0.5) {
        elements.fishShadow.classList.remove('hidden');
        
        // 隨機位置
        const fishingArea = document.querySelector('.fishing-area');
        const areaWidth = fishingArea.offsetWidth;
        elements.fishShadow.style.left = `${Math.random() * (areaWidth - 100) + 50}px`;
        
        // 2-5秒後隱藏
        setTimeout(() => {
            if (elements.fishShadow.classList.contains('hidden') === false) {
                elements.fishShadow.classList.add('hidden');
                
                // 隨機等待後再次顯示魚影
                if (gameState.status === 'waiting') {
                    setTimeout(showRandomFishShadow, Math.random() * 3000 + 1000);
                }
            }
        }, Math.random() * 3000 + 2000);
    } else {
        // 如果沒顯示魚影，等待一段時間後再嘗試
        if (gameState.status === 'waiting') {
            setTimeout(showRandomFishShadow, Math.random() * 2000 + 1000);
        }
    }
}

// 魚咬鉤
function fishBite() {
    // 進入咬鉤狀態
    gameState.status = 'bite';
    updateStatus('有魚上鉤了！快點點擊「拉起」！', true);
    
    // 啟用拉起按鈕並添加動畫
    elements.pullBtn.disabled = false;
    elements.pullBtn.classList.add('active');
    
    // 浮標動畫
    elements.floatObject.classList.add('bite');
    
    // 顯示水花效果
    elements.splash.classList.remove('hidden');
    setTimeout(() => {
        elements.splash.classList.add('hidden');
    }, 2000); // 延長水花效果時間
    
    // 顯示魚影在釣鉤附近
    elements.fishShadow.classList.remove('hidden');
    elements.fishShadow.style.left = `${parseInt(elements.floatObject.style.left) - 20}px`;
    
    // 設置捕獲窗口
    gameState.canCatch = true;
    setTimeout(() => {
        if (gameState.status === 'bite') {
            gameState.canCatch = false;
            gameState.status = 'failed';
            updateStatus('魚逃走了！');
            elements.pullBtn.disabled = true;
            elements.pullBtn.classList.remove('active');
            elements.floatObject.classList.remove('bite');
            elements.fishShadow.classList.add('hidden');
            
            // 延遲後重置
            setTimeout(resetFishing, 2000);
        }
    }, params.catchWindow);
}

// 拉起魚竿(原停止轉盤)
function stopWheel() {
    if (!wheelSpinning) return;
    
    // 停用按鈕並開始減速
    elements.stopWheelBtn.disabled = true;
    slowDown = true;
    
    // 更新狀態消息
    updateStatusMessage('魚竿正在拉起...');
}

// 顯示轉盤
function showWheel() {
    // 確保頁面滾動正常
    document.body.style.overflow = 'hidden';
    
    // 檢查SVG扇形定義
    const paths = document.querySelectorAll('#wheel path');
    if (paths.length === 4) {
        console.log("檢查SVG扇形區域定義:");
        paths.forEach((path, index) => {
            const rarity = path.getAttribute('data-rarity');
            const fill = path.getAttribute('fill');
            console.log(`扇形${index + 1}: 稀有度=${rarity}, 顏色=${fill}, 路徑=${path.getAttribute('d')}`);
        });
    }
    
    // 重置轉盤角度為0度，確保每次開始時轉盤位置一致
    elements.wheel.style.transition = 'none';
    elements.wheel.style.transform = 'rotate(0deg)';
    
    // 顯示轉盤容器
    elements.wheelContainer.classList.remove('hidden');
    
    // 初始化轉盤狀態
    elements.wheelResult.style.display = 'none';
    elements.stopWheelBtn.disabled = false;
    
    // 重置轉盤變數
    currentRotation = 0;
    slowDown = false;
    
    // 重置指針樣式
    const pointer = document.querySelector('.wheel-pointer');
    pointer.style.transform = 'translateX(-50%)';
    pointer.style.backgroundColor = '#f44336';
    
    // 開始轉盤旋轉動畫
    startWheel();
}

// 開始旋轉轉盤
function startWheel() {
    if (wheelSpinning) return;
    
    wheelSpinning = true;
    elements.stopWheelBtn.disabled = false;
    
    updateStatusMessage('轉盤正在旋轉，點擊拉起魚竿按鈕!');
    
    // 啟動指針動畫
    const pointer = document.querySelector('.wheel-pointer');
    pointer.classList.add('active');
    
    // 隱藏結果
    elements.wheelResult.style.display = 'none';
    
    // 初始旋轉速度 (降低10%初始速度)
    let spinSpeed = 13.5; // 從15降低到13.5
    let lastTimestamp = null;
    
    // 開始轉盤旋轉的函數
    function spinWheelAnimation(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        // 確保每幀的旋轉量合理
        const frameRotation = (spinSpeed * deltaTime) / 16.67; // 基於60幀計算
        
        currentRotation += frameRotation;
        
        // 不需要限制角度範圍，讓轉盤可以無限旋轉
        elements.wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        // 如果需要減速
        if (slowDown) {
            // 更平滑的減速
            spinSpeed *= 0.98;
            
            // 當速度足夠慢時停止
            if (spinSpeed < 0.2) {
                wheelSpinning = false;
                slowDown = false;
                
                // 調整最終角度到最接近的區段中心
                finalizeWheelPosition();
                
                return;
            }
        }
        
        requestAnimationFrame(spinWheelAnimation);
    }
    
    // 開始旋轉動畫
    requestAnimationFrame(spinWheelAnimation);
}

// 調整轉盤最終位置並顯示結果
function finalizeWheelPosition() {
    // 計算轉盤實際角度 (轉盤可能已旋轉多圈)
    let actualRotation = currentRotation % 360;
    
    // 確保角度為正數
    if (actualRotation < 0) {
        actualRotation += 360;
    }
    
    // 立即更新轉盤樣式，停止所有轉換
    elements.wheel.style.transition = 'none';
    elements.wheel.style.transform = `rotate(${actualRotation}deg)`;
    
    // 為除錯添加詳細日誌
    console.log("===== 轉盤停止分析 =====");
    console.log("原始轉盤旋轉: ", currentRotation.toFixed(2), "度");
    console.log("調整後轉盤角度: ", actualRotation.toFixed(2), "度");
    
    // 添加可視化debug標記，顯示實際停止位置
    const debugMarker = document.createElement('div');
    debugMarker.style.position = 'absolute';
    debugMarker.style.top = '0';
    debugMarker.style.left = '50%';
    debugMarker.style.width = '2px';
    debugMarker.style.height = '20px';
    debugMarker.style.backgroundColor = 'yellow';
    debugMarker.style.zIndex = '100';
    debugMarker.style.transform = 'translateX(-50%)';
    document.querySelector('.wheel-svg-container').appendChild(debugMarker);
    
    // 確保轉盤已完全停止
    requestAnimationFrame(() => {
        // 根據轉盤角度判定稀有度
        const rarity = determineRarityFromWheelPosition(actualRotation);
        currentRarity = rarity;
        
        // 詳細記錄判定結果
        console.log("最終判定: 轉盤角度", actualRotation, "度");
        console.log("對應稀有度:", getRarityText(rarity), "(", getRarityColor(rarity), ")");
        
        // 更新指針顏色以反映判定結果
        updatePointerColor(rarity);
        
        // 顯示結果
        showWheelResult(rarity);
        
        // 5秒後移除debug標記
        setTimeout(() => {
            if (debugMarker.parentNode) {
                debugMarker.parentNode.removeChild(debugMarker);
            }
        }, 5000);
        
        console.log("===== 轉盤分析結束 =====");
    });
}

// 根據轉盤位置判定稀有度（指針固定在0度位置）
function determineRarityFromWheelPosition(wheelPosition) {
    // 確保角度在0-360度範圍內
    let adjustedAngle = wheelPosition % 360;
    if (adjustedAngle < 0) {
        adjustedAngle += 360;
    }
    
    // 計算指針相對於轉盤的位置
    // 當轉盤順時針旋轉到角度A時，指針實際指向的是(360-A)度的位置
    let pointerPosition = (360 - adjustedAngle) % 360;
    
    // 為除錯添加詳細信息
    console.log("轉盤原始角度:", wheelPosition);
    console.log("轉盤調整後角度:", adjustedAngle);
    console.log("指針計算後位置:", pointerPosition);
    
    // 驗證轉盤定義的區域和判定邏輯是否對齊
    console.log("轉盤區域定義:");
    console.log("- 綠色(普通): 0-180度, 實際SVG範圍: 0-180度");
    console.log("- 藍色(高級): 180-270度, 實際SVG範圍: 180-270度");
    console.log("- 紫色(稀有): 270-342度, 實際SVG範圍: 270-342度");
    console.log("- 金色(傳說): 342-360度, 實際SVG範圍: 342-360度");
    
    // 根據指針角度判定稀有度
    let rarity;
    if (pointerPosition >= 0 && pointerPosition < 180) {
        // 指針指向綠色區域 (0-180度)
        rarity = 1; // 普通
        console.log("指針指向普通(綠色)區域：0-180度");
    } else if (pointerPosition >= 180 && pointerPosition < 270) {
        // 指針指向藍色區域 (180-270度)
        rarity = 2; // 高級
        console.log("指針指向高級(藍色)區域：180-270度");
    } else if (pointerPosition >= 270 && pointerPosition < 342) {
        // 指針指向紫色區域 (270-342度)
        rarity = 3; // 稀有
        console.log("指針指向稀有(紫色)區域：270-342度");
    } else {
        // 指針指向金色區域 (342-360度)
        rarity = 4; // 傳說
        console.log("指針指向傳說(金色)區域：342-360度");
    }
    
    // 檢查最終結果
    console.log(`最終判定結果: ${getRarityText(rarity)}魚 (${getRarityColor(rarity)})`);
    return rarity;
}

// 根據稀有度獲取顏色名稱（用於調試）
function getRarityColor(rarity) {
    switch(rarity) {
        case 1: return "綠色 (普通)";
        case 2: return "藍色 (高級)";
        case 3: return "紫色 (稀有)";
        case 4: return "金色 (傳說)";
        default: return "未知";
    }
}

// 根據稀有度更新指針顏色
function updatePointerColor(rarity) {
    const pointer = document.querySelector('.wheel-pointer');
    pointer.classList.remove('active');
    
    // 記錄原始顏色
    const originalColor = pointer.style.backgroundColor;
    
    // 根據稀有度設置不同顏色，確保與轉盤區域顏色完全一致
    let newColor = '';
    switch(rarity) {
        case 1:
            newColor = '#4CAF50'; // 綠色 - 普通
            break;
        case 2:
            newColor = '#2196F3'; // 藍色 - 高級
            break;
        case 3:
            newColor = '#9C27B0'; // 紫色 - 稀有
            break;
        case 4:
            newColor = '#FFC107'; // 金色 - 傳說
            break;
        default:
            newColor = '#333'; // 預設黑色
    }
    
    // 設置新顏色
    pointer.style.backgroundColor = newColor;
    
    // 顯示顏色變化的除錯信息
    console.log(`指針顏色已從 ${originalColor} 更新為 ${newColor} (稀有度: ${rarity})`);
    console.log(`稀有度對應: 1=綠色(普通), 2=藍色(高級), 3=紫色(稀有), 4=金色(傳說)`);
    
    // 使指針有輕微的放大效果，但不會導致畫面變形
    pointer.style.transform = 'translateX(-50%) scale(1.1)';
    setTimeout(() => {
        pointer.style.transform = 'translateX(-50%)';
    }, 300);
}

// 顯示轉盤結果
function showWheelResult(rarity) {
    // 移除所有稀有度類別
    elements.rarityResult.classList.remove('rarity-1', 'rarity-2', 'rarity-3', 'rarity-4');
    
    // 設置稀有度文字和樣式
    let rarityText = '';
    switch(rarity) {
        case 1:
            rarityText = '普通';
            elements.rarityResult.classList.add('rarity-1');
            break;
        case 2:
            rarityText = '高級';
            elements.rarityResult.classList.add('rarity-2');
            break;
        case 3:
            rarityText = '稀有';
            elements.rarityResult.classList.add('rarity-3');
            break;
        case 4:
            rarityText = '傳說';
            elements.rarityResult.classList.add('rarity-4');
            break;
    }
    
    // 更新結果文字
    elements.rarityResult.textContent = rarityText;
    
    // 通過直接設置樣式屬性來避免變形
    const resultElement = elements.wheelResult;
    
    // 清除任何可能影響顯示的過渡和變換
    resultElement.style.cssText = '';
    resultElement.style.display = 'block';
    resultElement.style.opacity = '1';
    resultElement.style.transform = 'none';
    resultElement.style.transition = 'none';
    
    // 強制瀏覽器重繪
    resultElement.offsetHeight;
    
    // 更新狀態消息
    updateStatusMessage(`恭喜！你釣到了一個${rarityText}魚！`);
    
    // 啟用繼續釣魚按鈕
    elements.catchFishBtn.disabled = false;
}

// 更新狀態消息
function updateStatusMessage(message) {
    const statusElement = document.getElementById('game-status');
    statusElement.textContent = message;
    
    // 突出顯示消息
    statusElement.style.animation = 'none';
    setTimeout(() => {
        statusElement.style.animation = 'bounce 0.5s';
    }, 10);
}

// 捕獲魚
function catchFish() {
    if (!currentRarity) return;
    
    // 根據稀有度隨機選擇一條魚
    const fishByRarity = fishDatabase.filter(fish => fish.rarity === currentRarity);
    const randomFish = fishByRarity[Math.floor(Math.random() * fishByRarity.length)];
    
    // 添加捕獲的魚到玩家收藏
    const isNewFish = addFishToCollection(randomFish);
    
    // 顯示剛捕獲的魚
    displayCaughtFish(randomFish, isNewFish);
    
    // 更新狀態
    updateStatusMessage(`你捕獲了 ${randomFish.name}！已添加到你的收藏。`);
    
    // 重置遊戲狀態
    currentRarity = null;
    elements.catchFishBtn.disabled = true;
}

// 添加魚到收藏中
function addFishToCollection(fish) {
    // 檢查魚是否已經在收藏中
    const isNewFish = !gameState.caughtFish.includes(fish.id);
    
    if (isNewFish) {
        gameState.caughtFish.push(fish.id);
        saveCaughtFish();
        updateCaughtFishCount();
    }
    
    return isNewFish;
}

// 顯示捕獲的魚
function displayCaughtFish(fish, isNewFish) {
    // 設置魚的信息
    elements.caughtFishImg.src = fish.image;
    elements.caughtFishName.textContent = fish.name;
    elements.caughtFishRarity.textContent = `稀有度: ${getRarityText(fish.rarity)}`;
    elements.caughtFishRarity.className = `rarity-${fish.rarity}`;
    elements.caughtFishDesc.textContent = fish.description;
    
    // 更新標題
    const catchTitle = document.querySelector('#fish-caught-panel h2');
    if (isNewFish) {
        catchTitle.innerHTML = '<i class="fas fa-fish"></i> 哇！是新的品種呢！';
        // 添加特殊效果
        catchTitle.classList.add('new-fish');
        setTimeout(() => {
            catchTitle.classList.remove('new-fish');
        }, 3000);
    } else {
        catchTitle.innerHTML = '<i class="fas fa-fish"></i> 釣到魚了！';
        catchTitle.classList.remove('new-fish');
    }
    
    // 顯示捕獲面板
    elements.fishCaughtPanel.classList.remove('hidden');
}

// 重置釣魚狀態
function resetFishing() {
    gameState.status = 'ready';
    gameState.currentFish = null;
    gameState.selectedRarity = null;
    elements.castBtn.disabled = false;
    elements.fishHook.classList.add('hidden');
    elements.floatObject.classList.add('hidden');
    elements.floatObject.classList.remove('bite');
    elements.fishShadow.classList.add('hidden');
    
    updateStatus('點擊「甩竿」開始釣魚');
}

// 顯示圖鑑
function showCollection() {
    // 清空現有內容
    elements.fishCollection.innerHTML = '';
    
    // 添加所有魚類到圖鑑
    fishDatabase.forEach(fish => {
        const isCaught = gameState.caughtFish.includes(fish.id);
        
        const fishItem = document.createElement('div');
        fishItem.className = `fish-item ${isCaught ? 'caught' : 'uncaught'}`;
        
        const fishImage = document.createElement('img');
        if (isCaught) {
            // 檢查圖片是否存在
            const img = new Image();
            img.onload = function() {
                fishImage.src = this.src;
            };
            img.onerror = function() {
                fishImage.src = defaultFishImage;
            };
            img.src = fish.image;
        } else {
            fishImage.src = defaultFishImage;
        }
        
        const fishName = document.createElement('div');
        fishName.className = 'fish-name';
        fishName.textContent = isCaught ? fish.name : '???';
        
        const fishRarity = document.createElement('div');
        fishRarity.className = `fish-rarity rarity-${fish.rarity}`;
        fishRarity.textContent = isCaught ? getRarityText(fish.rarity) : '';
        
        fishItem.appendChild(fishImage);
        fishItem.appendChild(fishName);
        fishItem.appendChild(fishRarity);
        
        // 點擊顯示詳細資訊
        if (isCaught) {
            fishItem.addEventListener('click', () => {
                alert(`名稱: ${fish.name}\n描述: ${fish.description}\n稀有度: ${getRarityText(fish.rarity)}`);
            });
        }
        
        elements.fishCollection.appendChild(fishItem);
    });
    
    // 顯示圖鑑面板
    elements.collectionPanel.classList.remove('hidden');
}

// 獲取稀有度文字
function getRarityText(rarity) {
    switch (rarity) {
        case 1: return '普通';
        case 2: return '高級';
        case 3: return '稀有';
        case 4: return '傳說';
        default: return '普通';
    }
}

// 更新狀態文字
function updateStatus(message, isAlert = false) {
    elements.statusText.textContent = message;
    
    // 如果是警告狀態，添加警告樣式
    if (isAlert) {
        elements.statusText.parentElement.classList.add('alert');
    } else {
        elements.statusText.parentElement.classList.remove('alert');
    }
}

// 繼續釣魚 (轉盤結果後)
function continueAfterWheel() {
    // 先禁用按鈕以避免重複點擊
    elements.catchFishBtn.disabled = true;
    
    // 重置轉盤和結果區域
    elements.wheelResult.style.display = 'none';
    elements.wheel.style.transition = 'none';
    elements.wheel.style.transform = 'rotate(0deg)';
    
    // 解決可能的滾動問題
    document.body.style.overflow = '';
    
    // 強制瀏覽器更新佈局
    document.body.offsetHeight;
    
    // 隱藏轉盤界面
    elements.wheelContainer.classList.add('hidden');
    
    // 延遲後顯示捕獲結果，確保轉盤已完全隱藏且佈局正常
    setTimeout(() => {
        catchFish();
    }, 100);
}

// 初始化事件監聽器
function initEventListeners() {
    // 轉盤相關事件
    elements.stopWheelBtn.addEventListener('click', stopWheel);
    elements.catchFishBtn.addEventListener('click', continueAfterWheel);
}

// 重新開始冒險
function restartAdventure() {
    // 顯示確認對話框
    if (confirm('確定要重新開始冒險嗎？這將清空所有已捕獲的魚類記錄！')) {
        // 清空已捕獲的魚類陣列
        gameState.caughtFish = [];
        
        // 保存空的捕獲記錄到本地儲存
        saveCaughtFish();
        
        // 更新UI顯示
        updateCaughtFishCount();
        
        // 顯示提示訊息
        alert('冒險已重新開始！所有魚類圖鑑已重置。');
        
        // 重置釣魚狀態
        resetFishing();
        
        // 如果圖鑑面板是開啟的，更新並重新顯示
        if (!elements.collectionPanel.classList.contains('hidden')) {
            showCollection();
        }
    }
}

// 在頁面載入完成後初始化遊戲和事件監聽
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initEventListeners();
});