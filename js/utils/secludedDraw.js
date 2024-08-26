function secludedDraw(ctx, callback) {
  ctx.save()
  callback()
  ctx.restore()
}

export default secludedDraw