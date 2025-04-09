// scripts/rarity-wheel.js
// 稀有度輪盤整合腳本

import { RarityWheel } from '../components/index.js';

// 稀有度配置
const RARITIES = [
  { name: '普通', color: '#7E8287', probability: 60 },
  { name: '高級', color: '#45AAFF', probability: 25 },
  { name: '稀有', color: '#FF6B8E', probability: 10 },
  { name: '傳說', color: '#FFD700', probability: 5 }
];

// 初始化輪盤應用
export function initRarityWheel() {
  const { createApp, ref } = Vue;
  
  const app = createApp({
    components: {
      RarityWheel
    },
    
    setup() {
      const showWheel = ref(false);
      const lastResult = ref(null);
      
      const openWheel = () => {
        showWheel.value = true;
      };
      
      const handleResult = (result) => {
        lastResult.value = result;
        console.log('抽取結果:', result);
        
        // 這裡可以根據抽取結果進行後續處理
        // 例如: 決定釣魚獲得的魚的稀有度
      };
      
      return {
        showWheel,
        lastResult,
        rarities: RARITIES,
        openWheel,
        handleResult
      };
    },
    
    template: `
      <div class="rarity-wheel-app">
        <button class="fishing-button" @click="openWheel">開始釣魚</button>
        
        <RarityWheel
          v-model:visible="showWheel"
          :rarities="rarities"
          @result="handleResult"
        />
      </div>
    `
  });
  
  // 掛載到DOM
  const mountPoint = document.getElementById('rarity-wheel-app');
  if (mountPoint) {
    app.mount(mountPoint);
  } else {
    console.error('找不到輪盤掛載點 #rarity-wheel-app');
  }
}

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  // 確保Vue已載入
  if (typeof Vue !== 'undefined') {
    initRarityWheel();
  } else {
    console.error('找不到Vue庫。請確保在使用rarity-wheel.js前已加載Vue 3。');
  }
});