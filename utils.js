var Utils = {

radToDeg:function(angle) {
  return angle * (180 / Math.PI);
},
degToRad:function(angle)
{
  return angle * (Math.PI / 180);
},
getDistance:function(x1,y1,x2,y2)
{
   var dx = x1-x2;
   var dy = y1-y2;
   var d = Math.sqrt(dx*dx + dy*dy);
   return d;
},
random:function(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

};
