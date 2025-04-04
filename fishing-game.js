// 釣魚竿元素
const fishingRod = document.createElement('div');
fishingRod.innerHTML = `
    <svg width="120" height="200" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
        <!-- 竿子手柄 - 圓潤可愛風格 -->
        <rect x="80" y="10" width="20" height="35" rx="8" ry="8" fill="#FF9E80" stroke="#FF6E40" stroke-width="2" />
        
        <!-- 手柄裝飾 - 可愛圖案 -->
        <circle cx="90" cy="20" r="4" fill="#FFAB91" />
        <circle cx="90" cy="35" r="4" fill="#FFAB91" />
        
        <!-- 竿子主體 - 更圓滑的曲線 -->
        <path d="M25,125 Q55,75 80,25" stroke="#FF8A65" stroke-width="6" stroke-linecap="round" />
        
        <!-- 竿子連接處 - 可愛的心形裝飾 -->
        <path d="M80,25 C76,20 74,22 80,28 C86,22 84,20 80,25" fill="#FF5252" />
        
        <!-- 釣線 - 加入微微的曲線 -->
        <path d="M25,125 Q22,150 25,170" stroke="#E0E0E0" stroke-width="2" />
        
        <!-- 釣鉤 - 更可愛的造型 -->
        <path d="M25,170 C22,175 28,180 25,177 L25,170" stroke="#BDBDBD" fill="#F5F5F5" stroke-width="2" />
        
        <!-- 添加小魚食餌 -->
        <circle cx="25" cy="176" r="3" fill="#FFF9C4" stroke="#FBC02D" stroke-width="1" />
    </svg>
`;
fishingRod.style.position = 'absolute';
fishingRod.style.top = '0';
fishingRod.style.right = '150px'; // 調整位置讓釣竿更靠近水面
fishingRod.style.zIndex = '10';
fishingRod.style.transform = 'rotate(-5deg)'; // 稍微傾斜一點更有活力
gameContainer.appendChild(fishingRod);

// 浮標元素
// ... existing code ... 