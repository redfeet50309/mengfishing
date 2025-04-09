// 魚類資料庫

// 使用簡單的Base64編碼來處理SVG圖片
// 創建一個函數將SVG內容轉換為普通的base64編碼
function createSvgDataUrl(svgContent) {
    try {
        // 將SVG內容轉換為base64編碼
        // 處理中文字符可能導致的錯誤
        const base64 = btoa(unescape(encodeURIComponent(svgContent)));
        return `data:image/svg+xml;base64,${base64}`;
    } catch (error) {
        console.error('SVG編碼錯誤:', error);
        // 返回一個基本的備用SVG
        const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="#616161"/>
            <text x="100" y="100" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圖片錯誤</text>
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(fallbackSvg)))}`;
    }
}

// 定義SVG魚圖標
const fish1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#FFC107"/>
    <path d="M60,100 C80,70 120,70 140,100 C120,130 80,130 60,100 Z" fill="white" stroke="#FF5722" stroke-width="2"/>
    <circle cx="80" cy="90" r="5" fill="black"/>
    <path d="M140,100 L180,90 M140,100 L180,110" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">萌萌金魚</text>
</svg>`;

const fish2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#2979FF"/>
    <path d="M40,100 C60,80 140,80 170,100 C140,120 60,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="65" cy="95" r="5" fill="black"/>
    <path d="M40,100 L20,75 M40,100 L20,125" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M90,80 L90,40" stroke="white" stroke-width="2"/>
    <text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">波波旗魚</text>
</svg>`;

const fish3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#AA00FF"/>
    <path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100 Z" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="70" cy="90" r="5" fill="black"/>
    <path d="M80,70 L85,75 M100,70 L105,75 M120,70 L125,75 M80,130 L85,125 M100,130 L105,125 M120,130 L125,125" stroke="#673AB7" stroke-width="2" stroke-linecap="round"/>
    <text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓石斑</text>
</svg>`;

const fish4Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#673AB7"/>
    <path d="M30,120 C60,120 70,80 100,80 C130,80 140,120 170,120" fill="none" stroke="white" stroke-width="10" stroke-linecap="round"/>
    <circle cx="50" cy="120" r="4" fill="black"/>
    <circle cx="150" cy="120" r="4" fill="black"/>
    <text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">軟軟鰻魚</text>
</svg>`;

const fish5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#607D8B"/>
    <path d="M60,100 C80,80 120,80 150,100 C120,120 80,120 60,100 Z" fill="white" stroke="black" stroke-width="2"/>
    <circle cx="80" cy="90" r="5" fill="black"/>
    <path d="M60,100 L30,90 M60,100 L30,100 M60,100 L30,110" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">萌萌鯰魚</text>
</svg>`;

// 定義默認魚圖標
const defaultFishSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#616161"/>
    <path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="#9E9E9E" stroke="black" stroke-width="2"/>
    <circle cx="80" cy="90" r="5" fill="black"/>
    <text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">未知魚類</text>
