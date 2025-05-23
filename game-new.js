// ==========================================================================
// Roo: Rewritten game logic for mengfishing (game-new.js)
// Goal: Implement core fishing, collection, environment, and time logic
//       with correct environment counting and UTF-8 compatibility.
// ==========================================================================

// --- Game State ---
const gameState = {
    status: 'ready', // ready, spinning, result
    caughtFish: [], // Array of caught fish objects { id, name, ... }
    currentFish: null, // The fish object currently being processed/displayed
    selectedRarity: null, // Rarity number determined by the wheel
    currentEnvironment: '沿岸', // Default environment (Matches HTML/fish-data.js)
    currentTime: '早上', // Default time (Matches HTML/fish-data.js)
    randomFishAppearance: {
        enabled: true,
        timer: null,
        interval: [5000, 15000] // ms
    }
};

// --- DOM Element References ---
const elements = {
    castBtn: document.getElementById('cast-btn'),
    statusText: document.getElementById('status-text'),
    fishHook: document.getElementById('fish-hook'),
    floatObject: document.getElementById('float-object'),
    splash: document.getElementById('splash'),
    fishShadow: document.querySelector('.fish-shadow'),
    fishingArea: document.querySelector('.fishing-area'),
    wheelAppContainer: document.getElementById('rarity-wheel-app'), // Vue app mount point
    fishCaughtPanel: document.getElementById('fish-caught-panel'),
    caughtFishImg: document.getElementById('caught-fish-img'),
    caughtFishName: document.getElementById('caught-fish-name'),
    caughtFishRarity: document.getElementById('caught-fish-rarity'),
    caughtFishEnvTime: document.getElementById('caught-fish-environment-time'),
    caughtFishDesc: document.getElementById('caught-fish-desc'),
    continueBtn: document.getElementById('continue-btn'),
    currentTimeDisplay: document.getElementById('current-time'),
    gameStatus: document.getElementById('game-status'), // For wheel status text
    collectionBtn: document.getElementById('collection-btn'),
    collectionPanel: document.getElementById('collection-panel'),
    collectionCount: document.getElementById('collection-count'), // Count in modal header
    fishCollectionGrid: document.getElementById('fish-collection'),
    closeCollection: document.getElementById('close-collection-btn'),
    environmentBtns: document.querySelectorAll('.environment-btn'), // NodeList
    restartBtn: document.getElementById('restart-adventure-btn'),
    caughtFishCounter: document.getElementById('caught-fish'), // Main counter in header
    filterEnvironment: document.getElementById('filter-environment'),
    filterTime: document.getElementById('filter-time'),
    filterRarity: document.getElementById('filter-rarity'),
    sky: document.querySelector('.sky'), // For background/time effects
    sun: document.querySelector('.sun') // For background/time effects
};

// --- Global Variables ---
let timeChangeInterval = null;
const TIME_CYCLE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const TIMES_OF_DAY = ['早上', '中午', '晚上']; // Ensure these match fish-data.js and HTML button values

// --- Rarity Wheel Interaction ---

