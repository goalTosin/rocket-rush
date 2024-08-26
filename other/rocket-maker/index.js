const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// let brushColor = "red";
// ctx.beginPath()
// ctx.arc()
function sizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
sizeCanvas();
addEventListener("resize", sizeCanvas);
addEventListener("pointerdown", () => {
  if (currentTool === tools.pan) {
    panning = true;
  }
});
addEventListener("pointerup", () => {
  panning = false;
});
addEventListener("pointermove", handlePointermove);
const tools = {
  pan: 0,
  select: 1,
};
let selectionColor = "red";
let selection = [];
let curPoint = {};
let scale = 1;
let panX = 0;
let panY = 0;
let panning = false;
let currentTool = tools.select;
function raycastPos(x, y, m = 1) {
  return {
    x: x / scale + panX * m + (canvas.width / 2) * m,
    y: y / scale + panY * m + (canvas.height / 2) * m,
  };
}
function handlePointermove(e) {
  if (currentTool === tools.select) {
    // console.log(curPoint);
    curPoint = point(e.clientX, e.clientY);
  }

  if (panning) {
    panX += e.movementX;
    panY += e.movementY;
  }
}
function drawNode(x, y) {
  let s = 10 / scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.beginPath();
  ctx.roundRect(-s / 2, -s / 2, s, s, s / 4);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "blue";
  ctx.stroke();
  ctx.restore();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  // ctx.fillStyle = 'white'
  // ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
  let curPointRedined = raycastPos(curPoint.x, curPoint.y);
  if (selection.length > 0) {
    if ((currentTool = tools.select)) {
      let lastPoint = raycastPos(
        selection[selection.length - 1].x,
        selection[selection.length - 1].y
      );
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(curPointRedined.x, curPointRedined.y);
      ctx.strokeStyle = selectionColor;
      ctx.stroke();
    }

    ctx.beginPath();
    let { x, y } = raycastPos(selection[0].x, selection[0].y);
    ctx.moveTo(x, y);
    for (let i = 1; i < selection.length; i++) {
      let { x, y } = raycastPos(selection[i].x, selection[i].y);
      ctx.lineTo(x, y);
      // console.log("asdf");
    }
    // ctx.lineWidth = 1
    ctx.strokeStyle = selectionColor;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    for (let i = 0; i < selection.length; i++) {
      let { x, y } = raycastPos(selection[i].x, selection[i].y);

      drawNode(x, y);
      // console.log("asdf");
    }
  }
  if ((currentTool = tools.select)) {
    drawNode(curPointRedined.x, curPointRedined.y);
  }

  ctx.restore();
  requestAnimationFrame(draw);
}
draw();
addEventListener("click", (e) => {
  if (currentTool === tools.select) {
    selection.push(point(e.clientX, e.clientY));
  }
});
function point(ex, ey) {
  let { x, y } = raycastPos(ex - canvas.offsetLeft, ey - canvas.offsetTop, -1);

  return {
    x,
    // :
    // (e.clientX - canvas.offsetLeft) / scale - panX - canvas.width / 2,
    y,
    // :
    // (e.clientY - canvas.offsetTop) / scale - panY - canvas.height / 2,
  };
}
