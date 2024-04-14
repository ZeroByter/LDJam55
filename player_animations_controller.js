export default class PlayerAnimationsController {
  constructor(player) {
    this.isHoldingSomething = false

    this.spriteIndex = 0

    this.lastSpriteChange = -1
    this.animationSpeed = 500

    this.animations = new Map()
    this.animations.set("idle", [
      "player_idle0",
      "player_idle1",
    ])
    this.animations.set("walk_straight", [
      "player_walk_straight0",
      "player_walk_straight1",
    ])
    this.animations.set("walk_side", [
      "player_walk_side0",
      "player_walk_side1",
    ])

    this.handAnimations = new Map()
    this.handAnimations.set("idle_empty", [
      "player_arms_empty_idle0",
      "player_arms_empty_idle1",
    ])
    this.handAnimations.set("idle_holding", [
      "player_arms_holding_idle0",
      "player_arms_holding_idle1",
    ])
    this.handAnimations.set("walk_straight_empty", [
      "player_arms_empty_walk_straight",
    ])
    this.handAnimations.set("walk_side_empty", [
      "player_arms_empty_walk_side",
    ])
    this.handAnimations.set("walk_straight_holding", [
      "player_arms_holding_walk_straight",
    ])
    this.handAnimations.set("walk_side_holding", [
      "player_arms_holding_walk_side",
    ])

    this.currentAnimation = "idle"
  }

  changeAnimation(newAnimation) {
    this.currentAnimation = newAnimation
  }

  setAnimationState(isWalkingStraight, isWalkingSide, movementSpeed, isHolding) {
    this.isHoldingSomething = isHolding

    this.animationSpeed = Math.max(80, 500 - movementSpeed * 2000)

    if (isWalkingSide) {
      this.changeAnimation("walk_side")
    } else if (isWalkingStraight) {
      this.changeAnimation("walk_straight")
    } else {
      this.changeAnimation("idle")
    }
  }

  /**
   * @returns {string[]}
   */
  getCurrentAnimation() {
    return this.animations.get(this.currentAnimation)
  }

  /**
   * @returns {string[]}
   */
  getCurrentHandsAnimation() {
    const holdingString = this.isHoldingSomething ? "holding" : "empty"

    return this.handAnimations.get(`${this.currentAnimation}_${holdingString}`)
  }

  getCurrentHandsSprite() {
    const currentHandsAnimation = this.getCurrentHandsAnimation()

    if (this.spriteIndex > currentHandsAnimation.length - 1) {
      return currentHandsAnimation[0]
    }

    return currentHandsAnimation[this.spriteIndex]
  }

  think(time) {
    if (time - this.lastSpriteChange > this.animationSpeed) {
      this.lastSpriteChange = time

      this.spriteIndex++
      if (this.spriteIndex > this.getCurrentAnimation().length - 1) {
        this.spriteIndex = 0
      }
    }

    let holdingOffset = 0
    if (this.currentAnimation == "idle" && this.spriteIndex == 1) {
      holdingOffset = 4
    }

    return [this.getCurrentAnimation()[this.spriteIndex], this.getCurrentHandsSprite(), holdingOffset]
  }
}