var game = new Phaser.Game(1920,1080,Phaser.CANVAS,"Game");

game.state.add("boot",bootState);
game.state.add("preload",preloadState);
game.state.add("title",titleState);
game.state.add("instructions",insState);
game.state.add("credits",creditState);
game.state.add("game",gameState);

game.state.start("boot");
