var step  = 1;
var img_pos = 0,
img_speed = 15;
var floor = [
  [-2254,559.58 ],
[-2221.33,562.71 ],
[-2111.774,562.71 ],
[-1976.55,559.58 ],
[-1928.972,562.71 ],
[-1863.864,559.58 ],
[-1840.701,562.71 ],
[-1758.69,527.652 ],
[-1714.241,527.652 ],
[-1609.693,527.652 ],
[-1585.904,531.408 ],
[-1548.342,527.652 ],
[-1513.91,531.408 ],
[-1469.461,527.652 ],
[-1421.257,539.547 ],
[-1388.077,555.824 ],
[-1351.767,560.206 ],
[-1319.213,551.442 ],
[-1298.554,527.652 ],
[-1167.086,527.652 ],
[-1167.086,510.749 ],
[-1133.906,510.749 ],
[-1133.906,494.472 ],
[-1071.303,497.603 ],
[-1071.303,466.927 ],
[-946.096,466.927 ],
[-720.097,466.927 ],
[-720.097,426.861 ],
[-581.117,426.861 ],
[-560.458,435.625 ],
[-480.951,396 ]
]
floor = floor.map((e)=>{
  return [2*(e[0]+2254),1.8*e[1]-530]
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
  // this.draw();
  // this.sonic.drawRight();
  // this.updateGameBoard();
}

Gameboard.prototype.updateGameBoard =  function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.draw();
  this.drawFloor();
  // console.log(this.sonic.userPull)


  // this.sonic.y += this.sonic.vy;
  switch (this.sonic.sonic_status) {
    case 'left':
      this.sonic.drawLeft();
      break;
    case 'right':
      this.sonic.drawRight();
      break;
    case 'jright':
      this.sonic.drawJRight();
      break;
    // case 'jleft:
    //   myBoard.sonic.moveRight();
    //   break;    
  }
  // console.log(this.sonic.x, floorLimit(this.sonic.x))
  // this.ctx.fillRect(this.sonic.x, floorLimit(this.sonic.x), 10, 10);
  requestAnimationFrame(this.updateGameBoard.bind(this));
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
  this.ctx.drawImage(this.img, img_pos, -485, this.width*2, this.height*2);
}

var gravity = 3;
function Sonic(ctx) {
  this.x = 520;
  this.y = 430;
  this.ctx = ctx;
  this.speed = 1;
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
  this.sonic_state = 0;
  this.sonic_status = 'right';
  // Gravity
  this.vx = 4;
  this.vy = 4;
  this.userPull = 0;

  setInterval(()=>{
    this.y += (gravity - this.userPull);
    this.userPull = (0>this.userPull-23) ? 0: this.userPull - 23;
    if (this.y > floorLimit(this.x+22) - 44) {
      this.y = floorLimit(this.x+22) - 44;
    }    
  
  },100)
}
Sonic.prototype.moveLeft = function () {
  this.x -= this.speed;
  this.y += 20;
  img_pos += img_speed;
  floor.forEach((e) => {
    e[0] += img_speed;
  });
}
Sonic.prototype.moveRight = function () {
  this.x += this.speed;
  this.y += 10;  
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
  // setTimeout(function() {
  //   this.y += 30;
  // }, 200);
}

Sonic.prototype.drawRight = function() {
  this.ctx.drawImage(this.sonic_img_right[Math.floor(this.sonic_state/1)], this.x, this.y, 44, 44);
  // this.sonic_state = (this.sonic_state +1)%30;
}
Sonic.prototype.drawLeft = function() {
  this.ctx.drawImage(this.sonic_img_left[Math.floor(this.sonic_state/1)], this.x, this.y, 44, 44);
  // this.sonic_state = (this.sonic_state +1)%30;
}
Sonic.prototype.drawJRight = function() {
  this.ctx.drawImage(this.sonic_img_right[Math.floor(this.sonic_state/1)], this.x, this.y, 44, 44);
  // this.sonic_state = (this.sonic_state +1)%30;
}

function startGame() {
  var myBoard = new Gameboard();
  myBoard.draw();
  document.onkeydown = (e) => {
  myBoard.sonic.sonic_state = (myBoard.sonic.sonic_state +1)%3;
    switch (e.keyCode) {
      case 32:
        myBoard.sonic.userPull = 30 ;
        // myBoard.sonic.moveUp();
        myBoard.sonic.sonic_status = "jright";
        break;
      case 38:
        myBoard.sonic.moveUp();
        myBoard.sonic.sonic_status = "jright";
        break;
      case 40:
        myBoard.sonic.moveDown();
        break;
      case 37:
        myBoard.sonic.moveLeft();
        myBoard.sonic.sonic_status = 'left';
        break;
      case 39:
        myBoard.sonic.moveRight();
        myBoard.sonic.sonic_status = 'right';
        break;
    }
    if (myBoard.sonic.y > floorLimit(myBoard.sonic.x+22) - 44) {
      myBoard.sonic.y = floorLimit(myBoard.sonic.x+22) - 44;
    }    
      // myBoard.updateGameBoard();
  }
  // document.onkeyup = function(e) {
  //   if (e.keyCode == 32) {
  //     myBoard.userPull = 0;
  //     //myBoard.sonic.y = floorLimit(myBoard.sonic.x+22) - 44;
  //   }
  // }
  myBoard.updateGameBoard();
}

window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };
};