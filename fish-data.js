// 魚類資料庫
const fishDatabase = [
    // 普通魚類 (稀有度1)
    {
        id: 1,
        name: "鯉魚",
        description: "淡水常見魚類，體色多變，壽命長。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FF5733"/><path d="M50,100 C70,70 130,70 150,100 C130,130 70,130 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M30,100 L50,100 M150,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鯉魚</text></svg>`,
        rarity: 1, // 普通
        catchRate: 0.30 // 30%
    },
    {
        id: 2,
        name: "鯽魚",
        description: "小型淡水魚類，容易捕獲，廣泛分佈。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2333A8FF"/><path d="M50,100 C70,85 130,85 150,100 C130,115 70,115 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="95" r="4" fill="black"/><path d="M170,100 L150,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鯽魚</text></svg>`,
        rarity: 1, // 普通
        catchRate: 0.20 // 20%
    },
    {
        id: 3,
        name: "青魚",
        description: "體型較大的淡水魚類，肉質鮮美。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2300BFFF"/><path d="M40,100 C65,80 135,80 160,100 C135,120 65,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M30,100 L40,100 M160,100 L170,100" stroke="white" stroke-width="3" stroke-linecap="round"/><text x="100" y="115" font-family="Arial" font-size="14" text-anchor="middle" fill="white">青魚</text></svg>`,
        rarity: 1, // 普通
        catchRate: 0.10 // 10%
    },
    {
        id: 4,
        name: "黃鱔",
        description: "形似蛇的水生動物，滑溜難抓。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFD700"/><path d="M30,100 Q60,70 100,100 Q140,130 170,100" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="85" r="3" fill="black"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">黃鱔</text></svg>`,
        rarity: 1, // 普通
        catchRate: 0.05 // 5%
    },
    {
        id: 5,
        name: "泥鰍",
        description: "小型底棲淡水魚，喜歡藏在泥底。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%238D6E63"/><path d="M40,100 Q70,80 100,100 Q130,120 160,100" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="90" r="3" fill="black"/><path d="M40,90 L30,85 M40,110 L30,115" stroke="white" stroke-width="2"/><text x="100" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="white">泥鰍</text></svg>`,
        rarity: 1, // 普通
        catchRate: 0.05 // 5%
    },

    // 高級魚類 (稀有度2)
    {
        id: 6,
        name: "鱸魚",
        description: "常見食用魚類，肉質鮮嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%233F51B5"/><path d="M50,100 C70,80 130,80 150,100 C130,120 70,120 50,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="95" r="5" fill="black"/><path d="M30,100 L50,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M100,80 L100,60 M100,120 L100,140" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鱸魚</text></svg>`,
        rarity: 2, // 高級
        catchRate: 0.30 // 30%
    },
    {
        id: 7,
        name: "鯰魚",
        description: "大嘴底棲淡水魚，有長鬚。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23607D8B"/><path d="M60,100 C80,80 120,80 150,100 C120,120 80,120 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M60,100 L30,90 M60,100 L30,100 M60,100 L30,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="110" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鯰魚</text></svg>`,
        rarity: 2, // 高級
        catchRate: 0.20 // 20%
    },
    {
        id: 8,
        name: "鱒魚",
        description: "冷水性淡水魚類，肉質細嫩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23E91E63"/><path d="M40,100 C60,85 140,85 160,100 C140,115 60,115 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="4" fill="black"/><path d="M160,100 L180,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,85 L110,85 M90,115 L110,115" stroke="black" stroke-width="1"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鱒魚</text></svg>`,
        rarity: 2, // 高級
        catchRate: 0.10 // 10%
    },
    {
        id: 9,
        name: "金魚",
        description: "觀賞魚類，顏色鮮豔多樣。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FFC107"/><path d="M60,100 C80,70 120,70 140,100 C120,130 80,130 60,100 Z" fill="white" stroke="%23FF5722" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M140,100 L180,90 M140,100 L180,110" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white">金魚</text></svg>`,
        rarity: 2, // 高級
        catchRate: 0.05 // 5%
    },
    {
        id: 10,
        name: "河豚",
        description: "有毒魚類，烹飪需專業技巧。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23795548"/><circle cx="100" cy="100" r="40" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><path d="M100,60 L100,45 M70,70 L60,55 M130,70 L140,55 M70,130 L60,145 M130,130 L140,145 M100,140 L100,155" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">河豚</text></svg>`,
        rarity: 2, // 高級
        catchRate: 0.05 // 5%
    },

    // 稀有魚類 (稀有度3)
    {
        id: 11,
        name: "鮭魚",
        description: "洄游性魚類，肉質鮮美。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23FF5252"/><path d="M40,100 C60,80 140,80 160,100 C140,120 60,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="90" r="5" fill="black"/><path d="M40,100 L20,100" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,80 L110,80 M90,120 L110,120" stroke="%23E91E63" stroke-width="1"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鮭魚</text></svg>`,
        rarity: 3, // 稀有
        catchRate: 0.30 // 30%
    },
    {
        id: 12,
        name: "鯛魚",
        description: "海水魚類，深受釣魚愛好者喜愛。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23D81B60"/><path d="M40,100 C50,60 150,60 160,100 C150,140 50,140 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M110,60 L120,40 M110,140 L120,160" stroke="white" stroke-width="3"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">鯛魚</text></svg>`,
        rarity: 3, // 稀有
        catchRate: 0.20 // 20%
    },
    {
        id: 13,
        name: "鯊魚",
        description: "大型掠食性魚類，兇猛迅速。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231E88E5"/><path d="M40,100 L70,70 L160,100 L70,130 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M110,70 L110,40 M110,130 L110,160" stroke="white" stroke-width="3"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black">鯊魚</text></svg>`,
        rarity: 3, // 稀有
        catchRate: 0.10 // 10%
    },
    {
        id: 14,
        name: "鰻魚",
        description: "長形遠洋洄游魚類，滑溜難抓。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23673AB7"/><path d="M30,120 C60,120 70,80 100,80 C130,80 140,120 170,120" fill="none" stroke="white" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="120" r="4" fill="black"/><circle cx="150" cy="120" r="4" fill="black"/><text x="100" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="white">鰻魚</text></svg>`,
        rarity: 3, // 稀有
        catchRate: 0.05 // 5%
    },
    {
        id: 15,
        name: "比目魚",
        description: "扁平側游魚類，兩眼在同一側。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%239C27B0"/><ellipse cx="100" cy="100" rx="60" ry="30" fill="white" stroke="black" stroke-width="2"/><circle cx="75" cy="85" r="5" fill="black"/><circle cx="90" cy="85" r="5" fill="black"/><path d="M120,90 C130,95 140,95 150,90" stroke="black" fill="none"/><text x="100" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="white">比目魚</text></svg>`,
        rarity: 3, // 稀有
        catchRate: 0.05 // 5%
    },

    // 傳說魚類 (稀有度4)
    {
        id: 16,
        name: "旗魚",
        description: "大型深海魚類，游速極快。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%232979FF"/><path d="M40,100 C60,80 140,80 170,100 C140,120 60,120 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="65" cy="95" r="5" fill="black"/><path d="M40,100 L20,75 M40,100 L20,125" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M90,80 L90,40" stroke="white" stroke-width="2"/><text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">旗魚</text></svg>`,
        rarity: 4, // 傳說
        catchRate: 0.30 // 30%
    },
    {
        id: 17,
        name: "石斑魚",
        description: "珍貴食用魚類，肉質細膩。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23AA00FF"/><path d="M40,100 C60,70 140,70 160,100 C140,130 60,130 40,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="70" cy="90" r="5" fill="black"/><path d="M80,70 L85,75 M100,70 L105,75 M120,70 L125,75 M80,130 L85,125 M100,130 L105,125 M120,130 L125,125" stroke="%23673AB7" stroke-width="2" stroke-linecap="round"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">石斑魚</text></svg>`,
        rarity: 4, // 傳說
        catchRate: 0.20 // 20%
    },
    {
        id: 18,
        name: "龍魚",
        description: "外形奇特的大型觀賞魚，被視為吉祥物。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23F44336"/><path d="M30,100 C50,60 150,60 170,100 C150,140 50,140 30,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="60" cy="85" r="6" fill="black"/><path d="M30,100 L10,80 M30,100 L10,120" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M90,60 L100,40 M110,60 L120,40 M90,140 L100,160 M110,140 L120,160" stroke="gold" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="black" font-weight="bold">龍魚</text></svg>`,
        rarity: 4, // 傳說
        catchRate: 0.10 // 10%
    },
    {
        id: 19,
        name: "藍鰭金槍魚",
        description: "極為珍貴的海洋魚類，被稱為海中黃金。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23303F9F"/><path d="M30,100 C50,70 150,70 170,100 C150,130 50,130 30,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="60" cy="90" r="5" fill="black"/><path d="M100,70 L100,50 M100,130 L100,150" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M170,100 L190,90 M170,100 L190,110" stroke="gold" stroke-width="2"/><text x="100" y="105" font-family="Arial" font-size="12" text-anchor="middle" fill="black" font-weight="bold">藍鰭金槍魚</text></svg>`,
        rarity: 4, // 傳說
        catchRate: 0.05 // 5%
    },
    {
        id: 20,
        name: "花羔紅點鮭",
        description: "罕見的淡水魚種，色彩斑斕。",
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23C2185B"/><path d="M40,100 C60,80 140,80 160,100 C140,120 60,120 40,100 Z" fill="white" stroke="gold" stroke-width="3"/><circle cx="65" cy="90" r="5" fill="black"/><path d="M40,100 L20,100" stroke="gold" stroke-width="3" stroke-linecap="round"/><path d="M80,85 C85,80 95,80 100,85 M120,85 C125,80 135,80 140,85" stroke="black" fill="none"/><circle cx="80" cy="90" r="2" fill="%23F44336"/><circle cx="100" cy="90" r="2" fill="%23F44336"/><circle cx="120" cy="90" r="2" fill="%23F44336"/><text x="100" y="115" font-family="Arial" font-size="11" text-anchor="middle" fill="white" font-weight="bold">花羔紅點鮭</text></svg>`,
        rarity: 4, // 傳說
        catchRate: 0.05 // 5%
    }
];

// 稀有度權重，用於轉盤系統
const rarityWeights = {
    1: 0.50, // 普通 - 50%機率
    2: 0.30, // 高級 - 30%機率
    3: 0.15, // 稀有 - 15%機率 
    4: 0.05  // 傳說 - 5%機率
};

// 魚的預設圖像 (如果沒有正確的圖像)
const defaultFishImage = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23616161"/><path d="M60,100 C80,80 120,80 140,100 C120,120 80,120 60,100 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="90" r="5" fill="black"/><text x="100" y="105" font-family="Arial" font-size="14" text-anchor="middle" fill="white">未知魚種</text><path d="M80,100 L140,100" stroke="black" stroke-width="1" stroke-dasharray="5,5"/></svg>`;