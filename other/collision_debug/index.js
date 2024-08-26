// _______utils______
function sizeCanvas(canvas) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function deg2rad(deg) {
  return (Math.PI / 180) * deg;
}

function linne(ctx, x0, y0, x1, y1) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function dott(ctx, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// _______main______
const canvas = document.querySelector("canvas");
sizeCanvas(canvas);
const ctx = canvas.getContext("2d");
const box = {
  x: 10,
  y: 10,
  vx: 0,
  vy: 0,
  w: 200,
  h: 70,
  fill: false,
  r: deg2rad(15),
  draw() {
    ctx.save()
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r);
      const drawShape = (sizeOff = 0) => {
        ctx.beginPath();
        ctx.rect(
          -this.w / 2 + sizeOff / 2,
          -this.h / 2 + sizeOff / 2,
          this.w - sizeOff,
          this.h - sizeOff
        );
      };
      if (this.fill) {
        drawShape();
        ctx.fillStyle = "red";
        ctx.fillStyle += "80";
        ctx.fill();
      }
      drawShape((ctx.lineWidth = 1));
      ctx.strokeStyle = "red";
      ctx.lineJoin = "round";
      ctx.stroke();
    ctx.restore()
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.9;
    this.vy *= 0.9;
  },
  save() {
    localStorage.setItem(
      "box_dims",
      JSON.stringify({
        x: this.x,
        y: this.y,
        // w: this.w,
        // h: this.h,
        r: this.r,
      })
    );
  },
  restore() {
    let raw = localStorage.getItem("box_dims");
    if (raw) {
      const parsed = JSON.parse(raw);
      this.x = parsed.x;
      this.y = parsed.y;
      // this.w = parsed.w;
      // this.h = parsed.h;
      this.r = parsed.r;
    }
  },
  isPointIn(x, y) {
    function rotatePoint(point, origin, angle) {
      const originalAngle = Math.atan2(origin.y - point.y, origin.x - point.x);
      const originalDistance = Math.hypot(
        origin.y - point.y,
        origin.x - point.x
      );
      const x = origin.x + Math.cos(angle + originalAngle) * originalDistance;
      const y = origin.y + Math.sin(angle + originalAngle) * originalDistance;
      return { x, y };
    }

    const rotatedPoint = rotatePoint({ x, y }, this, -box.r);

    return (
      Math.abs(rotatedPoint.x - this.x) <= this.w / 2 &&
      Math.abs(rotatedPoint.y - this.y) <= this.h / 2
    );
  },
};
box.restore();
window.box = box;

const circle = {
  x: 300,
  y: 150,
  vx: 0,
  vy: 0,
  r: 100,
  fill: false,
  draw() {
    const drawShape = (sizeOff = 0) => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r - sizeOff / 2, 0, Math.PI * 2);
    };
    if (this.fill) {
      drawShape();
      ctx.fillStyle = "purple";
      ctx.fillStyle += "80";
      ctx.fill();
    }
    drawShape((ctx.lineWidth = 1));
    ctx.strokeStyle = "purple";
    ctx.stroke();
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.9;
    this.vy *= 0.9;
  },
  save() {
    localStorage.setItem(
      "circ_dims",
      JSON.stringify({
        x: this.x,
        y: this.y,
        // r: this.r,
      })
    );
  },
  restore() {
    let raw = localStorage.getItem("circ_dims");
    if (raw) {
      const parsed = JSON.parse(raw);
      this.x = parsed.x;
      this.y = parsed.y;
      // this.r = parsed.r;
    }
  },
  isPointIn(x, y) {
    return Math.hypot(x - this.x, y - this.y) <= this.r;
  },
};
circle.restore();
window.circle = circle;

let pickedNode = null;

