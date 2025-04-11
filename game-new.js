  // Game state variables
const gameState = {
        status: 'ready', // ready, fishing, spinning, result
        caughtFish: [],
        currentFish: null,
        selectedRarity: null,
        currentEnvironment: '沙灘', // Default environment
        currentTime: '早上', // Default time
        fishingEvents: [ // Example events, can be localized/improved
                "魚線輕輕晃動", "浮標稍微下沉", "好像有什麼東西靠近了...",
                "水面泛起漣漪", "感覺到底部有動靜", "遠處傳來海鷗的叫聲",
                "浮標動了一下", "魚線被輕輕拉扯", "好像有大魚上鉤了！",
                "魚線突然繃緊"
        ],
        randomFishAppearance: {
                enabled: true,
                timer: null,
                interval: [5000, 15000] // ms
        }
};

// DOM element references
const elements = {
        castBtn: document.getElementById('cast-btn'),
        pullBtn: document.getElementById('pull-btn'),
        statusText: document.getElementById('status-text'),
        fishHook: document.getElementById('fish-hook'),
        floatObject: document.getElementById('float-object'),
        splash: document.getElementById('splash'),
        fishShadow: document.querySelector('.fish-shadow'),
        fishingArea: document.querySelector('.fishing-area'),
        // Use the ID defined in index.html for the Vue app mount point
        wheelAppContainer: document.getElementById('rarity-wheel-app'),
        fishCaughtPanel: document.getElementById('fish-caught-panel'),
        caughtFishImg: document.getElementById('caught-fish-img'),
        caughtFishName: document.getElementById('caught-fish-name'),
        caughtFishRarity: document.getElementById('caught-fish-rarity'),
        caughtFishEnvTime: document.getElementById('caught-fish-environment-time'),
        caughtFishDesc: document.getElementById('caught-fish-desc'),
        continueBtn: document.getElementById('continue-btn'),
        currentTimeDisplay: document.getElementById('current-time'),
        gameStatus: document.getElementById('game-status'),
        collectionBtn: document.getElementById('collection-btn'),
        collectionPanel: document.getElementById('collection-panel'),
        collectionCount: document.getElementById('collection-count'),
        fishCollectionGrid: document.getElementById('fish-collection'),
        closeCollection: document.getElementById('close-collection-btn'),
        environmentBtns: document.querySelectorAll('.environment-btn'),
        restartBtn: document.getElementById('restart-adventure-btn'),
        caughtFishCounter: document.getElementById('caught-fish'),
        filterEnvironment: document.getElementById('filter-environment'),
        filterTime: document.getElementById('filter-time'),
        filterRarity: document.getElementById('filter-rarity'),
};

// Global variables (consider namespacing later if project grows)
let isFishing = false;
let biteTimeout = null; // Legacy timer, likely unused now
let pullTimeout = null; // Legacy timer, likely unused now
let timeChangeInterval = null;
const TIME_CYCLE_DURATION = 5 * 60 * 1000; // 5 minutes
const TIMES_OF_DAY = ['早上', '中午', '晚上']; // Ensure these match fish-data.js

// --- Rarity Wheel Interaction ---

// This function will be called by the Vue app (wheel-app.js) when the wheel result is determined
window.handleRarityResult = function(rarityLabel) {
        console.log('接收到轉盤結果: ', rarityLabel);
        if (gameState.status !== 'spinning') {
                console.warn("接收到轉盤結果，但遊戲狀態不是 spinning");
                // If the state is already 'result' or 'ready', maybe ignore?
                // If it's 'fishing' or 'biting' (legacy states), might indicate a logic error.
                // For now, proceed but be aware of potential state issues.
        }
        gameState.status = 'result'; // Update status after spinning

        // Convert label to numeric value
        // Roo: Fix garbled keys. Ensure these match the names used in RarityWheel.js and wheel-app.js
        const rarityMap = { '普通': 1, '進階': 2, '稀有': 3, '傳說': 4 };
        const rarityValue = rarityMap[rarityLabel];

        if (!rarityValue) {
                console.error('無效的稀有度標籤: ', rarityLabel);
                updateStatusMessage('轉盤結果異常，請重試');
                resetFishingState();
                return;
        }

        gameState.selectedRarity = rarityValue;
        updateStatusMessage(`抽中了 <span style="color: ${getRarityColor(rarityValue)}">${rarityLabel}</span> 稀有度！`);

        // Select fish based on rarity, environment, and time
        const selectedFish = selectFishByRarity(rarityValue);
        if (!selectedFish) {
                console.error('找不到符合稀有度、環境、時間的魚: ', rarityValue, gameState.currentEnvironment, gameState.currentTime);
                updateStatusMessage('這個環境和時間好像沒有這種稀有度的魚...');
                // Don't reset immediately, let the notification show the rarity result first
                setTimeout(resetFishingState, 3000);
                return;
        }

        gameState.currentFish = selectedFish;

        // Play sound effect
        playRaritySound(rarityValue);

        // Check if it's a new fish for the collection
        const isNewFish = !gameState.caughtFish.some(fish => fish.id === selectedFish.id);

        // Show the caught fish notification panel
        showFishNotification(selectedFish, isNewFish);

        // If it's a new fish, add it to the collection and save
        if (isNewFish) {
                gameState.caughtFish.push({ ...selectedFish }); // Add a copy
                saveCaughtFish();
                updateCaughtCounter();
        }

        // Reset state is now handled by the notification's continue button or timeout
};

