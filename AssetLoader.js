/*
    * AssetLoader.js
    * 資源加載器
    * 這個類別會加載圖片、音頻和JSON文件
    * 這個類別會使用Promise來處理異步加載
    
    * 這個類別會使用單例模式來確保只有一個實例
    * 這樣可以避免多次加載同一個資源
    * 主要是為了避免多次加載同一個資源
    * 使用方法：
    * const assetLoader = new AssetLoader();
    * 東西請先在Sketch preload中加載 
    * 需要宣告
    * let assetLoader = new AssetLoader(p);
    * assetLoader.loadAssets([
    *     { type: 'image', url: 'path/to/image.png' },
    *     { type: 'json', url: 'path/to/data.json' },
    *     { type: 'audio', url: 'path/to/audio.mp3' }
    * ]);
    * 
    * 
    * assetLoader.get('path/to/image.png'); // 獲取已加載的資源
    * assetLoader.get('path/to/data.json'); // 獲取已加載的資源


*/
export class AssetLoader {
    constructor(p) {
        if (AssetLoader.instance) {
            return AssetLoader.instance; // 返回已存在的實例
        }
        this.p = p; // p5.js 實例
        this.assets = new Map(); // 存儲已加載的資源
        AssetLoader.instance = this; // 設定唯一實例
    }

    // 加載圖片
    loadImage(url) {
        if (this.assets.has(url)) {
            return this.assets.get(url); // 如果已經加載過，直接返回
        }
        let img = this.p.loadImage(url);
        this.assets.set(url, img); // 保存到資源表
        return img;
    }

    // 加載 3D 模型
    loadModel(url) {
        if (this.assets.has(url)) {
            return this.assets.get(url); // 如果已經加載過，直接返回
        }
        let model = this.p.loadModel(url);
        this.assets.set(url, model); // 保存到資源表
        return model;
    }

    // 加載音頻
    loadAudio(url) {
        if (this.assets.has(url)) {
            return this.assets.get(url); // 如果已經加載過，直接返回
        }
        let audio = this.p.loadSound(url);
        this.assets.set(url, audio); // 保存到資源表
        return audio;
    }

    // 加載單個資源
    load(assetType, url) {
        switch (assetType) {
            case 'image': return this.loadImage(url);
            case 'model': return this.loadModel(url);
            case 'audio': return this.loadAudio(url);
            default: throw new Error(`Unsupported asset type: ${assetType}`);
        }
    }

    // 加載多個資源
    loadAssets(assetList) {
        assetList.forEach(asset => {
            if (typeof asset === 'string') {
                // 如果是字符串，默認為加載圖片
                this.loadImage(asset);
            } else {
                const { type, url } = asset;
                this.load(type, url);
            }
        });
    }

    // 根據 URL 獲取已加載的資源
    get(url) {
        console.log("get url", url);
        console.log(this.assets);
        if (!this.assets.has(url)) {
            console.warn(`Asset not found: ${url}`);
            return null; // 如果資源不存在，返回 null
        }
        // 如果資源存在，返回資源
        return this.assets.get(url) || null;
    }

    static getInstance(p) {
        if (!AssetLoader.instance) {
            AssetLoader.instance = new AssetLoader(p);
        }
        return AssetLoader.instance;
    }
}