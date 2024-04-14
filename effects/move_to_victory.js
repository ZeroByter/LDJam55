import Game from "../game.js"
import ScreensManager from "../screens_manager.js"
import Effect from "./effect.js"

export default class MoveToVictoryEffect extends Effect {
  constructor(reason) {
    super()

    this.reason = reason

    this.screenRed = 0
    this.screenGreen = 150
    this.screenBlue = 0
    this.screenAlpha = 0

    this.helpAlpha = 0

    this.phase = "fadeToBlack"
    this.lastPhase = ""
  }

  /**
   * @param {number} time 
   */
  think(time) {
    super.think(time)

    const timeSinceCreation = time - this.timeCreated

    if (timeSinceCreation < 1000) {
      //fade to black
      this.screenAlpha = timeSinceCreation / 925
    } else if (timeSinceCreation > 1000) {
      //end
      this.phase = "exit"
    }

    if (this.phase != this.lastPhase) {
      this.onPhaseChange(this.phase)
    }

    this.lastPhase = this.phase
  }

  /**
   * 
   * @param {"fadeToBlack" | "exit"} phase 
   */
  onPhaseChange(phase) {
    switch (phase) {
      case "exit":
        ScreensManager.Singleton.setScreen("you_win")
        Game.gameInstance.stopGame()
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