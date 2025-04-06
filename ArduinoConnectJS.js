

class ReceiveArduino{
  static instance = null;  // 單一實例

  constructor(){
    if (ReceiveArduino.instance) {
      return ReceiveArduino.instance;  // 如果已有實例，直接返回現有實例
    }

    // 建立 Serial 連接按鈕
    // this.connectPort();
    this.port;
    this.reader;
    this.latestData = "尚未收到資料";

    this.quat = [0.0, 0.0, 0.0, 0.0];
    this.euler = [0.0, 0.0, 0.0];
    this.acceleration = [0, 0, 0];
    this.correctionQurt = [0, 0, 0];
    this.correctionEuler = [0, 0, 0];
    this.correctionAcceleration = [0, 0, 0];
    this.arduinoConnected = 0;

    ReceiveArduino.instance = this;
  }
  
  async connect() {
    if (!ReceiveArduino.instance) {
      new ReceiveArduino();  // 確保 Singleton 實例已經創建
    }

    await ReceiveArduino.instance.connectPort();
  }

  async connectPort() {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      const inputStream = textDecoder.readable;

      this.reader = inputStream.getReader();

      this.readLoop(); // 開始讀資料
    } catch (err) {
      console.error("連接錯誤:", err);
    }
  }

  async readLoop() {
    let buffer = "";
  
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
  
        buffer += value;
  
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
          let line = buffer.slice(0, newlineIndex).trim(); // 拿到一整行
          buffer = buffer.slice(newlineIndex + 1);         // 剩下的存回 buffer
  
          // 完整一行資料
          this.latestData = line;
          // console.log("最新資料:", this.latestData);
          if(this.latestData.length != 0){
            this.dataSaveToDist(this.latestData);
          }
        }
      }
    } catch (error) {
      console.error("讀取錯誤:", error);
    } finally {
      this.reader.releaseLock();
    }
  }

  gotData(){

  }

  dataSaveToDist(latestData){
    // 使用正則表達式解析數據
    if(latestData === '1'){
      this.arduinoConnected = 1;
    } else if(latestData === '0'){
      this.arduinoConnected = 0;
    } else if (latestData.startsWith('quat:')) {
      let quatValues = latestData.split(':')[1].split(',');
      this.quat = [parseFloat(quatValues[0]), 
                    parseFloat(quatValues[1]),
                    parseFloat(quatValues[2]), 
                    parseFloat(quatValues[3])];
    } else if (latestData.startsWith('euler:')) {
      let eulerValues = latestData.split(':')[1].split(',');
      this.euler = [this.normalizeRadian(parseFloat(eulerValues[0])), 
                    this.normalizeRadian(parseFloat(eulerValues[1])),
                    this.normalizeRadian(parseFloat(eulerValues[2]))];
    } else if (latestData.startsWith('acceleration:')) {
      let accelValues = latestData.split(':')[1].split(',');
      this.acceleration = [parseInt(accelValues[0]), 
                          parseInt(accelValues[1]),
                          parseInt(accelValues[2])];
    }
  }

  //映射到0~2pi
  normalizeRadian(angle) {
    let twoPI = 2 * Math.PI;
    return ((angle % twoPI) + twoPI) % twoPI;
  }
}



export default  new ReceiveArduino(); 