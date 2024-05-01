const socket = new WebSocket("ws://localhost:1880/testpage");

let color1 = document.getElementById('paint1');
let color2 = document.getElementById('paint2');
let color3 = document.getElementById('paint3');
let color4 = document.getElementById('paint4');
let color5 = document.getElementById('paint5');
let color6 = document.getElementById('paint6');
let color7 = document.getElementById('paint7');
let rotateAngle = 0;
let rotationCenter;
 
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Common = Matter.Common,
  Svg = Matter.Svg,
  Vertices = Matter.Vertices,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint;

const iEngine = Engine.create({ gravity: { y: 0.5 } });
const World = iEngine.world;
const iRunner = Runner.create();
const iRender = Render.create({
element: document.body,
engine: iEngine,
options: {
  width: window.innerWidth,
  height: window.innerHeight,
  wireframes: false,
  background: "white"
}
});

let glass1pic = './assets/glass1.png';
let glass1Img = document.createElement("img");
glass1Img.src = glass1pic;
glass1Img.width = 1000;
glass1Img.height = 1000;
glass1Img.alt = "glass1";
glass1Img.style.position = "absolute";
glass1Img.style.left = `${window.innerWidth / 2 - 500}px`; // Center the image horizontally
glass1Img.style.bottom = "-160px";
glass1Img.style.zIndex = "2";
glass1Img.style.pointerEvents = "none";
glass1Img.id = "glassimg1";
document.body.appendChild(glass1Img);

let leftWall1, leftWall2, leftWall3, leftWall4, leftWall5, leftWall6, leftWall7, leftWall8, rightWall1, rightWall2, rightWall3, rightWall4, rightWall5, rightWall6, rightWall7, rightWall8, ground1, ground2, ground3;
let walls = [];
let lastCombinedRotation = 0;
let diffRotation;
let smoothedRotationX = 0;
let smoothedRotationY = 0;
const alpha = 0.03;
let button1State = 0;
let button2State = 0;

let balls=[];
let isDrawing = false;
let ballColor = "#FA897B";
const buttons = document.querySelectorAll('.color');
let currentIndex = 0;
const colorValues = [
  '#FA897B', '#FFB350', '#FFDD94', '#D0E6A5', '#86E3CE', '#66A5D8', '#CCABD8'
];


function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

socket.addEventListener("message", handleSocketMessage);

function handleSocketMessage(event) {
  const data = JSON.parse(event.data);
  const rotationX = data.gyroX;
  const rotationY = data.gyroY;
  button1State = data.button1State;
  button2State = data.button2State;

  smoothRotation(rotationX, rotationY);
  rotateSmoothed();
  changeColor(button1State);
  openDrawing(button2State)
};

const smoothRotation = (rotationX, rotationY) => {
  smoothedRotationX = alpha * rotationX + (1 - alpha) * smoothedRotationX;
  smoothedRotationY = alpha * rotationY + (1 - alpha) * smoothedRotationY;
};

const rotateSmoothed = () => {
  const combinedRotation = calculateCombinedRotation(smoothedRotationX, smoothedRotationY);

  glass1Img.style.transformOrigin = "50% 46%";
  glass1Img.style.transform = `rotate(${combinedRotation}deg)`;

  diffRotation = (combinedRotation - lastCombinedRotation)*0.0175;
  lastCombinedRotation = combinedRotation;
  walls.forEach(wall => {
    let newPosition = rotatePoint({ x: rotationCenter.position.x, y: rotationCenter.position.y }, { x: wall.position.x, y: wall.position.y }, diffRotation);
    Body.setPosition(wall, newPosition);
    Body.rotate(wall, diffRotation);
  });
};

const calculateCombinedRotation = (rotationX, rotationY) => {
  const mappedX = map(rotationX, -90, 90, -1, 1);
  const mappedY = map(rotationY, -90, 90, -1, 1);
  const combinedRotation = - Math.atan2(mappedX, mappedY) * (180 / Math.PI) - 90;

  return combinedRotation;
};

function rotatePoint(pivot, point, angle) {
  let s = Math.sin(angle);
  let c = Math.cos(angle);
  // translate point back to origin:
  point.x -= pivot.x;
  point.y -= pivot.y;
  // rotate point
  let xnew = point.x * c - point.y * s;
  let ynew = point.x * s + point.y * c;
  // translate point back:
  point.x = xnew + pivot.x;
  point.y = ynew + pivot.y;
  return point;
}

const changeActiveButton = () => {
  buttons.forEach((button, index) => {
    if (index === currentIndex) {
        button.classList.add('activeBtn');
        // console.log(currentIndex);
    } else {
        button.classList.remove('activeBtn');
    }
});
};

function changeColor(button1State){
  if (button1State === 1) {
      // Change the current index and loop back to the beginning if necessary
      currentIndex = (currentIndex + 1) % buttons.length;
      ballColor = colorValues[currentIndex];
      changeActiveButton();
  }
}

