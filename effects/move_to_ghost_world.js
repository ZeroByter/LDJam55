import Game from "../game.js"
import { ilerp, lerp } from "../math.js"
import vector2 from "../vector2.js"
import Effect from "./effect.js"

export default class MoveToGhostWorldEffect extends Effect {
  constructor(activateDelay) {
    super(activateDelay)

    this.screenRed = 0
    this.screenGreen = 0
    this.screenBlue = 0
    this.screenAlpha = 0

    this.phase = "fadeToBlack"
    this.lastPhase = ""
  }

  /**
   * @param {number} time 
   */
  think(time) {
    super.think(time)

    const timeSinceCreation = time - this.timeCreated

    if (timeSinceCreation < 3000) {
      //fade to black
      this.screenAlpha = timeSinceCreation / 3000
    } else if (timeSinceCreation > 3000 && timeSinceCreation < 6000) {
      //do transition stuff
      this.phase = "main"
      this.screenRed = lerp(0, 170, ilerp(3000, 6000, timeSinceCreation))
      this.screenGreen = 0
      this.screenBlue = lerp(0, 170, ilerp(3000, 6000, timeSinceCreation))
    } else if (timeSinceCreation > 6000 && timeSinceCreation < 9000) {
      //fade from black into visible
      this.phase = "fadeOut"
      this.screenAlpha = ilerp(9000, 6000, timeSinceCreation)
    } else if (timeSinceCreation > 9000) {
      //idk i forgor
      this.phase = "exit"
      this.screenAlpha = 0
    }

    if (this.phase != this.lastPhase) {
      this.onPhaseChange(this.phase)
    }

    this.lastPhase = this.phase
  }

  /**
   * 
   * @param {"fadeToBlack" | "main" | "fadeOut" | "exit"} phase 
   */
  onPhaseChange(phase) {
    switch (phase) {
      case "fadeToBlack":
        break;
      case "main":
        Game.gameInstance.world.getPlayer().location = new vector2(95, 100)
        break
      case "fadeOut":
        break
      case "exit":
        break
      default:
        break
    }
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

    ctx.fillStyle = `rgba(${this.screenRed}, ${this.screenGreen}, ${this.screenBlue}, ${this.screenAlpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}