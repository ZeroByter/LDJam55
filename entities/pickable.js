import Game from "../game.js";
import { ReplayNonPlayerSnapshot } from "../replay.js";
import Entity from "./entity.js";

export default class Pickable extends Entity {
  constructor() {
    super()

    this.sprite = "red"
    this.actualSprite = false

    this.spriteSize = 0.25

    this.isBeingHeld = false

    this.ritualSlot = null
  }

  /**
     * @param {number} time 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {HTMLCanvasElement} canvas 
     */
  render(time, ctx, canvas) {
    if (this.isBeingHeld) {
      return;
    }

    super.render(time, ctx, canvas)

    const drawXY = Game.gameInstance.camera.worldToScreen(this.location.x, this.location.y)
    const scale = Game.gameInstance.camera.scale

    const drawSize = this.spriteSize * scale

    if (drawXY.x + drawSize < 0 || drawXY.y + drawSize < 0 || drawXY.x > canvas.width || drawXY.y > canvas.height) {
      return
    }

    if (this.actualSprite) {
      const image = Game.gameInstance.images.getImage(this.sprite)
      ctx.drawImage(image, drawXY.x - drawSize / 2, drawXY.y - drawSize / 2, drawSize, drawSize)
    } else {
      ctx.fillStyle = this.sprite
      ctx.fillRect(drawXY.x - drawSize / 2, drawXY.y - drawSize / 2, drawSize, drawSize)
    }
  }

  recordState() {
    return new ReplayNonPlayerSnapshot(this.id, this.location.x, this.location.y, this.sprite, this.recordExtraData)
  }
}