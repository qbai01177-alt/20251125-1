let stopSpriteSheet;
let walkSpriteSheet;
let jumpSpriteSheet;
let pushSpriteSheet;
let toolSpriteSheet;
let velocityY = 0;          // Y軸速度
const gravity = 0.6;        // 重力
const jumpForce = -18;      // 跳躍力道 (負數代表向上)
let isOnGround = true;      // 是否在地面上

let characterX, characterY; // 角色的 X 和 Y 座標
let facingDirection = 1;    // 角色面向: 1 為右, -1 為左
const characterSpeed = 5;   // 角色移動速度

let stopAnimation = [];
let walkAnimation = [];

let jumpAnimation = [];
let pushAnimation = [];
let toolAnimation = [];
const stopTotalFrames = 11; // 站立圖片精靈中的總影格數
const walkTotalFrames = 9;  // 走路圖片精靈中的總影格數

const jumpTotalFrames = 10;  // 跳躍圖片精靈中的總影格數
const pushTotalFrames = 4;  // 推圖片精靈中的總影格數
const toolTotalFrames = 5;  // tool.png 的總影格數
// 動畫播放速度，數字越小越快
// 表示每隔 5 個 draw() 循環才更新一次影格 (約 0.08 秒)
const animationSpeed = 5; 

// --- 用於偵錯的變數 ---
let loadingError = null; // 統一的錯誤訊息
let stopImageLoaded = false;
let walkImageLoaded = false;
let jumpImageLoaded = false;
let pushImageLoaded = false;
let toolImageLoaded = false;

// --- 攻擊狀態變數 ---
let isAttacking = false;
let attackState = 'none'; // 'none', 'push', 'tool'
let attackFrameCounter = 0;
let attackDirection = 1; // 攻擊時的方向
let toolX, toolY;        // tool.png 特效的座標
const toolSpeed = 30;    // tool.png 特效的飛行速度 (15 * 2)