// Called by wheel-app.js when the wheel result is determined
window.handleRarityResult = function (rarityLabel) {
    console.log('[Game] handleRarityResult called with label:', rarityLabel);
    if (gameState.status !== 'spinning') {
        console.warn("[Game] Received wheel result but game state wasn't 'spinning'. Current state:", gameState.status);
        // Allow proceeding anyway, might happen if user clicks fast
    }
    gameState.status = 'result'; // Update status after spinning

    // Convert label (e.g., "普通") to numeric value (e.g., 1)
    const rarityMap = {
        '普通': 1, // Matches wheel-app.js and getFishRarityText
        '進階': 2, // Roo: Corrected label to match wheel-app.js
        '稀有': 3, // Matches wheel-app.js and getFishRarityText
        '傳說': 4  // Matches wheel-app.js and getFishRarityText
    };
    const rarityValue = rarityMap[rarityLabel];
    console.log('[Game] Mapped rarityLabel to rarityValue:', rarityValue);

    if (!rarityValue) {
        console.error('[Game] Invalid rarityLabel, cannot map to value:', rarityLabel);
        updateStatusMessage('稀有度結果錯誤！請重試。', true);
        resetFishingState();
        return;
    }

    gameState.selectedRarity = rarityValue;
    // Display the rarity result clearly
    if (elements.gameStatus) elements.gameStatus.innerHTML = `稀有度結果: <span style="color: ${getRarityColor(rarityValue)}">${rarityLabel}</span>`;

    // Select fish based on rarity, environment, and time
    console.log(`[Game] Calling selectFishByRarity with rarityValue: ${rarityValue}, env: ${gameState.currentEnvironment}, time: ${gameState.currentTime}`);
    const selectedFish = selectFishByRarity(rarityValue);
    console.log('[Game] selectFishByRarity returned:', selectedFish ? selectedFish.name : 'null');

    if (!selectedFish) {
        console.error('[Game] Failed to find fish for criteria:', { rarity: rarityValue, environment: gameState.currentEnvironment, time: gameState.currentTime });
        updateStatusMessage(`在 ${gameState.currentEnvironment} (${gameState.currentTime}) 沒找到 ${rarityLabel} 的魚...運氣不好！`);
        // Automatically reset after a delay
        setTimeout(resetFishingState, 3000);
        return;
    }

    gameState.currentFish = selectedFish;
    console.log('[Game] gameState.currentFish set to:', gameState.currentFish ? gameState.currentFish.name : 'null');

    // Play sound effect (Placeholder)
    // playRaritySound(rarityValue);

    // Check if it's a new fish for the collection
    const isNewFish = !gameState.caughtFish.some(fish => fish.id === selectedFish.id);
    console.log(`[Game] Is new fish? ${isNewFish}`);

    // Show the caught fish notification panel
    console.log('[Game] Calling showFishNotification with fish:', selectedFish ? selectedFish.name : 'null');
    showFishNotification(selectedFish, isNewFish);

    // If it's a new fish, add it to the collection and save
    if (isNewFish) {
        console.log(`[Game] Adding new fish ${selectedFish.name} to collection.`);
        addCaughtFish(selectedFish); // This function handles adding and saving
        updateCaughtCounter(); // Update header counter
        updateEnvironmentCounts(); // Update environment button counters
    }

    // Reset state is now handled by the notification's continue button
};

// Selects a fish matching rarity, current environment, and current time
function selectFishByRarity(rarityValue) {
    console.log('[selectFishByRarity] Function start.');
    // Ensure fishDatabase is loaded and is an array
    if (!Array.isArray(window.fishDatabase)) {
        console.error("[selectFishByRarity] fishDatabase is not loaded or not an array.");
        return null;
    }
    console.log(`[selectFishByRarity] Filtering for rarity: ${rarityValue}, env: ${gameState.currentEnvironment}, time: ${gameState.currentTime}`);

    const possibleFish = window.fishDatabase.filter(fish => {
        // Basic validation for fish object and properties
        if (!fish || typeof fish.rarity !== 'number' || !Array.isArray(fish.environments) || !Array.isArray(fish.times)) {
            // console.warn(`[selectFishByRarity] Skipping invalid fish data:`, fish);
            return false;
        }

        const envMatch = fish.environments.includes(gameState.currentEnvironment);
        const timeMatch = fish.times.includes(gameState.currentTime);
        const rarityMatch = fish.rarity === rarityValue;

        // Detailed log for each fish check (optional)
        // console.log(`[selectFishByRarity] Checking ${fish.name}: Rarity ${fish.rarity} (${rarityMatch}), Env ${envMatch}, Time ${timeMatch}`);

        return rarityMatch && envMatch && timeMatch;
    });

    console.log(`[selectFishByRarity] Found ${possibleFish.length} possible fish:`, possibleFish.map(f => f.name));

    if (possibleFish.length === 0) {
        console.warn('[selectFishByRarity] No matching fish found for criteria.');
        return null; // No matching fish found
    }

    // Randomly select one from the possible fish
    const randomIndex = Math.floor(Math.random() * possibleFish.length);
    const selected = possibleFish[randomIndex];

    console.log(`[selectFishByRarity] Random index selected: ${randomIndex}`);
    console.log(`[selectFishByRarity] Returning selected fish:`, selected);

    return selected;
}

// --- Fishing Process ---

