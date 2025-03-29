
/*
let receiveArduino; // 宣告
receiveArduino = new ReceiveArduino("COM3");  // 需要知道port

// 宣告數值陣列
let quat = [];
let euler = [];
let acceleration = [];

// 取得資料
receiveArduino.onGotData = () => {
    quat = receiveArduino.dataDist['quat'];
    euler = receiveArduino.dataDist['euler'];
    acceleration = receiveArduino.dataDist['acceleration'];
    // console.log(quat);
    // console.log(euler);
    // console.log(acceleration);
  };
*/

class ReceiveArduino{
  constructor(port){
    this.serialPortName = port;
    this.serial = new p5.SerialPort();
    this.serial.open(port);
    this.serial.on('data', this.gotData.bind(this));
    this.serial.on('open', () => {
      console.log("Serial Port is Open!");
    });
    this.receiveMessage="";
    // 新增 dataDist 屬性來儲存數據
    this.dataDist = {
      quat: [0, 0, 0, 0],
      euler: [0, 0, 0],
      acceleration: [0, 0, 0]
    };
    console.log(this.serial);
  }

  onGotData(){

  }

  // 輸出資料
  // sendToArduino(msg){
  //   serial.write(msg);
  // }
  
  // 獲取資料
  gotData() {    
    let currentString = this.serial.readLine();
    if (currentString != "") {
      this.receiveMessage = currentString;
      this.dataSaveToDist();
      this.onGotData();
    }
  }

  dataSaveToDist(){
    // 使用正則表達式解析數據
    if (this.receiveMessage.startsWith('quat:')) {
      let quatValues = this.receiveMessage.split(':')[1].split(',');
      this.dataDist.quat = [parseFloat(quatValues[0]), 
                            parseFloat(quatValues[1]),
                            parseFloat(quatValues[2]),
                            parseFloat(quatValues[3])];
    } else if (this.receiveMessage.startsWith('euler:')) {
      let eulerValues = this.receiveMessage.split(':')[1].split(',');
      this.dataDist.euler = [parseFloat(eulerValues[0]), 
                            parseFloat(eulerValues[1]),
                            parseFloat(eulerValues[2])];
    } else if (this.receiveMessage.startsWith('acceleration:')) {
      let accelValues = this.receiveMessage.split(':')[1].split(',');
      this.dataDist.acceleration = [parseInt(accelValues[0]), 
                                    parseInt(accelValues[1]),
                                    parseInt(accelValues[2])];
    }
  }
  
}


