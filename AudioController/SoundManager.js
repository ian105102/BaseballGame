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
      this.sounds["Theme"] = this.p.loadSound("./music/Theme.mp3",
        () => {
          console.log("🎵 Theme 載入完成");
          this.ready["Theme"] = true;
        },
        () => {
          console.error("❌ Theme 載入失敗！");
        });
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
    playWhenReady(name, mode = "play") {
      if (this.ready[name]) {
        mode === "loop" ? this.loop(name) : this.play(name);
      } else {
        const wait = setInterval(() => {
          if (this.ready[name]) {
            mode === "loop" ? this.loop(name) : this.play(name);
            clearInterval(wait);
          }
        }, 100); // 每 100ms 檢查一次
      }
    }
  }
  