// Starts the fishing process (casting the line and spinning the wheel)
function startFishing() {
    console.log('開始釣魚流程');
    if (gameState.status !== 'ready') {
        console.warn(`無法開始釣魚，目前狀態: ${gameState.status}`);
        return;
    }

    gameState.status = 'spinning'; // Go directly to spinning state

    elements.castBtn.disabled = true;
    elements.castBtn.textContent = '稀有度判定中...';
    updateStatusMessage('拋竿！等待稀有度結果...');

    showFishingAnimation(); // Show line going into water
    stopRandomFishAppearance(); // Stop distracting shadows

    // Show and spin the Vue wheel using the API from wheel-app.js
    if (window.RarityWheelApp && typeof window.RarityWheelApp.show === 'function') {
        window.RarityWheelApp.show(); // show() in wheel-app.js should handle starting the spin
        // Trigger the spin explicitly after showing (slight delay for visibility)
        setTimeout(() => {
            if (window.RarityWheelApp && typeof window.RarityWheelApp.startSpin === 'function') {
                window.RarityWheelApp.startSpin();
            } else {
                console.error('無法觸發轉盤旋轉！');
                updateStatusMessage('轉盤錯誤，請重試。', true);
                resetFishingState();
            }
        }, 300);
    } else {
        console.error('Vue 稀有度轉盤 API (window.RarityWheelApp) 或 show 函數未找到');
        updateStatusMessage('轉盤初始化失敗！', true);
        resetFishingState(); // Reset if wheel cannot be shown/spun
    }
}

// Resets the game state to ready for fishing
function resetFishingState() {
    console.log('重設釣魚狀態');
    gameState.status = 'ready';
    gameState.currentFish = null;
    gameState.selectedRarity = null;

    elements.castBtn.disabled = false;
    elements.castBtn.textContent = '甩竿';
    if (elements.fishHook) elements.fishHook.classList.add('hidden');
    if (elements.floatObject) elements.floatObject.classList.add('hidden');
    if (elements.floatObject) elements.floatObject.classList.remove('bite'); // Legacy class
    if (elements.fishShadow) elements.fishShadow.classList.add('hidden');
    if (elements.fishCaughtPanel) elements.fishCaughtPanel.classList.add('hidden'); // Ensure notification panel is hidden

    // Hide the Vue wheel using the API from wheel-app.js
    if (window.RarityWheelApp && typeof window.RarityWheelApp.hide === 'function') {
        window.RarityWheelApp.hide();
    } else {
        console.warn('Vue 稀有度轉盤 API (window.RarityWheelApp) 或 hide 函數未找到');
        // Fallback: try hiding the container directly if API is not ready
        if (elements.wheelAppContainer) {
            elements.wheelAppContainer.style.display = 'none';
        }
    }

    updateStatusMessage('準備好了！點擊「甩竿」開始釣魚');
    if (elements.gameStatus) elements.gameStatus.textContent = '等待釣魚...';

    startRandomFishAppearance(); // Restart random fish shadows
}


// --- UI Updates & Animations ---

// Shows the fishing line animation
function showFishingAnimation() {
    if (!elements.fishHook || !elements.floatObject || !elements.splash) {
        console.error("缺少釣魚動畫元素");
        return;
    }
    elements.fishHook.style.height = '0px';
    elements.fishHook.classList.remove('hidden');
    elements.floatObject.classList.remove('hidden');
    elements.floatObject.style.transform = 'translateY(0)';

    let hookHeight = 0;
    const targetHeight = 150; // px, adjust as needed
    const interval = setInterval(() => {
        hookHeight += 5;
        if (hookHeight >= targetHeight) {
            hookHeight = targetHeight;
            clearInterval(interval);
            elements.floatObject.style.transform = `translateY(${targetHeight - 6}px)`; // Adjust float position slightly above hook end
            elements.splash.style.top = `${targetHeight - 15}px`; // Position splash near float
            elements.splash.style.left = `calc(50% - 20px)`; // Center splash horizontally
            elements.splash.classList.remove('hidden');
            setTimeout(() => elements.splash.classList.add('hidden'), 700); // Hide splash after animation
        }
        elements.fishHook.style.height = `${hookHeight}px`;
    }, 20);
}

// Updates the status message display
function updateStatusMessage(message, isAlert = false) {
    if (!elements.statusText) return;
    elements.statusText.innerHTML = message; // Use innerHTML for potential styling
    elements.statusText.parentElement.classList.toggle('alert', isAlert);
}

