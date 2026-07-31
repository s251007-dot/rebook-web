function recognize(){

 canvas.width = 100;
 canvas.height = 100;

 ctx.drawImage(video,0,0,100,100);

 const rgba = ctx.getImageData(0,0,100,100).data;

 let image = [];

 for(let i = 0; i < rgba.length; i += 4){
   image.push(rgba[i]);
   image.push(rgba[i+1]);
   image.push(rgba[i+2]);
 }

 let best = Infinity;
 let answer = -1;