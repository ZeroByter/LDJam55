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

    this.spriteIndex = 0
    this.lastSpriteChange = 0

    this.isLit = false
    this.litTime = -1

    this.lastIsLit = true
  }

  think(time) {
    super.think(time)

    if (time - this.lastSpriteChange > 100) {
      this.lastSpriteChange = time
      this.spriteIndex = 1 - this.spriteIndex
    }

    if (this.isLit && time - this.litTime > 3000) {
      this.makeUnlit()
    }

    if (this.isLit) {
      this.sprite = `stick_lit${this.spriteIndex}`
    } else {
      this.sprite = "stick"
    }

    if (this.isLit != this.lastIsLit) {
      this.recordExtraData = this.isLit
    }

    this.lastIsLit = this.isLit
  }

  makeLit() {
    this.isLit = true
    this.litTime = Game.gameInstance.lastRanTime
  }

  makeUnlit() {
    this.isLit = false
  }

  implementRecordedState(data) {
    if (data.extraData) {
      this.makeLit()
    } else {
      this.makeUnlit()
    }
  }
}