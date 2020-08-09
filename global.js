var Global = { restartFlag:false};

Global.enemyFrames = ["animal","deer","bat","cat","bird","tank"];

Global.foodFrames = ["food_10","food_20","food_50","food_100","food_200"];
Global.obstacleFrames = ["obstacle_h_l","obstacle_h_r","obstacle_v_d","obstacle_v_u"];

Global.obsPos = [{"x":558.4,"y":757.6,"type":"obstacle_h_l"}, {"x":636.4,"y":255.45,"type":"obstacle_h_r"}, {"x":560.35,"y":255.45,"type":"obstacle_v_u"},
                 {"x":1294.6,"y":339.45,"type":"obstacle_v_d"}, {"x":888.5,"y":257.45,"type":"obstacle_h_r"}, {"x":1134.6,"y":257.45,"type":"obstacle_h_r"},
                 {"x":800.45,"y":757.6,"type":"obstacle_h_l"}, {"x":1050.5,"y":757.6,"type":"obstacle_h_l"}, {"x":1294.6,"y":595.45,"type":"obstacle_v_d"},
                 {"x":560.35,"y":511.5,"type":"obstacle_v_u"}];

Global.titleBGM = undefined;
Global.gameBGM = undefined;
Global.gameOverBGM = undefined;
Global.powerupBGM = undefined;
