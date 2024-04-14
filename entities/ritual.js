import MoveToDeathLoseEffect from "../effects/move_to_death_lose.js";
import MoveToGhostWorldEffect from "../effects/move_to_ghost_world.js";
import MoveToVictoryEffect from "../effects/move_to_victory.js";
import Game from "../game.js";
import { ReplayNonPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import World from "../world.js";
import Entity from "./entity.js";

export default class Ritual extends Entity {
  /**
   * 
   * @param {World} world 
   * @param {vector2} center 
   * @param {number} slotsCount 
   * @param {boolean} isOverworld
   */
  constructor(world, center, slotsCount, isOverworld) {
    super()

    this.location = center

    this.slotsCount = slotsCount
    this.slots = world.generateRitualSpot(center, slotsCount, isOverworld)
    //the above contains the following data structure
    /**
     * {
        location: spot,
        accepts,
        occupied: false,
      }
     */

    this.occupiedSlots = []
    this.lastOccupiedSlots = [true]

    this.isOverworld = isOverworld

    this.allOccupiedTime = -1
    this.allDone = false
  }

  think(time) {
    super.think(time)

    let occupiedSlotsCount = 0

    for (const slot of this.slots) {
      if (slot.occupied) {
        occupiedSlotsCount++
      }
    }

    this.occupiedSlots = this.slots.map(slot => slot.occupied)

    if (this.countOccupiedSlots(this.occupiedSlots) != this.countOccupiedSlots(this.lastOccupiedSlots)) {
      this.recordExtraData = this.occupiedSlots
    }

    if (occupiedSlotsCount === this.slotsCount && this.allOccupiedTime === -1) {
      this.allOccupiedTime = time
    }

    if (this.allOccupiedTime > -1 && time - this.allOccupiedTime > 3000 && !this.allDone) {
      this.allDone = true

      const world = Game.gameInstance.world

      if (this.isOverworld) {
        if (world.isOverworld) {
          world.addEffect(new MoveToGhostWorldEffect())
        } else {
          world.addEffect(new MoveToDeathLoseEffect("too_slow"))
        }
      } else {
        world.addEffect(new MoveToVictoryEffect("too_slow"))
      }
      // Ritual done!!! 
    }

    this.lastOccupiedSlots = [...this.occupiedSlots]
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  renderBetweenTiles(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const scale = Game.gameInstance.camera.scale

    for (const slot of this.slots) {
      const drawXY = Game.gameInstance.camera.worldToScreen(slot.location.x, slot.location.y)

      if (slot.occupied) {
        ctx.fillStyle = "black"
        ctx.fillRect(drawXY.x, drawXY.y, scale, scale)
      }
    }
  }

  countOccupiedSlots(occupiedSlots) {
    return occupiedSlots.reduce((a, b) => a + (b ? 1 : 0), 0)
  }

  recordState() {
    return new ReplayNonPlayerSnapshot(this.id, this.location.x, this.location.y, "", this.recordExtraData)
  }

  implementRecordedState(data) {
    for (let i = 0; i < data.extraData.length; i++) {
      this.slots[i].occupied = data.extraData[i]
    }
  }
} 