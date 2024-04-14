import Camera from "./camera.js"
import Renderer from "./renderer.js"
import ImagesLoader from "./images_loader.js"
import World from "./world.js"
import Inputs from "./inputs.js"
import Player from "./entities/player.js"
import { ReplaySnapshot } from "./replay.js"
import PlayerReplay from "./entities/playerReplay.js"
import vector2 from "./vector2.js"
import MoveToGhostWorldEffect from "./effects/move_to_ghost_world.js"
import Stick from "./entities/stick.js"
import Skull from "./entities/skull.js"

export default class Game {
  /** @type Game */
  static gameInstance = null

  constructor(imagesLoadCallback) {
    Game.gameInstance = this

    this.isRunning = false

    this.debug = true

    this.mainLoopHandle = -1

    this.inputs = new Inputs()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    this.images = new ImagesLoader(imagesLoadCallback)

    // game loop stuff
    this.lastRanTime = 0
    this.unprocessed = 0
    this.secsPerTick = 1000 / 60
    this.ticks = 0

    this.isRecording = true
    this.replayRecordStart = -1
    this.lastReplayRecord = 0
    this.replayRecordDelay = 100

    this.lastTime = 0
  }

  think(time) {
    const entities = this.world.getEntities()

    const effects = this.world.getEffects()

    if (this.isRecording && time - this.lastReplayRecord > this.replayRecordDelay) {
      this.lastReplayRecord = time

      if (this.replayRecordStart === -1) {
        this.replayRecordStart = time
      }

      const playerSnapshots = {}
      const nonPlayerSnapshots = {}

      for (const [_, entity] of entities) {
        const recordedState = entity.recordState()
        if (recordedState != null) {
          if (entity instanceof Player) {
            playerSnapshots[entity.id] = recordedState
          } else {
            if (!entity.recordLastLocation.equals(entity.location)) {
              nonPlayerSnapshots[entity.id] = recordedState
            }
            if (entity.recordExtraData != null) {
              nonPlayerSnapshots[entity.id] = recordedState
              entity.recordExtraData = null
            }

            entity.recordLastLocation = entity.location.copy()
          }
        }
      }

      const newSnapshot = new ReplaySnapshot(time - this.replayRecordStart, playerSnapshots, nonPlayerSnapshots)

      this.world.replay.snapshots.push(newSnapshot)
    }

    for (const [_, effect] of effects) {
      effect.think(time)
    }

    for (const [_, entity] of entities) {
      entity.think(time)
    }

    if (this.inputs.isKeyPressed("escape")) {
      document.querySelectorAll(".main_menu_button")[0].click()
    }

    if (this.debug) {
      if (this.inputs.isKeyPressed("q")) {
        Game.gameInstance.world.addEffect(new MoveToGhostWorldEffect())
      }

      if (this.inputs.isKeyPressed("e")) {
        const entities = Game.gameInstance.world.getEntities()
        for (const [_, entity] of entities) {
          if (entity instanceof Stick) {
            Game.gameInstance.world.getPlayer().holding = entity
            entity.isBeingHeld = true
            break
          }
        }
      }

      if (this.inputs.isKeyPressed("r")) {
        const skull = new Skull()
        Game.gameInstance.world.addEntity(skull)
        Game.gameInstance.world.getPlayer().holding = skull
        skull.isBeingHeld = true
      }
    }

    for (const [key, keyData] of this.inputs.keys) {
      keyData.isPressed = false
    }

    this.lastTime = time
  }

  render(time) {
    this.renderer.render(time)
  }

  mainLoop(time) {
    if (!this.isRunning) {
      this.render(time)
    } else {
      this.unprocessed += Math.min(60, (time - this.lastRanTime) / this.secsPerTick)
      this.lastRanTime = time

      while (this.unprocessed >= 1) {
        this.ticks++
        this.think(time)
        this.unprocessed -= 1
      }

      this.render(time)
    }

    this.mainLoopHandle = window.requestAnimationFrame((time) => {
      this.mainLoop(time)
    })
  }

  startGame() {
    this.isRunning = true

    this.mainLoopHandle = window.requestAnimationFrame((time) => {
      this.mainLoop(time)
    })
  }

  stopGame() {
    this.isRunning = false

    window.cancelAnimationFrame(this.mainLoopHandle)
  }
}