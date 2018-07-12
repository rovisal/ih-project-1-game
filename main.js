var step  = 1;
var img_pos = 0,
img_speed = 15;
var floor = [
  [-2254,559.58 ],[-2221.33,562.71 ],[-2111.774,562.71 ],[-1976.55,559.58 ],[-1928.972,562.71 ],[-1863.864,559.58 ],[-1840.701,562.71 ],[-1758.69,527.652 ],[-1714.241,527.652 ],[-1609.693,527.652 ],[-1585.904,531.408 ],[-1548.342,527.652 ],[-1513.91,531.408 ],[-1469.461,527.652 ],[-1421.257,539.547 ],[-1388.077,555.824 ],[-1351.767,560.206 ],[-1319.213,551.442 ],[-1298.554,527.652 ],[-1167.086,527.652 ],[-1167.086,510.749 ],[-1133.906,510.749 ],[-1133.906,494.472 ],[-1071.303,497.603 ],[-1071.303,466.927 ],[-946.096,466.927 ],[-720.097,466.927 ],[-720.097,426.861 ],[-581.117,426.861 ],[-560.458,435.625 ],[-480.951,396 ]
]
floor = floor.map((e)=>{
  return [2.8*(e[0]+2254),2.3*e[1]-820]
})
function floorLimit(x) {
  // this.ctx.lineTo(2*(e[0]+2254),1.8*e[1]-530);

  var index = floor.findIndex((e)=>{return e[0] > x});
  return ((x-floor[index-1][0])*floor[index][1] + (floor[index][0]-x)*floor[index-1][1])/(floor[index][0]-floor[index-1][0]);
} 

function Gameboard() {
  this.ctx = document.getElementById('gameboard').getContext('2d');
  this.width = 5120;
  this.height = 640;
  this.sonic = new Sonic(this.ctx);
  this.img = new Image();
  this.img.src = 'img/gameboard-v2.png';
  this.frame = 0;
  //Enemies
  this.enemies = [];
  //motobugs
  this.myMotobugs = [];
  this.enemies.push(this.myMotobugs);
  // Add motobugs
    // Group 1
  // for (var i = 0; i<1; i++) {
  var motobug = new Motobug(720, 430, this.ctx);
  this.myMotobugs.push(motobug);
  motobug.draw(this.ctx);
  // }
    // Group 2
  var motobug = new Motobug(1500, 380, this.ctx);
  this.myMotobugs.push(motobug);
  motobug.draw(this.ctx);
  // Rings
  this.rings = [];
  // Add Rings
  for (var i = 0; i<3; i++) {
    var ring = new Rings(530 + i*35, 433, this.ctx);
		this.rings.push(ring);
		ring.draw(this.ctx);
  }
  for (var i = 0; i<6; i++) {
    var ring = new Rings(650, 330 - i*30, this.ctx);
		this.rings.push(ring);
		ring.draw(this.ctx);
  }
  this.drawRings = function() {
    this.ctx.font = '20px serif';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Rings: ' + this.sonic.health, 20, 50);
  }
  //Update with setInterval
	setInterval(()=>{
		this.myMotobugs.forEach((motobug) => {
			motobug.x -= 2;
		});
  },80)
}

Gameboard.prototype.testCrashEnemies = function() {
  for (i = 0; i < this.enemies.length; i++) {
    for (j = 0; j < this.enemies[i].length; j++) {
      if (this.sonic.crashWith(this.enemies[i][j]) &&
      !(["jright","jump","jleft"].includes(this.sonic.sonic_draw_status)) ) {
        
        this.sonic.health -= this.enemies[i][j].strength;
        this.sonic.score += 100;
        this.sonic.sonic_draw_status = 'hurt';
        console.log("Sonic health is now: " + this.sonic.health);
      } else if (this.sonic.crashWith(this.enemies[i][j])){
        console.log("The enermy is killed");
        this.enemies[i].splice([j], [j]+1);
      }
      this.sonic_draw_status = 'right';
    }
  }
}
Gameboard.prototype.testCrashRings = function() {
  for (i = 0; i < this.rings.length; i++) {
    if (this.sonic.crashWith(this.rings[i])) {
      console.log("There is crash between Sonic and a ring");
      console.log(this.rings[i]);
      this.sonic.health += 5;
      this.rings.splice(i, 1);
    }
  }
}


