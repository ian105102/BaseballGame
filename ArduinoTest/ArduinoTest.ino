#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#define LED_PIN 13
#define INTERRUPT_PIN 2

MPU6050 mpu;

bool DMPReady = false;
uint8_t devStatus;
uint16_t packetSize;

// 用於儲存四元數和運動數據
Quaternion q;           // [w, x, y, z]         Quaternion container
VectorInt16 aa;         // [x, y, z]            Accel sensor measurements
VectorInt16 gy;         // [x, y, z]            Gyro sensor measurements
VectorInt16 aaReal;     // [x, y, z]            Gravity-free accel sensor measurements
VectorInt16 aaWorld;    // [x, y, z]            World-frame accel sensor measurements
VectorFloat gravity;    // [x, y, z]            Gravity vector
float euler[3];         // [psi, theta, phi]    Euler angle container
float ypr[3];           // [yaw, pitch, roll]   Yaw/Pitch/Roll container and gravity vector

uint8_t FIFOBuffer[64];

volatile bool MPUInterrupt = false;  // 中斷標誌
void DMPDataReady() { MPUInterrupt = true; }

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);  // 設定 LED 為輸出模式
  Serial.println("Arduino Ready");
  initMPU();
}

void loop() {
  // 接收來自 p5.js 的資料
  if (Serial.available()) {  
    String receivedString = Serial.readStringUntil('\n');  // 讀取完整字串直到換行
    receivedString.trim();  // 去除換行符號和空格

    // 顯示收到的資料（可見於 Serial Monitor）
    Serial.print("Received: ");
    Serial.println(receivedString);

    // 根據資料控制 LED
    if (receivedString == "H") {  
      digitalWrite(LED_PIN, HIGH);  // 開燈
    } 
    else if (receivedString == "L") {  
      digitalWrite(LED_PIN, LOW);   // 關燈
    }
  }

  // 定期向 p5.js 發送資料
  // Serial.println(i%256);
  MPU();
  Serial.flush();  
  delay(33);  // 每 0.5 秒發送一次資料
}

void initMPU(){
  Wire.begin();
  delay(100);
  mpu.initialize();  // 初始化 MPU6050
  mpu.setSleepEnabled(false);
  pinMode(INTERRUPT_PIN, INPUT);  // 設定中斷腳位

  // 檢查 MPU6050 連接
  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed");
    return;
  }
  Serial.println("MPU6050 connection successful");

  // 初始化 DMP
  devStatus = mpu.dmpInitialize();

  mpu.setXGyroOffset(0);
  mpu.setYGyroOffset(0);
  mpu.setZGyroOffset(0);
  mpu.setXAccelOffset(0);
  mpu.setYAccelOffset(0);
  mpu.setZAccelOffset(0);

  if (devStatus == 0) {
    mpu.CalibrateAccel(6);  // Calibration Time: generate offsets and calibrate our MPU6050
    mpu.CalibrateGyro(6);
    Serial.println("These are the Active offsets: ");
    mpu.PrintActiveOffsets();
    Serial.println("Enabling DMP...");
    mpu.setDMPEnabled(true);  // 開啟 DMP
    attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), DMPDataReady, RISING);  // 設定中斷
    packetSize = mpu.dmpGetFIFOPacketSize();  // 取得 DMP 封包大小
    DMPReady = true;
    Serial.println("DMP ready! Waiting for first interrupt...");
  } else {
    Serial.println("DMP Initialization failed");
  }
}

void MPU(){
  if(DMPReady){
    if (mpu.dmpGetCurrentFIFOPacket(FIFOBuffer)) {
        mpu.dmpGetQuaternion(&q, FIFOBuffer);  // 取得四元數
        mpu.dmpGetGravity(&gravity, &q);      // 取得重力向量
        mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);  // 計算 yaw/pitch/roll
        mpu.dmpGetEuler(euler, &q);
        mpu.dmpGetAccel(&aa, FIFOBuffer);
        mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity);
        // /* Display Quaternion values in easy matrix form: [w, x, y, z] */
        Serial.println(mpu.testConnection());
        Serial.println("quat:" +
                      String(q.w) +
                      "," + 
                      String(q.x) + 
                      "," + 
                      String(q.y) +
                      "," + 
                      String(q.z));

        // /* Display Euler angles in degrees */
        Serial.println("euler:" + 
                      String(euler[0]) +
                      "," + 
                      String(euler[1]) +
                      "," + 
                      String(euler[2]));
        
        // /* Display real acceleration, adjusted to remove gravity */
        Serial.println("acceleration:" +
                      String(aaReal.x) + 
                      "," + 
                      String(aaReal.y) + 
                      "," + 
                      String(aaReal.z));
      }
  }
}