function openDrawing(button2State){
  if (button2State === 1) {
    startDrawing();
  }
}

changeActiveButton();

color1.addEventListener("click", function () {
  ballColor = "#FA897B";
  color1.style.transform = "scale(1.2)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1)";
})

color2.addEventListener("click", function () {
  ballColor = "#FFB350";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1.2)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1)";
})

color3.addEventListener("click", function () {
  ballColor = "#FFDD94";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1.2)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1)";
})

color4.addEventListener("click", function () {
  ballColor = "#D0E6A5";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1.2)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1)";
})

color5.addEventListener("click", function () {
  ballColor = "#86E3CE";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1.2)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1)";
})

color6.addEventListener("click", function () {
  ballColor = "#66A5D8";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1.2)";
  color7.style.transform = "scale(1)";
})

color7.addEventListener("click", function () {
  ballColor = "#CCABD8";
  color1.style.transform = "scale(1)";
  color2.style.transform = "scale(1)";
  color3.style.transform = "scale(1)";
  color4.style.transform = "scale(1)";
  color5.style.transform = "scale(1)";
  color6.style.transform = "scale(1)";
  color7.style.transform = "scale(1.2)";
})


const defaultCategory = 0x0001,
rotationCenterCategory = 0x0002,
ballCategory = 0x0004;

function drawBall() {
  if (isDrawing) {
    // let posX = e.clientX;
    // let posY = e.clientY;
    const shapeType = getRandomShapeType();
    let options = {
      friction: 0.9,
      restitution: 0,
      chamfer: { radius: 2 },
      render: { fillStyle: ballColor },
      collisionFilter: {
        category: ballCategory,
        // Allows the ball to collide with both the default category and other balls, but not with rotationCenter
        mask: defaultCategory | ballCategory
      }
    };
    let shape;
    switch(shapeType) {
      case 'circle':
        shape = Bodies.circle(window.innerWidth / 2, window.innerHeight * 0.3, 7, options);
        break;
      case 'rectangle':
        shape = Bodies.rectangle(window.innerWidth / 2, window.innerHeight * 0.3, 13, 13, options);
        break;
      case 'triangle':
        shape = Bodies.polygon(window.innerWidth / 2, window.innerHeight * 0.3, 3, 9, options);
        break;
    }

    if (shape) {
      Composite.add(iEngine.world, shape);
      balls.push(shape);
    }

    cleanupShapes();
  }
}

function getRandomShapeType() {
  const types = ['circle', 'rectangle', 'triangle']; // Extend with more shapes as needed
  const index = Math.floor(Math.random() * types.length);
  return types[index];
}

function cleanupShapes() {
  balls = balls.filter(ball => {
    return ball.position.y < window.innerHeight && ball.position.y > 0 && ball.position.x < window.innerWidth && ball.position.x > 0;
  });
}

function startDrawing(){
    isDrawing = true;
    drawBall();
}

function stopDrawing(e){
  isDrawing = false;
}

let wallOpacity = 0;