Gameboard.prototype.updateGameBoard =  function() {
  this.ctx.font = '50px serif';
  this.ctx.fillStyle = 'white';
  this.ctx.fillText('Rings: ' + this.sonic.health, 350, 50);
  // Check if there is a crash with motobugs
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.testCrashEnemies();
  this.testCrashRings();
  this.draw();
  // Drawn sonic depending on its status
  switch (this.sonic.sonic_draw_status) {
    case 'left':
      this.sonic.drawLeft();
      break;
    case 'right':
      this.sonic.drawRight();
      break;
    case 'jright':
      this.sonic.drawJRight();
      break;
    case 'jleft':
      this.sonic.drawJLeft();
      break;
    case 'jump':
      this.sonic.drawJ();
      break;
    case 'hurt':
      this.sonic.drawHurt();
      break;
  }
  //Displays
  this.drawRings();

  //Update myMotobugs
  this.myMotobugs.forEach((motobug) => { motobug.draw(this.ctx); })
  //Update rings
  this.rings.forEach((ring) => { ring.draw(this.ctx); })

  this.animationFrame = requestAnimationFrame(this.updateGameBoard.bind(this));
  // Notes
  // Display sonic x and draw rectangle showing square
  // console.log(this.sonic.x, floorLimit(this.sonic.x))
  // this.ctx.fillRect(this.sonic.x, floorLimit(this.sonic.x), 10, 10);
}

Gameboard.prototype.drawFloor = function () {
  this.ctx.beginPath();
  floor.forEach((e)=>{
    this.ctx.strokeStyle='pink';
    this.ctx.lineTo(e[0],e[1]);
    // this.ctx.lineTo(2*(e[0]+2254),1.8*e[1]-530);
  })
  this.ctx.stroke();
  this.ctx.closePath();
}

Gameboard.prototype.draw = function () {
  this.ctx.drawImage(this.img, img_pos, -635, this.width*2.8, this.height*2.3);
}

// Rings
function Rings(x, y, ctx) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 23;
  this.left   = function() { return this.x + img_pos };
  this.right  = function() { return (this.x + this.width + img_pos)  };
  this.top    = function() { return this.y                 };
  this.bottom = function() { return this.y + this.height };
  this.ring_img = new Image();
  this.ring_img.src = 'img/ring.png';
}
Rings.prototype.draw = function(ctx) {
  this.ctx.drawImage(this.ring_img, this.x + img_pos, this.y, this.width, this.height)
}
// Enemis
function Enemies(x, y, speedX, speedY, ctx, width, height, strength) {
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.ctx = ctx;
  this.width = width;
  this.height = height;
  this.strength = strength;
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.left   = function() { return this.x + img_pos       };
  this.right  = function() { return (this.x + this.width + img_pos)  };
  this.top    = function() { return this.y                 };
  this.bottom = function() { return this.y + this.height };
}
// Enemy - motobug
function Motobug (x, y, ctx) {
  Enemies.call(this, x, y, 1, 0, ctx, 39, 29, 5);
  this.motobug_img = new Image();
  this.motobug_img.src = 'img/enemies/motobug.png';
}
Motobug.prototype = Object.create(Enemies.prototype);
Motobug.prototype.constructor = Motobug;

