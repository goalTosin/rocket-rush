function rotatePoint(point, origin, angle) {
  const originalAngle = Math.atan2(origin.y - point.y, origin.x - point.x);
  const originalDistance = Math.hypot(origin.y - point.y, origin.x - point.x);
  const x = origin.x + Math.cos(angle + originalAngle) * originalDistance;
  const y = origin.y + Math.sin(angle + originalAngle) * originalDistance;
  return { x, y };
}
export default rotatePoint