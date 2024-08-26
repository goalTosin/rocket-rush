function toHexString(x, n = 2) {
  return Math.round(x).toString(16).padStart(n, '0')
}

export default toHexString