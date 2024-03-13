// let x, y;
// let targetX, targetY;
// let size, targetSize;
// let speed = 10;
// let sizeSpeed = 0.5;


// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   x = random(width);
//   y = random(height);
//   targetX = x;
//   targetY = y;
//   size = random(100, 200);
//   targetSize = size;

//   background(0);
// }

// function draw() {
//   // background(255, 50);

//   //Get a random target position
//   if (dist(x, y, targetX, targetY) < 1) {
//     let newTargetX = x + random(-400, 400);
//     let newTargetY = y + random(-400, 400);
//     targetX = constrain(newTargetX, 0, width);
//     targetY = constrain(newTargetY, 0, height);
//   }

//   x += (targetX - x) * 0.05;
//   y += (targetY - y) * 0.05;

//   //Get a random size
//   if (abs(size - targetSize) < 0.1) {
//     targetSize = size + random(-20, 20);
//     if (targetSize >= 200){
//       targetSize = 200;
//     }
//     else if (targetSize <= 20){
//       targetSize = 20;
//     }
//   }

//   size += (targetSize - size) * sizeSpeed;

//   x = constrain(x, 0, width);
//   y = constrain(y, 0, height);

//   //Gradient color change
//   colorFrom = color(colorFromR, colorFromG, colorFromB);
//   colorTo = color(colorToR, colorToG, colorToB);
//   lerpedColor = lerpColor(
//     colorFrom,
//     colorTo,
//     map(sin(frameCount * 0.1), -1, 1, 0, 1)
//   );

//     console.log(colorFrom.levels);

//   fill(colorFrom);
//   noStroke();
//   ellipse(x, y, size, size);
// }