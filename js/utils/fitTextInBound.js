// import secludedDraw from "./secludedDraw.js";

// function getTextHeight(ctxFont) {
//   return parseInt(ctxFont.substring(0, ctxFont.indexOf("px")));
// }
// /**
//  *
//  * @param { CanvasRenderingContext2D } ctx
//  * @param { string } text
//  * @param { number } x
//  * @param { number } y
//  * @param { 'fill' | 'stroke' } drawType
//  * @param {{ lineGap: number }} options
//  */
// function drawTextWithNewLine(ctx, x, y, text, drawType, { lineGap = 0 } = {}) {
//   const textHeight = getTextHeight(ctx.font);
//   secludedDraw(ctx, () => {
//     text.split("\n").forEach((line, i) => {
//       ctx[drawType + "Text"](line, x, i * (textHeight + lineGap) + y);
//     });
//   });
// }

// /**
//  *
//  * @param { CanvasRenderingContext2D } ctx
//  * @param { string } text
//  * @param { number } x
//  * @param { number } y
//  * @param { number } w
//  * @param {{ lineGap: number }} options
//  */
// function fitTextInBound(ctx, text, x, y, w, { lineGap = 0 } = {}) {
//   let drawnText = "";
//   function isOutOfBounds() {
//     const longestLine = drawnText.split('\n').reduce((a, b) => a.length > b.length ? a : b)
//     return ctx.measureText(longestLine).width > w
//   }
//   let dx = x;
//   let dy = y;
//   let words = text.split(" ");
//   for (let i = 0; i < words.length; i++) {
//     const word = words[i];
//     if (drawnText !== "") {
//       drawnText += " ";
//     }
//     drawnText += word;
//     if (isOutOfBounds()) {
//       drawnText += '\n'
//     }
//     if (isOutOfBounds()) {
//       drawnText = drawnText.substring(0, drawnText.length - 1)

//     }
//   }

// }

// export default fitTextInBound

function measureTextWithinWidth(
  text,
  ctx,
  width,
  { lineHeight, wordBreak = false } = {}
) {
  const x= 0
  const y= 0
  let curX = x;
  let curY = y;
  let writeChunks = text.split(" ");
  if (wordBreak) {
    writeChunks = [...text];
  }
  const outOfBounds = (m) => curX + m > x + width;
  const textHeight = Number(ctx.font.substring(0, ctx.font.indexOf("px")));
  lineHeight = lineHeight ? lineHeight : textHeight;
  lineHeight = textHeight + (lineHeight - textHeight);
  if (!textHeight) {
    console.error('ctx font is not correct: "' + ctx.font + '"');
  }
  let mx = 0;
  for (let i = 0; i < writeChunks.length; i++) {
    const textChunk = writeChunks[i];
    let tw = ctx.measureText(textChunk, curX, curY).width;
    if (outOfBounds(tw)) {
      curX = x;
      if (i !== 0) {
        curY += lineHeight;
      }
    }
    curX += tw + (wordBreak ? 0 : ctx.measureText(" ").width);
    mx = curX;
  }
  return { height: curY - y + textHeight};
}

function drawTextWithinWidth(
  text,
  ctx,
  x,
  y,
  width,
  { lineHeight, wordBreak = false } = {},
  drawType
) {
  let curX = x;
  let curY = y;
  let writeChunks = text.split(" ");
  if (wordBreak) {
    writeChunks = [...text];
  }
  const outOfBounds = (m) => curX + m > x + width;
  const textHeight = Number(ctx.font.substring(0, ctx.font.indexOf("px")));
  lineHeight = lineHeight ? lineHeight : textHeight;
  lineHeight = textHeight + (lineHeight - textHeight);
  if (!textHeight) {
    console.error('ctx font is not correct: "' + ctx.font + '"');
  }
  let mx = 0;
  for (let i = 0; i < writeChunks.length; i++) {
    const textChunk = writeChunks[i];
    let tw = ctx.measureText(textChunk, curX, curY).width;
    if (outOfBounds(tw)) {
      curX = x;
      if (i !== 0) {
        curY += lineHeight;
      }
    }
    ctx[drawType + "Text"](textChunk, curX, curY);
    curX += tw + (wordBreak ? 0 : ctx.measureText(" ").width);
    mx = curX;
  }
  return { h: curY - y + textHeight, lw: mx };
}

/**
 *
 * @param {string} text
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {{lineHeight: number, wordBreak: boolean}} options
 * @returns {void}
 */
function fillTextWithinWidth(
  text,
  ctx,
  x,
  y,
  width,
  { lineHeight, wordBreak } = {}
) {
  return drawTextWithinWidth(
    text,
    ctx,
    x,
    y,
    width,
    { lineHeight, wordBreak },
    "fill"
  );
}

/**
 *
 * @param {string} text
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {{lineHeight: number, wordBreak: boolean}} options
 * @returns {void}
 */
function strokeTextWithinWidth(
  text,
  ctx,
  x,
  y,
  width,
  { lineHeight, wordBreak } = {},
  drawType
) {
  return drawTextWithinWidth(
    text,
    ctx,
    x,
    y,
    width,
    { lineHeight, wordBreak },
    "stroke"
  );
}

export { fillTextWithinWidth, strokeTextWithinWidth, measureTextWithinWidth };
