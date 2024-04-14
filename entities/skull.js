import Game from "../game.js";
import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Skull extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "skull"
    this.spriteSize = 0.55
  }

  think(time) {
    super.think(time)

    const { world, camera, renderer } = Game.gameInstance

    const drawXY = camera.worldToScreen(this.location.x, this.location.y)

    const drawX = Math.floor(drawXY.x)
    const drawY = Math.floor(drawXY.y)

    if (drawX + camera.scale < 0 || drawY + camera.scale < 0 || drawX > renderer.canvas.width || drawY > renderer.canvas.height) {
      return
    }

    const playerLocation = world.playerReplayer != null ? world.playerReplayer.location : world.getPlayer().location

    this.flipSprite = playerLocation.x > this.location.x
    this.spriteAngle = -this.location.minus(playerLocation).normalized().toAngle()
    if (this.flipSprite) {
      this.spriteAngle -= 90
    } else {
      this.spriteAngle += 90
    }
  }
}