var titleState = function(game){

}

titleState.prototype = {

  create:function()
  {
    titleState.obj = this;
    this.physics.startSystem(Phaser.Physics.ARCADE);

    Global.titleBGM = this.add.sound("BGM_Titles");
    this.game.sound.setDecodedCallback([Global.titleBGM], this.start, this);

  },
  start:function()
  {
    Global.titleBGM.stop();
    Global.titleBGM.loopFull();
    Global.titleBGM.play();

    var bg = this.add.sprite(0,0,"title_bg");

    var play = this.add.sprite(this.world.centerX,65,"playtitle");
    play.anchor.set(0.5,0);

    titleState.obj.addGameObjects();

    var title = this.add.sprite(this.world.centerX,320,"prangAnim");
    title.anchor.set(0.5);
    var prangAnim = title.animations.add("prangAnim");

    title.animations.play("prangAnim",10,true);

    var obstacle = this.add.sprite(1750,1000,"obstacle_h_l");
    obstacle.anchor.set(0.5);

    var startButton = this.add.button(this.world.centerX,600,"start_button",this.onStartButton,this);
    startButton.anchor.set(0.5);

    var instructionsButton = this.add.button(this.world.centerX,700,"instructions_button",this.onInstructionButton,this);
    instructionsButton.anchor.set(0.5);

    var creditButton = this.add.button(this.world.centerX,800,"credit_button",this.onCreditButton,this);
    creditButton.anchor.set(0.5);

    var exitButton = this.add.button(this.world.centerX,900,"exit_button",this.onExitButton,this);
    exitButton.anchor.set(0.5);

    this.fs_button = this.add.button(this.world.width-10,10,"fs_button",this.fullScreenToggle,this);
    this.fs_button.anchor.set(1,0);

    this.keyBoardKeys();
  },

  addGameObjects:function()
  {
    this.enemyGroup = this.add.physicsGroup();

    var rx;
    var ry;

    for(var i=0; i < 4; i++)
    {
      var xpos = Utils.random(100,this.world.width-100);
      var ypos = Utils.random(100,this.world.height-100);
      var frame = Global.enemyFrames[i];
      var enemy = this.enemyGroup.create(xpos,ypos,"enemy",frame);
      enemy.anchor.set(0.5);

      enemy.dx = 1;
      enemy.dy = 1;
      enemy.v = Utils.random(1,9)/5;

      rx = Utils.random(0,2);
      if(rx === 0){ enemy.dx = -1; }

      ry = Utils.random(0,2);
      if(ry === 0){ enemy.dy = -1; }
    }

    this.char = this.add.sprite(this.world.centerX,this.world.centerY,"character");
    this.char.anchor.set(0.5);
    this.char.dx = 1;
    this.char.dy = 1;

    var walkAnim = this.char.animations.add("walk",[0,1]);
    walkAnim.play();
  },
  addEnemyAnimations:function(enemy,frame)
  {
    var arr = [0,1];

    if(frame === "animal"){ arr = [0,1];}
    else if(frame === "bat"){ arr = [2,3];}
    else if(frame === "bird"){ arr = [4,5];}
    else if(frame === "cat"){ arr = [6,7];}
    else if(frame === "deer"){ arr = [8,9];}
    else if(frame === "tank"){ arr = [10,11];}

    enemy.animations.add(frame,arr);
    enemy.animations.play(frame,4,true);

  },
  update:function()
  {

    if(this.char){

     this.char.x += 2*this.char.dx;
     this.char.y += 2*this.char.dy;

     if(this.char.y > this.world.height-this.char.height*0.5) { this.char.dy = -1; }
     else if(this.char.y < this.char.height*0.5) { this.char.dy = 1; }

     if(this.char.x > this.world.width-this.char.width*0.5) { this.char.dx = -1; }
     else if(this.char.y < this.char.width*0.5) { this.char.dx = 1; }
    }

    if(this.enemyGroup)
    {
      for(var i=0; i < this.enemyGroup.children.length; i++)
      {
        var enemy = this.enemyGroup.children[i];
        enemy.x += (1 + enemy.v) * enemy.dx;
        enemy.y += (1 + enemy.v) * enemy.dy;

        if(enemy.y > this.world.height-enemy.height*0.5) { enemy.dy = -1; }
        else if(enemy.y < enemy.height*0.5) { enemy.dy = 1; }

        if(enemy.x > this.world.width - enemy.width*0.5) { enemy.dx = -1; }
        else if(enemy.x < enemy.width*0.5) { enemy.dx = 1; }

        enemy.scale.x = 1*enemy.dx;
      }
    }
  },
  keyBoardKeys:function()
  {
    var key_S = this.input.keyboard.addKey(Phaser.Keyboard.S);
    key_S.onDown.add(this.onKeyDown, this);

    var key_I = this.input.keyboard.addKey(Phaser.Keyboard.I);
    key_I.onDown.add(this.onKeyDown, this);

    var key_C = this.input.keyboard.addKey(Phaser.Keyboard.C);
    key_C.onDown.add(this.onKeyDown, this);

    var key_X = this.input.keyboard.addKey(Phaser.Keyboard.X);
    key_X.onDown.add(this.onKeyDown, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.S);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.I);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.C);
    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.X);
  },
  onKeyDown:function(obj)
  {
    var key = obj.event.key.toUpperCase();

    if(key === "S") { this.onStartButton(); }
    else if(key === "I") { this.onInstructionButton(); }
    else if(key === "C") { this.onCreditButton(); }
    else if(key === "X") { this.onExitButton(); }

  },
  onStartButton:function()
  {
    Global.titleBGM.stop();
    this.state.start('game');
  },
  onInstructionButton:function()
  {
    this.state.start('instructions');
  },
  onCreditButton:function()
  {
    this.state.start('credits');
  },
  onExitButton:function()
  {
    window.close();
  },
  fullScreenToggle:function()
  {
    if (this.scale.isFullScreen)
    {
      this.scale.stopFullScreen();
    }
    else {
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.startFullScreen(false);
    }
  }
};