// _______loop_______
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  box.draw();
  circle.draw();
  if (boxCircCollision(circle, box) && !box.fill && !circle.fill) {
    box.fill = true;
    circle.fill = true;
  } else if (!boxCircCollision(circle, box) && box.fill && circle.fill) {
    box.fill = false;
    circle.fill = false;
  }
  if (pickedNode === circle) {
    let p = boxCircCollisionResponse(circle, box);
    if (boxCircCollision(circle, box) && p) {
      box.vx += p.x ? p.x : 0;
      box.vy += p.y ? p.y : 0;
    }
  } else if (pickedNode === box) {
    let p = boxCircCollisionResponse(circle, box);
    if (boxCircCollision(circle, box) && p) {
      circle.vx -= p.x ? p.x : 0;
      circle.vy -= p.y ? p.y : 0;
    }
  } else {
    let p = boxCircCollisionResponse(circle, box);
    if (boxCircCollision(circle, box) && p) {
      circle.vx -= p.x ? p.x / 2 : 0;
      circle.vy -= p.y ? p.y / 2 : 0;
      box.vx += p.x ? p.x / 2 : 0;
      box.vy += p.y ? p.y / 2 : 0;
    }
  }
  requestAnimationFrame(draw);
}
draw();

//________main debug function yaay!________
/**
 *
 * @param {{x: number; y: number; r: number;}} circle
 * @param {{h: number; w: number; x: number; y: number; r: number;}} box
 */
function boxCircCollision(circle, box) {
  function detectBallBoxCoilision(
    box = { x: 0, y: 0, w: 10, h: 10 },
    circle = { x: 10, y: 10, r: 10 }
  ) {
    // If the circle is to the RIGHT of the square, check against the RIGHT edge.
    // If the circle is to the LEFT of the square, check against the LEFT edge.
    // If the circle is ABOVE the square, check against the TOP edge.
    // If the circle is to the BELOW the square, check against the BOTTOM edge.

    const r = circle.r;
    const cx = circle.x;
    const cy = circle.y;
    const rx = box.x - box.w / 2;
    const ry = box.y - box.h / 2;
    const rw = box.w;
    const rh = box.h;

    let testX = cx;
    let testY = cy;

    if (cx < rx) testX = rx; // left edge
    else if (cx > rx + rw) testX = rx + rw; // right edge

    if (cy < ry) testY = ry; // top edge
    else if (cy > ry + rh) testY = ry + rh; // bottom edge

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= r) {
      return true;
    }
    return false;
  }

  function rotatePoint(point, origin, angle) {
    const originalAngle = Math.atan2(origin.y - point.y, origin.x - point.x);
    const originalDistance = Math.hypot(origin.y - point.y, origin.x - point.x);
    const x = origin.x + Math.cos(angle + originalAngle) * originalDistance;
    const y = origin.y + Math.sin(angle + originalAngle) * originalDistance;
    return { x, y };
  }

  // Rotate the circle around the box's center by the negative rotation angle
  const rotatedCirclePos = rotatePoint(circle, box, -box.r);

  // Check for collision between the non-rotated box and the rotated circle
  return detectBallBoxCoilision(box, { ...circle, ...rotatedCirclePos });
}

/**
 *
 * @param {{x: number; y: number; r: number;}} circle
 * @param {{h: number; w: number; x: number; y: number; r: number;}} box
 */
