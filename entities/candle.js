import Game from "../game.js";
import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Candle extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "gray"

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

  makeLit() {
    this.sprite = "orange"
    this.isLit = true
  }

  makeUnlit() {
    this.sprite = "gray"
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