// Shows the notification panel for a caught fish
function showFishNotification(fish, isNew) {
    console.log('[showFishNotification] Displaying fish:', fish ? fish.name : 'null', 'Is new:', isNew);
    if (!elements.fishCaughtPanel || !fish) {
        console.error('[showFishNotification] Panel or fish data missing.');
        return;
    }

    elements.caughtFishImg.src = fish.image || 'images/unknown-fish.png'; // Use unknown as default if image missing
    elements.caughtFishImg.alt = fish.name;
    elements.caughtFishName.textContent = fish.name + (isNew ? ' (新發現!)' : '');
    const rarityText = getFishRarityText(fish.rarity);
    console.log(`[showFishNotification] Rarity value: ${fish.rarity}, Rarity text: ${rarityText}`);
    elements.caughtFishRarity.textContent = `稀有度: ${rarityText}`;
    elements.caughtFishRarity.style.color = getRarityColor(fish.rarity);
    // Ensure environments and times are arrays before joining
    const envText = Array.isArray(fish.environments) ? fish.environments.join(', ') : '未知';
    const timeText = Array.isArray(fish.times) ? fish.times.join(', ') : '未知';
    elements.caughtFishEnvTime.textContent = `環境: ${envText} | 時間: ${timeText}`;
    elements.caughtFishDesc.textContent = fish.description || '沒有關於這條魚的描述。';

    elements.fishCaughtPanel.classList.remove('hidden');

    // Handle continue button click
    elements.continueBtn.onclick = () => {
        console.log('[showFishNotification] Continue button clicked.');
        elements.fishCaughtPanel.classList.add('hidden');
        // Reset state only after notification is closed
        resetFishingState();
    };
}

// --- Fish Collection (Pokedex) Logic ---

// Adds a caught fish to the state if it's new and saves
function addCaughtFish(fish) {
    if (!fish || typeof fish.id === 'undefined') return false; // Basic validation
    const existingFish = gameState.caughtFish.find(f => f.id === fish.id);
    if (!existingFish) {
        gameState.caughtFish.push({ ...fish }); // Store a copy
        saveCaughtFish();
        console.log(`新魚加入圖鑑: ${fish.name}`);
        return true;
    }
    console.log(`已經抓過這條魚了: ${fish.name}`);
    return false;
}

// Updates the caught fish counter display (header and modal)
function updateCaughtCounter() {
    // Ensure fishDatabase is loaded
    const totalFish = Array.isArray(window.fishDatabase) ? window.fishDatabase.length : 0;
    const caughtCount = gameState.caughtFish.length;
    const counterText = `<i class="fas fa-trophy"></i> 已捕獲: ${caughtCount}/${totalFish}`;
    const modalCountText = `(${caughtCount}/${totalFish})`;

    if (elements.caughtFishCounter) {
        elements.caughtFishCounter.innerHTML = counterText;
    }
    if (elements.collectionCount) {
        elements.collectionCount.textContent = modalCountText;
    }
}

// Loads caught fish data from localStorage
function loadCaughtFish() {
    try {
        const savedFish = localStorage.getItem('caughtFish');
        if (savedFish) {
            const parsedFish = JSON.parse(savedFish);
            if (Array.isArray(parsedFish)) {
                // Filter for valid fish objects more robustly
                const validFish = parsedFish.filter(item =>
                    item && typeof item.id === 'number' && typeof item.name === 'string'
                    // Add more checks if necessary (e.g., rarity, environments, times)
                );
                gameState.caughtFish = validFish;
                console.log(`從 localStorage 載入 ${validFish.length} 條魚`);
            } else {
                console.warn('localStorage 中的 caughtFish 不是有效的陣列，將重設。');
                gameState.caughtFish = [];
                localStorage.removeItem('caughtFish');
            }
        } else {
            gameState.caughtFish = []; // Initialize if nothing is saved
        }
    } catch (e) {
        console.error('讀取 localStorage 中的 caughtFish 失敗:', e);
        gameState.caughtFish = []; // Reset on error
        localStorage.removeItem('caughtFish'); // Clear potentially corrupted data
    }
}


// Saves caught fish data to localStorage
function saveCaughtFish() {
    try {
        localStorage.setItem('caughtFish', JSON.stringify(gameState.caughtFish));
    } catch (e) {
        console.error('儲存 caughtFish 到 localStorage 失敗:', e);
        // Optionally notify the user or handle the error (e.g., if storage is full)
    }
}


