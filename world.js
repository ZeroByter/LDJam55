import Effect from "./effects/effect.js"
import GhostMoveAreaEffect from "./effects/ghost_move_area.js"
import Apple from "./entities/apple.js"
import Candle from "./entities/candle.js"
import FirePit from "./entities/fire_pit.js"
import Player from "./entities/player.js"
import Ritual from "./entities/ritual.js"
import Skull from "./entities/skull.js"
import Stick from "./entities/stick.js"
import Game from "./game.js"
import { distToSegment } from "./math.js"
import { ReplaySystem } from "./replay.js"
import vector2 from "./vector2.js"

export default class World {
  /** @type {Map<string, Entity>} */
  #entities
  /** @type {Map<string, Effect>} */
  #effects

  constructor() {
    this.width = 200
    this.height = 200

    this.replay = new ReplaySystem()

    this.tiles = []
    this.aboveTiles = []

    this.#entities = new Map()

    this.#effects = new Map()

    this.rituals = []
    this.candles = []
    this.playerReplayer = null

    this.isOverworld = true

    const newPlayer = new Player()

    this.addEntity(newPlayer)

    this.addEntity(new FirePit(100, 100))

    this.playerId = newPlayer.id

    const center = new vector2(100, 100)

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const loc = new vector2(x, y)

        this.tiles.push(`grass${Math.floor(Math.random() * 3)}`)

        let aboveTile = null

        if (Math.sqrt(Math.pow(loc.x - center.x, 2) + Math.pow(loc.y - center.y, 2) * 3) > 10) {
          aboveTile = "tree"
        }

        this.aboveTiles.push(aboveTile)
      }
    }

    // generate tree paths
    const linesCount = 16
    const linesLength = 30 //MUST be even
    const linesSize = 4
    const linesAngleAdjustment = 7
    const linesAngleAdjustmentEvery = 3
    const linesAngleAdjustmentChance = 0.5

    let paths = []

    for (let i = 0; i < linesCount; i++) {
      let linePoint = new vector2(100, 100)
      let angle = i / linesCount * 360
      let angleLeftAdjustment = true

      const pathJoints = []

      for (let z = 0; z < linesLength; z++) {
        // Game.gameInstance.renderer.debugLines.push([linePoint.x, linePoint.y])
        pathJoints.push(linePoint.copy())
        linePoint = linePoint.newVectorFromAngleAndDistance(angle, linesSize).round()
        // Game.gameInstance.renderer.debugLines.push([linePoint.x, linePoint.y])

        if (angleLeftAdjustment) {
          angle += linesAngleAdjustment
        } else {
          angle -= linesAngleAdjustment
        }

        if (z % linesAngleAdjustmentEvery == 0 && Math.random() < linesAngleAdjustmentChance) {
          angleLeftAdjustment = !angleLeftAdjustment
        }
      }

      paths.push(pathJoints)
    }

    // removing trees near paths and generating paths
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const loc = new vector2(x, y)

        for (const path of paths) {
          for (let i = 0; i < path.length - 1; i++) {
            const lineStart = path[i]
            const lineEnd = path[i + 1]

            const distanceToLine = distToSegment(loc, lineStart, lineEnd)

            if (distanceToLine <= 2) {
              const tileIndex = x + y * this.width
              this.aboveTiles[tileIndex] = null
              if (distanceToLine <= 0.5 && loc.distance(center) > 10) {
                this.tiles[tileIndex] = "concrete"
              }
            }
          }
        }
      }
    }

    // spawning apples and sticks on some trees
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const loc = new vector2(x, y)
        const index = x + y * this.width

        let foundNonTreeNeighbor = false

        for (let y2 = 0; y2 < 3; y2++) {
          for (let x2 = 0; x2 < 3; x2++) {
            const index = (x + (x2 - 1)) + (y + (y2 - 1)) * this.width
            if (this.aboveTiles[index] !== "tree") {
              foundNonTreeNeighbor = true
              break
            }
          }
          if (foundNonTreeNeighbor) {
            break
          }
        }

        if (this.aboveTiles[index] === "tree" && foundNonTreeNeighbor) {
          if (Math.random() < 0.2) {
            this.addEntity(new Apple(x + Math.random(), y + Math.random()))
          }
          if (Math.random() < 0.35) {
            this.addEntity(new Stick(x + Math.random(), y + Math.random()))
          }
        }


        if (this.aboveTiles[index] == null && loc.distance(center) > 10) {
          if (Math.random() < 0.01) {
            this.addEntity(new Candle(x + Math.random(), y + Math.random()))
          }
        }
      }
    }

    // generate overworld ritual spot
    const overworldRitual = new Ritual(this, new vector2(95, 100), 8, true)
    this.addEntity(overworldRitual)
  }

  /**
   * @param {vector2} centerLocation 
   */
  generateRitualSpot(centerLocation, slotsCount, isOverworld) {
    this.aboveTiles[centerLocation.x + centerLocation.y * this.width] = "ritual_center"

    const slots = []

    for (let i = 0; i < slotsCount; i++) {
      const spot = centerLocation.newVectorFromAngleAndDistance(i / slotsCount * 360, 3).round()

      let appleOrSkull = isOverworld ? "apple" : "skull"

      const accepts = Math.random() < 0.5 ? "candle" : appleOrSkull

      const slotData = {
        location: spot,
        accepts,
        occupied: false,
      }

      if (Game.gameInstance.debug) {
        if (accepts === "apple") {
          const a = new Apple(spot.x + 0.5, spot.y + 0.5)
          a.ritualSlot = slotData
          this.addEntity(a)
        } else if (accepts === "skull") {
          const a = new Skull(spot.x + 0.5, spot.y + 0.5)
          a.ritualSlot = slotData
          this.addEntity(a)
        } else if (accepts === "candle") {
          const a = new Candle(spot.x + 0.5, spot.y + 0.5)
          a.ritualSlot = slotData
          this.addEntity(a)
        }
      }

      slots.push(slotData)

      this.aboveTiles[spot.x + spot.y * this.width] = `ritual_${accepts}`
    }

    return slots
  }

  addEntity(entity) {
    if (entity instanceof Candle) {
      this.candles.push(entity)
    }

    if (entity instanceof Ritual) {
      this.rituals.push(entity)
    }

    this.#entities.set(entity.id, entity)
  }

  getEntity(id) {
    return this.#entities.get(id)
  }

  getEntities() {
    return this.#entities
  }

  addEffect(effect) {
    if (!Game.gameInstance.isRunning) {
      return
    }

    this.#effects.set(effect.id, effect)
  }

  /**
   * @param {string} id 
   */
  removeEffect(id) {
    this.#effects.delete(id)
  }

  getEffects() {
    return this.#effects
  }

  /**
   * 
   * @returns {Player}
   */
  getPlayer() {
    return this.getEntity(this.playerId)
  }
}