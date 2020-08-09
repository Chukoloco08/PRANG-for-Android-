var insState = function(game){

};

insState.prototype = {

  create:function()
  {
    this.add.sprite(0,0,"instructions_bg");

    var title = this.add.sprite(this.world.centerX,100,"prang_small");
    title.anchor.set(0.5);

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
  }
};
