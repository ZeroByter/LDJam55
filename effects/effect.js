import Game from "../game.js"
import { randomId } from "../utils.js"

export default class Effect {
  constructor(activateDelay = 0) {
    this.id = randomId()

    this.isActive = false
    this.activateDelay = activateDelay

    this.timeCreated = Game.gameInstance.lastRanTime
  }

  think(time) {

  }

  renderBetweenTiles(time, ctx, canvas) {

  }

  preRender(time, ctx, canvas) {

  }

  render(time, ctx, canvas) {

  }
}