// Renders the fish collection based on filters
function renderFishCollection() {
    if (!elements.fishCollectionGrid || !Array.isArray(window.fishDatabase)) return;
    elements.fishCollectionGrid.innerHTML = ''; // Clear existing content

    // Get filter values
    const filterEnv = elements.filterEnvironment.value;
    const filterTime = elements.filterTime.value;
    const filterRarity = elements.filterRarity.value; // This will be a string "1", "2", etc. or "all"

    // Iterate through all possible fish in the database
    window.fishDatabase.forEach(fish => {
        if (!fish || typeof fish.id === 'undefined') return; // Skip invalid fish data

        const isCaught = gameState.caughtFish.some(caught => caught.id === fish.id);

        // Apply filters with checks for array existence
        const envMatch = filterEnv === 'all' || (Array.isArray(fish.environments) && fish.environments.includes(filterEnv));
        const timeMatch = filterTime === 'all' || (Array.isArray(fish.times) && fish.times.includes(filterTime));
        const rarityMatch = filterRarity === 'all' || (typeof fish.rarity === 'number' && fish.rarity === parseInt(filterRarity)); // Compare number to parsed int

        if (envMatch && timeMatch && rarityMatch) {
            const fishCard = document.createElement('div');
            fishCard.classList.add('fish-card');
            fishCard.classList.toggle('not-caught', !isCaught);

            fishCard.innerHTML = `
                <img src="${isCaught ? (fish.image || 'images/unknown-fish.png') : 'images/unknown-fish.png'}" alt="${isCaught ? fish.name : '未捕獲'}">
                <p>${isCaught ? fish.name : '???'}</p>
                ${isCaught ? `<span class="rarity-dot" style="background-color: ${getRarityColor(fish.rarity)};"></span>` : ''}
            `;

            // Add click event to show details if caught
            if (isCaught) {
                fishCard.onclick = () => showFishNotification(fish, false); // 'false' because it's already caught
            }

            elements.fishCollectionGrid.appendChild(fishCard);
        }
    });
    updateCaughtCounter(); // Ensure count in modal header is updated
}


// --- Environment and Time Logic ---

// Sets the initial active state for environment buttons
function initEnvironmentButtons() {
    elements.environmentBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-environment') === gameState.currentEnvironment);
    });
}

// Changes the current fishing environment
function changeEnvironment(newEnvironment) {
    if (gameState.status !== 'ready') {
        updateStatusMessage('釣魚中無法切換環境！', true);
        return;
    }
    // Validate newEnvironment if necessary (e.g., check if it exists in a predefined list)
    gameState.currentEnvironment = newEnvironment;
    console.log(`環境切換為: ${newEnvironment}`);
    updateStatusMessage(`已切換到 ${newEnvironment} 環境`);

    // Update button active state
    elements.environmentBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-environment') === newEnvironment);
    });

    // Update fishing area background class
    updateFishingAreaClass();
    startRandomFishAppearance(); // Restart fish shadow timer for new environment
}

// Starts the automatic time changing cycle
function startTimeChangeCycle() {
    clearInterval(timeChangeInterval); // Clear existing interval if any
    timeChangeInterval = setInterval(() => {
        const currentIndex = TIMES_OF_DAY.indexOf(gameState.currentTime);
        const nextIndex = (currentIndex + 1) % TIMES_OF_DAY.length;
        gameState.currentTime = TIMES_OF_DAY[nextIndex];
        console.log(`時間變換為: ${gameState.currentTime}`);
        updateTimeDisplay();
        startRandomFishAppearance(); // Restart fish shadow timer for new time
    }, TIME_CYCLE_DURATION);
}

// Updates the time display element and visual background
function updateTimeDisplay() {
    if (elements.currentTimeDisplay) {
        elements.currentTimeDisplay.textContent = gameState.currentTime;
    }
    // Update fishing area class for time change
    updateFishingAreaClass();
}

