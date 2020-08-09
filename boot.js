var bootState = function(game){

}

bootState.prototype = {

  init:function()
  {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	  this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically  = true;
  	//this.scale.setScreenSize();

     this.stage.backgroundColor = "#000000";

  },
  preload:function()
  {
      var d = new Date();
      var t = d.getTime();

      this.load.baseURL = "assets/";

      this.load.image('loadingbar','ui/loadingbar.png?v='+t);
      this.load.image('loadingbar_bg','ui/loadingbar_bg.png?v='+t);
      this.load.image('play','ui/play.png?v='+t);
      
  },
  create:function()
  {
    console.log("bootState: ");

    this.state.start('preload');
  }
};
