// SoundManager.js
export class SoundManager {
    static instance = null;
  
    constructor(p) {
      if (SoundManager.instance) return SoundManager.instance;
  
      this.p = p;
      this.sounds = {};
      this.ready = {};
      this._pendingCheck = {};
      this._looped = {}; // 🔁 防止背景音樂重複 loop
      SoundManager.instance = this;
    }
  
    loadSounds() {
      this.sounds = {};
  
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
        "EffectEnd.mp3",
        "hit1.mp3",
        "hit2.mp3",
        "hit3.mp3",
        "ScoreTheme.mp3",
        "Theme.mp3",
        "Waiting loop.mp3",
        "Wrong.mp3"
      ];
  
      for (const fileName of soundFiles) {
        const key = fileName.replace(".mp3", "");
        this.sounds[key] = this.p.loadSound(basePath + fileName);
      }
    }
  
    play(name) {
      const sound = this.sounds[name];
      if (sound) {
        const clone = sound.clone();
        clone.setVolume(1.0);
        clone.play();
      }
    }
  
    loop(name) {
      const sound = this.sounds[name];
      if (sound && !sound.isPlaying() && !this._looped[sound]) {
        sound.setVolume(1.0);
        sound.loop();
        this._looped[sound] = true;
      }
    }
  
    stop(name) {
      const sound = this.sounds[name];
      if (sound) {
        sound.stop();
        if (this._looped[sound]) delete this._looped[sound];
      }
    }
  
    setVolume(name, vol) {
      if (this.sounds[name]) {
        this.sounds[name].setVolume(vol);
      }
    }
  
    // 🎵 主功能：確保載入後再播放（可 loop / play）
    playWhenReady(name, mode = "play", callback = null) {
      const sound = this.sounds[name];
    
      if (!sound) {
        console.warn(`⚠️ 音效 ${name} 尚未註冊於 sounds`);
        return;
      }
    
      // ✅ loop 播過就不重複播
      if (mode === "loop" && this._looped[sound]) return;
    
      // ✅ 防止同一音效重複設監聽
      if (this._pendingCheck[name]) return;
    
      if (sound.isLoaded()) {
        console.log(`🎵 [立即播放] ${name} → ${mode}`);
        this._playSound(sound, mode, callback);
      } else {
        console.log(`⏳ [等待音樂] ${name} 尚未載入，設置監聽...`);
        this._pendingCheck[name] = true;
    
        const checkLoaded = setInterval(() => {
          if (sound.isLoaded()) {
            clearInterval(checkLoaded);
            delete this._pendingCheck[name];
    
            if (mode === "play" || (mode === "loop" && !this._looped[sound])) {
              console.log(`🎵 [延遲播放] ${name} 載入完成 → ${mode}`);
              this._playSound(sound, mode, callback);
            }
          }
        }, 100);
      }
    }
    
  
    // 🔧 真正播放邏輯：loop 一次，play 用 clone 疊加
    _playSound(sound, mode, callback) {
      sound.setVolume(1.0);
    
      if (mode === "loop") {
        if (!this._looped[sound]) {
          sound.loop();
          this._looped[sound] = true;
        }
        // 🔁 loop 模式通常不會呼叫 callback（你也可以自己決定）
        if (callback) callback(); // 若你想在 loop 開始時就呼叫 callback
      } else {
        sound.play();
        if (callback) {
          // 🎯 播放結束後才 callback
          sound.onended(() => {
            callback();
          });
        }
      }
    }
    
      
      
  }
  