// Selects a fish matching rarity, current environment, and current time
function selectFishByRarity(rarityValue) {
        // Ensure fishDatabase is loaded and is an array
        if (!Array.isArray(fishDatabase)) {
                console.error("fishDatabase 未載入或不是陣列");
                return null;
        }
        const possibleFish = fishDatabase.filter(fish => {
                // ** Crucial Check **: Ensure fish object and its properties exist before accessing
                if (!fish || typeof fish.rarity !== 'number') return false;

                // Add checks for existence and type of arrays before calling includes
                const envMatch = Array.isArray(fish.environments) && fish.environments.includes(gameState.currentEnvironment);
                const timeMatch = Array.isArray(fish.times) && fish.times.includes(gameState.currentTime);
                return fish.rarity === rarityValue && envMatch && timeMatch;
        });

        if (possibleFish.length === 0) {
                return null; // No matching fish found
        }

        // Randomly select one from the possible fish
        const randomIndex = Math.floor(Math.random() * possibleFish.length);
        return possibleFish[randomIndex];
}

// --- Fishing Process ---

// Starts the fishing process (casting the line)
function startFishing() {
        console.log('開始拋竿');
        if (gameState.status !== 'ready') {
                console.warn(`無法開始拋竿，目前狀態: ${gameState.status}`);
                return;
        }

        gameState.status = 'spinning'; // Go directly to spinning state
        isFishing = true; // Track fishing cycle

        elements.castBtn.disabled = true;
        elements.castBtn.textContent = '轉盤轉動中...';
        updateStatusMessage('拋竿成功... 等待轉盤結果！');

        showFishingAnimation();
        stopRandomFishAppearance();

        // Show and spin the Vue wheel using the API from wheel-app.js
        // Ensure window.RarityWheelApp is available (initialized by wheel-app.js)
        if (window.RarityWheelApp && typeof window.RarityWheelApp.show === 'function') {
                window.RarityWheelApp.show(); // show() in wheel-app.js should handle starting the spin
        } else {
                console.error('Vue 轉盤 API (window.RarityWheelApp) 未找到或 show 方法不存在');
                updateStatusMessage('轉盤初始化失敗，請重試');
                resetFishingState(); // Reset if wheel cannot be shown/spun
        }
}

