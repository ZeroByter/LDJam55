import Game from "../game.js";
import { ReplayNonPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import Entity from "./entity.js";

//template example entity

export default class ExampleEntity extends Entity {
  constructor() {
    super()

    this.location = new vector2(100, 100)
  }

  think(time) {
    self.think(time)
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const scale = Game.gameInstance.camera.scale
    const drawXY = Game.gameInstance.camera.worldToScreen(this.location.x, this.location.y)
  }

  recordState() {
    return new ReplayNonPlayerSnapshot(this.id, this.location.x, this.location.y, "")
  }

  implementRecordedState(data) {
    this.location = data.location
  }
} 