// Updates sky visuals based on time of day (Simplified, main logic in updateFishingAreaClass)
function updateSkyForTime(time) {
    // This function is now less relevant as updateFishingAreaClass handles the main background logic.
    // Kept for potential future sky-specific details (like sun/moon position/visibility).
    if (!elements.sky || !elements.sun) return;

    // Reset sun/moon visibility (assuming no moon element for now)
    elements.sun.style.display = 'block';

    switch (time) {
        case '早上':
            elements.sun.style.opacity = '0.8';
            elements.sun.style.top = '10px';
            break;
        case '中午':
            elements.sun.style.opacity = '1';
            elements.sun.style.top = '5px';
            break;
        case '晚上':
            elements.sun.style.display = 'none';
            // if (moon) moon.style.display = 'block'; // Add if you have a moon element
            break;
        default:
            console.warn("未知的時間:", time);
            elements.sun.style.opacity = '0.8';
            elements.sun.style.top = '10px';
            break;
    }
}

// Updates the CSS class of the fishing area based on environment and time
function updateFishingAreaClass() {
    if (!elements.fishingArea) return;

    const environmentClassMap = {
        '沿岸': 'coastal',
        '海水': 'sea',
        '淡水': 'freshwater',
        '湖泊': 'lake'
    };
    const timeClassMap = {
        '早上': 'morning',
        '中午': 'noon',
        '晚上': 'evening'
    };

    // Remove existing environment and time classes
    elements.fishingArea.classList.remove('coastal', 'sea', 'freshwater', 'lake', 'morning', 'noon', 'evening');

    // Add current environment class
    const currentEnvClass = environmentClassMap[gameState.currentEnvironment];
    if (currentEnvClass) {
        elements.fishingArea.classList.add(currentEnvClass);
    } else {
        elements.fishingArea.classList.add('coastal'); // Default fallback
        console.warn(`未知的環境用於 CSS class 映射: ${gameState.currentEnvironment}. 使用預設 coastal.`);
    }

    // Add current time class
    const currentTimeClass = timeClassMap[gameState.currentTime];
    if (currentTimeClass) {
        elements.fishingArea.classList.add(currentTimeClass);
    } else {
        elements.fishingArea.classList.add('morning'); // Default fallback
        console.warn(`未知的時間用於 CSS class 映射: ${gameState.currentTime}. 使用預設 morning.`);
    }
    console.log(`[Game] Updated fishing area classes: ${elements.fishingArea.className}`);
    // Also update sky details like sun/moon visibility based on time
    updateSkyForTime(gameState.currentTime);
    // Roo: Ensuring no delayed call here
}


// --- Random Fish Shadow Logic ---

// Starts the timer for showing random fish shadows
function startRandomFishAppearance() {
    if (!gameState.randomFishAppearance.enabled || !elements.fishShadow) return;
    stopRandomFishAppearance(); // Clear existing timer first

    const showFish = () => {
        // Ensure fishDatabase is loaded
        if (!Array.isArray(window.fishDatabase)) {
            console.error("fishDatabase 未載入或不是陣列，無法顯示魚影");
            scheduleNextFishAppearance(); // Still schedule next check
            return;
        }

        // Check if fish exist in the current context before showing shadow
        const fishInCurrentContext = window.fishDatabase.some(fish => {
            const envMatch = Array.isArray(fish?.environments) && fish.environments.includes(gameState.currentEnvironment);
            const timeMatch = Array.isArray(fish?.times) && fish.times.includes(gameState.currentTime);
            return envMatch && timeMatch;
        });


        if (fishInCurrentContext && gameState.status === 'ready') {
            elements.fishShadow.classList.remove('hidden');
            const duration = Math.random() * 4 + 3; // 3-7 seconds
            const direction = Math.random() < 0.5 ? 'left' : 'right';
            // Ensure CSS animations fish-swim-left and fish-swim-right are defined
            elements.fishShadow.style.animation = `fish-swim-${direction} ${duration}s infinite ease-in-out`;
            // Randomize position slightly
            elements.fishShadow.style.left = `${Math.random() * 80 + 10}%`;
            elements.fishShadow.style.bottom = `${Math.random() * 30 + 5}%`;

            // Hide after duration and schedule next
            setTimeout(() => {
                if (gameState.status === 'ready') { // Only hide if still ready
                    elements.fishShadow.classList.add('hidden');
                    elements.fishShadow.style.animation = ''; // Stop animation
                }
                scheduleNextFishAppearance();
            }, duration * 1000);
        } else {
            elements.fishShadow.classList.add('hidden'); // Ensure hidden if no fish/not ready
            scheduleNextFishAppearance(); // Schedule next check even if not shown
        }
    };

    const scheduleNextFishAppearance = () => {
        // Ensure interval values are valid numbers
        const intervalMin = gameState.randomFishAppearance.interval[0] || 5000;
        const intervalMax = gameState.randomFishAppearance.interval[1] || 15000;
        const nextAppearanceTime = Math.random() * (intervalMax - intervalMin) + intervalMin;
        gameState.randomFishAppearance.timer = setTimeout(showFish, nextAppearanceTime);
        // console.log(`Next fish shadow check in ${Math.round(nextAppearanceTime / 1000)}s`);
    };

    scheduleNextFishAppearance(); // Start the cycle
}

