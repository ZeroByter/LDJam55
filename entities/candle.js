import Game from "../game.js";
import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Candle extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "candle"
    this.actualSprite = true
    this.spriteSize = 0.55

    this.spriteIndex = 0
    this.lastSpriteChange = 0

    this.isLit = false

    this.lastIsLit = true
  }

  think(time) {
    super.think(time)

    if (time - this.lastSpriteChange > 100) {
      this.lastSpriteChange = time
      this.spriteIndex = 1 - this.spriteIndex
    }

    if (this.isLit) {
      this.sprite = `candle_lit${this.spriteIndex}`
    } else {
      this.sprite = "candle"
    }

    if (this.isLit != this.lastIsLit) {
      this.recordExtraData = this.isLit
    }

    this.lastIsLit = this.isLit
  }

  makeLit() {
    this.isLit = true
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