var creditState = function(game){

};

creditState.prototype = {

  create:function()
  {
    this.add.sprite(0,0,"credits_bg");

    var title = this.add.sprite(this.world.centerX,100,"prang_small");
    title.anchor.set(0.5);

    var authorButton = this.add.button(this.world.centerX,510,"author_link",this.onAuthorButton,this);
    authorButton.anchor.set(0.5);

    var devButton = this.add.button(this.world.centerX,740,"dev_link",this.onDevButton,this);
    devButton.anchor.set(0.5);

    var returnButton = this.add.button(this.world.centerX,1020,"return_button",this.onBack,this);
    returnButton.anchor.set(0.5);

    this.keyBoardKeys();

  },
  keyBoardKeys:function()
  {
    var key_R = this.input.keyboard.addKey(Phaser.Keyboard.R);
    key_R.onDown.add(this.onBack, this);

    this.input.keyboard.removeKeyCapture(Phaser.Keyboard.R);
  },
  onBack:function()
  {
    Global.titleBGM.stop();
    this.state.start('title');
  },
  onAuthorButton:function()
  {
    //window.location.href = "http://www.ozzed.net";
    window.open("http://www.ozzed.net", "_blank");
  },
  onDevButton:function()
  {
   //window.location.href = "http://www.fiverr.com/gamegeek3";
   window.open("http://www.fiverr.com/gamegeek3", "_blank");
  },
  onBack:function()
  {
    Global.titleBGM.stop();
    this.state.start('title');
  }
};
