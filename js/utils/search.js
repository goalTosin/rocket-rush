function evaluteSimilarity(arr1, arr2) {
  // let sameUpTillNow = true;
  // arrays.forEach((arr) => {
  //   arrays.forEach((arr2) => {
  //     [...arr].forEach((ar) => {
  //       if (arr !== arr2) {
  //         sameUpTillNow = sameUpTillNow && arr2.includes(ar);
  //       }
  //     });
  //   });
  // });
  let sameUpTillNow = true;
  [...arr1].forEach((v) => {
    sameUpTillNow = sameUpTillNow && arr2.includes(v);
  });
  return sameUpTillNow;
}



function search(strs, searchstr) {
  let vs = []
  strs.forEach(str => {
    if (evaluteSimilarity(searchstr, str)) {
      vs.push(str)
    }
  })
  return vs
}

export default search