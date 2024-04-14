import Game from "../game.js";
import PlayerAnimationsController from "../player_animations_controller.js";
import { ReplayPlayerSnapshot } from "../replay.js";
import vector2 from "../vector2.js";
import Apple from "./apple.js";
import Candle from "./candle.js";
import Entity from "./entity.js";
import FirePit from "./fire_pit.js";
import Pickable from "./pickable.js";
import Skull from "./skull.js";
import Stick from "./stick.js";

export default class Player extends Entity {
  constructor() {
    super()

    this.animationsController = new PlayerAnimationsController()

    this.sprite = "player_idle1"
    this.handsSprite = "player_arms_empty_idle1"

    this.holdingOffset = 0
    this.flipSprite = false

    this.location = new vector2(95.5, 100.5)
    this.lastLocation = this.location.copy()

    this.holding = null
  }

  think(time) {
    const inputs = Game.gameInstance.inputs

    let speed = this.getMovementSpeed()

    if (inputs.isKeyDown("w")) {
      const oldLocation = this.location.copy()
      this.location.y -= speed
      this.checkCollisions(oldLocation)
    }
    if (inputs.isKeyDown("s")) {
      const oldLocation = this.location.copy()
      this.location.y += speed
      this.checkCollisions(oldLocation)
    }
    if (inputs.isKeyDown("a")) {
      const oldLocation = this.location.copy()
      this.location.x -= speed
      this.checkCollisions(oldLocation)
    }
    if (inputs.isKeyDown("d")) {
      const oldLocation = this.location.copy()
      this.location.x += speed
      this.checkCollisions(oldLocation)
    }

    if (inputs.isKeyPressed("space")) {
      const entities = Game.gameInstance.world.getEntities()

      if (this.holding == null) {
        //not holding anything, find something to pick up

        for (const [_, entity] of entities) {
          if (entity instanceof Pickable && entity.location.distance(this.location.minus(0, 0.5)) < 0.5 && !entity.isBeingHeld) {
            if (entity instanceof Candle && entity.isLit) {
              entity.makeUnlit()
              entity.ritualSlot.occupied = false
            } else {
              this.holding = entity
              entity.isBeingHeld = true
              if (entity.ritualSlot != null) {
                entity.ritualSlot.occupied = false
              }
            }
            break
          }
        }
      } else {
        //holding something, find somewhere to drop it
        this.holding.location = this.location.copy().minus(0, 0.25)
        this.holding.isBeingHeld = false

        if (this.holding instanceof Candle || this.holding instanceof Apple || this.holding instanceof Skull) {
          const rituals = Game.gameInstance.world.rituals
          for (const ritual of rituals) {
            for (const slot of ritual.slots) {
              if (this.holding.location.distance(slot.location.add(0.5, 0.5)) < 0.5) {
                if ((slot.accepts === "candle" && this.holding instanceof Candle) || (slot.accepts === "apple" && this.holding instanceof Apple) || (slot.accepts === "skull" && this.holding instanceof Skull)) {
                  if (!(this.holding instanceof Candle)) {
                    slot.occupied = true
                  }
                  this.holding.ritualSlot = slot
                }
              }
            }
          }
        }

        this.holding = null
      }
    }

    if (this.holding instanceof Stick && this.location.distance(FirePit.Singleton.location.add(0.5, 0.5)) < 1) {
      if (FirePit.Singleton.isLit) {
        this.holding.makeLit()
      } else {
        FirePit.Singleton.makeLit()
        this.holding.location = new vector2(-1, -1)
        this.holding.isBeingHeld = false
        this.holding = null
      }
    }

    if (this.holding instanceof Stick && this.holding.isLit) {
      for (const candle of Game.gameInstance.world.candles) {
        if (!candle.isLit && this.holding.isLit && this.location.distance(candle.location) < 0.75) {
          candle.makeLit()
          this.holding.makeUnlit()
          candle.ritualSlot.occupied = true
          break
        }
      }
    }

    const movedDistance = this.location.minus(this.lastLocation)

    this.animationsController.setAnimationState(movedDistance.y != 0 && movedDistance.x == 0, movedDistance.x != 0, movedDistance.magnitude(), this.holding != null)

    const [sprite, handsSprite, holdingOffset] = this.animationsController.think(time)

    this.sprite = sprite
    this.handsSprite = handsSprite
    this.holdingOffset = holdingOffset
    this.flipSprite = movedDistance.x != 0 && movedDistance.x < 0

    this.lastLocation = this.location.copy()
    Game.gameInstance.camera.location = this.location.copy()
  }

  /**
   * @param {vector2} oldLocation 
   */
  checkCollisions(oldLocation) {
    const world = Game.gameInstance.world

    const rounded = this.location.floor()
    const index = rounded.x + rounded.y * world.width

    if (world.aboveTiles[index] === "tree" || this.location.distance(FirePit.Singleton.location.add(0.5, 0.65)) < 0.6) {
      this.location = oldLocation
    }
  }

  /**
   * @param {vector2} oldLocation 
   */
  getMovementSpeed() {
    const world = Game.gameInstance.world

    const rounded = this.location.floor()
    const index = rounded.x + rounded.y * world.width

    if (world.tiles[index] === "concrete") {
      return 0.175
    } else {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const newLocation = rounded.add(x - 1, y - 1)
          const index = newLocation.x + newLocation.y * world.width
          if (world.tiles[index] === "concrete") {
            return 0.13
          }
        }
      }
    }

    return 0.1
  }

  /**
   * @param {number} time 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   */
  render(time, ctx, canvas) {
    super.render(time, ctx, canvas)

    const { images, camera } = Game.gameInstance

    const drawXY = camera.worldToScreen(this.location.x, this.location.y)
    const scale = camera.scale

    const size = 0.8 * scale

    ctx.save()
    ctx.globalAlpha = Game.gameInstance.world.isOverworld ? 1 : 0.85
    ctx.translate(drawXY.x - size / 2, drawXY.y - size)
    if (this.flipSprite) {
      ctx.translate(size, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(images.getImage(this.sprite), 0, 0, size, size)
    ctx.drawImage(images.getImage(this.handsSprite), 0, 0, size, size)
    ctx.restore()

    if (this.holding) {
      const drawSize = this.holding.spriteSize * scale

      if (this.holding.actualSprite) {
        const image = images.getImage(this.holding.sprite)
        ctx.drawImage(image, drawXY.x - drawSize / 2, drawXY.y - drawSize / 2 - size + this.holdingOffset, drawSize, drawSize)
      } else {
        ctx.fillStyle = this.holding.sprite
        ctx.fillRect(drawXY.x - drawSize / 2, drawXY.y - drawSize / 2 - size + this.holdingOffset, drawSize, drawSize)
      }
    }
  }

  recordState() {
    return new ReplayPlayerSnapshot(this.id, this.location.x, this.location.y, this.holding)
  }

  implementRecordedState(data) {
    this.location = data.location
    this.holding = data.holding
  }
} 