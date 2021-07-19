var PLAY = 1;
var END = 0;
var gameState = PLAY;

//use trex for making the girl
var trex, trex_running, trex_collided;

//make ground and invisibleground invisible
var ground, invisibleGround, groundImage;

//use to make birds
var cloudsGroup, cloudImage;

//make enemy
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//distance covered
var score=0;

var gameOver, restart;

var bg,bgImg;

//adding sticker
var sticker,stickerImg;

function preload(){
  trex_running =   loadAnimation("girl1.png","girl2.png","girl3.png","girl4.png","girl5.png","girl6.png","girl7.png","girl8.png",);
  trex_collided = loadAnimation("girl8.png");
  
  groundImage = loadImage("bg.jpg");
  
  cloudImage = loadAnimation("bird1.png","bird2.png","bird3.png","bird4.png","bird5.png","bird7.png","bird8.png","bird9.png","bird10.png","bird11.png","bird12.png","bird13.png","bird14.png");
  
  obstacle1 = loadAnimation("mummy1.png","mummy2.png","mummy3.png");

  obstacle2 = loadImage("rockGrass.png");


  obstacle3 = loadImage("cactus_02.png");
  obstacle4 = loadImage("shell1.png");
  obstacle5 = loadImage("shell2.png");
  obstacle6 = loadImage("rockGrass.png");
  
  gameOverImg = loadImage("gamEOver2.png");
  restartImg = loadImage("restart2.png");

  //bgImg=loadImage("desert.jpg");

  //sticker
  stickerImg=loadImage("halloween.png");
}

function setup() {
  createCanvas(1000,600);
  
  
  
  ground = createSprite(500,100,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.scale=1.8;
  ground.velocityX = -(6 + 3*score/100);

  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1
  
  gameOver = createSprite(camera.position.x+100,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x+100,350);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.5;
  restart.scale = 0.6;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(500,550,1000,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  //bg=createSprite(0,620);
 // bg.addImage(bgImg);

  //add sticker
  sticker=createSprite(250,30,20,20);
  sticker.addImage(stickerImg);
  sticker.scale=0.2
  
}

function draw() {
 
  background(0);
  drawSprites();

  textSize(30);
  fill("black");
  text("DISTANCE          COVERED : "+ score  , 60,35);

  //adding camera position
  camera.position.x=trex.x;

  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/200);
  
    if(keyDown("space") && trex.y >= 155) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

   
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(900,0,40,10);
    cloud.y = Math.round(random(50,trex.y-50));


    cloud.addAnimation("bird",cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -5;
    
     //assign lifetime to the variable
    cloud.lifetime =displayWidth;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,500,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));

    
    switch(rand) {
      case 1: obstacle.addAnimation("mummy",obstacle1);
               obstacle.scale = 0.3;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.3;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.2;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale=0.6;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale=0.6;
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.3;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
   

    obstacle.lifetime = displayWidth;

//set collider
    obstacle.setCollider("rectangle",0, 0, 100, 100);
    obstacle.debug=false;
   
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
   score = 0;
  
}