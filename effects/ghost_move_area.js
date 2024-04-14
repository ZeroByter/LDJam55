import Game from "../game.js"
import { ilerp, lerp } from "../math.js"
import vector2 from "../vector2.js"
import Effect from "./effect.js"

export default class GhostMoveAreaEffect extends Effect {
  constructor(activateDelay) {
    super(activateDelay)

    this.outsideZoneHurt = 0
    this.isPlayerDead = false
  }

  /**
   * @param {number} time 
   */
  think(time) {
    super.think(time)

    const { world } = Game.gameInstance

    const playerDistanceToDanger = this.getDistanceToDanger(world.getPlayer().location) ** 0.85

    if (playerDistanceToDanger >= 1) {
      if (this.outsideZoneHurt >= 1) {
        if (!this.isPlayerDead) {
          this.isPlayerDead = true
          world.addEffect(new MoveToDeathLoseEffect())
        }
      } else {
        this.outsideZoneHurt += 0.02
      }
    } else {
      if (this.outsideZoneHurt > 0) {
        this.outsideZoneHurt = Math.max(0, this.outsideZoneHurt -= 0.02)
      }
    }
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  preRender(time, ctx, canvas) {
    super.preRender(time, ctx, canvas)

    const { world, camera } = Game.gameInstance

    const cameraScale = camera.scale

    const playerDistanceToDanger = this.getDistanceToDanger(world.getPlayer().location) ** 0.85

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        const drawXY = camera.worldToScreen(x, y)

        const drawX = Math.floor(drawXY.x)
        const drawY = Math.floor(drawXY.y)

        if (drawX + cameraScale < 0 || drawY + cameraScale < 0 || drawX > canvas.width || drawY > canvas.height) {
          continue
        }

        const loc = new vector2(x, y)

        const finalDistance = this.getDistanceToDanger(loc)

        let r = lerp(17, 80, playerDistanceToDanger) * ((this.outsideZoneHurt * 2) + 1)
        let g = 0
        let b = lerp(17, 0, playerDistanceToDanger)

        ctx.fillStyle = `rgba(${r},${g},${b},${finalDistance})`
        ctx.fillRect(drawX, drawY, cameraScale, cameraScale)
      }
    }
  }

  getDistanceToDanger(loc) {
    const { world } = Game.gameInstance

    const center = new vector2(world.width / 2, world.height / 2)

    const centerDistance = Math.sqrt(Math.pow(loc.x - center.x, 2) + Math.pow(loc.y - center.y, 2) * 3)

    let playerReplayerLocation = new vector2(-100, -100)
    if (world.playerReplayer) {
      playerReplayerLocation = world.playerReplayer.location
    }

    const playerDistance = loc.distance(playerReplayerLocation)

    return Math.min(ilerp(10, 14, centerDistance), ilerp(5, 7, playerDistance))
  }
}