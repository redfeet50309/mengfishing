// wheel-app.js
// 稀有度輪盤主應用

// Vue組件定義
const app = Vue.createApp({
  data() {
    return {
      isVisible: false,
      isSpinning: false,
      resultRarity: null,
      rarities: [
        { name: '普通', color: '#7E8287', probability: 0.60 },
        { name: '進階', color: '#45AAFF', probability: 0.25 },
        { name: '稀有', color: '#FF6B8E', probability: 0.10 },
        { name: '傳說', color: '#FFD700', probability: 0.05 }
      ]
    };
  },
  methods: {
    show() {
      this.isVisible = true;
      console.log('顯示輪盤');
    },
    hide() {
      this.isVisible = false;
      this.resultRarity = null;
      console.log('隱藏輪盤');
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
      console.log('旋轉完成:', result);
      this.isSpinning = false;
      
      // 通知遊戲邏輯
      if (typeof window.handleRarityResult === 'function') {
        window.handleRarityResult(result);
      }
      
      // 延遲隱藏輪盤
      setTimeout(() => {
        this.hide();
      }, 2000);
    }
  },
  template: `
    <div v-if="isVisible" class="rarity-wheel-overlay">
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