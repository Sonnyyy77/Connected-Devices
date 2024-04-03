const socket = new WebSocket("ws://localhost:1880/testpage");

let particles = [];
let colorR, colorG, colorB;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorR = 0;
  colorG = 0;
  colorB = 0;
}

function draw() {
  background(0, 50);
  
  for (let i=0; i<1; i++){
      particles.push(new Particle(color(colorR, colorG, colorB)));
  }
  
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
    particles[i].checkParticleLives();
    if (particles[i].life <= 0) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(color){
    this.x = random(0,width);
    this.y = random(0,height);
    this.r = random(100, 150);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    this.color = color;
    this.life = 60;
  }

  createParticle() {
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.r);
  }

  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<200) {
        let c = color(this.color);
        c.setAlpha(50);
        stroke(c);
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
  
  checkParticleLives(){
    this.life -= 1;
    // console.log(this.life);
  }
}

socket.addEventListener("message", handleSocketMessage);


function handleSocketMessage(event) {
  // console.log("connected");
  let colorval = event.data.split(",");
  console.log(colorval)

  //white: 5, 5, 5 // 255, 255, 255
  //black: 35, 35, 35 // 0, 0, 0
  //red: 8, 20, 17 // 255, 0, 0
  //blue: 25, 20, 13 // 0, 0, 255
  //green: 16, 12, 17 // 0, 255, 0

  colorR = map(colorval[0], 5, 40, 255, 0)
  colorG = map(colorval[1], 5, 40, 255, 0)
  colorB = map(colorval[2], 5, 40, 255, 0)
}


handleSocketMessage();