function boxCircCollisionResponse(circle, box) {
  // const cr = circle.r;
  // const cx = circle.x;
  // const cy = circle.y;
  // const bx = box.x;
  // const by = box.y;
  // const br = Math.hypot(box.h, box.w) / 2;
  // const angle = Math.atan2(by - cy, bx - cx);
  // const objectsDist = Math.hypot(cy - by, cx - bx);
  // const overlapDist = br + cr - objectsDist;
  // return {
  //   x: bx + Math.cos(angle) * overlapDist,
  //   y: by + Math.sin(angle) * overlapDist,
  // };
  /**
   *
   * @param {{x: number; y: number; r: number;}} circle
   * @param {{h: number; w: number; x: number; y: number; r: number;}} box
   */
  function getBoxCircContactPoint(circle, box) {
    function getURBoxCircContactPoint(circle, box) {
      // If the circle is to the RIGHT of the square, check against the RIGHT edge.
      // If the circle is to the LEFT of the square, check against the LEFT edge.
      // If the circle is ABOVE the square, check against the TOP edge.
      // If the circle is to the BELOW the square, check against the BOTTOM edge.

      const cx = circle.x;
      const cy = circle.y;
      const rx = box.x - box.w / 2;
      const ry = box.y - box.h / 2;
      const rw = box.w;
      const rh = box.h;

      let testX = cx;
      let testY = cy;

      if (cx < rx) testX = rx; // left edge
      else if (cx > rx + rw) testX = rx + rw; // right edge

      if (cy < ry) testY = ry; // top edge
      else if (cy > ry + rh) testY = ry + rh; // bottom edge
      return { testX, testY };
    }

    function rotatePoint(point, origin, angle) {
      const originalAngle = Math.atan2(origin.y - point.y, origin.x - point.x);
      const originalDistance = Math.hypot(
        origin.y - point.y,
        origin.x - point.x
      );
      const x = origin.x + Math.cos(angle + originalAngle) * originalDistance;
      const y = origin.y + Math.sin(angle + originalAngle) * originalDistance;
      return { x, y };
    }

    // Rotate the circle around the box's center by the negative rotation angle
    const rotatedCirclePos = rotatePoint(circle, box, -box.r);
    const newCirc = { ...circle, ...rotatedCirclePos };
    const { testX, testY } = getURBoxCircContactPoint(newCirc, box);
    const cx = newCirc.x;
    const cy = newCirc.y;
    const r = circle.r;
    // Check for collision between the non-rotated box and the rotated circle
    // return detectBallBoxCoilision(box, { ...circle, ...rotatedCirclePos });
    const angle = Math.atan2(testY - cy, testX - cx);
    const contactURPointPost = rotatePoint(
      {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      },
      box,
      box.r
    );
    const contactURPointPre = rotatePoint(
      {
        x: testX,
        y: testY,
      },
      box,
      box.r
    );
    const distPos = {
      x: contactURPointPost.x - contactURPointPre.x,
      y: contactURPointPost.y - contactURPointPre.y,
    };
    return { pre: contactURPointPre, post: contactURPointPost, dist: distPos };
  }
  const point = getBoxCircContactPoint(circle, box);
  // linne(ctx, circle.x, circle.y, box.x, box.y);
  // dott(ctx, circle.x, circle.y);
  // dott(ctx, box.x, box.y);
  linne(ctx, point.pre.x, point.pre.y, point.post.x, point.post.y);
  dott(ctx, point.pre.x, point.pre.y);
  dott(ctx, point.post.x, point.post.y);
  return { x: point.dist.x, y: point.dist.y };
}

function getPickedNode(e) {
  const control = [box, circle];
  for (let i = 0; i < control.length; i++) {
    const element = control[i];
    if (element.isPointIn(e.clientX, e.clientY)) {
      pickedNode = element;
      movePickedNode(e);
    }
  }
}

function movePickedNode(e) {
  if (pickedNode) {
    if (pickedNode.w) {
      pickedNode.r +=
        (Math.atan2(e.clientY - pickedNode.y, e.clientX - pickedNode.x) -
          pickedNode.r) *
        0.05;
    }
    pickedNode.x = e.clientX;
    pickedNode.y = e.clientY;
    // box.r = p.r
  }
}

function releasePickedNode(e) {
  if (pickedNode) {
    pickedNode.save();
    pickedNode = null;
    movePickedNode(e);
  }
}

// _______events______
addEventListener("resize", () => sizeCanvas(canvas));
addEventListener("pointerdown", getPickedNode);
addEventListener("pointermove", movePickedNode);
addEventListener("pointerup", releasePickedNode);

/*
Code this javascript function.

/**

 *

 * @param {{x: number; y: number; r: number;}} circle

 * @param {{h: number; w: number; x: number; y: number; r: number;}} box
 * /
function boxCircCollisionResponse(circle, box) {
  
}

The box's r property is for rotation. This function should return the postion of the box after collision response. Dont replace w with width and so on. The code assumes that the origin of the box is its center
*/
