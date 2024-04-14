import PlayerReplay from "../entities/playerReplay.js"
import Ritual from "../entities/ritual.js"
import Skull from "../entities/skull.js"
import Game from "../game.js"
import { ilerp, lerp } from "../math.js"
import vector2 from "../vector2.js"
import Effect from "./effect.js"
import GhostMoveAreaEffect from "./ghost_move_area.js"

export default class MoveToGhostWorldEffect extends Effect {
  constructor(activateDelay) {
    super(activateDelay)

    this.screenRed = 0
    this.screenGreen = 0
    this.screenBlue = 0
    this.screenAlpha = 0

    this.helpAlpha = 0

    this.phase = "fadeToBlack"
    this.lastPhase = ""
  }

  /**
   * @param {number} time 
   */
  think(time) {
    super.think(time)

    const timeSinceCreation = time - this.timeCreated

    if (timeSinceCreation < 3000) {
      //fade to black
      this.screenAlpha = timeSinceCreation / 3000
    } else if (timeSinceCreation > 3000 && timeSinceCreation < 6000) {
      //do transition stuff
      this.phase = "main"
      this.screenRed = lerp(0, 170, ilerp(3000, 6000, timeSinceCreation))
      this.screenGreen = 0
      this.screenBlue = lerp(0, 170, ilerp(3000, 6000, timeSinceCreation))

      this.helpAlpha = ilerp(3000, 6000, timeSinceCreation)
    } else if (timeSinceCreation > 6000 && timeSinceCreation < 10000) {
      //show help
      this.phase = "help"
    } else if (timeSinceCreation > 10000 && timeSinceCreation < 13000) {
      //fade from black into visible
      this.phase = "fadeOut"
      this.screenAlpha = ilerp(13000, 10000, timeSinceCreation)
      this.helpAlpha = ilerp(13000, 10000, timeSinceCreation)
    } else if (timeSinceCreation > 13000) {
      //idk i forgor
      this.phase = "exit"
      this.screenAlpha = 0
    }

    if (this.phase != this.lastPhase) {
      this.onPhaseChange(this.phase)
    }

    this.lastPhase = this.phase
  }

  /**
   * 
   * @param {"fadeToBlack" | "main" | "fadeOut" | "exit"} phase 
   */
  onPhaseChange(phase) {
    switch (phase) {
      case "fadeToBlack":
        break;
      case "main":
        const game = Game.gameInstance
        const world = game.world

        world.getPlayer().location = new vector2(95.5, 100.5)
        world.getPlayer().holding = null

        game.isRecording = false

        world.replay.playbackTimeStart = game.lastRanTime + 11000

        const playerId = Object.keys(world.replay.snapshots[0].playerSnapshots)[0]

        const nonPlayerSnapshots = Object.values(world.replay.snapshots[0].nonPlayerSnapshots)
        for (const snapshot of nonPlayerSnapshots) {
          const entity = world.getEntity(snapshot.id)
          entity.playbackId = snapshot.id
        }

        world.playerReplayer = new PlayerReplay(playerId)
        world.addEntity(world.playerReplayer)

        /** @type {Ritual} */
        const overworldRitual = world.rituals[0]
        overworldRitual.slots.forEach(slot => slot.occupied = false)
        overworldRitual.allOccupiedTime = -1
        overworldRitual.allDone = false

        world.addEntity(new Ritual(world, new vector2(105, 100), 8, false))
        world.addEffect(new GhostMoveAreaEffect())

        world.isOverworld = false

        // spawning skulls
        const center = new vector2(world.width / 2, world.height / 2)
        for (let y = 0; y < world.height; y++) {
          for (let x = 0; x < world.width; x++) {
            const loc = new vector2(x, y)
            const index = x + y * world.width

            if (world.aboveTiles[index] == null && loc.distance(center) > 10) {
              if (Math.random() < 0.1) {
                world.addEntity(new Skull(x + Math.random(), y + Math.random()))
              }
            }

            if (world.tiles[index] == "concrete") {
              world.tiles[index] = "ghost_concrete"
            } else {
              world.tiles[index] = `ghost_grass${Math.floor(Math.random() * 3)}`
            }

            if (world.aboveTiles[index] == "tree") {
              world.aboveTiles[index] = `ghost_${world.aboveTiles[index]}`
            }
          }
        }

        //TODO: swtich all textures to ghost world textures
        break
      case "exit":
        Game.gameInstance.world.removeEffect(this.id)
        break
      default:
        break
    }
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  preRender(time, ctx, canvas) {
    super.preRender(time, ctx, canvas)
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    ctx.fillStyle = `rgba(${this.screenRed}, ${this.screenGreen}, ${this.screenBlue}, ${this.screenAlpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = "30px Arial"
    ctx.textAlign = "center"

    ctx.fillStyle = `rgba(255,255,255,${this.helpAlpha})`
    let textOffset = 0
    ctx.fillText("Rise... Rise to the ghost realm...", canvas.width / 2, canvas.height / 2 + textOffset * 30)
    textOffset++
    ctx.fillText("Collect candles and skulls to complete your summoning ritual...", canvas.width / 2, canvas.height / 2 + textOffset * 30)
    textOffset++
    ctx.fillText("Complete your ritual before your physical body or you'll die...", canvas.width / 2, canvas.height / 2 + textOffset * 30)
    textOffset++
    ctx.fillText("Don't stray too far away from your physical body...", canvas.width / 2, canvas.height / 2 + textOffset * 30)
  }
}