function drawWalls1() {
  let verticesLeft1 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 25, y: 25 },
    { x: 10, y: 25 }
  ]
  let verticesLeft2 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 17, y: 55 },
    { x: 2, y: 55 }
  ]
  let verticesLeft3 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 12, y: 55 },
    { x: -3, y: 55 }
  ]
  let verticesLeft4 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: -5, y: 115 },
    { x: -20, y: 115 }
  ]
  let verticesLeft5 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: -15, y: 65 },
    { x: -30, y: 65 }
  ]
  let verticesLeft6 = [
    { x: 0, y: 0 },
    { x: 15, y: 5 },
    { x: -20, y: 35 },
    { x: -35, y: 30 }
  ]
  let verticesLeft7 = [
    { x: -10, y: -15 },
    { x: 8, y: -2 },
    { x: 5, y: 17 },
    { x: -15, y: 25 }
  ]
  let verticesLeft8 = [
    { x: 0, y: 0 },
    { x: 30, y: -5 },
    { x: 15, y: 25 },
    { x: -5, y: 25 }
  ]

  let verticesRight1 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 5, y: 25 },
    { x: -10, y: 25 }
  ]
  let verticesRight2 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 13, y: 55 },
    { x: -2, y: 55 }
  ]
  let verticesRight3 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 18, y: 55 },
    { x: 3, y: 55 }
  ]
  let verticesRight4 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 35, y: 115 },
    { x: 20, y: 115 }
  ]
  let verticesRight5 = [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 45, y: 65 },
    { x: 30, y: 65 }
  ]
  let verticesRight6 = [
    { x: 0, y: 5 },
    { x: 15, y: 0 },
    { x: 50, y: 30 },
    { x: 35, y: 35 }
  ]
  let verticesRight7 = [
    { x: -10, y: -2 },
    { x: 8, y: -15 },
    { x: 13, y: 25 },
    { x: -7, y: 17 }
  ]
  let verticesRight8 = [
    { x: 0, y: -5 },
    { x: 30, y: 0 },
    { x: 35, y: 25 },
    { x: 15, y: 25 }
  ]

  let bottomleft = [
    { x: 0, y: 0 },
    { x: 95, y: 10 },
    { x: 95, y: 25 },
    { x: 0, y: 15 }
  ]
  let bottomright = [
    { x: 0, y: 10 },
    { x: 95, y: 0 },
    { x: 95, y: 15 },
    { x: 0, y: 25 }
  ]

  // Use a group for rotation
  let group = Body.nextGroup(true);
  // Central static body to act as a rotation point
  rotationCenter = Bodies.circle(window.innerWidth / 2, window.innerHeight-380, 0.01, { isStatic: true, render: { opacity: 0, visible: false } });
  rotationCenter.collisionFilter = {category: rotationCenterCategory, mask: defaultCategory // It will only collide with bodies in the default category
    };
  const wallOptions = { collisionFilter: { group: group }, isStatic: true, render: { opacity: wallOpacity } };

  leftWall1 = Bodies.fromVertices(window.innerWidth / 2 - 132, window.innerHeight - 150, verticesLeft1, wallOptions, true);
  leftWall2 = Bodies.fromVertices(window.innerWidth / 2 - 137, window.innerHeight - 180, verticesLeft2, wallOptions, true);
  leftWall3 = Bodies.fromVertices(window.innerWidth / 2 - 137, window.innerHeight - 225, verticesLeft3, wallOptions, true);
  leftWall4 = Bodies.fromVertices(window.innerWidth / 2 - 127, window.innerHeight - 290, verticesLeft4, wallOptions, true);
  leftWall5 = Bodies.fromVertices(window.innerWidth / 2 - 107, window.innerHeight - 365, verticesLeft5, wallOptions, true);
  leftWall6 = Bodies.fromVertices(window.innerWidth / 2 - 82, window.innerHeight - 400, verticesLeft6, wallOptions, true);
  leftWall7 = Bodies.fromVertices(window.innerWidth / 2 - 64, window.innerHeight - 420, verticesLeft7, wallOptions, true);
  leftWall8 = Bodies.fromVertices(window.innerWidth / 2 - 57, window.innerHeight - 445, verticesLeft8, wallOptions, true);
  rightWall1 = Bodies.fromVertices(window.innerWidth / 2 + 132, window.innerHeight - 150, verticesRight1, wallOptions, true);
  rightWall2 = Bodies.fromVertices(window.innerWidth / 2 + 137, window.innerHeight - 180, verticesRight2, wallOptions, true);
  rightWall3 = Bodies.fromVertices(window.innerWidth / 2 + 137, window.innerHeight - 225, verticesRight3, wallOptions, true);
  rightWall4 = Bodies.fromVertices(window.innerWidth / 2 + 127, window.innerHeight - 300, verticesRight4, wallOptions, true);
  rightWall5 = Bodies.fromVertices(window.innerWidth / 2 + 107, window.innerHeight - 365, verticesRight5, wallOptions, true);
  rightWall6 = Bodies.fromVertices(window.innerWidth / 2 + 82, window.innerHeight - 400, verticesRight6, wallOptions, true);
  rightWall7 = Bodies.fromVertices(window.innerWidth / 2 + 64, window.innerHeight - 420, verticesRight7, wallOptions, true);
  rightWall8 = Bodies.fromVertices(window.innerWidth / 2 + 57, window.innerHeight - 445, verticesRight8, wallOptions, true);

  ground1 = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 133, 110, 15, wallOptions);
  ground2 = Bodies.fromVertices(window.innerWidth / 2 - 90, window.innerHeight - 138, bottomleft, wallOptions, true);
  ground3 = Bodies.fromVertices(window.innerWidth / 2 + 90, window.innerHeight - 138, bottomright, wallOptions, true);

  walls = [leftWall1, leftWall2, leftWall3, leftWall4, leftWall5, leftWall6, leftWall7, leftWall8, rightWall1, rightWall2, rightWall3, rightWall4, rightWall5, rightWall6, rightWall7, rightWall8, ground1, ground2, ground3];

  walls.forEach(wall => {
    if (wall && wall.position) {
      Composite.add(World, Constraint.create({
        bodyA: rotationCenter,
        bodyB: wall,
        pointA: { x: 0, y: 0 }, // Center point on rotationCenter
        length: 0,
        stiffness: 1
      }));
    }
  });

  Composite.add(World, [rotationCenter, ...walls]);
}

drawWalls1();

Render.run(iRender);
Runner.run(iRunner, iEngine);
// document.addEventListener('pointerdown', startDrawing);
// document.addEventListener('pointermove', drawBall);
document.addEventListener('pointerup', stopDrawing);
document.addEventListener("keydown", function(event) {
  // Check if the key pressed is the space key
  if (event.keyCode === 32 || event.key === " ") {
    startDrawing();
    // drawBall();
    // console.log("Space key pressed");
  }
});

document.addEventListener('keyup', stopDrawing); 

// drawWalls1();