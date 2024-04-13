import MoveToGhostWorldEffect from "../effects/move_to_ghost_world.js";
import Game from "../game.js";
import { ReplayNonPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import Entity from "./entity.js";

export default class FirePit extends Entity {
  static Singleton

  constructor(x, y) {
    super()

    FirePit.Singleton = this

    this.location = new vector2(x, y)

    this.isLit = false

    this.lastIsLit = true
  }

  think(time) {
    super.think(time)

    if (this.isLit != this.lastIsLit) {
      this.recordExtraData = this.isLit
    }

    this.lastIsLit = this.isLit
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  renderBetweenTiles(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const scale = Game.gameInstance.camera.scale
    const drawXY = Game.gameInstance.camera.worldToScreen(this.location.x, this.location.y)

    ctx.fillStyle = "rgba(0,0,0,0.75)"
    ctx.fillRect(drawXY.x + scale / 8, drawXY.y + scale / 8, scale * 0.75, scale * 0.75)

    if (this.isLit) {
      ctx.fillStyle = "rgba(255,0,0,0.5)"
      ctx.fillRect(drawXY.x + scale / 8, drawXY.y + scale / 2, scale * 0.75, scale / 2.6)
    }
  }

  makeLit() {
    this.isLit = true
  }

  makeUnlit() {
    this.isLit = false
  }

  recordState() {
    return new ReplayNonPlayerSnapshot(this.id, this.location.x, this.location.y, "", this.recordExtraData)
  }

  implementRecordedState(data) {
    if (data.extraData) {
      this.makeLit()
    } else {
      this.makeUnlit()
    }
  }
} 