// 在 setup() 之前執行，用來預先載入資源
function preload() {
  // 載入站立的圖片精靈
  stopSpriteSheet = loadImage(
    '20251125/1/stop/stop.png', // 站立圖片路徑
    // 成功時的回呼函式
    () => {
      console.log("圖片載入成功！ (stop.png)");
      stopImageLoaded = true;
    },
    // 失敗時的回呼函式
    (event) => {
      console.error("載入圖片失敗:", event);
      loadingError = "圖片載入失敗！\n\n請檢查：\n1. 檔案路徑是否為 '20251125/1/stop/stop.png'。\n2. 是否使用了本地伺服器 (Live Server)。";
    }
  );

  // 載入走路的圖片精靈
  walkSpriteSheet = loadImage(
    '20251125/1/walk/walk.png', // 走路圖片路徑
    // 成功時的回呼函式
    () => {
      console.log("圖片載入成功！ (walk.png)");
      walkImageLoaded = true;
    },
    // 失敗時的回呼函式
    (event) => {
      console.error("載入圖片失敗:", event);
      loadingError = "圖片載入失敗！\n\n請檢查：\n1. 檔案路徑是否為 '20251125/1/walk/walk.png'。\n2. 是否使用了本地伺服器 (Live Server)。";
    }
  );

  // 載入跳躍的圖片精靈
  jumpSpriteSheet = loadImage(
    '20251125/1/jump/jump.png', // 跳躍圖片路徑
    // 成功時的回呼函式
    () => {
      console.log("圖片載入成功！ (jump.png)");
      jumpImageLoaded = true;
    },
    // 失敗時的回呼函式
    (event) => {
      console.error("載入圖片失敗:", event);
      loadingError = "圖片載入失敗！\n\n請檢查：\n1. 檔案路徑是否為 '20251125/1/jump/jump.png'。\n2. 是否使用了本地伺服器 (Live Server)。";
    }
  );

  // 載入推的圖片精靈
  pushSpriteSheet = loadImage(
    '20251125/1/push/push.png', // 推的圖片路徑
    // 成功時的回呼函式
    () => {
      console.log("圖片載入成功！ (push.png)");
      pushImageLoaded = true;
    },
    // 失敗時的回呼函式
    (event) => {
      console.error("載入圖片失敗:", event);
      loadingError = "圖片載入失敗！\n\n請檢查：\n1. 檔案路徑是否為 '20251125/1/push/push.png'。\n2. 是否使用了本地伺服器 (Live Server)。";
    }
  );

  // 載入 tool 的圖片精靈
  toolSpriteSheet = loadImage(
    '20251125/1/tool/tool.png', // tool 的圖片路徑
    // 成功時的回呼函式
    () => {
      console.log("圖片載入成功！ (tool.png)");
      toolImageLoaded = true;
    },
    // 失敗時的回呼函式
    (event) => {
      console.error("載入圖片失敗:", event);
      loadingError = "圖片載入失敗！\n\n請檢查：\n1. 檔案路徑是否為 '20251125/1/tool/tool.png'。\n2. 是否使用了本地伺服器 (Live Server)。";
    }
  );

}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 如果圖片載入成功，才進行切割
  if (stopImageLoaded) {
    // 切割站立動畫
    const frameWidth = stopSpriteSheet.width / stopTotalFrames;
    const frameHeight = stopSpriteSheet.height;
    for (let i = 0; i < stopTotalFrames; i++) {
      let frame = stopSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
      stopAnimation.push(frame);
    }
  }

  if (walkImageLoaded) {
    // 切割走路動畫
    const frameWidth = walkSpriteSheet.width / walkTotalFrames;
    const frameHeight = walkSpriteSheet.height;
    for (let i = 0; i < walkTotalFrames; i++) {
      let frame = walkSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
      walkAnimation.push(frame);
    }
  }

  if (jumpImageLoaded) {
    // 切割跳躍動畫
    const frameWidth = jumpSpriteSheet.width / jumpTotalFrames;
    const frameHeight = jumpSpriteSheet.height;
    for (let i = 0; i < jumpTotalFrames; i++) {
      let frame = jumpSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
      jumpAnimation.push(frame);
    }
  }

  if (pushImageLoaded) {
    // 切割推的動畫
    const frameWidth = pushSpriteSheet.width / pushTotalFrames;
    const frameHeight = pushSpriteSheet.height;
    for (let i = 0; i < pushTotalFrames; i++) {
      let frame = pushSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
      pushAnimation.push(frame);
    }
  }

  if (toolImageLoaded) {
    // 切割 tool 動畫
    const frameWidth = toolSpriteSheet.width / toolTotalFrames;
    const frameHeight = toolSpriteSheet.height;
    for (let i = 0; i < toolTotalFrames; i++) {
      let frame = toolSpriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight);
      toolAnimation.push(frame);
    }
  }

  if (stopImageLoaded && walkImageLoaded && jumpImageLoaded && pushImageLoaded && toolImageLoaded) {
    // 將圖片的繪製模式設定為中心點對齊
    imageMode(CENTER);

    // 初始化角色位置在畫布中央
    characterX = width / 2;
    characterY = height / 2;

    // 初始化物理變數
    velocityY = 0;
    isOnGround = true;
    isAttacking = false;
    attackState = 'none';
    facingDirection = 1;
  }
}

