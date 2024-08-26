function rrand(a, b, int = false) {
  if (!b || typeof b === "boolean") {
    int = b;
    b = a;
    a = 0;
  }
  return int
    ? a + Math.round(Math.random() * (b - a))
    : a + Math.random() * (b - a);
}

export default rrand;

window.rrand = rrand;
