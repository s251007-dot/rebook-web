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
  fetch("data.json").then(r => r.json()),
  fetch("labels.json").then(r => r.json())
])
.then(files => {
  data = files[0];
  labels = files[1];

  console.log("データ読み込み完了");
});


// Python版と同じ比較
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


function recognize(){

  canvas.width = 100;
  canvas.height = 100;

  ctx.drawImage(video,0,0,100,100);

  const img =
    ctx.getImageData(0,0,100,100).data;


  let best = Infinity;
  let answer = -1;


  for(let i=0;i<data.length;i++){

    let distance = 0;


    for(let j=0;j<img.length;j++){

      let diff =
        img[j] - data[i][j];

      distance += diff * diff;

    }


    distance =
      distance / img.length;


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


  if(answer >= 0){

    result.innerText = names[answer];

  }

}


// 1秒ごとに認識
setInterval(()=>{

  if(data.length > 0){

    recognize();

  }

},1000);