// Stops the random fish shadow timer and hides the shadow
function stopRandomFishAppearance() {
    clearTimeout(gameState.randomFishAppearance.timer);
    if (elements.fishShadow) { // Check if element exists
        elements.fishShadow.classList.add('hidden');
        elements.fishShadow.style.animation = ''; // Stop animation
    }
    // console.log("停止隨機魚影");
}

// --- Utility Functions ---

// Gets the display text for a rarity value
function getFishRarityText(rarityValue) {
    switch (rarityValue) {
        case 1: return '普通';
        case 2: return '進階'; // Roo: Corrected label to match wheel-app.js (Attempt 3)
        case 3: return '稀有';
        case 4: return '傳說';
        default: return '未知';
    }
}

// Gets the color associated with a rarity value
function getRarityColor(rarityValue) {
    // Match colors defined in wheel-app.js for consistency
    const colorMap = {
        1: '#81C784', // 普通 - Greenish
        2: '#64B5F6', // 高級 - Blueish
        3: '#E57373', // 稀有 - Reddish
        4: '#FFB74D'  // 傳說 - Orangeish
    };
    return colorMap[rarityValue] || '#FFFFFF'; // Default white
}

// Placeholder sound functions - TODO: Implement actual sound playback if desired
// function playSuccessSound() { console.log("播放成功音效 (TODO)"); }
// function playFailSound() { console.log("播放失敗音效 (TODO)"); }
// function playRaritySound(rarityValue) { console.log(`播放稀有度 ${rarityValue} 音效 (TODO)`); }

// Roo: Rewritten function to update environment-specific collection counts
function updateEnvironmentCounts() {
    // Ensure fishDatabase is loaded and is an array
    if (!window.fishDatabase || !Array.isArray(window.fishDatabase)) {
        console.error("[updateEnvironmentCounts] fishDatabase not available or not an array.");
        return;
    }
    // Ensure gameState.caughtFish is an array
    if (!Array.isArray(gameState.caughtFish)) {
        console.warn("[updateEnvironmentCounts] gameState.caughtFish is not an array. Initializing.");
        gameState.caughtFish = []; // Initialize if not an array
    }
    console.log("[updateEnvironmentCounts] Updating counts...");

    elements.environmentBtns.forEach(btn => {
        const environmentName = btn.getAttribute('data-environment'); // Should be Chinese string like '沿岸'
        const countSpan = btn.querySelector('.env-count');
        if (!environmentName || !countSpan) {
            console.warn("[updateEnvironmentCounts] Button missing data-environment or countSpan:", btn);
            return; // Skip this button
        }

        try {
            // Filter all fish for this environment
            const totalInEnv = window.fishDatabase.filter(fish =>
                fish && Array.isArray(fish.environments) && fish.environments.includes(environmentName)
            ).length;

            // Filter caught fish for this environment
            const caughtInEnv = gameState.caughtFish.filter(fish =>
                fish && Array.isArray(fish.environments) && fish.environments.includes(environmentName)
            ).length;

            const countText = `${caughtInEnv}/${totalInEnv}`;
            countSpan.textContent = countText;

            // Log calculated counts and the text being set
            console.log(`[updateEnvironmentCounts] Env Button: "${environmentName}" (Length: ${environmentName.length}), Caught: ${caughtInEnv}, Total: ${totalInEnv}, Setting text: "${countText}"`);

            // Log the first caught fish's environment array for comparison (if any caught)
            const firstCaughtFishInEnv = gameState.caughtFish.find(f => f && Array.isArray(f.environments) && f.environments.includes(environmentName));
            if (firstCaughtFishInEnv && Array.isArray(firstCaughtFishInEnv.environments) && firstCaughtFishInEnv.environments.length > 0) {
                console.log(`[updateEnvironmentCounts] First caught fish env array for "${environmentName}": ${JSON.stringify(firstCaughtFishInEnv.environments)} (Value: "${firstCaughtFishInEnv.environments[0]}", Length: ${firstCaughtFishInEnv.environments[0].length})`);
            }

        } catch (error) {
              console.error(`[updateEnvironmentCounts] Error processing environment ${environmentName}:`, error);
              countSpan.textContent = 'ERR'; // Indicate error on the button
        }
    });
}


