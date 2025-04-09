// 定義轉盤組件
const RarityWheel = {
    template: `
        <div class="rarity-wheel">
            <div class="rarity-legend">
                <div class="legend-title">稀有度機率:</div>
                <div v-for="segment in segments" :key="segment.label" class="legend-item">
                    <span class="legend-color" :style="{ backgroundColor: segment.color }"></span>
                    <span class="legend-text">{{ segment.label }}: {{ Math.round(segment.probability * 100) }}%</span>
                </div>
            </div>
            
            <div class="wheel-area">
                <div class="wheel-svg-container">
                    <div class="pointer"></div>
                    <svg
                        :width="size"
                        :height="size"
                        :viewBox="\`0 0 \${size} \${size}\`"
                        class="wheel"
                        :style="wheelStyle"
                    >
                        <g :transform="\`translate(\${size/2}, \${size/2})\`">
                            <!-- 普通 (50%) - 綠色 -->
                            <path
                                d="M 0 0 L 0 -150 A 150 150 0 0 1 150 0 Z"
                                fill="#4CAF50"
                            />
                            <!-- 高級 (30%) - 藍色 -->
                            <path
                                d="M 0 0 L 150 0 A 150 150 0 0 1 0 150 Z"
                                fill="#2196F3"
                            />
                            <!-- 稀有 (15%) - 紫色 -->
                            <path
                                d="M 0 0 L 0 150 A 150 150 0 0 1 -129.9 75 Z"
                                fill="#9C27B0"
                            />
                            <!-- 傳說 (5%) - 金色 -->
                            <path
                                d="M 0 0 L -129.9 75 A 150 150 0 0 1 -147.5 25 Z"
                                fill="#FFC107"
                            />
                            <!-- 完成圓環 -->
                            <path
                                d="M 0 0 L -147.5 25 A 150 150 0 0 1 0 -150 Z"
                                fill="#FFC107"
                            />

                            <!-- 中心圓 -->
                            <circle r="40" fill="#333333" />
                            
                            <!-- 稀有度文字 -->
                            <text x="0" y="-85" text-anchor="middle" fill="white" font-weight="bold">普通</text>
                            <text x="85" y="0" text-anchor="middle" fill="white" font-weight="bold">高級</text>
                            <text x="-50" y="85" text-anchor="middle" fill="white" font-weight="bold">稀有</text>
                            <text x="-120" y="0" text-anchor="middle" fill="white" font-weight="bold">傳說</text>
                        </g>
                    </svg>
                </div>
            </div>
            
            <div class="wheel-controls">
                <button
                    class="spin-button"
                    @click="stopSpin"
                    :disabled="!isSpinning || isStopping"
                >
                    點擊停止
                </button>
            </div>
        </div>
    `,
    
    setup() {
        const { ref, computed, onMounted } = Vue;
        
        // 定義轉盤區段
        const segments = [
            { label: '普通', probability: 0.5, color: '#4CAF50', startAngle: 0, endAngle: 180 },
            { label: '高級', probability: 0.3, color: '#2196F3', startAngle: 180, endAngle: 270 },
            { label: '稀有', probability: 0.15, color: '#9C27B0', startAngle: 270, endAngle: 324 },
            { label: '傳說', probability: 0.05, color: '#FFC107', startAngle: 324, endAngle: 360 }
        ];

        // 狀態
        const size = 300;
        const currentAngle = ref(0);
        const isSpinning = ref(false);
        const isStopping = ref(false);
        const animationId = ref(null);
        const spinDuration = 3000;
        const spinSpeed = ref(5);

        // 計算轉盤樣式
        const wheelStyle = computed(() => {
            if (isStopping.value) {
                return {
                    transform: `rotate(${currentAngle.value}deg)`,
                    transition: `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.21, 0.9)`
                };
            } else {
                return {
                    transform: `rotate(${currentAngle.value}deg)`,
                    transition: 'none'
                };
            }
        });

        // 開始旋轉
        function startSpin() {
            console.log("開始旋轉轉盤");
            if (isSpinning.value || isStopping.value) return;
            
            isSpinning.value = true;
            spinSpeed.value = 8; // 稍微增加旋轉速度
            
            function animate() {
                if (!isSpinning.value) return;
                
                currentAngle.value = (currentAngle.value + spinSpeed.value) % 360;
                animationId.value = requestAnimationFrame(animate);
            }
            
            animate();
        }

        // 停止旋轉
        function stopSpin() {
            if (!isSpinning.value || isStopping.value) return;
            console.log("停止轉盤");
            
            isSpinning.value = false;
            isStopping.value = true;
            cancelAnimationFrame(animationId.value);

            // 計算停在哪個稀有度
            const random = Math.random();
            let finalAngle = 0;
            let result = '';
            let accumulatedProbability = 0;
            
            for (const segment of segments) {
                accumulatedProbability += segment.probability;
                if (random <= accumulatedProbability) {
                    const midAngle = (segment.startAngle + segment.endAngle) / 2;
                    finalAngle = midAngle; // 停在區段中間
                    result = segment.label;
                    break;
                }
            }
            
            // 添加額外旋轉
            const extraRotations = 5 * 360;
            const stopAngle = currentAngle.value % 360;
            const targetAngle = currentAngle.value - stopAngle + extraRotations + finalAngle;
            
            currentAngle.value = targetAngle;
            
            setTimeout(() => {
                isStopping.value = false;
                if (window.handleRarityResult) {
                    window.handleRarityResult(result);
                }
            }, spinDuration);
        }

        // 掛載完成後，將方法暴露到全局
        onMounted(() => {
            window.rarityWheelAPI = {
                startSpin,
                stopSpin
            };
            
            // 自動啟動轉盤
            console.log("組件掛載完成，等待外部調用 startSpin");
        });

        return {
            size,
            segments,
            currentAngle,
            isSpinning,
            isStopping,
            wheelStyle,
            stopSpin
        };
    }
};

// 創建並掛載 Vue 應用
document.addEventListener('DOMContentLoaded', () => {
    const app = Vue.createApp({
        components: {
            'rarity-wheel': RarityWheel
        }
    });
    
    app.mount('#rarity-wheel-app');
    
    console.log("轉盤組件已初始化");
});