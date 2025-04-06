// SoundManager.js
export class SoundManager {
    static instance = null;
  
    constructor(p) {
      if (SoundManager.instance) return SoundManager.instance;
      this.p = p;
      this.sounds = {};
      this.ready = {}; // ✅ 加這個追蹤載入完成
      SoundManager.instance = this;
    }
  
    loadSounds() {
        this.sounds = {}; // 初始化音效容器
      
        const basePath = "./music/";
      
        const soundFiles = [
          "button1.mp3",
          "button2.mp3",
          "catch ball1.mp3",
          "catch ball2.mp3",
          "catch ball3.mp3",
          "Correct.mp3",
          "Crowd Ambient.mp3",
          "Crowd Cheer.mp3",
          "hit1.mp3",
          "hit2.mp3",
          "hit3.mp3",
          "Theme.mp3",
          "Waiting loop.mp3",
          "Wrong.mp3"
        ];
      
        for (const fileName of soundFiles) {
          const key = fileName.replace(".mp3", ""); // 把檔名當成 key（不含副檔名）
          this.sounds[key] = this.p.loadSound(basePath + fileName);
        }
      }
      
  
    play(name) {
      if (this.sounds[name]) this.sounds[name].play();
    }
  
    loop(name) {
      if (this.sounds[name] && !this.sounds[name].isPlaying()) {
        this.sounds[name].loop();
      }
    }
  
    stop(name) {
      if (this.sounds[name]) this.sounds[name].stop();
    }
  
    setVolume(name, vol) {
      if (this.sounds[name]) this.sounds[name].setVolume(vol);
    }
  
    // ✅ 等載入好後再播放（play or loop）
    playWhenReady(name, mode = "play", callback = null) {
        const sound = this.sounds[name];
      
        if (!sound) {
          console.warn(`⚠️ 音效 ${name} 尚未註冊於 sounds`);
          return;
        }
      
        // 防止重複播放
        if (sound.isPlaying()) return;
      
        // 防止重複監聽
        if (this._pendingCheck && this._pendingCheck[name]) return;
      
        // 已經載入就直接播放
        if (sound.isLoaded()) {
          console.log(`🎵 [立即播放] ${name} → ${mode}`);
          this._playSound(sound, mode, callback);
        } else {
          console.log(`⏳ [等待音樂] ${name} 尚未載入，設置監聽...`);
      
          if (!this._pendingCheck) this._pendingCheck = {};
          this._pendingCheck[name] = true;
      
          const checkLoaded = setInterval(() => {
            if (sound.isLoaded()) {
              clearInterval(checkLoaded);
              delete this._pendingCheck[name];
      
              if (!sound.isPlaying()) {
                console.log(`🎵 [延遲播放] ${name} 載入完成 → ${mode}`);
                this._playSound(sound, mode, callback);
              }
            }
          }, 100);
        }
      }
      
      // 🔧 把 play / loop 撥放邏輯獨立成一個函數
      _playSound(sound, mode, callback) {
        if (mode === "loop") sound.loop();
        else sound.play();
      
        if (callback) callback();
      }
      
      
      
      
      
      
  }
  