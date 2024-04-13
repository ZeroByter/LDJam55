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

export default class Game {
  /** @type Game */
  static gameInstance = null

  constructor() {
    Game.gameInstance = this

    this.inputs = new Inputs()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()
    this.images = new ImagesLoader()

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

    window.requestAnimationFrame((time) => {
      this.mainLoop(time)
    })
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

    if (this.inputs.isKeyPressed("p")) {
      this.isRecording = false

      this.world.replay.playbackTimeStart = time

      const playerId = Object.keys(this.world.replay.snapshots[0].playerSnapshots)[0]

      const nonPlayerSnapshots = Object.values(this.world.replay.snapshots[0].nonPlayerSnapshots)
      for (const snapshot of nonPlayerSnapshots) {
        const entity = this.world.getEntity(snapshot.id)
        entity.playbackId = snapshot.id
      }

      this.world.addEntity(new PlayerReplay(playerId))
    }

    if (this.inputs.isKeyPressed("q")) {
      Game.gameInstance.world.addEffect(new MoveToGhostWorldEffect())
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
    this.unprocessed += Math.min(60, (time - this.lastRanTime) / this.secsPerTick)
    this.lastRanTime = time

    while (this.unprocessed >= 1) {
      this.ticks++
      this.think(time)
      this.unprocessed -= 1
    }

    this.render(time)

    window.requestAnimationFrame((time) => {
      this.mainLoop(time)
    })
  }
}