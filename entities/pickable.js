import Game from "../game.js";
import { ReplayNonPlayerSnapshot } from "../replay.js";
import Entity from "./entity.js";

export default class Pickable extends Entity {
  constructor() {
    super()

    this.sprite = ""

    this.spriteSize = 0.25
    this.spriteAngle = Math.random() * 180
    this.flipSprite = Math.random() < 0.5

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

    ctx.save()
    ctx.translate(drawXY.x, drawXY.y)
    ctx.rotate(this.spriteAngle * Math.PI / 180)
    if (this.flipSprite) {
      ctx.scale(-1, 1)
    }
    const image = Game.gameInstance.images.getImage(this.sprite)
    ctx.drawImage(image, drawSize / -2, drawSize / -2, drawSize, drawSize)
    ctx.restore()
  }

  recordState() {
    return new ReplayNonPlayerSnapshot(this.id, this.location.x, this.location.y, this.sprite, this.recordExtraData)
  }
}