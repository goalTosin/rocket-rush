import rotatePoint from "./rotatePoint.js";

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

  // Rotate the circle around the box's center by the negative rotation angle
  const rotatedCirclePos = rotatePoint(circle, box, -box.r);

  // Check for collision between the non-rotated box and the rotated circle
  return detectBallBoxCoilision(box, { ...circle, ...rotatedCirclePos });
}


export default boxCircCollision