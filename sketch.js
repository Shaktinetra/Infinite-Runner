var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacleImg;
var score=0;
var gameOver, restart, count;
var checkpoint, jump, die;
var backgroundImg;
var cloud, obstacle;

function preload(){
  trex_running =   loadAnimation("trex1.png", "trex2.png", "trex3.png", "trex4.png", "trex5.png", "trex6.png", "trex7.png", "trex8.png");
  trex_collided = loadAnimation("trex4.png");
  
  groundImage = loadImage("Imported piskel.gif");
  cloudImage = loadImage("clouds.png");
  obstacleImg = loadImage("obstacle1.jpeg");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("download (5).png");
  backgroundImg = loadImage("background.gif");

  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
}

function setup() {
  createCanvas(800, 300);
  
  trex = createSprite(300,280,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  
  ground = createSprite(100,280,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,190);
  restart.addImage(restartImg);
  
  restart.scale = 0.5;
  gameOver.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(trex.x, 290,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  count = 3;
}

function draw() {
  background(backgroundImg)
  textSize(20);
  stroke(0);
  textFont("Ink Free");
  text("Score: "+ score, trex.x - 300,50);
  text("Lives: " + count, trex.x - 300, 70);

  ground.depth = trex.depth + 1;
  restart.depth = ground.depth + 1;
  gameOver.depth = restart.depth + 1;

  invisibleGround.x = trex.x;
  restart.x = trex.x;
  gameOver.x = trex.x;

  if (gameState===PLAY){

    trex.velocityY = trex.velocityY + 0.8;
    trex.velocityX  = 2;
    camera.position.x = trex.x;
    ground.velocityX = -(6 + 3*score/100);
    
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space") && trex.y >= 230) {
      trex.velocityY = -15;
      jump.play();
    }

    
  console.log(trex.velocityX + "____" + trex.x);
  
    trex.collide(invisibleGround);

    if (ground.x < trex.x - 800) {
      ground.x = trex.x + 200;
     }
  
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.collide(trex)) {
      if(count > 1) {
        obstaclesGroup.destroyEach();
      }
      else {
        gameState = END;
      }
      count = count - 1;
      die.play();
    }
  }
  
  if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityYEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {

  if (trex.x % 100 === 0) {
    cloud = createSprite(trex.x + 500, Math.round(random(75, 100)),40,10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.lifetime = 300;
    cloud.velocityX = -(6 + 3*score/100);
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(trex.x % 160 === 0) {
    obstacle = createSprite(trex.x + 500,245,10,40);
    obstacle.addImage(obstacleImg);
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.velocityX = -(6 + 3*score/100);

    obstacle.depth = ground.depth - 1;
    trex.depth = obstacle.depth - 1;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();

  trex.changeAnimation("running",trex_running);

  score = 0;
  count = 3;
}