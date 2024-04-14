import Game from "../game.js";
import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Apple extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "apple"
    this.spriteSize = 0.4
  }

  think(time) {
    super.think(time)

    if (!Game.gameInstance.world.isOverworld) {
      this.sprite = "ghost_apple"
    } else {
      this.sprite = "apple"
    }
  }
}