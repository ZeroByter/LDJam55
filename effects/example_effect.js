import Game from "../game.js"
import Effect from "./effect.js"

export default class ExampleEffect extends Effect {
  constructor(activateDelay) {
    super(activateDelay)
  }

  /**
   * @param {number} time 
   */
  think(time) {
    super.think(time)
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  preRender(time, ctx, canvas) {
    super.preRender(time, ctx, canvas)
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)
  }
}