// Resets the game state to ready for fishing
function resetFishingState() {
        console.log('重置釣魚狀態');
        gameState.status = 'ready';
        gameState.currentFish = null;
        gameState.selectedRarity = null;
        isFishing = false;

        clearTimeout(biteTimeout); // Clear any pending legacy timers
        clearTimeout(pullTimeout);

        elements.castBtn.disabled = false;
        elements.castBtn.textContent = '拋竿';
        elements.pullBtn.classList.add('hidden');
        elements.pullBtn.classList.remove('active');
        elements.fishHook.classList.add('hidden');
        elements.floatObject.classList.add('hidden');
        elements.floatObject.classList.remove('bite');
        elements.fishShadow.classList.add('hidden');
        elements.fishCaughtPanel.classList.add('hidden'); // Ensure notification panel is hidden

        // Hide the Vue wheel using the API from wheel-app.js
        if (window.RarityWheelApp && typeof window.RarityWheelApp.hide === 'function') {
                window.RarityWheelApp.hide();
        } else {
                  console.warn('Vue 轉盤 API (window.RarityWheelApp) 未找到或 hide 方法不存在');
                  // Fallback: try hiding the container directly if API is not ready (might conflict)
                  // if (elements.wheelAppContainer) {
                  //     elements.wheelAppContainer.style.display = 'none';
                  // }
        }

        updateStatusMessage('準備好，可以拋竿了！');
        if (elements.gameStatus) elements.gameStatus.textContent = '等待轉盤決定魚的稀有度！'; // Reset wheel status text

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
        const targetHeight = 150;
        const interval = setInterval(() => {
                hookHeight += 5;
                if (hookHeight >= targetHeight) {
                        hookHeight = targetHeight;
                        clearInterval(interval);
                        elements.floatObject.style.transform = `translateY(${targetHeight - 6}px)`;
                        elements.splash.style.top = `${targetHeight - 15}px`;
                        elements.splash.style.left = `calc(50% - 20px)`;
                        elements.splash.classList.remove('hidden');
                        setTimeout(() => elements.splash.classList.add('hidden'), 700);
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
        if (!elements.fishCaughtPanel || !fish) return;

        elements.caughtFishImg.src = fish.image || 'images/default-fish.png';
        elements.caughtFishName.textContent = fish.name + (isNew ? ' (新發現!)' : '');
        elements.caughtFishRarity.textContent = `稀有度: ${getFishRarityText(fish.rarity)}`;
        elements.caughtFishRarity.style.color = getRarityColor(fish.rarity);
        // Ensure environments and times are arrays before joining
        const envText = Array.isArray(fish.environments) ? fish.environments.join(', ') : '未知';
        const timeText = Array.isArray(fish.times) ? fish.times.join(', ') : '未知';
        elements.caughtFishEnvTime.textContent = `環境: ${envText} | 時間: ${timeText}`;
        elements.caughtFishDesc.textContent = fish.description || '沒有描述';

        elements.fishCaughtPanel.classList.remove('hidden');

        // Handle continue button click
        elements.continueBtn.onclick = () => {
                elements.fishCaughtPanel.classList.add('hidden');
                // Reset state only after notification is closed
                resetFishingState();
        };
}

// --- Fish Collection (Pokedex) Logic ---

// Adds a caught fish to the state if it's new
function addCaughtFish(fish) {
        if (!fish || typeof fish.id === 'undefined') return false; // Basic validation
        const existingFish = gameState.caughtFish.find(f => f.id === fish.id);
        if (!existingFish) {
                gameState.caughtFish.push({ ...fish }); // Store a copy
                saveCaughtFish();
                console.log(`新魚加入圖鑑: ${fish.name}`);
                return true;
        }
        console.log(`已經抓過: ${fish.name}`);
        return false;
}

// Updates the caught fish counter display
function updateCaughtCounter() {
        // Ensure fishDatabase is loaded
        const totalFish = Array.isArray(fishDatabase) ? fishDatabase.length : 0;
        const caughtCount = gameState.caughtFish.length;
        if (elements.caughtFishCounter) {
                elements.caughtFishCounter.innerHTML = `<i class="fas fa-trophy"></i> 已捕捉: ${caughtCount}/${totalFish}`;
        }
        if (elements.collectionCount) {
                elements.collectionCount.textContent = `(${caughtCount}/${totalFish})`;
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
                                console.log(`從 localStorage 載入了 ${validFish.length} 條魚`);
                        } else {
                                console.warn('localStorage 中的 caughtFish 不是有效的陣列，將重置');
                                gameState.caughtFish = [];
                                localStorage.removeItem('caughtFish');
                        }
                } else {
                        gameState.caughtFish = []; // Initialize if nothing is saved
                }
        } catch (e) {
                console.error('讀取 localStorage 中的 caughtFish 失敗: ', e);
                gameState.caughtFish = []; // Reset on error
                localStorage.removeItem('caughtFish'); // Clear potentially corrupted data
        }
}


// Saves caught fish data to localStorage
function saveCaughtFish() {
        try {
                localStorage.setItem('caughtFish', JSON.stringify(gameState.caughtFish));
        } catch (e) {
                console.error('儲存 caughtFish 到 localStorage 失敗: ', e);
                // Optionally notify the user or handle the error (e.g., if storage is full)
        }
}


// Renders the fish collection based on filters
function renderFishCollection() {
        if (!elements.fishCollectionGrid || !Array.isArray(fishDatabase)) return;
        elements.fishCollectionGrid.innerHTML = ''; // Clear existing content

        // Get filter values
        const filterEnv = elements.filterEnvironment.value;
        const filterTime = elements.filterTime.value;
        const filterRarity = elements.filterRarity.value;

        // Iterate through all possible fish
        fishDatabase.forEach(fish => {
                if (!fish || typeof fish.id === 'undefined') return; // Skip invalid fish data

                const isCaught = gameState.caughtFish.some(caught => caught.id === fish.id);

                // Apply filters with checks for array existence
                const envMatch = filterEnv === 'all' || (Array.isArray(fish.environments) && fish.environments.includes(filterEnv));
                const timeMatch = filterTime === 'all' || (Array.isArray(fish.times) && fish.times.includes(filterTime));
                const rarityMatch = filterRarity === 'all' || (typeof fish.rarity === 'number' && fish.rarity === parseInt(filterRarity));

                if (envMatch && timeMatch && rarityMatch) {
                        const fishCard = document.createElement('div');
                        fishCard.classList.add('fish-card');
                        fishCard.classList.toggle('not-caught', !isCaught);

                        fishCard.innerHTML = `
                                <img src="${isCaught ? (fish.image || 'images/default-fish.png') : 'images/unknown-fish.png'}" alt="${isCaught ? fish.name : '未捕捉'}">
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
function initEnvironments() {
        elements.environmentBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-environment') === gameState.currentEnvironment);
        });
}

// Changes the current fishing environment
function changeEnvironment(newEnvironment) {
        if (gameState.status !== 'ready') {
                updateStatusMessage('釣魚中無法切換環境！');
                return;
        }
        // Validate newEnvironment if necessary
        gameState.currentEnvironment = newEnvironment;
        console.log(`環境切換為: ${newEnvironment}`);
        updateStatusMessage(`已切換到 ${newEnvironment} 環境`);

        // Update button active state
        elements.environmentBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-environment') === newEnvironment);
        });

        // updateBackgroundForEnvironment(newEnvironment); // Optional visual change
        startRandomFishAppearance(); // Restart fish shadow timer for new environment
}

// Starts the automatic time changing cycle
function startTimeChangeCycle() {
        clearInterval(timeChangeInterval); // Clear existing interval if any
        timeChangeInterval = setInterval(() => {
                const currentIndex = TIMES_OF_DAY.indexOf(gameState.currentTime);
                const nextIndex = (currentIndex + 1) % TIMES_OF_DAY.length;
                gameState.currentTime = TIMES_OF_DAY[nextIndex];
                console.log(`時間切換為: ${gameState.currentTime}`);
                updateTimeDisplay();
                startRandomFishAppearance(); // Restart fish shadow timer for new time
        }, TIME_CYCLE_DURATION);
}

// Updates the time display element and sky visuals
function updateTimeDisplay() {
        if (elements.currentTimeDisplay) {
                elements.currentTimeDisplay.textContent = gameState.currentTime;
        }
        updateSkyForTime(gameState.currentTime);
}

// Updates sky visuals based on time of day
function updateSkyForTime(time) {
        const sky = document.querySelector('.sky');
        const sun = document.querySelector('.sun');
        // const moon = document.querySelector('.moon'); // Add if you have a moon element

        if (!sky || !sun) return;

        sky.className = 'sky'; // Reset classes first
        sun.style.display = 'block'; // Default to showing sun
        // if (moon) moon.style.display = 'none'; // Default hide moon

        switch (time) {
                case '早上':
                        sky.classList.add('sky-morning');
                        sun.style.opacity = '0.8';
                        sun.style.top = '10px'; // Adjust position as needed
                        break;
                case '中午':
                        sky.classList.add('sky-noon');
                        sun.style.opacity = '1';
                        sun.style.top = '5px'; // Adjust position as needed
                        break;
                case '晚上':
                        sky.classList.add('sky-night');
                        sun.style.display = 'none'; // Hide sun
                        // if (moon) moon.style.display = 'block'; // Show moon
                        break;
                default:
                          console.warn("未知的時間: ", time);
                          // Apply default (e.g., morning) styles?
                          sky.classList.add('sky-morning');
                          sun.style.opacity = '0.8';
                          sun.style.top = '10px';
                          break;
        }
}


// --- Random Fish Shadow Logic ---

// Starts the timer for showing random fish shadows
function startRandomFishAppearance() {
        if (!gameState.randomFishAppearance.enabled || !elements.fishShadow) return;
        stopRandomFishAppearance(); // Clear existing timer first

        const showFish = () => {
                // ** Crucial Check **: Ensure fishDatabase is loaded and is an array
                if (!Array.isArray(fishDatabase)) {
                          console.error("fishDatabase 未載入或不是陣列，無法顯示魚影");
                          scheduleNextFishAppearance(); // Still schedule next check
                          return;
                }

                // Check if fish exist in the current context before showing shadow
                const fishInCurrentContext = fishDatabase.some(fish => {
                          // Add checks for array existence before includes
                          const envMatch = Array.isArray(fish?.environments) && fish.environments.includes(gameState.currentEnvironment);
                          const timeMatch = Array.isArray(fish?.times) && fish.times.includes(gameState.currentTime);
                          return envMatch && timeMatch;
                });


                if (fishInCurrentContext && gameState.status === 'ready') {
                        elements.fishShadow.classList.remove('hidden');
                        const duration = Math.random() * 4 + 3; // 3-7 seconds
                        const direction = Math.random() < 0.5 ? 'left' : 'right';
                        elements.fishShadow.style.animation = `fish-swim-${direction} ${duration}s infinite ease-in-out`;
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
		case 2: return '進階';
		case 3: return '稀有';
		case 4: return '傳說';

        }
}

// Gets the color associated with a rarity value
function getRarityColor(rarityValue) {
        const colorMap = {
                1: '#7E8287', // Grey
                2: '#45AAFF', // Blue
                3: '#FF6B8E', // Pink
                4: '#FFD700'  // Gold
        };
        return colorMap[rarityValue] || '#FFFFFF'; // Default white
}

// Placeholder sound functions - TODO: Implement actual sound playback
function playSuccessSound() { console.log("播放成功音效 (TODO)"); }
function playFailSound() { console.log("播放失敗音效 (TODO)"); }
function playRaritySound(rarityValue) { console.log(`播放稀有度 ${rarityValue} 音效 (TODO)`); }

// --- Game Reset ---

// Confirms and executes game reset
function confirmRestart() {
        if (confirm('確定要重置冒險嗎？所有已捕捉的魚都會消失！')) {
                console.log('玩家確認重置冒險');
                localStorage.removeItem('caughtFish'); // Clear saved data
                gameState.caughtFish = []; // Clear current state
                updateCaughtCounter(); // Update display
                renderFishCollection(); // Re-render empty collection
                resetFishingState(); // Reset fishing state
                changeEnvironment('沙灘'); // Reset to default environment
                gameState.currentTime = '早上'; // Reset to default time
                updateTimeDisplay();
                startTimeChangeCycle(); // Restart time cycle
                updateStatusMessage('冒險已重置，祝你好運！');
        } else {
                console.log('玩家取消重置冒險');
        }
}

// --- Event Listeners Setup ---

function setupEventListeners() {
        // Ensure elements exist before adding listeners
        if (elements.castBtn) elements.castBtn.addEventListener('click', startFishing);
        // elements.pullBtn listener might be obsolete

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
        if (typeof fishDatabase === 'undefined' || !Array.isArray(fishDatabase)) {
                  console.error("fishDatabase 未載入或不是陣列！請確保 fish-data.js 已正確載入。");
                  updateStatusMessage("錯誤：無法載入魚類資料！");
                  return; // Stop initialization if fish data is missing
        }

        loadCaughtFish();
        updateCaughtCounter();
        setupEventListeners();
        initEnvironments(); // Set initial button states
        // changeEnvironment(gameState.currentEnvironment); // Apply initial environment visuals/logic - called by initEnvironments? Redundant? Check initEnvironments logic. Let's call it explicitly.
        if (gameState.currentEnvironment) {
                changeEnvironment(gameState.currentEnvironment);
        } else {
                console.warn("Initial environment not set, defaulting might occur.");
        }
        startTimeChangeCycle();
        updateTimeDisplay();

        // Vue wheel initialization is handled by wheel-app.js
        // Do NOT call any initializeRarityWheel() function here

        console.log('遊戲初始化完成');
        resetFishingState(); // Ensure clean state on start
}

// --- Start Game ---
// Make sure this runs after wheel-app.js has potentially initialized the Vue app
document.addEventListener('DOMContentLoaded', initGame);

// --- Legacy/Obsolete Functions (Can be removed later) ---
/*
function initializeRarityWheel() {
        // This function is removed as wheel-app.js handles Vue initialization
        console.warn("initializeRarityWheel in game-new.js is obsolete and should be removed.");
}

function fishBite() {
        // Obsolete: Wheel determines outcome
        console.log('魚咬鉤了! (Legacy)');
}

function pullFish() {
        // Obsolete: Wheel determines outcome
        console.log('拉竿! (Legacy)');
}
*/