function draw() {
  // 設定背景顏色
  background('#f2e8cf');

  // --- 偵錯訊息顯示 ---
  if (loadingError) {
    // 如果有錯誤，顯示錯誤訊息
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255, 0, 0); // 紅色字
    text(loadingError, width / 2, height / 2);
  } else if (!stopImageLoaded || !walkImageLoaded || !jumpImageLoaded || !pushImageLoaded || !toolImageLoaded) {
    // 如果還在載入中，顯示載入訊息
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("載入中...", width / 2, height / 2);
  } else {
    // --- 物理更新 ---
    // 施加重力
    velocityY += gravity;
    characterY += velocityY;

    // 地面偵測 (讓角色不會掉下畫布中央)
    if (characterY >= height / 2) {
      characterY = height / 2;
      velocityY = 0;
      isOnGround = true;
    } else {
      isOnGround = false;
    }

    // --- 攻擊狀態處理 ---
    // 偵測是否按下空白鍵來啟動攻擊
    if (keyIsDown(32) && !isAttacking) { // 32 是空白鍵的 keyCode，移除 isOnGround 限制以允許空中攻擊
      isAttacking = true;
      attackState = 'push';
      attackDirection = facingDirection; // 記下攻擊時的方向
      attackFrameCounter = 0; // 重置攻擊動畫計數器
    }

    // --- 按鍵處理與動畫選擇 ---
    if (isAttacking) {
      // 如果正在攻擊，則執行攻擊動畫邏輯
      push(); // 儲存繪圖狀態，以便翻轉
      translate(characterX, characterY); // 移動座標系到角色位置
      if (attackDirection === -1) {
        scale(-1, 1); // 如果是向左攻擊，翻轉座標系
      }

      if (attackState === 'push') {
        let frameIndex = floor(attackFrameCounter / animationSpeed);
        if (frameIndex >= pushTotalFrames) {
          // 當 push 動畫播放完一輪後，切換到 tool 狀態
          attackState = 'tool';
          attackFrameCounter = 0;
          toolX = 0; // 初始化 tool 的相對位置
          toolY = 0;
        } else {
          image(pushAnimation[frameIndex], 0, 0); // 在新座標系的原點繪製
          attackFrameCounter++;
        }
      } else if (attackState === 'tool') {
        let frameIndex = floor(attackFrameCounter / animationSpeed);
        if (frameIndex >= toolTotalFrames) {
          // 當 tool 動畫播放完一輪後，結束攻擊
          isAttacking = false;
          attackState = 'none';
        } else {
          // 在播放 tool 動畫時，改為繪製一個靜態的、沒有特效的姿勢（例如走路的最後一幀）
          // 這樣可以避免 push.png 最後一幀自帶的特效與 tool.png 重疊
          image(walkAnimation[walkTotalFrames - 1], 0, 0);
          // 繪製並移動 tool 特效
          image(toolAnimation[frameIndex], toolX, toolY);
          toolX += toolSpeed; // 讓 tool 特效向前飛
          attackFrameCounter++;
        }
      }
      pop(); // 恢復原本的繪圖狀態
    } else if (keyIsDown(87)) { // 'W' key
      // 如果按下 W 鍵，執行跳躍
      if (isOnGround) {
        velocityY = jumpForce;
        isOnGround = false;
      }
      // 無論如何都播放跳躍動畫
      let frameIndex = floor(frameCount / animationSpeed) % jumpTotalFrames;
      image(jumpAnimation[frameIndex], characterX, characterY);
    } else if (keyIsDown(68)) { // 'D' key
      // 按下 D 鍵：向右移動並播放走路動畫
      facingDirection = 1; // 面向右
      characterX += characterSpeed;
      // 邊界處理
      if (characterX > width + walkAnimation[0].width / 2) {
        characterX = -walkAnimation[0].width / 2;
      }
      let frameIndex = floor(frameCount / animationSpeed) % walkTotalFrames;
      image(walkAnimation[frameIndex], characterX, characterY);
    } else if (keyIsDown(65)) { // 'A' key
      // 按下 A 鍵：向左移動並播放翻轉的走路動畫
      facingDirection = -1; // 面向左
      characterX -= characterSpeed;
      // 邊界處理
      if (characterX < -walkAnimation[0].width / 2) {
        characterX = width + walkAnimation[0].width / 2;
      }
      let frameIndex = floor(frameCount / animationSpeed) % walkTotalFrames;
      push(); // 儲存當前的繪圖設定
      translate(characterX, characterY); // 移動到角色的位置
      scale(-1, 1); // 水平翻轉座標系
      image(walkAnimation[frameIndex], 0, 0); // 在翻轉後的新原點繪製圖片
      pop(); // 恢復原本的繪圖設定
    } else {
      // 沒有按鍵時的預設行為
      if (isOnGround) {
        // 如果在地面上，播放站立動畫
        push();
        translate(characterX, characterY);
        if (facingDirection === -1) {
          scale(-1, 1); // 讓站立的角色也能面向左
        }
        let frameIndex = floor(frameCount / animationSpeed) % stopTotalFrames;
        image(stopAnimation[frameIndex], 0, 0);
        pop();
      } else {
        // 如果在空中，繼續播放跳躍動畫
        let frameIndex = floor(frameCount / animationSpeed) % jumpTotalFrames;
        image(jumpAnimation[frameIndex], characterX, characterY);
      }
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重置角色位置到新的畫布中央
  characterX = width / 2;
  characterY = height / 2;
  velocityY = 0;
  isOnGround = true;
  isAttacking = false;
  attackState = 'none';
  facingDirection = 1;
}
