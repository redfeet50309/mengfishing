// components/RarityWheel.js
import { ref, computed, onMounted, watch } from 'vue';

export default {
  name: 'RarityWheel',
  props: {
    rarities: {
      type: Array,
      required: true,
      // 每個稀有度應包含名稱、顏色和機率
      validator: (value) => {
        return value.every(item => 
          typeof item.name === 'string' && 
          typeof item.color === 'string' && 
          typeof item.probability === 'number'
        );
      }
    },
    isSpinning: {
      type: Boolean,
      default: false
    },
    resultRarity: {
      type: String,
      default: ''
    }
  },
  
  setup(props, { emit }) {
    const wheelRef = ref(null);
    const rotation = ref(0);
    const targetRotation = ref(0);
    const animationId = ref(null);
    const spinComplete = ref(false);
    
    const totalSegments = computed(() => props.rarities.length);
    const segmentAngle = computed(() => 360 / totalSegments.value);
    
    // 計算每個稀有度區段的起始角度和結束角度
    const segments = computed(() => {
      let currentAngle = 0;
      return props.rarities.map(rarity => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (rarity.probability * 360);
        currentAngle = endAngle;
        
        return {
          ...rarity,
          startAngle,
          endAngle
        };
      });
    });
    
    // 為每個區段創建SVG路徑
    const segmentPaths = computed(() => {
      return segments.value.map(segment => {
        return createSectorPath(segment.startAngle, segment.endAngle, 150);
      });
    });
    
    // 創建扇形路徑
    function createSectorPath(startAngle, endAngle, radius) {
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 150 + radius * Math.cos(startRad);
      const y1 = 150 + radius * Math.sin(startRad);
      const x2 = 150 + radius * Math.cos(endRad);
      const y2 = 150 + radius * Math.sin(endRad);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }
    
    // 旋轉輪盤到目標稀有度
    function spinToRarity(rarityName) {
      if (!rarityName) return;
      
      // 先找到對應稀有度的段落
      const targetSegment = segments.value.find(seg => seg.name === rarityName);
      if (!targetSegment) return;
      
      // 計算目標角度 (段落中點)
      const targetAngle = (targetSegment.startAngle + targetSegment.endAngle) / 2;
      
      // 加上多轉幾圈的效果 (3-5圈)
      const extraSpins = 3 + Math.floor(Math.random() * 3);
      targetRotation.value = 360 * extraSpins + targetAngle;
      
      // 開始動畫
      startSpinAnimation();
    }
    
    // 動畫旋轉輪盤
    function startSpinAnimation() {
      spinComplete.value = false;
      
      // 確定當前位置和目標位置
      const startRotation = rotation.value % 360;
      const distance = targetRotation.value - startRotation;
      const duration = 5000; // 5秒
      const startTime = performance.now();
      
      // 停止現有的動畫
      if (animationId.value) {
        cancelAnimationFrame(animationId.value);
      }
      
      // 動畫函數
      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用緩動函數使動畫看起來更自然
        // 開始快，結束慢
        const easeOut = function(t) {
          return 1 - Math.pow(1 - t, 3);
        };
        
        rotation.value = startRotation + distance * easeOut(progress);
        
        if (progress < 1) {
          animationId.value = requestAnimationFrame(animate);
        } else {
          // 動畫完成
          spinComplete.value = true;
          emit('spin-complete', props.resultRarity);
        }
      }
      
      animationId.value = requestAnimationFrame(animate);
    }
    
    // 監聽結果稀有度的變化
    watch(() => props.resultRarity, (newRarity) => {
      if (newRarity && props.isSpinning) {
        spinToRarity(newRarity);
      }
    });
    
    // 監聽旋轉狀態的變化
    watch(() => props.isSpinning, (isSpinning) => {
      if (isSpinning && props.resultRarity) {
        spinToRarity(props.resultRarity);
      }
    });
    
    // 暴露方法給父組件
    const manualSpin = (rarityName) => {
      spinToRarity(rarityName);
    };
    
    return {
      wheelRef,
      rotation,
      segments,
      segmentPaths,
      spinComplete,
      manualSpin
    };
  },
  
  // 組件模板
  template: `
    <div class="rarity-wheel-container">
      <div class="rarity-wheel-area">
        <div class="rarity-wheel" ref="wheelRef" :style="{ transform: 'rotate(' + rotation + 'deg)' }">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path 
                v-for="(path, index) in segmentPaths" 
                :key="'segment-' + index"
                :d="path"
                :fill="segments[index].color"
                stroke="#ffffff"
                stroke-width="1"
              />
              
              <!-- 稀有度標籤 -->
              <text 
                v-for="(segment, index) in segments" 
                :key="'text-' + index"
                :x="150 + 120 * Math.cos((segment.startAngle + segment.endAngle) / 2 * Math.PI / 180)"
                :y="150 + 120 * Math.sin((segment.startAngle + segment.endAngle) / 2 * Math.PI / 180)"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#ffffff"
                font-weight="bold"
                font-size="14"
                transform="rotate(90, 150, 150)"
              >
                {{ segment.name }}
              </text>
            </g>
          </svg>
        </div>
        
        <!-- 指針 -->
        <div class="wheel-pointer">
          <div class="pointer"></div>
          <div class="pointer-base"></div>
        </div>
      </div>
      
      <!-- 稀有度圖例 -->
      <div class="rarity-legend">
        <div v-for="(rarity, index) in rarities" :key="'legend-' + index" class="legend-item">
          <span class="color-box" :style="{ backgroundColor: rarity.color }"></span>
          <span class="rarity-name">{{ rarity.name }}</span>
          <span class="rarity-percentage">{{ (rarity.probability * 100).toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  `
};