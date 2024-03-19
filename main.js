//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver=false // true 면 게임 끝, false 면 게임이 안끝남
let score = 0
//우주선 좌표
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

let bulletList = [] // 총알 저장 리스트
function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX + 18;
        this.y = spaceshipY
        this.alive=true // true 면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.y-=7;
    };

    this.checkHit=function(){
        // 총알.y <= 적군.y
        // 총알.x >= 적군.x , 총알.x <= 적군.x +적군의 넓이
        for(let i=0; i < enemyList.length;i++){
            if (
                this.y <= enemyList[i].y &&
                this.x >= enemyList[i].x &&
                this.x <= enemyList[i].x + 40
            ) {
                //총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
                score++;
                this.alive = false // 죽은총알
                enemyList.splice(i,1);
            }
        }
    }
}

function generateRandomVale(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList=[]
function Enemy(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y= 0
        this.x= generateRandomVale(0, canvas.width - 64)
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 2;
        //적군의 속도조절

        if(this.y >= canvas.height - 60) {
            gameOver = true;
            console.log("gameover");
        }
    };
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";
    
    enemyImage = new Image();
    enemyImage.src="images/enemy.png";
    
    gameOverImage = new Image();
    gameOverImage.src="images/gameOver.jpg";
}

//방향키 
let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true
        console.log("키다운객체에 들어간 값은?", keysDown)
    });
    document.addEventListener("keyup",function(){
        delete keysDown[event.keyCode]

        if(event.keyCode == 32){
            createBullet() // 총알 생성
        }
        console.log("버튼 클릭후",keysDown);
    });
}

function createBullet(){
    console.log("총알 생성");
    let b = new Bullet();
    b.init();
    console.log("새로운 총알 리스트". bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000);
}

// 키 업데이트 설정 속도 
function update(){
    if(39 in keysDown){
        spaceshipX += 5;
    } // right
    if(37 in keysDown){
        spaceshipX -= 5;
    } // left

    if(spaceshipX <= 0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width - 64){
        spaceshipX=canvas.width - 64;
    }
    // 우주선의 좌표값이 무한대로 업데이트가 아닌 경기장 안에서만 있게


    // 총알의 y 좌표 업데이트 함수
    for(let i=0; i<bulletList.length; i++){
        if (bulletList[i].alive) {
        bulletList[i].update();
        bulletList[i].checkHit();
    };
}
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive) {
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
        if(!gameOver) {
    update(); // 좌표 업데이트 하고
    render(); // 그려주고
    console.log("animation calls main function")
    requestAnimationFrame(main);
        }else{
            ctx.drawImage(gameOverImage,10,100,380,380);
        }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 우주선 xy 좌표
// 다시 render 그리기

//총알 만들기
//1. 스페이스바 총알 발사
//2. 총알 발사 = 총알의 y값이 -- , 총알의 x값은? 스페이스를 누른 순간의 우주선 x좌표
//3. 발사된 총알들은 총알 배열에 저장
//4. 총알들은 x,y 좌표값이 있어야 함.
//5. 총알 배열을 가지고 render 그려준다

// 적군 만들기
//1. x,y init, update
//2. 위치 랜덤
//3. 밑으로 내려온다
//4. 초마다 하나씩 생성
//5. 적군이 바닥에 닿으면 게임 오버
//6. 적군과 총알이 만나면 우주선이 사라지며 점수 획득

// 적군이 죽는다
// 총알이 적군에게 닿는다
// 총알.y <= 적군y 값보다 작아짐