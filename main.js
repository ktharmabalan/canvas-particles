// https://www.youtube.com/channel/UC9Yp2yz6-pwhQuPlIDV_mjA/videos
// https://codepen.io/tholman/full/foxtn
// https://www.html5canvastutorials.com/
// https://www.khanacademy.org/math/algebra2/trig-functions/intro-to-radians-alg2/v/introduction-to-radians
// https://codepen.io/sakri/pen/mtlDu
// https://codepen.io/allanpope/pen/LVWYYd
// https://christopherlis.com/projects/particle-surge

var canvas = document.querySelector('canvas');
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var c = canvas.getContext('2d');
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

var mouse = {
  x: undefined,
  y: undefined,
};

var maxSize = 50;
var interactionLimit = 20;

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener('resize', function() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  init();
});

function Circle(x, y, dx, dy, speed, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.speed = speed;
  this.radius = radius;
  this._radius = radius;
  this.color = color;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = 'rgba(' + this.color + ', 1)';
    c.stroke();
    c.fillStyle = 'rgba(' + this.color + ', 0.5)';
    c.fill();
  }

  this.update = function() {
    if ((this.x + this.radius) >= width || (this.x - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.y + this.radius) >= height || (this.y - this.radius) <= 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if (mouse.x && mouse.y && mouse.x - this.x < (interactionLimit) && mouse.x - this.x > -(interactionLimit) && mouse.y - this.y < (interactionLimit) && mouse.y - this.y > -(interactionLimit) && this.radius < maxSize) {
      this.radius += 1;
    } else if (this.radius > this._radius) {
      this.radius -= 1;
    }
    
    this.draw();
  }
}

var circles = [];

function init() {
  circles = [];

  for (let i = 0; i <= 500; i++) {
    var speed = 2;
    var x = Math.random() * (width - radius * 2) + radius;
    var y = Math.random() * (height - radius * 2) + radius;
    var dx = (Math.random() - 0.5) + (Math.random() * speed);
    var dy = (Math.random() - 0.5) + (Math.random() * speed);
    var radius = 2;
    // radius = (Math.random() * 8) + 2;
    var color = (Math.random() * 255) + ', ' + (Math.random() * 255) + ', ' + (Math.random() * 255);
    
    circles.push(new Circle(x, y, dx, dy, speed, radius, color));
  }
}

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, width, height);
  circles.forEach(circle => {
    circle.update();
  });
}

init();
animate();