alert("script.js読み込み完了");

let data = [];
let labels = [];

const result = document.getElementById("result");
const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "environment"
  },
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  console.log(err);
});
const names = [
  "rebloom Lip\n\n全成分\n水\nグリセリン\nBG\nシア脂",
  "rebloom Cheek\n\n全成分\nメントキシン\n果実エキス\n赤色顔料"
];


// JSON読み込み
Promise.all([
  fetch("data.json").then(res => res.json()),
  fetch("labels.json").then(res => res.json())
])
.then(([d, l]) => {

  data = d;
  labels = l;

  console.log("データ読み込み成功");

});


// カメラ画像用
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


function recognize(){

  canvas.width = 100;
  canvas.height = 100;


  // カメラ画像を100×100にする
  ctx.drawImage(video,0,0,100,100);


  // RGBA → RGBに変換
  const rgba =
    ctx.getImageData(0,0,100,100).data;


  let image = [];

  for(let i = 0; i < rgba.length; i += 4){

    image.push(rgba[i]);
    image.push(rgba[i+1]);
    image.push(rgba[i+2]);

  }


  let best = Infinity;
  let answer = -1;


  // 一番近い画像を探す
  for(let i=0; i<data.length; i++){

    let distance = 0;


    for(let j=0; j<image.length; j++){

      let diff =
        image[j] - data[i][j];

      distance += diff * diff;

    }


    distance =
      distance / image.length;


    if(distance < best){

      best = distance;
      answer = labels[i];

    }

  }


  console.log(
    "判定:",
    answer,
    "距離:",
    best
  );


  if(answer !== -1 && best < 3000){

    result.innerText = names[answer];

}else{

    result.innerText = "商品をカメラに映してください";

}
}


// 1秒ごとに確認
setInterval(()=>{

  if(data.length > 0){

    recognize();

  }

},1000);