// --- Game Reset ---

// Confirms and executes game reset
function confirmRestart() {
    if (confirm('確定要重設所有遊戲進度嗎？\n這會清空您的圖鑑和所有已捕獲的魚！')) {
        console.log('玩家確認重設遊戲');
        localStorage.removeItem('caughtFish'); // Clear saved data
        gameState.caughtFish = []; // Clear current state
        updateCaughtCounter(); // Update display
        renderFishCollection(); // Re-render empty collection (if modal is open)
        resetFishingState(); // Reset fishing state
        changeEnvironment('沿岸'); // Reset to default environment
        gameState.currentTime = '早上'; // Reset to default time
        updateTimeDisplay();
        startTimeChangeCycle(); // Restart time cycle
        updateStatusMessage('遊戲已重設，祝您好運！');
        updateEnvironmentCounts(); // Reset env counts display
    } else {
        console.log('玩家取消重設遊戲');
    }
}

// --- Event Listeners Setup ---

function setupEventListeners() {
    // Ensure elements exist before adding listeners
    if (elements.castBtn) elements.castBtn.addEventListener('click', startFishing);

    // Collection panel
    if (elements.collectionBtn) {
        elements.collectionBtn.addEventListener('click', () => {
            renderFishCollection(); // Render content first
            if (elements.collectionPanel) elements.collectionPanel.classList.remove('hidden');
        });
    }
    if (elements.closeCollection) {
        elements.closeCollection.addEventListener('click', () => {
            if (elements.collectionPanel) elements.collectionPanel.classList.add('hidden');
        });
    }

    // Environment buttons
    elements.environmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const environment = btn.getAttribute('data-environment');
            if (environment) changeEnvironment(environment);
        });
    });

    // Collection filters
    if (elements.filterEnvironment) elements.filterEnvironment.addEventListener('change', renderFishCollection);
    if (elements.filterTime) elements.filterTime.addEventListener('change', renderFishCollection);
    if (elements.filterRarity) elements.filterRarity.addEventListener('change', renderFishCollection);

    // Restart button
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', confirmRestart);
}

// --- Game Initialization ---

function initGame() {
    console.log("Initializing game...");
    // Ensure fishDatabase is loaded from fish-data.js before proceeding
    if (typeof window.fishDatabase === 'undefined' || !Array.isArray(window.fishDatabase)) {
        console.error("fishDatabase 未定義或不是陣列！請確保 fish-data.js 已正確載入。");
        updateStatusMessage("錯誤：無法載入魚類資料！", true);
        return; // Stop initialization if fish data is missing
    }

    loadCaughtFish();
    updateCaughtCounter();
    updateEnvironmentCounts(); // Update environment counts on init
    setupEventListeners();
    initEnvironmentButtons(); // Set initial button states

    // Explicitly set initial environment state and apply classes
    if (gameState.currentEnvironment) {
        changeEnvironment(gameState.currentEnvironment); // Applies class via updateFishingAreaClass
    } else {
        console.warn("Initial environment not set, defaulting might occur.");
        changeEnvironment('沿岸'); // Set a default if needed
    }

    // Update display and fishing area class for initial time
    updateTimeDisplay(); // Sets the time text and calls updateFishingAreaClass

    // Vue wheel initialization is handled by wheel-app.js
    // Do NOT call any initializeRarityWheel() function here

    console.log('遊戲初始化完成');
    resetFishingState(); // Ensure clean state on start
    // Roo: Call counts one last time synchronously after all init steps (Attempt 3)
    updateEnvironmentCounts();
}

// --- Start Game ---
// Make sure this runs after the DOM is ready and potentially after wheel-app.js has initialized the Vue app
document.addEventListener('DOMContentLoaded', initGame);