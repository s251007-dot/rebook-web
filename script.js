let data = [];
let labels = [];

const result = document.getElementById("result");
const video = document.getElementById("video");

const names = [
  "rebloom Lip\n\n全成分\n水\nグリセリン\nBG\nシア脂",
  "rebloom Cheek\n\n全成分\nメントキシン\n果実エキス\n赤色顔料"
];


// データ読み込み
Promise.all([
 fetch("data.json").then(r=>r.json()),
 fetch("labels.json").then(r=>r.json())
])
.then(files=>{
 data = files[0];
 labels = files[1];

 console.log("データ読み込み完了");
});


// カメラ画像を比較する準備
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


function recognize(){

 canvas.width = 100;
 canvas.height = 100;

 ctx.drawImage(video,0,0,100,100);

 let image =
 ctx.getImageData(0,0,100,100).data;


 let best = 999999999;
 let answer = 0;


 for(let i=0;i<data.length;i++){

  let distance = 0;

  for(let j=0;j<image.length;j++){

   distance +=
   Math.abs(image[j]-data[i][j%data[i].length]);

  }


  if(distance < best){
    best = distance;
    answer = labels[i];
  }

 }

 console.log(answer);
 result.innerText = names[answer];

}


// 1秒ごとに確認
setInterval(()=>{
 if(data.length>0){
  recognize();
 }
},1000);