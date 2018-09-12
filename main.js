import { distance, resolveCollision } from './utils';

// https://codepen.io/jdnichollsc/pen/waVMdB?editors=0010
// https://www.youtube.com/channel/UC9Yp2yz6-pwhQuPlIDV_mjA/videos
// https://codepen.io/tholman/full/foxtn
// https://www.html5canvastutorials.com/
// https://www.khanacademy.org/math/algebra2/trig-functions/intro-to-radians-alg2/v/introduction-to-radians
// https://codepen.io/sakri/pen/mtlDu
// https://codepen.io/allanpope/pen/LVWYYd
// https://christopherlis.com/projects/particle-surge

const canvas = document.querySelector('canvas');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const c = canvas.getContext('2d');
// c.fillStyle = "#009688";
// c.fillRect(100, 100, 50, 50);
// c.fillStyle = "#3f51b5";
// c.fillRect(200, 200, 50, 50);
// c.fillRect(0, 200, 50, 50);

// // Line
// c.beginPath();
// c.moveTo(0, 200);
// c.lineTo(50, 50);
// c.lineTo(100, 200);
// c.strokeStyle = "#0088FF";
// c.stroke();
// // c.closePath();

// c.beginPath();
// // Arc / Circle: takes radians for start and end angles
// c.arc(200, 200, 30, 0, Math.PI * 2, false);
// c.stroke();

// Draw circles
// for (var i = 0; i < 200; i++) {
//   var x = Math.random() * width;
//   var y = Math.random() * height;
//   c.beginPath();
//   c.arc(x, y, (Math.random() * 10) + 3, 0, Math.PI * 2, false);
//   c.fillStyle = 'rgb(' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ')';
//   c.fill();
//   c.strokeStyle = 'rgb(' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255) + ')';
//   c.stroke();
// }

const mouse = {
  x: undefined,
  y: undefined,
};

const maxSize = 50;
const interactionLimit = 50;

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  init();
});

class Circle {
  constructor(x, y, dx, dy, speed, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
    this.radius = radius;
    this._radius = radius;
    this.color = color;
    this.colliding = false;
    this.mass = 1;
    this.opacity = 0.1;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // c.save();
    // c.globalAlpha = this.opacity;
    // if (this.colliding) {
    c.fillStyle = `rgba(${this.color},${this.opacity})`;
    c.fill();
    // }
    // c.restore();
    c.strokeStyle = `rgba(${this.color}, 1)`;
    c.lineWidth = 5;
    c.stroke();
  }

  update(circles) {
    this.colliding = false;
    if ((this.x + this.radius) >= width || (this.x - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.y + this.radius) >= height || (this.y - this.radius) <= 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if (mouse.x && mouse.y && mouse.x - this.x < (interactionLimit) && mouse.x - this.x > -(interactionLimit) && mouse.y - this.y < (interactionLimit) && mouse.y - this.y > -(interactionLimit)) {
      this.colliding = true;
      //   if (this.radius < maxSize) {
      //     this.radius += 10;
      //   }
      //   if (this.opacity < 1) {
      //     this.opacity = 1.0;
      //   }
      // } else {
      //   if (this.radius > this._radius) {
      //     this.radius -= 1;
      //   }
      //   if (this.opacity > 0.1) {
      //     this.opacity -= 0.05;
      //   }
    }

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const { x, y } = this;
      // console.log(circle);
      const { x: x1, y: y1 } = circle;
      if (this === circle) continue;
      if (distance(x, y, x1, y1) - this.radius * 2 < 0) {
        // console.log('collided');
        this.colliding = true;
        resolveCollision(this, circle);
      }
    }

    if (this.colliding) {
      if (this.radius < maxSize) {
        this.radius += 10;
      }
      if (this.opacity < 1) {
        this.opacity = 1.0;
      }
    } else {
      if (this.radius > this._radius) {
        this.radius -= 2;
      }
      if (this.opacity > 0.1) {
        this.opacity -= 0.05;
      }
    }
    
    this.draw();
  }
}

let circles = [];
const maxTries = 1000;

const init = () => {
  circles = [];
  for (let i = 0; i <= 50; i++) {
    const speed = 5;
    const radius = 30;
    // radius = (Math.random() * 50) + 10;
    let x = Math.random() * (width - radius * 2) + radius;
    let y = Math.random() * (height - radius * 2) + radius;
    const dx = (Math.random() - 0.5) + (Math.random() * speed);
    const dy = (Math.random() - 0.5) + (Math.random() * speed);
    const color = (Math.random() * 255) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255);

    let loopCount = 0;
    if (i !== 0) {
      for (let j = 0; j < circles.length; j++) {
        // console.log(loopCount);
        if (loopCount > maxTries) {
          // console.log('break');
          break;
        }
        const { x: x2, y: y2 } = circles[j];
        if (distance(x, y, x2, y2) - radius * 2 < 0) {
          x = Math.random() * (width - radius * 2) + radius;
          y = Math.random() * (height - radius * 2) + radius;
          j = -1;
        }
        loopCount++;
      }
    }

    circles.push(new Circle(x, y, dx, dy, speed, radius, color));
  }
}

const animate = () => {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, width, height);
  circles.forEach(circle => {
    circle.update(circles);
  });
}

init();
animate();