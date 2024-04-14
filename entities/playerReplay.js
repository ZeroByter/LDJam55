import Game from "../game.js";
import { ilerp, lerp } from "../math.js";
import { ReplayPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import Entity from "./entity.js";

export default class PlayerReplay extends Entity {
  constructor(playbackId) {
    super()

    this.playbackId = playbackId

    this.location = new vector2(100, 100)

    this.holding = null
  }

  think(time) {
    const replaySystem = Game.gameInstance.world.replay
    const playbackTime = replaySystem.getPlaybackTime(time)

    const lastSnapshot = replaySystem.getLastSnapshot()
    const snapshots = replaySystem.getSnapshots(playbackTime)

    if (snapshots == null) {
      return;
    }

    const [current, next] = snapshots

    if (next != null && playbackTime < lastSnapshot.time) {
      const lerpValue = ilerp(current.time, next.time, playbackTime)

      const currentPlayer = current.playerSnapshots[this.playbackId]
      const nextPlayer = next.playerSnapshots[this.playbackId]

      this.location = new vector2(lerp(currentPlayer.x, nextPlayer.x, lerpValue), lerp(currentPlayer.y, nextPlayer.y, lerpValue))
      this.holding = currentPlayer.holding

      if (this.holding != null) {
        this.holding.isBeingHeld = nextPlayer.holding != null
      }
    }
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const drawXY = Game.gameInstance.camera.worldToScreen(this.location.x, this.location.y)
    const scale = Game.gameInstance.camera.scale

    const width = 0.5 * scale
    const height = 0.5 * scale

    ctx.fillStyle = "blue"
    ctx.fillRect(drawXY.x - width / 2, drawXY.y - height, width, height)

    if (this.holding) {
      const drawSize = this.holding.spriteSize * scale

      const image = Game.gameInstance.images.getImage(this.holding.sprite)
      ctx.drawImage(image, drawXY.x - drawSize / 2, drawXY.y - drawSize / 2 - height / 2, drawSize, drawSize)
    }
  }

  recordState() {
    return new ReplayPlayerSnapshot(this.id, this.location.x, this.location.y, this.holding)
  }

  implementRecordedState(data) {
    this.location = data.location
    this.holding = data.holding
  }
} 