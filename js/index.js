import Game from "./game.js"

const game = new Game(document.querySelector('canvas'))
game.startAnimation()

window.game = game