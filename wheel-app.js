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
      setTimeout(() => {
        vm.startSpin();
      }, 500);
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
document.addEventListener('DOMContentLoaded', () => {
  // 註冊RarityWheel組件
  const RarityWheel = {
    props: {
      rarities: Array,
      isSpinning: Boolean,
      resultRarity: String
    },
    emits: ['spin-complete'],
    template: `
      <div class="wheel-component">
        <div class="wheel-area">
          <div class="wheel" :class="{ spinning: isSpinning }" ref="wheel">
            <div 
              v-for="(rarity, index) in rarities" 
              :key="index"
              class="wheel-segment"
              :style="{
                '--segment-color': rarity.color,
                '--segment-start': index * (360 / rarities.length) + 'deg',
                '--segment-end': (index + 1) * (360 / rarities.length) + 'deg'
              }"
            >
              <span class="segment-label">{{ rarity.name }}</span>
            </div>
          </div>
          <div class="wheel-pointer"></div>
        </div>
      </div>
    `,
    data() {
      return {
        spinning: false,
        finalAngle: 0
      };
    },
    watch: {
      isSpinning(newVal) {
        if (newVal && this.resultRarity) {
          this.spin(this.resultRarity);
        }
      },
      resultRarity(newVal) {
        if (this.isSpinning && newVal) {
          this.spin(newVal);
        }
      }
    },
    methods: {
      spin(resultRarity) {
        if (!this.$refs.wheel) return;
        
        // 找到結果稀有度的索引
        const resultIndex = this.rarities.findIndex(r => r.name === resultRarity);
        if (resultIndex === -1) return;
        
        // 計算目標角度 (段落中點)
        const segmentSize = 360 / this.rarities.length;
        const targetAngle = resultIndex * segmentSize + segmentSize / 2;
        
        // 額外旋轉圈數 (3-5圈)
        const extraRotations = 3 + Math.floor(Math.random() * 3);
        this.finalAngle = extraRotations * 360 + targetAngle;
        
        // 應用旋轉動畫
        this.$refs.wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        this.$refs.wheel.style.transform = `rotate(${-this.finalAngle}deg)`;
        
        // 動畫結束後發出事件
        setTimeout(() => {
          this.$emit('spin-complete', resultRarity);
        }, 4500);
      }
    }
  };
  
  app.component('rarity-wheel', RarityWheel);
  
  // 掛載應用
  const mountEl = document.getElementById('wheel-app');
  if (mountEl) {
    app.mount(mountEl);
    console.log('輪盤應用已初始化');
  } else {
    console.error('找不到掛載元素 #wheel-app');
  }
});