Motobug.prototype.draw = function(ctx) {
  this.ctx.drawImage(this.motobug_img, this.x-22 + img_pos, this.y-22, this.width, this.height)
}
// /Enemy - motobug
// Sonic
var gravity = 30,
dirleft = false,
dirright = false,
jump = false;
function Sonic(ctx) {
  this.x = 520;
  this.y = 430;
  this.width = 38;
  this.height = 39;
  this.ctx = ctx;
  this.speed = 0.1;
  // Sonic health
  this.health = 0;
  this.score = 0;
  // Images right
  this.sonic_img_right = [new Image(),new Image(),new Image()];
  this.sonic_img_right[0].src = 'img/sonic/s-right-1.png';
  this.sonic_img_right[1].src = 'img/sonic/s-right-2.png';
  this.sonic_img_right[2].src = 'img/sonic/s-right-3.png';
  // Images left
  this.sonic_img_left = [new Image(),new Image(),new Image()];
  this.sonic_img_left[0].src = 'img/sonic/s-left-1.png';
  this.sonic_img_left[1].src = 'img/sonic/s-left-2.png';
  this.sonic_img_left[2].src = 'img/sonic/s-left-3.png';
  // Images jump left
  this.sonic_img_jright = [new Image(),new Image(),new Image(),new Image(),new Image()];
  this.sonic_img_jright[0].src = 'img/sonic/s-jright-1.png';
  this.sonic_img_jright[1].src = 'img/sonic/s-jright-2.png';
  this.sonic_img_jright[2].src = 'img/sonic/s-jright-3.png';
  this.sonic_img_jright[3].src = 'img/sonic/s-jright-4.png';
  // Images jump left
  this.sonic_img_jleft = [new Image(),new Image(),new Image(),new Image(),new Image()];
  this.sonic_img_jleft[0].src = 'img/sonic/s-jleft-1.png';
  this.sonic_img_jleft[1].src = 'img/sonic/s-jleft-2.png';
  this.sonic_img_jleft[2].src = 'img/sonic/s-jleft-3.png';
  this.sonic_img_jleft[3].src = 'img/sonic/s-jleft-4.png';
  // Images hurted
  this.sonic_img_hurt = [new Image(),new Image(),new Image()];
  this.sonic_img_hurt[0].src = 'img/sonic/s-hurt-1.png';
  this.sonic_img_hurt[1].src = 'img/sonic/s-hurt-2.png';
  this.sonic_img_hurt[2].src = 'img/sonic/s-hurt-3.png';
  // Sonic states
  this.sonic_state = 0;
  this.sonic_four_state = 0;
  this.sonic_three_state = 0;
  this.sonic_draw_status = 'right';
  this.sonic_direction_status = '';
  // Sonic borders
  this.left   = function() { return this.x                 };
  this.right  = function() { return (this.x + this.width)  };
  this.top    = function() { return this.y                 };
  this.bottom = function() { return this.y + this.height };
  // Gravity
  this.vx = 4;
  this.vy = 4;
  this.userPull = 0;
  // Crash with enemies
  this.crashWith = function(object) {
    if ((
      (this.bottom() > object.top())    &&
      (this.top()    < object.bottom()) &&
      (this.right()  > object.left())   &&
      (this.left()   < object.right())
  ))
    console.log("Sonic crashes with something...");
    
    return (
      (this.bottom() > object.top())    &&
      (this.top()    < object.bottom()) &&
      (this.right()  > object.left())   &&
      (this.left()   < object.right())
  )}

  setInterval(() => {
    // Sonic movements
    if (dirleft) {
      this.moveLeft();
      this.sonic_draw_status = 'left';
    };
    if (dirright) {
      this.moveRight();
      this.sonic_draw_status = 'right';
    };
    if (jump) {
      this.userPull = 50 ;
      this.sonic_draw_status = 'jump';
    }
    if (dirright && jump) {
      this.moveRight();
      this.sonic_draw_status = 'jright';
    }
    if (dirleft && jump) {
      this.moveLeft();
      this.sonic_draw_status = 'jleft';
    }
    if (this.y > floorLimit(this.x+22) - 44) {
      this.y = floorLimit(this.x+22) - 44;
    }
    this.y += (gravity - this.userPull);
    this.userPull = (0>this.userPull-23) ? 0: this.userPull - 23;
    if (this.y > floorLimit(this.x+22) - 44) {
      this.y = floorLimit(this.x+22) - 44;
    }
  },80)
}
Sonic.prototype.moveLeft = function () {
  this.x -= this.speed;
  img_pos += img_speed;
  floor.forEach((e) => {
    e[0] += img_speed;
  });
}
Sonic.prototype.moveRight = function () {
  this.x += this.speed;
  img_pos -= img_speed;
  floor.forEach((e) => {
    e[0] -= img_speed;
  });  
}
Sonic.prototype.moveDown = function () {
  this.y += this.speed;
}
Sonic.prototype.moveUp = function () {
  this.y -= 90;
}

