var preloadState = function(game){

};

preloadState.prototype = {

  init:function()
  {
      //preloader

      var loadingbar_bg = this.add.sprite(this.world.centerX-411*0.5,this.world.centerY,"loadingbar_bg");
      loadingbar_bg.anchor.set(0,0.5);
      loadingbar_bg.width = 347;

      this.loadingbar = this.add.sprite(this.world.centerX-411*0.5,this.world.centerY,"loadingbar");
      this.loadingbar.anchor.set(0,0.5);

      this.loadingbar.scale.x = 0;

  },
  preload:function()
  {
     var d = new Date();
     var t = d.getTime();

     this.load.baseURL = "assets/";

     this.load.image('title_bg','title_bg.jpg?v='+t);
     this.load.image('gamebg','game_bg.jpg?v='+t);
     this.load.image('instructions_bg','instructions_bg.png?v='+t);
     this.load.image('credits_bg','credits_bg.jpg?v='+t);

     //ui

     this.load.image('prang_small','ui/prang_small.png?v='+t);
     this.load.image('playtitle','ui/playtitle.png?v='+t);

     this.load.image('start_button','ui/start_button.png?v='+t);
     this.load.image('instructions_button','ui/instructions_button.png?v='+t);
     this.load.image('credit_button','ui/credit_button.png?v='+t);
     this.load.image('exit_button','ui/exit_button.png?v='+t);
     this.load.image('return_button','ui/return_button.png?v='+t);
     this.load.image('fs_button','ui/fs_button.png?v='+t);

     this.load.image('author_link','ui/soundartist_link.jpg?v='+t);
     this.load.image('dev_link','ui/dev_link.jpg?v='+t);

     //game

     this.load.image('explosion_1','explosion_1.png?v='+t);
     this.load.image('explosion_2','explosion_2.png?v='+t);
     this.load.image('explosion_3','explosion_3.png?v='+t);
     this.load.image('gameover_image','gameover.png?v='+t);

     this.addImages(Global.obstacleFrames,t);
     this.addImages(Global.foodFrames,t);


     //spriteSheets
     this.load.atlasJSONHash('character','spriteSheets/characterAnim.png?v='+t,'spriteSheets/characterAnim.json?v='+t);
     this.load.atlasJSONHash('enemy','spriteSheets/enemy.png?v='+t,'spriteSheets/enemy.json?v='+t);
     this.load.atlasJSONHash('prangAnim','spriteSheets/prangAnim.png?v='+t,'spriteSheets/prangAnim.json?v='+t);
     this.load.atlasJSONHash('explosion','spriteSheets/explosion.png?v='+t,'spriteSheets/explosion.json?v='+t);

     this.load.atlasJSONHash('vortex','spriteSheets/vortex.png?v='+t,'spriteSheets/vortex.json?v='+t);
     this.load.atlasJSONHash('twinkle','spriteSheets/twinkle.png?v='+t,'spriteSheets/twinkle.json?v='+t);
     this.load.atlasJSONHash('digits','spriteSheets/digits.png?v='+t,'spriteSheets/digits.json?v='+t);
     this.load.atlasJSONHash('powerup','spriteSheets/powerup.png?v='+t,'spriteSheets/powerup.json?v='+t);
     //bitmapFonts

     this.load.bitmapFont('pusab_8bit', 'bitmapFonts/pusab_8bit.png', 'bitmapFonts/pusab_8bit.xml');

     //audio

     this.load.audio('BGM_Titles', 'audio/BGM_Titles.mp3');
     this.load.audio('BGM_Game', 'audio/BGM_Game.mp3');
     this.load.audio('BGM_gameover', 'audio/BGM_gameover.mp3');
     this.load.audio('BGM_powerup', 'audio/BGM_powerup.mp3');

     this.load.audio('SFX_enemy_death', 'audio/SFX_enemy_death.wav');
     this.load.audio('SFX_enemy_spawn', 'audio/SFX_enemy_spawn.wav');
     this.load.audio('SFX_food_spawn', 'audio/SFX_food_spawn.wav');
     this.load.audio('SFX_player_death', 'audio/SFX_player_death.wav');
     this.load.audio('SFX_player_eat', 'audio/SFX_player_eat.wav');
     this.load.audio('vortex', 'audio/vortex.wav');

  },
  addImages:function(arr,t)
  {
    for(var i = 0; i < arr.length; i++)
    {
      var key = arr[i];
      var path = key+".png?v="+t;
      this.load.image(key,path);
    }
  },
  loadUpdate()
  {
    var per = this.load.progress*0.01;
    this.loadingbar.scale.x = per;
  },
  create:function()
  {
    var button = this.add.button(this.world.centerX,this.world.centerY+150,"play",this.onPlay,this);
    button.anchor.set(0.5);
    button.scale.setTo(0.8);

    var key_p = this.input.keyboard.addKey(Phaser.Keyboard.P);
    key_p.onDown.add(this.onPlay, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.P);
  },
  onPlay:function()
  {
    this.state.start('title');
  }

};
