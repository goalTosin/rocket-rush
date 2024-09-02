import rotatePoint from "./rotatePoint.js";

/**
 *
 * @param {{x: number; y: number; r: number;}} circle
 * @param {{h: number; w: number; x: number; y: number; r: number;}} box
 */
function boxCircCollisionResponse(circle, box) {
  function getURBoxCircContactPoint(circle, box) {
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

  const rotatedCirclePos = rotatePoint(circle, box, -box.r);
  const newCirc = { ...circle, ...rotatedCirclePos };
  const { testX, testY } = getURBoxCircContactPoint(newCirc, box);
  const cx = newCirc.x;
  const cy = newCirc.y;
  const r = circle.r;
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
  return {x: distPos.x + box.x, y: distPos.y + box.y};
}

export default boxCircCollisionResponse;
