import Game from "./game.js";
import vector2 from "./vector2.js";

export default class Camera {
  constructor() {
    this.location = new vector2(100, 100)
    this.scale = 80
  }

  screenToWorld(x, y) {
    return new vector2(0, 0)
  }

  worldToScreen(x, y) {
    const canvas = Game.gameInstance.renderer.canvas

    return new vector2((x - this.location.x) * this.scale + canvas.width / 2, (y - this.location.y) * this.scale + canvas.height / 2)
  }
}