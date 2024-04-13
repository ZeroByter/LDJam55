import vector2 from "../vector2.js";
import Pickable from "./pickable.js";

export default class Apple extends Pickable {
  constructor(x, y) {
    super()

    this.location = new vector2(x, y)

    this.sprite = "red"
  }
}