// wheel-app.js
// 稀有度輪盤主應用

// Vue組件定義
const app = Vue.createApp({
  data() {
    return {
      isVisible: false,
      isSpinning: false,
      resultRarity: null,
      hideTimeoutId: null, // Roo: Add state to store hide timer ID
      rarities: [
        { name: '普通', color: '#81C784', probability: 0.60 }, // 淺綠色
        { name: '進階', color: '#64B5F6', probability: 0.25 }, // 柔和藍
        { name: '稀有', color: '#E57373', probability: 0.10 }, // 柔和紅
        { name: '傳說', color: '#FFB74D', probability: 0.05 }  // 橘黃色
      ]
    };
  },
  methods: {
    show() {
      // Roo: Clear any pending hide timer before showing
      if (this.hideTimeoutId) {
        clearTimeout(this.hideTimeoutId);
        this.hideTimeoutId = null;
        console.log('[WheelApp] Cleared pending hide timer.');
      }
      this.isVisible = true;
      this.isSpinning = false; // Roo: Ensure spinning is reset when shown
      this.resultRarity = null; // Roo: Ensure result is reset when shown
      console.log('[WheelApp] Showing wheel.');
    },
    hide() {
      this.isVisible = false;
      this.resultRarity = null;
      this.isSpinning = false; // Roo: Ensure spinning is false when hidden
      // Roo: Clear timer if hide is called directly
      if (this.hideTimeoutId) {
        clearTimeout(this.hideTimeoutId);
        this.hideTimeoutId = null;
      }
      console.log('[WheelApp] Hiding wheel.');
    },
    startSpin() {
      if (this.isSpinning) return;
      
      this.isSpinning = true;
      console.log('開始旋轉');
      
      // 隨機決定結果 (根據稀有度概率)
      const random = Math.random();
      let cumulativeProbability = 0;
      
      for (const rarity of this.rarities) {
        cumulativeProbability += rarity.probability;
        if (random <= cumulativeProbability) {
          // 延遲設置結果，讓動畫有時間旋轉
          setTimeout(() => {
            this.resultRarity = rarity.name;
            console.log('選擇結果:', rarity.name);
          }, 100);
          break;
        }
      }
    },
    handleSpinComplete(result) {
      // Roo: Add detailed logging for debugging consistency
      console.log('[WheelApp] Spin animation complete. Visual Result:', result);
      // Roo: Compare calculated rarity with visual result
      console.log('[WheelApp] Calculated Rarity (from startSpin):', this.resultRarity);
      console.log('[WheelApp] Visual Result (from component):', result);
      if (this.resultRarity !== result) {
          console.warn('[WheelApp] MISMATCH DETECTED between calculated rarity and visual result!');
      }
      console.log('[WheelApp] Current isSpinning state:', this.isSpinning); // Should be true before setting false
      this.isSpinning = false;
      console.log('[WheelApp] isSpinning set to false.');

      // 通知遊戲邏輯
      if (typeof window.handleRarityResult === 'function') {
        console.log('[WheelApp] Calling window.handleRarityResult with:', result);
        window.handleRarityResult(result); // This is where the external logic takes over
        console.log('[WheelApp] Returned from window.handleRarityResult.');
      } else {
        console.warn('[WheelApp] window.handleRarityResult function not found.');
      }

      // 延遲隱藏輪盤
      console.log('[WheelApp] Scheduling wheel hide in 2 seconds.');
      // Roo: Store the timeout ID
      this.hideTimeoutId = setTimeout(() => {
        console.log('[WheelApp] Hiding wheel via timer.');
        this.hide();
        this.hideTimeoutId = null; // Roo: Clear the ID after execution
      }, 2000);
    }
  },
  template: `
    <div v-show="isVisible" class="rarity-wheel-overlay">
      <div class="rarity-wheel-container">
        <h2 class="rarity-wheel-title">釣魚稀有度</h2>
        <rarity-wheel
          :rarities="rarities"
          :is-spinning="isSpinning"
          :result-rarity="resultRarity"
          @spin-complete="handleSpinComplete"
        ></rarity-wheel>
        <button v-if="!isSpinning && !resultRarity" @click="startSpin" class="spin-button">
          轉動輪盤
        </button>
      </div>
    </div>
  `
});

// 全局API
window.RarityWheelApp = {
  show() {
    const vm = app._instance?.proxy;
    if (vm) {
      vm.show();
      // Roo: Removed automatic spin on show
      // setTimeout(() => {
      //   vm.startSpin();
      // }, 500);
    }
  },
  hide() {
    const vm = app._instance?.proxy;
    if (vm) {
      vm.hide();
    }
  },
  // Roo: Add startSpin to the global API
  startSpin() {
    const vm = app._instance?.proxy;
    if (vm && typeof vm.startSpin === 'function') {
      vm.startSpin();
    } else {
      console.error('[WheelApp API] Cannot call startSpin. Vue instance or method not found.');
    }
  }
};

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', async () => { // Roo: Make async
  try {
    // Roo: Read component from global scope (for file:/// compatibility)
    // const RarityWheelModule = await import('./components/RarityWheel.js'); // Removed dynamic import
    const RarityWheelComponent = window.GlobalRarityWheelComponent;

    if (!RarityWheelComponent) {
      console.error('無法從 RarityWheel.js 加載組件定義');
      return;
    }

    // Roo: Register the component before mounting
    app.component('rarity-wheel', RarityWheelComponent);
    console.log('RarityWheel 組件已註冊');

    // 掛載應用 (Roo: Prioritize the correct visible container)
    const primaryMountEl = document.getElementById('rarity-wheel-app');
    const fallbackMountEl = document.getElementById('wheel-app'); // Fallback to the one in hidden modal (less ideal)

    if (primaryMountEl) {
      app.mount(primaryMountEl);
      console.log('輪盤應用已初始化並掛載到 #rarity-wheel-app');
    } else if (fallbackMountEl) {
      // Fallback if primary target doesn't exist
      app.mount(fallbackMountEl);
      console.warn('輪盤應用已掛載到備用目標 #wheel-app');
    } else {
      console.error('找不到掛載元素 #rarity-wheel-app 或 #wheel-app');
    }
  } catch (error) {
    console.error('初始化輪盤應用時出錯:', error);
  }
});