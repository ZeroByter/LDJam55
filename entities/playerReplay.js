import Game from "../game.js";
import { ilerp, lerp } from "../math.js";
import PlayerAnimationsController from "../player_animations_controller.js";
import { ReplayPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import Entity from "./entity.js";

export default class PlayerReplay extends Entity {
  constructor(playbackId) {
    super()

    this.animationsController = new PlayerAnimationsController()

    this.sprite = "player_idle1"
    this.handsSprite = "player_arms_empty_idle1"

    this.holdingOffset = 0
    this.flipSprite = false

    this.playbackId = playbackId

    this.location = new vector2(100, 100)
    this.lastLocation = this.location.copy()

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
        this.holding.heldByReplayer = true
        this.holding.isBeingHeld = nextPlayer.holding != null
      }
    }

    const movedDistance = this.location.minus(this.lastLocation)

    this.animationsController.setAnimationState(movedDistance.y != 0 && movedDistance.x == 0, movedDistance.x != 0, movedDistance.magnitude(), this.holding != null)

    const [sprite, handsSprite, holdingOffset] = this.animationsController.think(time)

    this.sprite = sprite
    this.handsSprite = handsSprite
    this.holdingOffset = holdingOffset
    this.flipSprite = movedDistance.x != 0 && movedDistance.x < 0

    this.lastLocation = this.location.copy()
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const { images, camera } = Game.gameInstance

    const drawXY = camera.worldToScreen(this.location.x, this.location.y)
    const scale = camera.scale

    const size = 0.8 * scale

    ctx.save()
    ctx.translate(drawXY.x - size / 2, drawXY.y - size)
    if (this.flipSprite) {
      ctx.translate(size, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(images.getImage(this.sprite), 0, 0, size, size)
    ctx.drawImage(images.getImage(this.handsSprite), 0, 0, size, size)
    ctx.restore()

    if (this.holding) {
      const drawSize = this.holding.spriteSize * scale

      const image = images.getImage(this.holding.sprite)
      ctx.drawImage(image, drawXY.x - drawSize / 2, drawXY.y - drawSize / 2 - size + this.holdingOffset, drawSize, drawSize)
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