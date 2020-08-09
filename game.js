var gameState = function(game){

};

gameState.prototype = {

  init:function()
  {
    gameState.obj = this;
    this.centerX = this.world.centerX;
    this.centerY = this.world.centerY;

    this.mouseX = this.centerX;
    this.mouseY = this.centerY;

    this.angle = 0;
    this.score = 0;
    this.walkFlag = false;
    this.playerSpeed = 300;
    this.enemySpeed = 150;

    this.playerLife = 3;
    this.gameOverFlag = false;
    this.stop = 1;

    this.foodCount = 0;
    this.powerupCount = 0;
    this.powerupMode = false;
    this.powerUpSpeed = 800;

    this.scoreCount = 0;

    this.foodRandom = [1,2,3,4,5,6,7,8,9];

    this.LEFT = false;
    this.RIGHT = false;
    this.TOP = false;
    this.DOWN = false;

  },
  create:function()
  {
    Global.gameBGM = this.add.sound("BGM_Game");
    Global.gameOverBGM = this.add.sound("BGM_gameover");
    Global.powerupBGM = this.add.sound("BGM_powerup");

    this.SFX_enemy_death = this.add.sound("SFX_enemy_death");
    this.SFX_enemy_spawn = this.add.sound("SFX_enemy_spawn");
    this.SFX_food_spawn = this.add.sound("SFX_food_spawn");
    this.SFX_player_death = this.add.sound("SFX_player_death");
    this.SFX_player_eat = this.add.sound("SFX_player_eat");
    this.SFX_vortex = this.add.sound("vortex");

    var soundArray = [Global.gameBGM, Global.gameOverBGM, Global.powerupBGM,this.SFX_vortex,
                      this.SFX_enemy_death,this.SFX_enemy_spawn,this.SFX_food_spawn,
                      this.SFX_player_death,this.SFX_player_eat];

    this.game.sound.setDecodedCallback(soundArray, this.start, this);

  },
  start:function()
  {
    Global.gameBGM.loopFull();
    Global.gameBGM.play();

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.setBounds(0, 0, 1920, 1080);

    this.setScreen();
    this.addHud();

    this.setEnemySpeed();
  },
  addHud:function()
  {
    this.scoreLabel = this.game.add.bitmapText(20, 10, 'pusab_8bit', "SCORE :", 40);
    this.scoreField = this.game.add.bitmapText(this.scoreLabel.x+200, 10, 'pusab_8bit', this.score.toString(), 40);

    this.playerLifeGroup = this.add.group();

    for(var i = 0; i < this.playerLife; i++)
    {
      var xpos = this.world.width - 30 - i*50;
      var ypos = 40;
      var plife = this.playerLifeGroup.create(xpos,ypos,"character");
      plife.anchor.set(0.5);
      plife.scale.set(0.5);
    }
  },
  setScreen:function()
  {
    var bg = this.game.add.image(0,0,'gamebg');

    this.powerup = this.add.sprite(-300,0,"powerup",0);
    this.powerup.anchor.set(0,1);

    this.player = this.add.sprite(this.centerX,this.centerY,"character");
    this.player.anchor.set(0.5);
    this.player.ix = this.player.x;
    this.player.iy = this.player.y;

    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    var walkAnim = this.player.animations.add("walk",[0,1]);

    this.enemyGroup = this.add.physicsGroup();
    this.obstacleGroup = this.add.physicsGroup();
    this.foodGroup = this.add.physicsGroup();

    this.addEvents();

    this.addEnemy();

    this.addObstacles();
  },

  onTimer:function()
  {
    var self = gameState.obj;

    if(gameState.obj.gameOverFlag === true){return;}

    self.onEnemyTimer();
    self.onFoodTimer();
    self.onObsTimer();
  },
  onFoodTimer:function()
  {
    var self = gameState.obj;
    var len = self.foodGroup.children.length;

   if(len >= 4 && self.score < 5000) { return;  }
   else if(len >= 3 && self.score >= 5000 && self.score < 10000)  { return;  }
   else if(len >= 2 && self.score >= 10000 && self.score < 15000)  { return;  }
   else if(len >= 2 && self.score >= 15000 && self.score < 30000)  { return;  }
   else if(len >= 2 && self.score >= 30000 && self.score < 40000)  { return;  }
   else if(len >= 1 && self.score >= 40000)  { return;  }

    self.addFood();

  },
  onEnemyTimer:function()
  {
    var self = gameState.obj;
    var len = self.enemyGroup.children.length;

   if(len >= 1 && self.score < 5000) { return;  }
   else if(len >= 2 && self.score >= 5000 && self.score < 10000)  { return; }
   else if(len >= 2 && self.score >= 10000 && self.score < 15000)  { return; }
   else if(len >= 3 && self.score >= 15000 && self.score < 30000)  { return; }
   else if(len >= 3 && self.score >= 30000 && self.score < 40000)  { return; }
   else if(len >= 4 && self.score >= 40000)  { return; }

   if(len >= 4)  { return; }

   self.addEnemy();

  },
  onObsTimer:function()
  {
    var self = gameState.obj;
    var len = self.obstacleGroup.children.length;

    if(len >= 1 && self.score < 5000) { return;  }
    else if(len >= 2 && self.score >= 5000 && self.score < 10000)  { return; }
    else if(len >= 2 && self.score >= 10000 && self.score < 15000)  { return; }
    else if(len >= 3 && self.score >= 15000 && self.score < 30000)  { return; }
    else if(len >= 4 && self.score >= 30000 && self.score < 40000)  { return; }
    else if(len >= 4 && self.score >= 40000)  { return; }

    this.addObstacles();

  },
  addFood:function()
  {
    var xpos;
    var ypos;
    var rx;
    var ry;

    var fno = Utils.random(0,5);
    if(fno === 5){ fno = 4;}
    var frame = Global.foodFrames[fno];

    if(this.powerupMode == false)
    {
     this.foodCount++;

     if(this.foodCount === 5)
     {
      frame = "powerup";
      this.foodCount = 0;
     }
    }

    if(this.foodRandom.length === 0){
        this.foodRandom = [1,2,3,4,5,6,7,8,9];
    }

    var rn = Utils.random(0,this.foodRandom.length-1);
    var place = this.foodRandom[rn];
    this.foodRandom.splice(rn,1);

    if(place === 1){ rx = 1; ry = 1; }
    else if(place === 2){ rx = 1; ry = 2; }
    else if(place === 3){ rx = 1; ry = 3; }

    else if(place === 4){ rx = 2; ry = 1; }
    else if(place === 5){ rx = 2; ry = 2; }
    else if(place === 6){ rx = 2; ry = 3; }

    else if(place === 7){ rx = 3; ry = 1; }
    else if(place === 8){ rx = 3; ry = 2; }
    else if(place === 9){ rx = 3; ry = 3; }


    if(rx === 1){ xpos = Utils.random(50,504); }
    else if(rx === 2){ xpos = Utils.random(680,1240); }
    else if(rx === 3){ xpos = Utils.random(1400,1881); }

    if(ry === 1){ ypos = Utils.random(200,213); }
    else if(ry === 2){ ypos = Utils.random(358,713); }
    else if(ry === 3){ ypos = Utils.random(863,1040); }

    var food = this.foodGroup.create(xpos,ypos,frame,0);
    food.type = frame;
    food.life = 350;
    food.ix = food.x;
    food.iy = food.y;
    food.anchor.set(0.5);

    this.playSoundFX("food_spawn");

  },
  addEnemy:function(type="")
  {
    var fno = Utils.random(0,6);
    if(fno == 6){fno === 5;}
    var frame = Global.enemyFrames[fno];

    var xpos = Utils.random(0,2) * this.world.width;
    var ypos = Utils.random(150,this.world.height-50);

    if(xpos <= 0) { xpos = 40; }
    else if(xpos > 1820) { xpos = 1820; }

    if(type != ""){ frame = type;}

    var enemy = this.enemyGroup.create(xpos,ypos,"enemy",frame);
    enemy.anchor.set(0.5);
    enemy.type = frame;
    enemy.life = Utils.random(90,150)*10;
    enemy.ix = enemy.x;
    enemy.iy = enemy.y;
    enemy.dx = 1;
    enemy.dy = 1;
    enemy.ang = 20;

    if(xpos >= 1820) { enemy.scale.x = -1; }
    var arr = [0,1];

    if(frame === "animal"){ arr = [0,1];}
    else if(frame === "bat"){ arr = [2,3];}
    else if(frame === "bird"){ arr = [4,5];}
    else if(frame === "cat"){ arr = [6,7];}
    else if(frame === "deer"){ arr = [8,9];}
    else if(frame === "tank"){ arr = [10,11];}

    enemy.animations.add(frame,arr);
    enemy.animations.play(frame,4,true);

    this.playSoundFX("enemy_spawn");

  },
  addObstacles:function()
  {
    var fno = Utils.random(0,4);
    if(fno == 4){fno === 3;}
    var obj = Global.obsPos[fno];

    var xpos = obj.x;
    var ypos = obj.y;

    var obs = this.obstacleGroup.create(xpos,ypos,obj.type);
    obs.body.immovable = true;
    obs.life = Utils.random(30,90)*10;

  },
  onTap:function(e)
  {
    if(this.gameOverFlag === true){ return; }

    if(e.y <= 60) { return; }
    if(this.LEFT === true || this.RIGHT === true || this.DOWN === true || this.TOP === true){ return; }

    this.mouseX = e.x;
    this.mouseY = e.y;

    var speed = this.playerSpeed;
    if(this.powerupMode === true) { speed = this.powerUpSpeed; }

    this.physics.arcade.moveToPointer(this.player, speed);
    this.player.animations.play("walk",5,true);

  },
  update:function()
  {
    if(this.gameOverFlag === true){ return; }

     this.keyBoardUpdate();

     if(this.LEFT === false && this.RIGHT === false && this.DOWN === false && this.TOP === false)
     {
      this.movePlayer();
     }

     this.moveEnemy();

     this.Collisions();

     this.physics.arcade.collide(this.player, this.obstacleGroup,this.playerObstacleCollision,null,this);
     this.physics.arcade.overlap(this.enemyGroup, this.foodGroup,this.enemyFoodCollison,null,this);

     this.attachPowerUp();
  },
  onKeyBoardEvents:function()
  {
    var speed = this.enemySpeed+100;

    if(this.powerupMode === true){
      speed = this.powerUpSpeed;
    }

    var key1 = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(addPhaserDude, this);

    var key2 = this.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key2.onDown.add(addPhaserLogo, this);

    var key3 = this.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key3.onDown.add(addPineapple, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);

    if(this.cursor.left.isDown ) { this.player.body.velocity.x = -speed; }
    else if( this.cursor.right.isDown ) { this.player.body.velocity.x = speed; }

    else if( this.cursor.up.isDown ) { this.player.body.velocity.y = -speed; }
    else if( this.cursor.down.isDown ) { this.player.body.velocity.y = speed; }

    else { this.player.body.velocity.x = 0; this.player.body.velocity.y = 0; }
  },
  attachPowerUp:function()
  {
    if(this.powerupMode === true){

     this.powerup.x = this.player.x+6;
     this.powerup.y = this.player.y-this.player.height*0.5+8;

     this.powerupCount++;

     if(this.powerupCount >= 810) { this.powerup.frame = 1;}

     if(this.powerupCount === 1000){

       this.player.body.velocity.x = this.player.body.velocity.x/2;
       this.player.body.velocity.y = this.player.body.velocity.y/2;

       this.onPowerUpEnd();
     }

    }
  },
  Collisions:function()
  {
    if(this.foodGroup.children.length > 0)
    {
     for(var i = 0; i < this.foodGroup.children.length; i++)
     {
       var food = this.foodGroup.children[i];

       if(food.life > 0)
       {
         food.life -= 1;

         if(food.life === 0){
           this.showTwinkleAnimation(food.x,food.y,"twinkle");
           food.destroy();

           break;

          }
       }

       this.physics.arcade.overlap(this.player,food,this.playerFoodCollision,null,this);
     }

    }

    if(this.obstacleGroup.children.length > 0)
    {
      for(var j = 0; j < this.obstacleGroup.children.length; j++)
      {
        var obj  = this.obstacleGroup.children[j];

        if(obj.life > 0)
        {
          obj.life--;
          if(obj.life <= 0){ obj.destroy(); }
        }
      }
    }

  },
  movePlayer:function()
  {
     if(Utils.getDistance(this.mouseX,this.mouseY,this.player.x,this.player.y) <= 5)
     {
       this.player.body.velocity.x = 0;
       this.player.body.velocity.y = 0;
       this.walkFlag = false;
       this.player.animations.stop();
     }
  },
  moveEnemy:function()
  {
    if(this.enemyGroup.children.length > 0)
    {
      for(var i = 0; i < this.enemyGroup.children.length; i++)
      {
        var enemy = this.enemyGroup.children[i];
        var type = enemy.type;
        if(enemy.body.velocity.x < 0){ enemy.scale.x = -1; }
        else if(enemy.body.velocity.x > 0){ enemy.scale.x = 1; }

        if(enemy.life > 0)
        {
          enemy.life--;
          if(enemy.life === 0) {
            this.showVortexAnimation(enemy.x,enemy.y,"vortex");
            enemy.destroy();
            break;
          }
        }

        if(type === "tank"  || type === "bird" || type === "cat")
        {

         if(this.powerupMode === true)  {
           this.unFollowPlayer(enemy,type);
         }
         else {
           this.followPlayer(enemy,type);
         }


        }
        else if(type === "deer" || type === "animal")
        {
          this.moveEnemyStraight(enemy,type);
        }
        else if(type === "bat")
        {
          this.moveEnemyRandom(enemy,type);
        }

        this.physics.arcade.overlap(this.player, enemy,this.enemyPlayerCollision,null,this);

      }

    }

  },
  unFollowPlayer:function(enemy,type)
  {
    var hW = Math.abs(enemy.width*0.5);
    var hH = Math.abs(enemy.height*0.5);

    if(enemy.x < hW)
    {
      enemy.ang = 0 + Utils.random(-9,9)*5;
    }
    else if(enemy.x > this.world.width-hW)
    {
      enemy.ang = 180 + Utils.random(-9,9)*5;
    }
    if(enemy.y < 100 + hW)
    {
      enemy.ang = 90 + Utils.random(-15,15)*3;
    }
    else if(enemy.y > this.world.height-hH)
    {
      enemy.ang = 270 + Utils.random(-15,15)*3;
    }
    if(type === "tank")
    {
      this.physics.arcade.collide(enemy, this.obstacleGroup,this.enemyObstacleCollision,null,this);
    }

    var rad = Utils.degToRad(enemy.ang);
    var vx = Math.cos(rad)*this.enemySpeed;
    var vy = Math.sin(rad)*this.enemySpeed;

    if(type === "cat" && this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0)
    {
       vx = 0; vy = 0;
    }

    enemy.body.velocity.x = vx;
    enemy.body.velocity.y = vy;
    if(enemy.type === "tank") { this.physics.arcade.collide(enemy, this.obstacleGroup); }
  },
  followPlayer:function(enemy,type)
  {
    var rad = Math.atan2(this.player.y-enemy.y,this.player.x-enemy.x);

    var vx = Math.cos(rad)*this.enemySpeed;
    var vy =  Math.sin(rad)*this.enemySpeed;

    if(type === "cat" && this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0)
    {
       vx = 0; vy = 0;
    }

    enemy.body.velocity.x = vx;
    enemy.body.velocity.y = vy;
    if(enemy.type === "tank") { this.physics.arcade.collide(enemy, this.obstacleGroup); }
  },
  moveEnemyStraight:function(enemy,type)
  {
    var hw = Math.abs(enemy.width*0.5);

    if(enemy.x >= this.world.width-hw)
    {
      enemy.dx = -1;
      enemy.x = this.world.width-hw-1;
    }
    if(enemy.x <= hw)
    {
      enemy.dx = 1;
      enemy.x = hw+1;
    }

    enemy.body.velocity.x = this.enemySpeed*enemy.dx;

    if(type === "deer")
    {
      this.physics.arcade.collide(enemy, this.obstacleGroup,this.enemyObstacleCollision,null,this);
    }

  },
  moveEnemyRandom:function(enemy,type)
  {
    var hW = Math.abs(enemy.width*0.5);
    var hH = Math.abs(enemy.height*0.5);

    if(enemy.x < hW)
    {
      enemy.ang = 0 + Utils.random(-9,9)*5;
    }
    else if(enemy.x > this.world.width-hW)
    {
      enemy.ang = 180 + Utils.random(-9,9)*5;
    }
    if(enemy.y < 100 + hW)
    {
      enemy.ang = 90 + Utils.random(-15,15)*3;
    }
    else if(enemy.y > this.world.height-hH)
    {
      enemy.ang = 270 + Utils.random(-15,15)*3;
    }

    var rad = Utils.degToRad(enemy.ang);
    enemy.body.velocity.x = Math.cos(rad)*this.enemySpeed;
    enemy.body.velocity.y = Math.sin(rad)*this.enemySpeed;
    this.physics.arcade.collide(enemy, this.obstacleGroup,this.enemyObstacleCollision,null,this);
  },
  playerFoodCollision:function(player,food)
  {
    if(food.type === "food_10") { this.setScore(10); this.showScoreUp(food.x,food.y,"10");}
    else if(food.type === "food_20") { this.setScore(20); this.showScoreUp(food.x,food.y,"20");}
    else if(food.type === "food_50") { this.setScore(50); this.showScoreUp(food.x,food.y,"50");}
    else if(food.type === "food_100") { this.setScore(100); this.showScoreUp(food.x,food.y,"100");}
    else if(food.type === "food_200") { this.setScore(200); this.showScoreUp(food.x,food.y,"200");}
    else if(food.type === "powerup") { this.onPowerUpStart(); }

    this.playSoundFX("player_eat");
    food.destroy();
  },

  onPowerUpStart:function()
  {
    Global.gameBGM.pause();
    Global.powerupBGM.loopFull();
    Global.powerupBGM.play();
    this.powerupMode = true;
  },
  onPowerUpEnd:function()
  {
    Global.powerupBGM.stop();
    if(this.gameOverFlag === false){ Global.gameBGM.resume(); }

    this.powerup.frame = 0;
    this.powerupMode = false;
    this.powerupCount = 0;
    this.powerup.x = -300;
  },
  playerObstacleCollision:function(player,obs)
  {
    if(this.powerupMode === true)
    {
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
      this.resetGameObjects();
	  this.onPowerUpEnd();

    }
  },
  enemyObstacleCollision:function(enemy,obs)
  {
     var type = enemy.type;
     var vx;
     var vy;

     if(type === "deer")
     {
       if(enemy.dx === 1)
       {
         enemy.body.velocity.x = -20;
         enemy.dx = -1;
       }
       else {
         enemy.body.velocity.x = 20;
         enemy.dx = 1;
       }
     }
     else if(type === "bat"){

      vx = enemy.body.velocity.x;
      vy = enemy.body.velocity.y;

      if(vx < 0 && vy > 0) { enemy.ang = 270 + Utils.random(1,9)*5;  }
      else if(vx < 0 && vy < 0) {enemy.ang = 0 + Utils.random(1,9)*5; }
      if(vx > 0 && vy > 0)  { enemy.ang = 180 + Utils.random(1,15)*3; }
      else if(vx > 0 && vy < 0) { enemy.ang = 90 + Utils.random(1,15)*3; }
    }
    else if(type === "tank")
    {
      vx = enemy.body.velocity.x;
      vy = enemy.body.velocity.y;

      if(vx < 0 && vy > 0) { enemy.ang = 270 + Utils.random(1,9)*5;  }
      else if(vx < 0 && vy < 0) {enemy.ang = 0 + Utils.random(1,9)*5; }
      if(vx > 0 && vy > 0)  { enemy.ang = 180 + Utils.random(1,15)*3; }
      else if(vx > 0 && vy < 0) { enemy.ang = 90 + Utils.random(1,15)*3; }
    }
  },
  enemyFoodCollison:function(enemy,food)
  {
    if(enemy.type === "deer" || enemy.type === "animal" || enemy.type === "bat")
    {
      if(food.type != "powerup")
      {
       food.destroy();
      }
    }
  },

  enemyPlayerCollision:function(player,enemy)
  {
    if(this.powerupMode === true)
    {
      this.addExplosions(enemy.x,enemy.y);
      enemy.destroy();

      this.playSoundFX("enemy");
      this.setScore(500);
      this.showScoreUp(enemy.x,enemy.y,"500");
    }
    else
    {
      this.playSoundFX("player_death");
      this.resetGameObjects();
      return;
    }
  },
  addExplosions:function(x,y)
  {
     var explosion = this.add.sprite(x,y,"explosion");
     explosion.anchor.set(0.5);

     var anim = explosion.animations.add("explosion_Anim");
     anim.onComplete.add(function(){
       explosion.destroy();
     }, this);

     anim.play(5,false);

  },
  resetGameObjects:function()
  {
    var self = gameState.obj;

    if(this.playerLife > 0)
    {
      this.playerLife--;
      var last = this.playerLifeGroup.children.length-1;
      this.playerLifeGroup.children[last].destroy();

      if(this.playerLife === 0) {
        this.gameOver();
       }
    }

    this.player.animations.stop();
    this.player.frame = 2;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    var tween = this.add.tween(this.player).to({alpha: 0}, 500, Phaser.Easing.Linear.In, true);

    tween.onComplete.add(function(){
      self.player.frame = 0;
      self.player.alpha = 1;
      self.player.x = self.player.ix;
      self.player.y = self.player.iy;
    },this);

   this.reSpawnEnemy();

  },
  reSpawnEnemy:function()
  {
    if(this.enemyGroup.children.length > 0)
    {
      for(var i = 0; i < this.enemyGroup.children.length; i++)
      {
        var enemy = this.enemyGroup.children[i];
        var n = Utils.random(-1,1);
        enemy.x = enemy.ix
        enemy.y = enemy.iy
      }
    }
  },
  setScore:function(n=100)
  {
    this.score += n;
    this.scoreField.text = this.score.toString();
    this.scoreCount += n;

    if(this.scoreCount >= 5000)
    {
      this.scoreCount = this.scoreCount - 5000;
      this.addLife();
    }

    this.setEnemySpeed();
  },
  addLife:function()
  {
    if(this.playerLife < 5)
    {
      var xpos = this.game.width - 30 - 50 * this.playerLife;
      var pl = this.playerLifeGroup.create(xpos,40,"character");
      pl.anchor.set(0.5);
      pl.scale.setTo(0.5);

      this.playerLife++;
    }

  },
  gameOver:function()
  {
    let _self = this;
    gameState.obj.gameOverFlag = true;

    _self.onPowerUpEnd();

    Global.gameBGM.stop();
    Global.powerupBGM.stop();
    Global.gameOverBGM.play();

    if(this.enemyGroup.children.length > 0)
    {
       for(var i=0; i < this.enemyGroup.children.length; i++)
       {
        var enemy = this.enemyGroup.children[i];
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
       }
    }

     setTimeout(function(){
       _self.showGameOver();
     },1000);
  },
  showGameOver:function()
  {
    var gameoverImage = this.add.sprite(this.centerX,this.centerY,"gameover_image");
    gameoverImage.anchor.set(0.5);

    var scoreText = this.game.add.bitmapText(0, -250, 'pusab_8bit', "SCORE : " + this.score, 100);
    scoreText.anchor.set(0.5);
    gameoverImage.addChild(scoreText);

    var restartButton = this.add.button(0,150,"return_button",this.onRestartButton,this);
    restartButton.anchor.set(0.5);
    gameoverImage.addChild(restartButton);

    var key_R = this.input.keyboard.addKey(Phaser.Keyboard.R);
    key_R.onDown.add(this.onRestartButton, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);
  },
  onRestartButton:function()
  {
    Global.gameOverBGM.stop();
    Global.gameBGM.stop();
    Global.powerupBGM.stop();

    this.state.start("title");
  },
  setEnemySpeed:function()
  {
    if(this.score <= 15000) { this.enemySpeed = this.playerSpeed * 50/100; }
    else if(this.score > 15000 && this.score <= 30000) { this.enemySpeed = this.playerSpeed * 60/100; }
    else if(this.score > 30000 && this.score <= 40000) { this.enemySpeed = this.playerSpeed * 70/100; }
    else if(this.score > 40000) { this.enemySpeed = this.playerSpeed * 70/100; }

  },
  playSoundFX:function(type)
  {
    if(this.gameOverFlag === true){return;}

    if(type === "enemy") { this.SFX_enemy_death.play(); }
    else if(type === "enemy_spawn") { this.SFX_enemy_spawn.play(); }
    else if(type === "food_spawn") { this.SFX_food_spawn.play(); }
    else if(type === "player_death") { this.SFX_player_death.play(); }
    else if(type === "player_eat") { this.SFX_player_eat.play(); }
    else if(type === "vortex") { this.SFX_vortex.play(); }

  },
  addEvents:function()
  {
    this.game.input.onDown.add(this.onTap,this);

    this.timer = this.time.create(false);
    this.timer.repeat(500,100000000,this.onTimer);
    this.timer.start();

    var key_A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    var key_W = this.input.keyboard.addKey(Phaser.Keyboard.W);
    var key_S = this.input.keyboard.addKey(Phaser.Keyboard.S);
    var key_D = this.input.keyboard.addKey(Phaser.Keyboard.D);

    key_A.onDown.add(this.onKeyDown, this);
    key_W.onDown.add(this.onKeyDown, this);
    key_S.onDown.add(this.onKeyDown, this);
    key_D.onDown.add(this.onKeyDown, this);

    key_A.onUp.add(this.onKeyUp, this);
    key_W.onUp.add(this.onKeyUp, this);
    key_S.onUp.add(this.onKeyUp, this);
    key_D.onUp.add(this.onKeyUp, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.A);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.W);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.S);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);
  },
  onKeyDown:function(obj)
  {
    if(this.gameOverFlag === true){return;}

    var key = obj.event.key.toUpperCase();

    if(key === "A") { this.LEFT = true;  }
    else if(key === "D") { this.RIGHT = true; }
    else if(key === "W") { this.TOP = true; }
    else if(key === "S") { this.DOWN = true; }

  },
  onKeyUp:function(obj)
  {
    var key = obj.event.key.toUpperCase();

    if(key === "A") { this.LEFT = false;  }
    else if(key === "D") { this.RIGHT = false; }
    else if(key === "W") { this.TOP = false; }
    else if(key === "S") { this.DOWN = false; }

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

  },
  keyBoardUpdate:function()
  {
    var speed = this.playerSpeed;

    if(this.powerupMode === true){
     speed = this.powerUpSpeed;
    }

    if(this.LEFT === true){  this.player.body.velocity.x = -speed; }
    if(this.RIGHT === true){  this.player.body.velocity.x = speed; }
    if(this.TOP === true){  this.player.body.velocity.y = -speed; }
    if(this.DOWN === true){  this.player.body.velocity.y = speed; }

  },
  showTwinkleAnimation:function(_x,_y,_type)
  {
    var twinkle = this.add.sprite(_x,_y,'twinkle',0);
    twinkle.anchor.set(0.5);

    var anim = twinkle.animations.add("twinkle",[0,1,0,1,0,1,0,1,0,1]);
    anim.play("twinkle",5,false);
    anim.onComplete.add(function(){ twinkle.destroy()},this);
  },
  showVortexAnimation:function(_x,_y,_type)
  {
    var vortex = this.add.sprite(_x,_y,'vortex',0);
    vortex.anchor.set(0.5);

    var anim = vortex.animations.add("vortex",[0,1,2,0,1,2,0,1,2]);
    anim.play("vortex",5,false);
    anim.onComplete.add(function(){ vortex.destroy()},this);

    this.playSoundFX("vortex");
  },
  showScoreUp:function(_x,_y,type)
  {
    var sp = this.add.sprite(_x,_y-50,'digits',type);
    sp.anchor.set(0.5);

    var tween = this.add.tween(sp).to({y:sp.y-300, alpha: 0},1500,Phaser.Easing.Linear.In, true);
    tween.onComplete.add(function(){
      sp.destroy();
    });
  }

};
