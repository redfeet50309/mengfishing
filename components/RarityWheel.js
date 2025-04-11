// components/RarityWheel.js
// Roo: Removed import for non-module script
// import { ref, computed, onMounted, watch } from 'vue';

const RarityWheelComponentDefinition = {
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
    // Roo: Use global Vue object
    const wheelRef = Vue.ref(null);
    const rotation = Vue.ref(0);
    const targetRotation = Vue.ref(0);
    const animationId = Vue.ref(null);
    const spinComplete = Vue.ref(false); // Roo: Indicates if the spin animation finished
    const highlightedSegmentName = Vue.ref(''); // Roo: Track which segment name is highlighted
    const highlightTimeoutId = Vue.ref(null); // Roo: To clear previous highlight timeout

    const totalSegments = Vue.computed(() => props.rarities.length);
    const segmentAngle = Vue.computed(() => 360 / totalSegments.value);
    
    // Roo: Change segments from computed to ref to allow modification (highlighting)
    const segments = Vue.ref([]);

    function updateSegments() {
      let currentAngle = 0;
      segments.value = props.rarities.map(rarity => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (rarity.probability * 360);
        currentAngle = endAngle % 360; // Ensure angle stays within 360

        return {
          ...rarity,
          startAngle,
          endAngle,
          isHighlighted: false // Roo: Add highlight state
        };
      });
    }

    // Roo: Initial calculation and watch for prop changes
    Vue.onMounted(() => {
      updateSegments();
      // Roo: Log initial ref state
      console.log('[RarityWheel] Mounted, wheelRef:', wheelRef.value);
    });
    Vue.watch(() => props.rarities, updateSegments, { deep: true });


    // 為每個區段創建SVG路徑 (Now depends on segments.value)
    const segmentPaths = Vue.computed(() => {
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
      if (!rarityName || !segments.value || segments.value.length === 0) return; // Roo: Add check for segments

      // Roo: Clear previous highlight and timeout
      clearHighlight();
      if (highlightTimeoutId.value) {
        clearTimeout(highlightTimeoutId.value);
        highlightTimeoutId.value = null;
      }

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
      // Roo: Log ref state at animation start
      console.log('[RarityWheel] Starting spin animation, wheelRef:', wheelRef.value);
      spinComplete.value = false; // Roo: Reset spin complete flag
      clearHighlight(); // Roo: Clear highlight when starting spin

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
        
        // Roo: Log ref state BEFORE updating rotation
        console.log('[RarityWheel] Animate frame, wheelRef before update:', wheelRef.value);
        
        // Roo: Check if wheel element still exists before updating rotation
        if (wheelRef.value) {
            rotation.value = startRotation + distance * easeOut(progress);
        } else {
            console.warn('[RarityWheel] wheelRef is null during animation, stopping.'); // Roo: Add warning
            // Roo: If element is gone, stop the animation
            cancelAnimationFrame(animationId.value);
            animationId.value = null;
            return; // Exit animation loop
        }
        
        if (progress < 1) {
          animationId.value = requestAnimationFrame(animate);
        } else {
          // 動畫完成
          rotation.value = targetRotation.value; // Ensure exact final rotation
          spinComplete.value = true;
          highlightResult(props.resultRarity); // Roo: Highlight the result
          emit('spin-complete', props.resultRarity);
        }
      }
      
      animationId.value = requestAnimationFrame(animate);
    }

    // Roo: Function to highlight the winning segment
    function highlightResult(rarityName) {
      clearHighlight(); // Clear previous just in case
      const segmentIndex = segments.value.findIndex(s => s.name === rarityName);
      if (segmentIndex !== -1) {
        segments.value[segmentIndex].isHighlighted = true;
        highlightedSegmentName.value = rarityName; // Store highlighted name

        // Set timeout to remove highlight after a delay
        highlightTimeoutId.value = setTimeout(() => {
           // Roo: Check if component/element still exists before clearing highlight
           if (wheelRef.value) {
               clearHighlight();
           }
        }, 2500); // Highlight duration: 2.5 seconds
      }
    }

    // Roo: Function to clear highlight state from all segments
    function clearHighlight() {
        segments.value.forEach(s => s.isHighlighted = false);
        highlightedSegmentName.value = '';
        if (highlightTimeoutId.value) {
          clearTimeout(highlightTimeoutId.value);
          highlightTimeoutId.value = null;
        }
    }

    // 監聽結果稀有度的變化
    Vue.watch(() => props.resultRarity, (newRarity) => {
      // Roo: Use nextTick to ensure DOM is ready before spinning
      if (newRarity && props.isSpinning) {
        Vue.nextTick(() => {
            spinToRarity(newRarity);
        });
      }
    });
    
    // 監聽旋轉狀態的變化
    Vue.watch(() => props.isSpinning, (isSpinning) => {
      // Roo: Use nextTick to ensure DOM is ready before spinning (redundant check, but safe)
      if (isSpinning && props.resultRarity) {
         Vue.nextTick(() => {
            spinToRarity(props.resultRarity);
         });
      }
    });
    
    // 暴露方法給父組件
    const manualSpin = (rarityName) => {
      spinToRarity(rarityName);
    };

    // Roo: Add cleanup logic before unmount
    Vue.onBeforeUnmount(() => {
      // Roo: Log ref state before unmount
      console.log('[RarityWheel] Before unmount, wheelRef:', wheelRef.value, 'animationId:', animationId.value, 'highlightTimeoutId:', highlightTimeoutId.value);
      
      // Roo: Prioritize cancelling animation frame IMMEDIATELY
      if (animationId.value) {
        console.log('[RarityWheel] Cancelling animation frame:', animationId.value);
        cancelAnimationFrame(animationId.value);
        animationId.value = null; // Ensure it's nullified
      }

      // 清除高亮超時
      if (highlightTimeoutId.value) {
        console.log('[RarityWheel] Clearing highlight timeout:', highlightTimeoutId.value);
        clearTimeout(highlightTimeoutId.value);
        highlightTimeoutId.value = null; // Ensure it's nullified
      }
      
      // Roo: Optional: Explicitly clear the ref (might help prevent race conditions)
      // wheelRef.value = null;
      // console.log('[RarityWheel] Explicitly set wheelRef to null');
    });
    
    return {
      wheelRef,
      rotation,
      segments,
      segmentPaths,
      spinComplete,
      highlightedSegmentName, // Roo: Expose for result display
      manualSpin
    };
  },
  
  // 組件模板
  template: '#rarity-wheel-template', // 指向 HTML 中的模板
};

// Roo: Expose to global scope for file:/// compatibility
window.GlobalRarityWheelComponent = RarityWheelComponentDefinition;

// Roo: Removed export for non-module script
// export default RarityWheelComponentDefinition;