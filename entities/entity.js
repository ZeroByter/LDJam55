import Game from "../game.js";
import { randomId } from "../utils.js"
import vector2 from "../vector2.js";

export default class Entity {
  constructor() {
    this.id = randomId()

    this.location = new vector2()

    this.playbackId = null
    this.recordLastLocation = this.location.copy()

    this.recordExtraData = null
  }

  think(time) {
    const replaySystem = Game.gameInstance.world.replay
    const playbackTime = replaySystem.getPlaybackTime(time)

    const lastSnapshot = replaySystem.getLastSnapshot()
    const snapshots = replaySystem.getSnapshots(playbackTime)

    if (snapshots == null) {
      return;
    }

    const [current, next] = snapshots

    if (next != null && playbackTime < lastSnapshot.time) {
      const currentData = current.nonPlayerSnapshots[this.playbackId]

      if (currentData != null) {
        this.location = new vector2(currentData.x, currentData.y)

        if (currentData.extraData != null) {
          this.implementRecordedState(currentData)
        }
      }
    }
  }

  /**
   * 
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  renderBetweenTiles(time, ctx, canvas) {

  }

  /**
   * 
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {

  }

  recordState() {
    throw { name: "NotImplementedError", message: "too lazy to implement" };
  }

  implementRecordedState(data) {

  }
}