Sonic.prototype.drawRight = function() {
  this.ctx.drawImage(this.sonic_img_right[Math.floor(this.sonic_state/1)], this.x, this.y, 44, 44);
}
Sonic.prototype.drawLeft = function() {
  this.ctx.drawImage(this.sonic_img_left[Math.floor(this.sonic_state/1)], this.x, this.y, 44, 44);
}
Sonic.prototype.drawJRight = function() {
  console.log(this.sonic_five_state)
  this.ctx.drawImage(this.sonic_img_jright[this.sonic_four_state], this.x, this.y, 44, 44);
}
Sonic.prototype.drawJLeft = function() {
  console.log(this.sonic_five_state)
  this.ctx.drawImage(this.sonic_img_jleft[this.sonic_four_state], this.x, this.y, 44, 44);
}
Sonic.prototype.drawJ = function() {
  console.log(this.sonic_five_state)
  this.ctx.drawImage(this.sonic_img_jleft[this.sonic_four_state], this.x, this.y, 44, 44);
}
Sonic.prototype.drawHurt = function() {
  // for (var i = 0; i < this.sonic_img_hurt.length; i++) {
    this.ctx.drawImage(this.sonic_img_hurt[this.sonic_three_state], this.x -= 60, this.y, 44, 44);
    // this.ctx.drawImage(this.sonic_img_hurt[i], this.x -= 1, this.y, 44, 44);
  // }
    // setTimeout(function() {
      this.sonic_draw_status = 'right';
    // }, 50);
  // for (k = 0; k < this.sonic_img_hurt.length ; k++) {
  //   this.ctx.drawImage(this.sonic_img_hurt[k], this.x -=20, this.y, 44, 44);
  // }
}

function startGame() {
  var myBoard = new Gameboard();
  myBoard.draw();
  
  // var key_state = (e.type == "keydown")?true:false;
  document.onkeydown = (e) => {
    setInterval(function() {
      myBoard.sonic.sonic_state = (myBoard.sonic.sonic_state +1)%3;
      myBoard.sonic.sonic_four_state = (myBoard.sonic.sonic_four_state +1)%4;
      myBoard.sonic.sonic_three_state = (myBoard.sonic.sonic_three_state +1)%3;
    },200);
    switch (e.keyCode) {
      case 88: // Jump
        jump = true;
        myBoard.sonic.sonic_draw_status = 'jump';
        break;
      case 37: // Move Left
        dirleft = true;
        myBoard.sonic.sonic_draw_status = 'left';
        break;
      case 39: // Move right
        dirright = true;
        myBoard.sonic.sonic_draw_status = 'right';
        break;
    }
  }

  document.onkeyup = (e) => {
    myBoard.sonic.sonic_direction_status = '';
    switch (e.keyCode) {
      case 88: // Jump attack
        jump = false;
        break;
      case 37: // Left
        dirleft = false;
        break;
      case 39: // Right
        dirright = false;
        break;

    }
  }
  myBoard.updateGameBoard();
}

window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };
};
