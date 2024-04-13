import Game from "../game.js";
import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Stick extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "stick"
    this.spriteSize = 0.5
    this.actualSprite = true

    this.isLit = false
    this.litTime = -1

    this.lastIsLit = true
  }

  think(time) {
    super.think(time)

    if (this.isLit && time - this.litTime > 6000) {
      this.makeUnlit()
    }

    if (this.isLit != this.lastIsLit) {
      this.recordExtraData = this.isLit
    }

    this.lastIsLit = this.isLit
  }

  makeLit() {
    this.isLit = true
    this.litTime = Game.gameInstance.lastRanTime
    this.sprite = "fire_stick"
  }

  makeUnlit() {
    this.isLit = false
    this.sprite = "stick"
  }

  implementRecordedState(data) {
    if (data.extraData) {
      this.makeLit()
    } else {
      this.makeUnlit()
    }
  }
}