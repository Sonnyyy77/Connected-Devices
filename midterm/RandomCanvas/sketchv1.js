const socket = new WebSocket("ws://localhost:1880/testpage");

let x, y;
let targetX, targetY;
let size, targetSize;
let speed = 10;
let sizeSpeed = 0.5;
let bgColor1, bgColor2;
let colorFrom, colorFromR, colorFromG, colorFromB, colorTo, colorToR, colorToG, colorToB;
let lerpedColor;


function setup() {
  createCanvas(windowWidth, windowHeight);
  x = random(width);
  y = random(height);
  targetX = x;
  targetY = y;
  size = random(100, 200);
  targetSize = size;
  // bgColor1 = color('#8364e8');
  // bgColor1.setAlpha(50);
  // bgColor2 = color('#d397fa');
  // bgColor2.setAlpha(50);

//   colorFromR = 211;
// colorFromG = 151;
// colorFromB = 250;
// colorToR = 131;
// colorToG = 100;
// colorToB = 232;

  background(0);
}

function draw() {
  // background(255, 50);
  // let lerpedBackgroundColor = lerpColor(bgColor1, bgColor2, (sin(frameCount * 0.1) + 1) / 2);
  // background(lerpedBackgroundColor);

  //Get a random target position
  if (dist(x, y, targetX, targetY) < 1) {
    let newTargetX = x + random(-400, 400);
    let newTargetY = y + random(-400, 400);
    targetX = constrain(newTargetX, 0, width);
    targetY = constrain(newTargetY, 0, height);
  }

  x += (targetX - x) * 0.05;
  y += (targetY - y) * 0.05;

  //Get a random size
  if (abs(size - targetSize) < 0.1) {
    targetSize = size + random(-20, 20);
    if (targetSize >= 200){
      targetSize = 200;
    }
    else if (targetSize <= 20){
      targetSize = 20;
    }
  }

  size += (targetSize - size) * sizeSpeed;

  x = constrain(x, 0, width);
  y = constrain(y, 0, height);

  //Gradient color change
  colorFrom = color(colorFromR, colorFromG, colorFromB);
  colorTo = color(colorToR, colorToG, colorToB);
  lerpedColor = lerpColor(
    colorFrom,
    colorTo,
    map(sin(frameCount * 0.1), -1, 1, 0, 1)
  );

    console.log(colorFrom.levels);

  fill(colorFrom);
  noStroke();
  ellipse(x, y, size, size);
}

socket.addEventListener("message", handleSocketMessage);


function handleSocketMessage(event) {
  // console.log("connected");
  let colorval = event.data.split(",");
  console.log(colorval)

  colorFromR = 255 - colorval[0]
  colorFromG = 255 - colorval[1]
  colorFromB = 255 - colorval[2]

  // console.log()

  // if (colorval[0] == "R"){
  //     colorFromR = colorval.match(/(\d+)/)
  // }
  // if (event.data[0] == "G"){
  //     // text.style.letterSpacing = "-" + colorval[0] + "px";
  //     // slider.value = colorval[0]*-1;
  // }
  // if (event.data[0] == "B"){
  //         // roundswitch.checked = true;
  //         // document.body.style.background = "black";
  //         // text.style.color = "white";
  //         // hidtext.style.opacity = "1";
  // }
  // console.log(colorval[0]);
}


handleSocketMessage();