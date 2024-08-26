/**
 * @type {<A>(arr: A[]) => A}
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default randomItem;

