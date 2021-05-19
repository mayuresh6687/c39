var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trexImg, trexImg;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
var bird, birdImg, birdsGroup;

var highScore;

var temp = 1;
var temp2 = 1;

var trexImg, backgroundImg, cactus;

function preload(){
  // trexImg = loadAnimation("trex1.png","trex3.png","trex4.png");
  // trexImg = loadAnimation("trexImg.png");
  
  // groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  // obstacle1 = loadImage("obstacle1.png");
  // obstacle2 = loadImage("obstacle2.png");
  // obstacle3 = loadImage("obstacle3.png");
  // obstacle4 = loadImage("obstacle4.png");
  // obstacle5 = loadImage("obstacle5.png");
  // obstacle6 = loadImage("obstacle6.png");
  
  birdImg = loadImage("updatedImages/cactus.png");
  trexImg = loadImage("updatedImages/dino.png");
  backgroundImg = loadImage("updatedImages/background.png");
  cactus = loadImage("updatedImages/cactus.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  // birdImg = loadImage("bird.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width/2,height - 35,width + 50,30);
  ground.x = ground.width /2;

  trex = createSprite(50,height - 50,20,50);
  trex.addAnimation("running", trexImg);
  trex.addAnimation("collided" ,trexImg);
  trex.scale = 0.3;
  trex.velocityX = 5;

  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 25);
  restart.addImage(restartImg);
  
  invisibleGround = createSprite(width/2,height - 25,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",2,1,trex.width,trex.height);
  trex.debug = true;
  
  score = 0;
  highScore = 0;
}

function draw() {
  background(backgroundImg);
  //displaying score
  textSize(40);
  text("Score: "+ score, trex.x + 50,50);
  text("High Score: "+ highScore, trex.x - 300,50);
  
  ground.x = trex.x;

  if(gameState === PLAY){
    if(score % 150 === 0 && score !== 0){
      checkPointSound.play();
    }
    
    gameOver.visible = false
    restart.visible = false
    //move the ground
    
    //Alternate method to increase the score
    // if(frameCount % 5 === 0){
    //   score++;
    // }
    
    //Frame Rate is the number of times the draw function is run in one second.
    score = score + Math.round(getFrameRate()/50);
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space")&& trex.y >= height - 125) {
      trex.velocityY = -25;
      jumpSound.play();
      
      touches = [];
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    spawnBirds();
    
    if(obstaclesGroup.isTouching(trex) || birdsGroup.isTouching(trex)){
      //These two line are to add AI to the trex.
      //when the trex touches any of the cactus, the trex jumps. The collider has been adjusted.
      // trex.velocityY = -12;
      // jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.x = trex.x;
      restart.x = trex.x;
    
      gameOver.visible = true;
      restart.visible = true;
      
      trex.velocityY = 0;
      trex.velocityX = 0;
     
      //change the trex animation
      trex.changeAnimation("collided", trexImg);
     
     //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     birdsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     birdsGroup.setVelocityXEach(0);
     
     //This is to reset the game when we die.
     //it is written in the end state, because we are still able to reset the game while playing.
     if(mousePressedOver(restart)){
       reset();
     }
   }
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  invisibleGround.x = trex.x;

  camera.position.x = trex.x;
  camera.position.y = height/2
  
  drawSprites();
}

function spawnBirds(){
  if(score > 300 && score % 250 === 0){
    bird = createSprite(trex.x + 600,Math.round(random(height - 100,height - 50)),20,20);
    bird.addImage("bird",birdImg);
    bird.scale = 0.05;
    bird.lifetime = 350;
    
    bird.depth = restart.depth;
    restart.depth++;
    
    birdsGroup.add(bird);
  }
}

function spawnObstacles(){
 if (frameCount % 150 === 0){
   var obstacle = createSprite(trex.x + 600,height - 80,10,40);
   obstacle.addImage(cactus);
   obstacle.scale = 0.05;
   obstacle.setCollider("rectangle",0,0,1200,150);
   obstacle.debug = true;

    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 400;
   
   obstacle.depth = restart.depth;
   restart.depth++;
   
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

    temp++;
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
     cloud = createSprite(trex.x + 600,Math.round(random(100,150)),40,10);
    cloud.addImage(cloudImage);
    
     //assign lifetime to the variable
    cloud.lifetime = 350;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  
  if(score > highScore){
    highScore = score;
  }
  
  score = 0;
  
  trex.velocityX = 5;
}