</svg>`;

// 創建默認魚圖像並確保它在全域空間可用
const defaultFishImage = createSvgDataUrl(defaultFishSvg);
window.defaultFishImage = defaultFishImage;

const fishDatabase = [
    // 沿岸環境 - 20種魚
    {
        id: 1,
        name: "萌萌金魚",
        description: "色彩鮮豔的金魚，在清晨的沿岸水域特別活躍。",
        image: createSvgDataUrl(fish1Svg),
        rarity: 1, // 普通
        environment: "沿岸", // 環境
        time: "早上", // 出現時間
        probability: 5.86 // 出現機率
    },
    {
        id: 2,
        name: "波波旗魚",
        description: "中午時分在沿岸出沒的普通旗魚，游速適中。",
        image: createSvgDataUrl(fish2Svg),
        rarity: 1, // 普通
        environment: "沿岸",
        time: "中午",
        probability: 10.65
    },
    {
        id: 3,
        name: "圓圓石斑",
        description: "早上在沿岸活動的石斑魚，體型圓潤可愛。",
        image: createSvgDataUrl(fish3Svg),
        rarity: 1,
        environment: "沿岸",
        time: "早上",
        probability: 5.41
    },
    {
        id: 4,
        name: "軟軟鰻魚",
        description: "夜間沿岸常見的鰻魚，觸感柔軟滑溜。",
        image: createSvgDataUrl(fish4Svg),
        rarity: 1,
        environment: "沿岸",
        time: "晚上",
        probability: 12.77
    },
    {
        id: 5,
        name: "萌萌鯰魚",
        description: "晚上在沿岸出沒的鯰魚，有著可愛的長鬍鬚。",
        image: createSvgDataUrl(fish5Svg),
        rarity: 1,
        environment: "沿岸",
        time: "晚上",
        probability: 13.60
    },
    {
        id: 6,
        name: "嫩嫩柳葉魚",
        description: "中午時分在沿岸覓食的柳葉魚，肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩柳葉魚</text></svg>`,
        rarity: 1,
        environment: "沿岸",
        time: "中午",
        probability: 13.98
    },
    {
        id: 7,
        name: "QQ魟魚",
        description: "中午在沿岸游動的魟魚，身體彈性十足。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><circle cx="120" cy="90" r="5" fill="black"/><path d="M100,110 C90,120 110,120 100,110" stroke="black" fill="none"/><path d="M100,60 L100,30 M70,70 L50,50 M130,70 L150,50" stroke="white" stroke-width="2"/><text x="100" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="white">QQ魟魚</text></svg>`,
        rarity: 1,
        environment: "沿岸",
        time: "中午",
        probability: 6.98
    },
    {
        id: 8,
        name: "嫩嫩劍魚",
        description: "夜晚在沿岸悠游的劍魚，嘴部的劍還很嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><path d="M50,100 L20,100" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="90" r="5" fill="black"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩劍魚</text></svg>`,
        rarity: 1,
        environment: "沿岸",
        time: "晚上",
        probability: 7.03
    },
    {
        id: 9,
        name: "波波龍魚",
        description: "早上在沿岸游動的龍魚，有波浪般的鰭。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F44336"/><path d="M30,100 C50,60 150,60 170,100 C150,140 50,140 30,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M90,60 L100,40 M110,60 L120,40 M90,140 L100,160 M110,140 L120,160" stroke="gold" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">波波龍魚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "早上",
        probability: 7.54
    },
    {
        id: 10,
        name: "圓圓比目魚",
        description: "早上在沿岸活動的比目魚，身體特別圓潤。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="30" fill="white" stroke="black" stroke-width="2"/><circle cx="75" cy="85" r="5" fill="black"/><circle cx="90" cy="85" r="5" fill="black"/><path d="M120,90 C130,95 140,95 150,90" stroke="black" fill="none"/><text x="100" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓比目魚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "早上",
        probability: 5.42
    },
    {
        id: 11,
        name: "軟軟河豚",
        description: "晚上在沿岸覓食的河豚，摸起來特別柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23795548"/><circle cx="100" cy="100" r="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M100,60 L100,45 M70,70 L60,55 M130,70 L140,55 M70,130 L60,145 M130,130 L140,145 M100,140 L100,155" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">軟軟河豚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "晚上",
        probability: 5.78
    },
    {
        id: 12,
        name: "甜甜燈籠魚",
        description: "中午在沿岸出沒的燈籠魚，散發著甜甜的光芒。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23000000"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="%23444444" stroke="%23FFEB3B" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="%23FFEB3B"/><circle cx="80" cy="90" r="15" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.5"/><circle cx="80" cy="90" r="25" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.3"/><path d="M140,100 L160,100" stroke="%23FFEB3B" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="%23FFEB3B">甜甜燈籠魚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "中午",
        probability: 3.59
    },
    {
        id: 13,
        name: "小捲捲青魚",
        description: "晚上在沿岸游動的青魚，鰭捲捲的非常可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,80 Q100,70 110,80 M90,120 Q100,130 110,120" stroke="%2300BFFF" stroke-width="2"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">小捲捲青魚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "晚上",
        probability: 3.30
    },
    {
        id: 14,
        name: "小捲捲泡泡魚",
        description: "早上在沿岸冒泡泡的小魚，鰭像捲捲的紙。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230288D1"/><path d="M60,100 C70,85 130,85 140,100 C130,115 70,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="4" fill="black"/><path d="M140,100 L155,100" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="90" r="5" fill="white"/><circle cx="170" cy="80" r="3" fill="white"/><path d="M90,85 Q95,75 100,85 M90,115 Q95,125 100,115" stroke="%230288D1" stroke-width="2"/><text x="95" y="105" font-family="Arial" font-size="12" text-anchor="middle" fill="black">小捲捲泡泡魚</text></svg>`,
        rarity: 2,
        environment: "沿岸",
        time: "早上",
        probability: 5.22
    },
    {
        id: 15,
        name: "滑滑蝦虎魚",
        description: "早上在沿岸的蝦虎魚，身體滑溜難以抓住。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23004D40"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="%23009688" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M50,100 L30,90 M50,100 L30,110" stroke="%2380CBC4" stroke-width="2" stroke-linecap="round"/><path d="M110,80 L120,60 M110,120 L120,140" stroke="%2380CBC4" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑蝦虎魚</text></svg>`,
        rarity: 3,
        environment: "沿岸",
        time: "早上",
        probability: 1.89
    },
    {
        id: 16,
        name: "波波飛魚",
        description: "中午在沿岸表面跳躍的飛魚，鰭如波浪般美麗。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231976D2"/><path d="M40,100 C60,85 140,85 160,100 C140,115 60,115 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M100,85 L120,50 M100,115 L120,150" stroke="%231976D2" stroke-width="8" stroke-linecap="round"/><path d="M40,100 L20,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="95" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">波波飛魚</text></svg>`,
        rarity: 3,
        environment: "沿岸",
        time: "中午",
        probability: 2.42
    },
    {
        id: 17,
        name: "波波刺魚",
        description: "晚上在沿岸出沒的刺魚，身上的刺像波浪一樣起伏。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FF5722"/><path d="M60,100 C80,85 120,85 140,100 C120,115 80,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="5" fill="black"/><path d="M60,85 L50,70 M80,80 L70,65 M100,80 L100,65 M120,80 L130,65 M60,115 L50,130 M80,120 L70,135 M100,120 L100,135 M120,120 L130,135" stroke="%23FF5722" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">波波刺魚</text></svg>`,
        rarity: 3,
        environment: "沿岸",
        time: "晚上",
        probability: 1.40
    },
    {
        id: 18,
        name: "滑滑沙丁魚",
        description: "早上在沿岸聚集的沙丁魚，身體滑溜閃亮。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2303A9F4"/><path d="M60,100 C75,90 125,90 140,100 C125,110 75,110 60,100 Z" fill="silver" stroke="black" stroke-width="1"/><circle cx="75" cy="97" r="3" fill="black"/><path d="M140,100 L150,100" stroke="silver" stroke-width="2" stroke-linecap="round"/><path d="M100,90 L100,85 M100,110 L100,115" stroke="white" stroke-width="1"/><text x="100" y="105" font-family="Arial" font-size="12" text-anchor="middle" fill="black">滑滑沙丁魚</text></svg>`,
        rarity: 3,
        environment: "沿岸",
        time: "早上",
        probability: 1.30
    },
    {
        id: 19,
        name: "滑滑海馬",
        description: "早上在沿岸岩石間的海馬，身體滑滑的很難捉。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230097A7"/><path d="M120,60 C140,70 140,100 120,110 C100,120 100,150 100,170" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><circle cx="125" cy="70" r="4" fill="black"/><path d="M120,60 C110,50 100,60 110,70" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><path d="M100,170 C95,180 105,180 100,170" fill="none" stroke="%239C27B0" stroke-width="7"/><text x="90" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑海馬</text></svg>`,
        rarity: 4,
        environment: "沿岸",
        time: "早上",
        probability: 0.33
    },
    {
        id: 20,
        name: "QQ章魚",
        description: "中午在沿岸覓食的章魚，觸手彈性十足，非常Q彈。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23880E4F"/><circle cx="100" cy="80" r="30" fill="%23E91E63" stroke="black" stroke-width="2"/><circle cx="90" cy="75" r="5" fill="black"/><circle cx="110" cy="75" r="5" fill="black"/><path d="M80,100 Q70,120 60,150 M90,105 Q80,130 75,160 M110,105 Q120,130 125,160 M120,100 Q130,120 140,150" stroke="%23E91E63" stroke-width="6" stroke-linecap="round"/><text x="100" y="50" font-family="Arial" font-size="14" text-anchor="middle" fill="white">QQ章魚</text></svg>`,
        rarity: 4,
        environment: "沿岸",
        time: "中午",
        probability: 0.36
    },
    
    // 海水環境 - 20種魚 (ID 21-40)
    {
        id: 21,
        name: "滑滑青魚",
        description: "晚上在海水中優游的青魚，鱗片光滑閃亮。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑青魚</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "晚上",
        probability: 6.22
    },
    {
        id: 22,
        name: "嫩嫩鬼頭刀",
        description: "晚上在海水中出沒的鬼頭刀，肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23303F9F"/><path d="M30,100 C50,70 150,70 170,100 C150,130 50,130 30,100 Z" fill="white" stroke="gold" stroke-width="2"/><circle cx="60" cy="90" r="5" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">嫩嫩鬼頭刀</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "晚上",
        probability: 9.42
    },
    {
        id: 23,
        name: "滑滑鱸魚",
        description: "中午在海水中活動的鱸魚，體表光滑。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="95" r="5" fill="black"/><path d="M30,100 L50,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M100,80 L100,60 M100,120 L100,140" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑鱸魚</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "中午",
        probability: 7.61
    },
    {
        id: 24,
        name: "啾啾海馬",
        description: "早上在海水中悠游的海馬，發出啾啾的聲音。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230097A7"/><path d="M120,60 C140,70 140,100 120,110 C100,120 100,150 100,170" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><circle cx="125" cy="70" r="4" fill="black"/><path d="M120,60 C110,50 100,60 110,70" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><path d="M100,170 C95,180 105,180 100,170" fill="none" stroke="%239C27B0" stroke-width="7"/><text x="90" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">啾啾海馬</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "早上",
        probability: 9.95
    },
    {
        id: 25,
        name: "QQ燈籠魚",
        description: "晚上在深海發光的燈籠魚，身體Q彈有彈性。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23000000"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="%23444444" stroke="%23FFEB3B" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="%23FFEB3B"/><circle cx="80" cy="90" r="15" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.5"/><circle cx="80" cy="90" r="25" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.3"/><path d="M140,100 L160,100" stroke="%23FFEB3B" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="%23FFEB3B">QQ燈籠魚</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "晚上",
        probability: 10.76
    },
    {
        id: 26,
        name: "滑滑劍魚",
        description: "中午在海水中高速游動的劍魚，劍部光滑鋒利。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><path d="M50,100 L20,100" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="90" r="5" fill="black"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑劍魚</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "中午",
        probability: 12.95
    },
    {
        id: 27,
        name: "嫩嫩石斑",
        description: "早上在海水珊瑚礁中的石斑魚，肉質鮮嫩可口。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23AA00FF"/><path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M80,70 L85,75 M100,70 L105,75 M120,70 L125,75 M80,130 L85,125 M100,130 L105,125 M120,130 L125,125" stroke="%23673AB7" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩石斑</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "早上",
        probability: 8.40
    },
    {
        id: 28,
        name: "嫩嫩金魚",
        description: "晚上在海水中閃閃發光的金魚，肉質特別嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFC107"/><path d="M60,100 C80,70 120,70 140,100 C120,130 80,130 60,100 Z" fill="white" stroke="%23FF5722" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M140,100 L180,90 M140,100 L180,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩金魚</text></svg>`,
        rarity: 1,
        environment: "海水",
        time: "晚上",
        probability: 5.18
    },
    {
        id: 29,
        name: "軟軟刺魚",
        description: "早上在海水中游動的刺魚，刺身柔軟不扎手。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FF5722"/><path d="M60,100 C80,85 120,85 140,100 C120,115 80,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="5" fill="black"/><path d="M60,85 L50,70 M80,80 L70,65 M100,80 L100,65 M120,80 L130,65 M60,115 L50,130 M80,120 L70,135 M100,120 L100,135 M120,120 L130,135" stroke="%23FF5722" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">軟軟刺魚</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "早上",
        probability: 7.46
    },
    {
        id: 30,
        name: "嫩嫩柳葉魚",
        description: "早上在海水中群游的柳葉魚，肉質特別嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩柳葉魚</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "早上",
        probability: 7.33
    },
    {
        id: 31,
        name: "嫩嫩蝦虎魚",
        description: "中午在海水中活動的蝦虎魚，個頭小但肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23004D40"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="%23009688" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M50,100 L30,90 M50,100 L30,110" stroke="%2380CBC4" stroke-width="2" stroke-linecap="round"/><path d="M110,80 L120,60 M110,120 L120,140" stroke="%2380CBC4" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩蝦虎魚</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "中午",
        probability: 3.06
    },
    {
        id: 32,
        name: "滑滑電鰻",
        description: "早上在海水中電力十足的電鰻，身體光滑閃亮。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFD700"/><path d="M30,100 Q60,70 100,100 Q140,130 170,100" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="85" r="3" fill="black"/><path d="M40,75 L35,65 M60,70 L55,60 M80,70 L75,60 M100,75 L95,65" stroke="%23FFD700" stroke-width="3" stroke-linecap="round"/><path d="M45,75 L40,65 M65,70 L60,60 M85,70 L80,60 M105,75 L100,65" stroke="yellow" stroke-width="1" stroke-linecap="round"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑電鰻</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "早上",
        probability: 4.18
    },
    {
        id: 33,
        name: "萌萌河豚",
        description: "中午在海水中可愛的河豚，膨脹時圓圓的很萌。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23795548"/><circle cx="100" cy="100" r="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M100,60 L100,45 M70,70 L60,55 M130,70 L140,55 M70,130 L60,145 M130,130 L140,145 M100,140 L100,155" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">萌萌河豚</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "中午",
        probability: 3.80
    },
    {
        id: 34,
        name: "軟軟龍魚",
        description: "中午在海水中優雅游動的龍魚，觸感柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F44336"/><path d="M30,100 C50,60 150,60 170,100 C150,140 50,140 30,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M90,60 L100,40 M110,60 L120,40 M90,140 L100,160 M110,140 L120,160" stroke="gold" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">軟軟龍魚</text></svg>`,
        rarity: 2,
        environment: "海水",
        time: "中午",
        probability: 6.83
    },
    {
        id: 35,
        name: "小捲捲章魚",
        description: "早上在海水中活動的章魚，觸手捲捲的很可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23880E4F"/><circle cx="100" cy="80" r="30" fill="%23E91E63" stroke="black" stroke-width="2"/><circle cx="90" cy="75" r="5" fill="black"/><circle cx="110" cy="75" r="5" fill="black"/><path d="M80,100 Q70,110 65,120 Q60,130 70,135 M90,105 Q85,120 80,130 Q75,140 85,145 M110,105 Q115,120 120,130 Q125,140 115,145 M120,100 Q130,110 135,120 Q140,130 130,135" stroke="%23E91E63" stroke-width="6" stroke-linecap="round"/><text x="100" y="50" font-family="Arial" font-size="14" text-anchor="middle" fill="white">小捲捲章魚</text></svg>`,
        rarity: 3,
        environment: "海水",
        time: "早上",
        probability: 2.70
    },
    {
        id: 36,
        name: "小捲捲鰻魚",
        description: "晚上在海水中游動的鰻魚，身體常捲成小圈。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23673AB7"/><path d="M60,100 C90,70 110,130 140,100 C110,70 90,130 60,100" fill="none" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="70" cy="90" r="4" fill="black"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">小捲捲鰻魚</text></svg>`,
        rarity: 3,
        environment: "海水",
        time: "晚上",
        probability: 2.61
    },
    {
        id: 37,
        name: "嫩嫩沙丁魚",
        description: "中午在海水中群游的沙丁魚，肉質特別鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2303A9F4"/><path d="M60,100 C75,90 125,90 140,100 C125,110 75,110 60,100 Z" fill="silver" stroke="black" stroke-width="1"/><circle cx="75" cy="97" r="3" fill="black"/><path d="M140,100 L150,100" stroke="silver" stroke-width="2" stroke-linecap="round"/><path d="M100,90 L100,85 M100,110 L100,115" stroke="white" stroke-width="1"/><text x="100" y="105" font-family="Arial" font-size="12" text-anchor="middle" fill="black">嫩嫩沙丁魚</text></svg>`,
        rarity: 3,
        environment: "海水",
        time: "中午",
        probability: 2.72
    },
    {
        id: 38,
        name: "圓圓魟魚",
        description: "早上在海水中悠游的魟魚，身體特別圓。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><circle cx="120" cy="90" r="5" fill="black"/><path d="M100,110 C90,120 110,120 100,110" stroke="black" fill="none"/><path d="M100,60 L100,30 M70,70 L50,50 M130,70 L150,50" stroke="white" stroke-width="2"/><text x="100" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓魟魚</text></svg>`,
        rarity: 3,
        environment: "海水",
        time: "早上",
        probability: 2.94
    },
    {
        id: 39,
        name: "甜甜旗魚",
        description: "晚上在海水中高速游動的旗魚，肉質鮮甜。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%232979FF"/><path d="M40,100 C60,80 140,80 170,100 C140,120 60,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M40,100 L20,75 M40,100 L20,125" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,80 L90,40" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">甜甜旗魚</text></svg>`,
        rarity: 4,
        environment: "海水",
        time: "晚上",
        probability: 0.76
    },
    {
        id: 40,
        name: "啾啾比目魚",
        description: "早上在海底沙地上的比目魚，發出輕微的啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="30" fill="white" stroke="black" stroke-width="2"/><circle cx="75" cy="85" r="5" fill="black"/><circle cx="90" cy="85" r="5" fill="black"/><path d="M120,90 C130,95 140,95 150,90" stroke="black" fill="none"/><text x="100" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">啾啾比目魚</text></svg>`,
        rarity: 4,
        environment: "海水",
        time: "早上",
        probability: 0.66
    },
    
    // 淡水環境 - 20種魚 (ID 41-60)
    {
        id: 41,
        name: "萌萌刺魚",
        description: "晚上在淡水中活動的刺魚，刺尖圓潤可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FF5722"/><path d="M60,100 C80,85 120,85 140,100 C120,115 80,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="5" fill="black"/><path d="M60,85 L50,70 M80,80 L70,65 M100,80 L100,65 M120,80 L130,65 M60,115 L50,130 M80,120 L70,135 M100,120 L100,135 M120,120 L130,135" stroke="%23FF5722" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">萌萌刺魚</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "晚上",
        probability: 8.73
    },
    {
        id: 42,
        name: "圓圓石斑",
        description: "晚上在淡水中悠游的石斑魚，體型圓潤。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23AA00FF"/><path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M80,70 L85,75 M100,70 L105,75 M120,70 L125,75 M80,130 L85,125 M100,130 L105,125 M120,130 L125,125" stroke="%23673AB7" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓石斑</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "晚上",
        probability: 10.69
    },
    {
        id: 43,
        name: "小捲捲劍魚",
        description: "晚上在淡水中游動的劍魚，劍部捲曲可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><path d="M50,100 Q35,95 20,100" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="90" r="5" fill="black"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">小捲捲劍魚</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "晚上",
        probability: 8.33
    },
    {
        id: 44,
        name: "嫩嫩鬼頭刀",
        description: "中午在淡水中出沒的鬼頭刀，肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23303F9F"/><path d="M30,100 C50,70 150,70 170,100 C150,130 50,130 30,100 Z" fill="white" stroke="gold" stroke-width="2"/><circle cx="60" cy="90" r="5" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">嫩嫩鬼頭刀</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "中午",
        probability: 5.13
    },
    {
        id: 45,
        name: "圓圓鰻魚",
        description: "早上在淡水中緩慢爬行的鰻魚，體型圓胖。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23673AB7"/><path d="M30,120 C60,120 70,80 100,80 C130,80 140,120 170,120" fill="none" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="120" r="4" fill="black"/><circle cx="150" cy="120" r="4" fill="black"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓鰻魚</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "早上",
        probability: 8.42
    },
    {
        id: 46,
        name: "QQ海馬",
        description: "中午在淡水中優游的海馬，身體Q彈有彈性。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230097A7"/><path d="M120,60 C140,70 140,100 120,110 C100,120 100,150 100,170" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><circle cx="125" cy="70" r="4" fill="black"/><path d="M120,60 C110,50 100,60 110,70" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><path d="M100,170 C95,180 105,180 100,170" fill="none" stroke="%239C27B0" stroke-width="7"/><text x="90" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">QQ海馬</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "中午",
        probability: 11.99
    },
    {
        id: 47,
        name: "啾啾蝦虎魚",
        description: "早上在淡水中活動的蝦虎魚，發出輕微的啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23004D40"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="%23009688" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M50,100 L30,90 M50,100 L30,110" stroke="%2380CBC4" stroke-width="2" stroke-linecap="round"/><path d="M110,80 L120,60 M110,120 L120,140" stroke="%2380CBC4" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">啾啾蝦虎魚</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "早上",
        probability: 10.22
    },
    {
        id: 48,
        name: "小捲捲金魚",
        description: "早上在淡水中游動的金魚，鰭捲曲可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFC107"/><path d="M60,100 C80,70 120,70 140,100 C120,130 80,130 60,100 Z" fill="white" stroke="%23FF5722" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M140,100 Q160,90 180,100 M140,100 Q160,110 180,100" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">小捲捲金魚</text></svg>`,
        rarity: 1,
        environment: "淡水",
        time: "早上",
        probability: 13.37
    },
    {
        id: 49,
        name: "圓圓泡泡魚",
        description: "晚上在淡水中吐泡泡的小魚，體型圓潤可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230288D1"/><path d="M60,100 C70,85 130,85 140,100 C130,115 70,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="4" fill="black"/><path d="M140,100 L155,100" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="90" r="5" fill="white"/><circle cx="170" cy="80" r="3" fill="white"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">圓圓泡泡魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "晚上",
        probability: 6.29
    },
    {
        id: 50,
        name: "軟軟柳葉魚",
        description: "早上在淡水中優游的柳葉魚，身體柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">軟軟柳葉魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "早上",
        probability: 5.58
    },
    {
        id: 51,
        name: "圓圓飛魚",
        description: "中午在淡水表面跳躍的飛魚，體型圓胖。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231976D2"/><path d="M40,100 C60,85 140,85 160,100 C140,115 60,115 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M100,85 L120,50 M100,115 L120,150" stroke="%231976D2" stroke-width="8" stroke-linecap="round"/><path d="M40,100 L20,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="95" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">圓圓飛魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "中午",
        probability: 3.36
    },
    {
        id: 52,
        name: "啾啾青魚",
        description: "早上在淡水中成群游動的青魚，發出輕微的啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">啾啾青魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "早上",
        probability: 6.06
    },
    {
        id: 53,
        name: "軟軟燈籠魚",
        description: "早上在淡水深處發光的燈籠魚，觸感柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23000000"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="%23444444" stroke="%23FFEB3B" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="%23FFEB3B"/><circle cx="80" cy="90" r="15" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.5"/><circle cx="80" cy="90" r="25" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.3"/><path d="M140,100 L160,100" stroke="%23FFEB3B" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="%23FFEB3B">軟軟燈籠魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "早上",
        probability: 5.52
    },
    {
        id: 54,
        name: "軟軟鯰魚",
        description: "中午在淡水底層活動的鯰魚，觸感柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23607D8B"/><path d="M60,100 C80,80 120,80 150,100 C120,120 80,120 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M60,100 L30,90 M60,100 L30,100 M60,100 L30,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">軟軟鯰魚</text></svg>`,
        rarity: 2,
        environment: "淡水",
        time: "中午",
        probability: 4.02
    },
    {
        id: 55,
        name: "波波河豚",
        description: "中午在淡水中悠游的河豚，鰭如波浪般起伏。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23795548"/><circle cx="100" cy="100" r="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M100,60 Q110,55 120,60 M70,70 Q65,60 60,55 M130,70 Q135,60 140,55 M70,130 Q65,140 60,145 M130,130 Q135,140 140,145 M100,140 Q110,145 120,145" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">波波河豚</text></svg>`,
        rarity: 3,
        environment: "淡水",
        time: "中午",
        probability: 2.28
    },
    {
        id: 56,
        name: "萌萌比目魚",
        description: "早上在淡水底層的比目魚，眼睛圓圓的很萌。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="30" fill="white" stroke="black" stroke-width="2"/><circle cx="75" cy="85" r="6" fill="black"/><circle cx="90" cy="85" r="6" fill="black"/><path d="M120,90 C130,95 140,95 150,90" stroke="black" fill="none"/><text x="100" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">萌萌比目魚</text></svg>`,
        rarity: 3,
        environment: "淡水",
        time: "早上",
        probability: 2.80
    },
    {
        id: 57,
        name: "滑滑章魚",
        description: "早上在淡水中活動的章魚，皮膚光滑難以抓住。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23880E4F"/><circle cx="100" cy="80" r="30" fill="%23E91E63" stroke="black" stroke-width="2"/><circle cx="90" cy="75" r="5" fill="black"/><circle cx="110" cy="75" r="5" fill="black"/><path d="M80,100 Q70,120 65,150 M90,105 Q80,130 75,160 M110,105 Q120,130 125,160 M120,100 Q130,120 140,150" stroke="%23E91E63" stroke-width="6" stroke-linecap="round"/><text x="100" y="50" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑章魚</text></svg>`,
        rarity: 3,
        environment: "淡水",
        time: "早上",
        probability: 1.93
    },
    {
        id: 58,
        name: "圓圓電鰻",
        description: "晚上在淡水中釋放電流的電鰻，體型圓胖結實。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFD700"/><path d="M30,100 Q60,70 100,100 Q140,130 170,100" fill="none" stroke="white" stroke-width="12" stroke-linecap="round"/><circle cx="50" cy="85" r="4" fill="black"/><path d="M40,75 L35,65 M60,70 L55,60 M80,70 L75,60 M100,75 L95,65" stroke="%23FFD700" stroke-width="3" stroke-linecap="round"/><path d="M45,75 L40,65 M65,70 L60,60 M85,70 L80,60 M105,75 L100,65" stroke="yellow" stroke-width="1" stroke-linecap="round"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">圓圓電鰻</text></svg>`,
        rarity: 3,
        environment: "淡水",
        time: "晚上",
        probability: 1.23
    },
    {
        id: 59,
        name: "軟軟魟魚",
        description: "中午在淡水中緩慢滑行的魟魚，身體異常柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><circle cx="120" cy="90" r="5" fill="black"/><path d="M100,110 C90,120 110,120 100,110" stroke="black" fill="none"/><path d="M100,60 L100,30 M70,70 L50,50 M130,70 L150,50" stroke="white" stroke-width="2"/><text x="100" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">軟軟魟魚</text></svg>`,
        rarity: 4,
        environment: "淡水",
        time: "中午",
        probability: 0.72
    },
    {
        id: 60,
        name: "嫩嫩鱸魚",
        description: "晚上在淡水中優雅游動的鱸魚，肉質極其鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="95" r="5" fill="black"/><path d="M30,100 L50,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M100,80 L100,60 M100,120 L100,140" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">嫩嫩鱸魚</text></svg>`,
        rarity: 4,
        environment: "淡水",
        time: "晚上",
        probability: 0.68
    },
    
    // 湖泊環境 - 20種魚 (ID 61-80)
    {
        id: 61,
        name: "嫩嫩比目魚",
        description: "中午在湖泊中棲息的比目魚，肉質特別鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="30" fill="white" stroke="black" stroke-width="2"/><circle cx="75" cy="85" r="5" fill="black"/><circle cx="90" cy="85" r="5" fill="black"/><path d="M120,90 C130,95 140,95 150,90" stroke="black" fill="none"/><text x="100" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩比目魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "中午",
        probability: 12.16
    },
    {
        id: 62,
        name: "甜甜龍魚",
        description: "晚上在湖泊中優雅游動的龍魚，肉質鮮甜。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F44336"/><path d="M30,100 C50,60 150,60 170,100 C150,140 50,140 30,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M90,60 L100,40 M110,60 L120,40 M90,140 L100,160 M110,140 L120,160" stroke="gold" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">甜甜龍魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "晚上",
        probability: 11.97
    },
    {
        id: 63,
        name: "軟軟海馬",
        description: "早上在湖泊中緩慢游動的海馬，身體柔軟有彈性。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230097A7"/><path d="M120,60 C140,70 140,100 120,110 C100,120 100,150 100,170" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><circle cx="125" cy="70" r="4" fill="black"/><path d="M120,60 C110,50 100,60 110,70" fill="none" stroke="%239C27B0" stroke-width="10" stroke-linecap="round"/><path d="M100,170 C95,180 105,180 100,170" fill="none" stroke="%239C27B0" stroke-width="7"/><text x="90" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">軟軟海馬</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "早上",
        probability: 10.14
    },
    {
        id: 64,
        name: "圓圓燈籠魚",
        description: "晚上在湖泊深處發光的燈籠魚，體型圓潤可愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23000000"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="%23444444" stroke="%23FFEB3B" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="%23FFEB3B"/><circle cx="80" cy="90" r="15" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.5"/><circle cx="80" cy="90" r="25" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.3"/><path d="M140,100 L160,100" stroke="%23FFEB3B" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="%23FFEB3B">圓圓燈籠魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "晚上",
        probability: 13.03
    },
    {
        id: 65,
        name: "圓圓刺魚",
        description: "中午在湖泊中游動的刺魚，身體圓胖帶刺。",
        image: "https://placehold.co/200x200/69c8ff/ffffff?text=圓圓刺魚",
        rarity: 1,
        environment: "湖泊",
        time: "中午",
        probability: 7.62
    },
    {
        id: 66,
        name: "萌萌鱸魚",
        description: "早上在湖泊中活動的鱸魚，有著可愛圓潤的眼睛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="95" r="5" fill="black"/><path d="M30,100 L50,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M100,80 L100,60 M100,120 L100,140" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">萌萌鱸魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "早上",
        probability: 10.82
    },
    {
        id: 67,
        name: "QQ鯰魚",
        description: "早上在湖泊底層的鯰魚，觸感Q彈有彈性。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23607D8B"/><path d="M60,100 C80,80 120,80 150,100 C120,120 80,120 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M60,100 L30,90 M60,100 L30,100 M60,100 L30,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">QQ鯰魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "早上",
        probability: 12.36
    },
    {
        id: 68,
        name: "甜甜泡泡魚",
        description: "晚上在湖泊表面吐著甜甜泡泡的小魚，氣泡聞起來有甜味。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230288D1"/><path d="M60,100 C70,85 130,85 140,100 C130,115 70,115 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="4" fill="black"/><path d="M140,100 L155,100" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="90" r="5" fill="white"/><circle cx="170" cy="80" r="3" fill="white"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">甜甜泡泡魚</text></svg>`,
        rarity: 1,
        environment: "湖泊",
        time: "晚上",
        probability: 9.83
    },
    {
        id: 69,
        name: "滑滑柳葉魚",
        description: "早上在湖泊中優游的柳葉魚，身體滑滑的。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">滑滑柳葉魚</text></svg>`,
        rarity: 2,
        environment: "湖泊",
        time: "早上",
        probability: 6.78
    },
    {
        id: 70,
        name: "波波鰻魚",
        description: "晚上在湖泊底層游動的鰻魚，游動時身體呈波浪狀。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23673AB7"/><path d="M30,120 C60,120 70,80 100,80 C130,80 140,120 170,120" fill="none" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="120" r="4" fill="black"/><circle cx="150" cy="120" r="4" fill="black"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">波波鰻魚</text></svg>`,
        rarity: 2,
        environment: "湖泊",
        time: "晚上",
        probability: 5.32
    },
    {
        id: 71,
        name: "嫩嫩青魚",
        description: "中午在湖泊中優游的青魚，肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩青魚</text></svg>`,
        rarity: 2,
        environment: "湖泊",
        time: "中午",
        probability: 6.29
    },
    {
        id: 72,
        name: "啾啾旗魚",
        description: "早上在湖泊表面跳躍的旗魚，發出啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%232979FF"/><path d="M40,100 C60,80 140,80 170,100 C140,120 60,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M40,100 L20,75 M40,100 L20,125" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,80 L90,40" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">啾啾旗魚</text></svg>`,
        rarity: 2,
        environment: "湖泊",
        time: "早上",
        probability: 4.82
    },
    {
        id: 73,
        name: "萌萌劍魚",
        description: "晚上在湖泊中悠游的劍魚，劍尖圓圓的很萌。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><path d="M50,100 L20,100" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="90" r="5" fill="black"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">萌萌劍魚</text></svg>`,
        rarity: 2,
        environment: "湖泊",
        time: "晚上",
        probability: 3.43
    },
    {
        id: 74,
        name: "甜甜河豚",
        description: "晚上在湖泊中游動的河豚，肉質鮮甜。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23795548"/><circle cx="100" cy="100" r="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M100,60 L100,45 M70,70 L60,55 M130,70 L140,55 M70,130 L60,145 M130,130 L140,145 M100,140 L100,155" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">甜甜河豚</text></svg>`,
        rarity: 3,
        environment: "湖泊",
        time: "晚上",
        probability: 3.87
    },
    {
        id: 75,
        name: "啾啾飛魚",
        description: "中午在湖泊表面跳躍的飛魚，發出啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231976D2"/><path d="M40,100 C60,85 140,85 160,100 C140,115 60,115 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M100,85 L120,50 M100,115 L120,150" stroke="%231976D2" stroke-width="8" stroke-linecap="round"/><path d="M40,100 L20,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="95" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">啾啾飛魚</text></svg>`,
        rarity: 3,
        environment: "湖泊",
        time: "中午",
        probability: 2.42
    },
    {
        id: 76,
        name: "波波石斑",
        description: "早上在湖泊岩石間的石斑魚，鰭如波浪般起伏。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23AA00FF"/><path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M80,70 Q90,60 100,70 M120,70 Q130,60 140,70 M80,130 Q90,140 100,130 M120,130 Q130,140 140,130" stroke="%23673AB7" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">波波石斑</text></svg>`,
        rarity: 3,
        environment: "湖泊",
        time: "早上",
        probability: 2.13
    },
    {
        id: 77,
        name: "啾啾燈籠魚",
        description: "中午在湖泊深處發光的燈籠魚，發出輕微啾啾聲。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23000000"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="%23444444" stroke="%23FFEB3B" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="%23FFEB3B"/><circle cx="80" cy="90" r="15" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.5"/><circle cx="80" cy="90" r="25" fill="none" stroke="%23FFEB3B" stroke-width="1" opacity="0.3"/><path d="M140,100 L160,100" stroke="%23FFEB3B" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="%23FFEB3B">啾啾燈籠魚</text></svg>`,
        rarity: 3,
        environment: "湖泊",
        time: "中午",
        probability: 1.82
    },
    {
        id: 78,
        name: "嫩嫩魟魚",
        description: "早上在湖泊底層滑行的魟魚，肉質特別鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><circle cx="120" cy="90" r="5" fill="black"/><path d="M100,110 C90,120 110,120 100,110" stroke="black" fill="none"/><path d="M100,60 L100,30 M70,70 L50,50 M130,70 L150,50" stroke="white" stroke-width="2"/><text x="100" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="white">嫩嫩魟魚</text></svg>`,
        rarity: 4,
        environment: "湖泊",
        time: "早上",
        probability: 0.89
    },
    {
        id: 79,
        name: "波波金魚",
        description: "中午在湖泊淺水區游動的金魚，鰭如波浪般美麗。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFC107"/><path d="M60,100 C80,70 120,70 140,100 C120,130 80,130 60,100 Z" fill="white" stroke="%23FF5722" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M140,100 Q150,90 160,90 M140,100 Q150,110 160,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">波波金魚</text></svg>`,
        rarity: 4,
        environment: "湖泊",
        time: "中午",
        probability: 0.65
    },
    {
        id: 80,
        name: "軟軟章魚",
        description: "晚上在湖泊深處活動的章魚，觸手格外柔軟。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23880E4F"/><circle cx="100" cy="80" r="30" fill="%23E91E63" stroke="black" stroke-width="2"/><circle cx="90" cy="75" r="5" fill="black"/><circle cx="110" cy="75" r="5" fill="black"/><path d="M80,100 Q70,120 60,150 M90,105 Q80,130 75,160 M110,105 Q120,130 125,160 M120,100 Q130,120 140,150" stroke="%23E91E63" stroke-width="6" stroke-linecap="round"/><text x="100" y="50" font-family="Arial" font-size="14" text-anchor="middle" fill="white">軟軟章魚</text></svg>`,
        rarity: 4,
        environment: "湖泊",
        time: "晚上",
        probability: 0.84
    }
];

// 環境與時間設定
const environments = ["沿岸", "海水", "淡水", "湖泊"];
const timePeriods = ["早上", "中午", "晚上"];

// 根據環境和時間篩選魚類
function getFishByEnvironmentAndTime(environment, time) {
    return fishDatabase.filter(fish => 
        fish.environment === environment && 
        fish.time === time
    );
}

// 根據稀有度獲取魚類
function getFishByRarity(rarity) {
    return fishDatabase.filter(fish => fish.rarity === rarity);
}

// 稀有度權重，用於轉盤系統
const rarityWeights = {
    1: 0.50, // 普通 - 50%機率
    2: 0.30, // 高級 - 30%機率
    3: 0.15, // 稀有 - 15%機率 
    4: 0.05  // 傳說 - 5%機率
};