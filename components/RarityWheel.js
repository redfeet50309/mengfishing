// RarityWheel component with Vue 3 Composition API
const RarityWheel = {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    onResult: {
      type: Function,
      default: () => {}
    }
  },
  
  setup(props, { emit }) {
    const { ref, watch, computed, onMounted } = Vue;

    // Wheel state
    const isSpinning = ref(false);
    const rotationAngle = ref(0);
    const resultRarity = ref(null);
    
    // Rarity configurations
    const rarityConfig = {
      legendary: {
        color: '#FFD700', // Gold
        probability: 0.03,
        startAngle: 342,
        endAngle: 360
      },
      rare: {
        color: '#9966CC', // Purple
        probability: 0.18,
        startAngle: 288,
        endAngle: 342
      },
      premium: {
        color: '#4169E1', // Royal Blue
        probability: 0.36,
        startAngle: 180,
        endAngle: 288
      },
      common: {
        color: '#808080', // Gray
        probability: 0.43,
        startAngle: 0,
        endAngle: 180
      }
    };

    // Watch for props changes
    watch(
      () => props.visible,
      (newValue) => {
        if (newValue) {
          startSpin();
        }
      }
    );

    // Calculate the final angle for the spin based on rarity
    const calculateFinalAngle = (rarity) => {
      const config = rarityConfig[rarity];
      if (!config) return 360 * 5 + Math.random() * 360; // Default
      
      // Calculate random angle within the rarity's range
      const range = config.endAngle - config.startAngle;
      const randomAngle = config.startAngle + Math.random() * range;
      
      // Add multiple full rotations for spinning effect (at least 5)
      return 360 * 5 + randomAngle;
    };

    // Start the spin animation
    const startSpin = () => {
      isSpinning.value = true;
      rotationAngle.value = 0;
      resultRarity.value = null;
      
      // Initial spinning animation
      requestAnimationFrame(updateSpin);
    };

    // Update the spin animation
    const updateSpin = () => {
      if (!isSpinning.value) return;
      
      if (resultRarity.value) {
        // We have a result, animate to the final position
        const finalAngle = calculateFinalAngle(resultRarity.value);
        animateToFinalPosition(finalAngle);
      } else {
        // Continue spinning until we get a result
        rotationAngle.value += 10;
        requestAnimationFrame(updateSpin);
      }
    };

    // Animate to the final position with easing
    const animateToFinalPosition = (finalAngle) => {
      const duration = 3000; // 3 seconds for slowing down
      const startAngle = rotationAngle.value;
      const angleToRotate = finalAngle - (startAngle % 360);
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - easeOutCubic
        const easing = 1 - Math.pow(1 - progress, 3);
        rotationAngle.value = startAngle + angleToRotate * easing;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          finishSpin();
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Determine random rarity based on probabilities
    const determineRandomRarity = () => {
      const random = Math.random();
      let cumulativeProbability = 0;
      
      for (const [rarity, config] of Object.entries(rarityConfig)) {
        cumulativeProbability += config.probability;
        if (random <= cumulativeProbability) {
          return rarity;
        }
      }
      
      return 'common'; // 默認普通
    };

    // Finish the spin and emit the result
    const finishSpin = () => {
      isSpinning.value = false;
      
      // Determine the rarity result
      const result = determineRandomRarity();
      resultRarity.value = result;
      
      // Add vibration effect to the pointer
      const pointerElement = document.querySelector('.wheel-pointer');
      if (pointerElement) {
        pointerElement.classList.add('vibrate');
        setTimeout(() => {
          pointerElement.classList.remove('vibrate');
        }, 1000);
      }
      
      // Emit the result after a short pause
      setTimeout(() => {
        emit('result', {
          id: result,
          label: getDisplayLabel(result)
        });
        
        // Also expose the result for the global handler
        if (window.handleRarityResult) {
          window.handleRarityResult(getDisplayLabel(result));
        }
      }, 500);
    };
    
    // Convert rarity id to display label
    const getDisplayLabel = (rarityId) => {
      const map = {
        'legendary': '傳說',
        'rare': '稀有',
        'premium': '進階',
        'common': '普通'
      };
      return map[rarityId] || rarityId;
    };

    // Computed styles
    const wheelStyle = computed(() => {
      return {
        transform: `rotate(${rotationAngle.value}deg)`,
        transition: isSpinning.value ? 'none' : 'transform 0.5s ease'
      };
    });

    onMounted(() => {
      console.log('稀有度轉盤組件已初始化');
      // 將開始旋轉方法暴露給全局
      window.rarityWheelAPI = {
        startSpin
      };
    });

    return {
      isSpinning,
      rotationAngle,
      rarityConfig,
      wheelStyle
    };
  },
  template: `
    <div class="rarity-wheel-container" v-if="visible">
      <div class="wheel-title">稀有度轉盤</div>
      <div class="wheel-area">
        <div class="wheel" :style="wheelStyle">
          <svg viewBox="0 0 100 100">
            <!-- Legendary sector (3% - Gold) -->
            <path d="M50,50 L50,0 A50,50 0 0,1 64.28,3.45 Z" :fill="rarityConfig.legendary.color" stroke="white" stroke-width="0.5"></path>
            
            <!-- Rare sector (18% - Purple) -->
            <path d="M50,50 L64.28,3.45 A50,50 0 0,1 93.30,25 Z" :fill="rarityConfig.rare.color" stroke="white" stroke-width="0.5"></path>
            
            <!-- Premium sector (36% - Blue) -->
            <path d="M50,50 L93.30,25 A50,50 0 0,1 50,100 Z" :fill="rarityConfig.premium.color" stroke="white" stroke-width="0.5"></path>
            
            <!-- Common sector (43% - Gray) -->
            <path d="M50,50 L50,100 A50,50 0 0,1 0,50 A50,50 0 0,1 50,0 Z" :fill="rarityConfig.common.color" stroke="white" stroke-width="0.5"></path>
          </svg>
        </div>
        <div class="wheel-pointer">
          <div class="pointer-tip"></div>
          <div class="pointer-label">指針</div>
        </div>
      </div>
      
      <div class="rarity-legend">
        <div class="rarity-item">
          <div class="color-box" :style="{ backgroundColor: rarityConfig.legendary.color }"></div>
          <span class="rarity-name">傳奇 (3%)</span>
        </div>
        <div class="rarity-item">
          <div class="color-box" :style="{ backgroundColor: rarityConfig.rare.color }"></div>
          <span class="rarity-name">稀有 (18%)</span>
        </div>
        <div class="rarity-item">
          <div class="color-box" :style="{ backgroundColor: rarityConfig.premium.color }"></div>
          <span class="rarity-name">進階 (36%)</span>
        </div>
        <div class="rarity-item">
          <div class="color-box" :style="{ backgroundColor: rarityConfig.common.color }"></div>
          <span class="rarity-name">普通 (43%)</span>
        </div>
      </div>
    </div>
  `
};

// 全局註冊組件（適用於非模組化環境）
if (typeof Vue !== 'undefined') {
  Vue.component('rarity-wheel', RarityWheel);
}

// 同時支援模組導出
export default RarityWheel;