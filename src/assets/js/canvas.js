//1.新建一个函数产生随机数
function rn(min,max){
  return parseInt(Math.random()*(max-min)+min);
}
//2.新建一个函数产生随机颜色
function rc(min,max){
  let r = rn(min,max);
  let g = rn(min,max);
  let b = rn(min,max);
  return "rgb("+r+","+g+","+b+")";
}

function draw(w,h,c1) {
  //3.填充背景颜色,颜色要浅一点
  let ctx = c1.getContext("2d");
  ctx.fillStyle = rc(180,230);
  ctx.fillRect(0,0,w,h);

  //4.随机产生字符串
  let pool="ABCDEFGHIJKLIMNOPQRSTUVWSYZ1234567890";
  let canvasText = '';
  for(let i = 0;i < 4;i++){
    let c = pool[rn(0,pool.length)];//随机的字
    let fs = rn(18,40);//字体的大小
    let deg = rn(-30,30);//字体的旋转角度
    ctx.font = fs+'px simHei';
    ctx.textBaseline = "top";
    ctx.fillStyle = rc(80,150);
    ctx.save();
    ctx.translate(30*i+15,15);
    ctx.rotate(deg*Math.PI/180);
    ctx.fillText(c,-10,-15);
    ctx.restore();
    canvasText += c;
  }
  //5.随机产生5条干扰线,干扰线的颜色要浅一点
  for(let i = 0;i < 5;i++){
    ctx.beginPath();
    ctx.moveTo(rn(0,w),rn(0,h));
    ctx.lineTo(rn(0,w),rn(0,h));
    ctx.strokeStyle = rc(180,230);
    ctx.closePath();
    ctx.stroke();
  }
  //6.随机产生40个干扰的小点
  for(let i = 0;i < 40;i++){
    ctx.beginPath();
    ctx.arc(rn(0,w),rn(0,h),1,0,2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = rc(150,200);
    ctx.fill();
  }
  return canvasText;
}

export default {
  /*
  * 使用说明:
  * w,h 为宽和高 整数不带单位 如: 120 40
  * c1 代表 canvas 元素传入的js原生格式
  * 使用时直接 this.$canvas.canvas_draw(参数1,参数2,参数3)
  */
  canvas_draw:function (w,h,c1) {
    return draw(w,h,c1);
  }
}
