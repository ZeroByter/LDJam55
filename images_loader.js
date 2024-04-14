export default class SpritesLoader {
  #globalProgressCallback

  constructor(imagesLoadCallback) {
    this.totalImagesCount = 48
    this.#globalProgressCallback = null

    this.images = new Map()

    this.imagesLoaded = false

    this.loadImages(imagesLoadCallback);
  }

  #getPixels(image) {
    let canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, image.width, image.height)
    canvas = undefined
    ctx = undefined
    return imageData
  }

  #getPixel(data, x, y) {
    let baseIndex = y * (data.width * 4) + x * 4

    return {
      r: data.data[baseIndex],
      g: data.data[baseIndex + 1],
      b: data.data[baseIndex + 2],
      a: data.data[baseIndex + 3]
    }
  }

  #loadImage(id, path, scale = 4) {
    return new Promise(resolve => {
      let newImage = new Image()
      newImage.crossOrigin = "Anonymous"
      newImage.onload = () => {
        let renderWidth = newImage.width * scale
        let renderHeight = newImage.height * scale

        const pixels = this.#getPixels(newImage)

        const canvas = document.createElement('canvas')
        canvas.width = renderWidth
        canvas.height = renderHeight
        const ctx = canvas.getContext("2d")

        for (let y = 0; y < newImage.height; y++) {
          for (let x = 0; x < newImage.width; x++) {
            let pixel = this.#getPixel(pixels, x, y)
            ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a / 255})`
            ctx.fillRect(x * scale, y * scale, Math.ceil(scale), Math.ceil(scale))
          }
        }

        this.images.set(id, canvas)

        if (this.#globalProgressCallback != null) {
          this.#globalProgressCallback(this.images.size / this.totalImagesCount)
        }

        resolve()
      }
      newImage.src = path
    })
  }

  loadImages(progressCallback) {
    return new Promise(async resolve => {
      this.#globalProgressCallback = progressCallback

      this.#loadImage("concrete", "./sprites/concrete.png")
      this.#loadImage("ghost_concrete", "./sprites/ghost_concrete.png")

      this.#loadImage("grass0", "./sprites/grass0.png")
      this.#loadImage("grass1", "./sprites/grass1.png")
      this.#loadImage("grass2", "./sprites/grass2.png")

      this.#loadImage("ghost_grass0", "./sprites/ghost_grass0.png")
      this.#loadImage("ghost_grass1", "./sprites/ghost_grass1.png")
      this.#loadImage("ghost_grass2", "./sprites/ghost_grass2.png")

      this.#loadImage("ritual_center", "./sprites/ritual_center.png")
      this.#loadImage("ritual_apple", "./sprites/ritual_apple.png")
      this.#loadImage("ritual_candle", "./sprites/ritual_candle.png")
      this.#loadImage("ritual_skull", "./sprites/ritual_skull.png")

      this.#loadImage("tree", "./sprites/tree.png")
      this.#loadImage("ghost_tree", "./sprites/ghost_tree.png")

      this.#loadImage("skull", "./sprites/skull.png")

      this.#loadImage("fire_pit", "./sprites/fire_pit.png")
      this.#loadImage("fire_pit_lit0", "./sprites/fire_pit_lit0.png")
      this.#loadImage("fire_pit_lit1", "./sprites/fire_pit_lit1.png")

      this.#loadImage("stick", "./sprites/stick.png")
      this.#loadImage("stick_lit0", "./sprites/stick_lit0.png")
      this.#loadImage("stick_lit1", "./sprites/stick_lit1.png")

      this.#loadImage("ghost_fire_pit_lit0", "./sprites/ghost_fire_pit_lit0.png")
      this.#loadImage("ghost_fire_pit_lit1", "./sprites/ghost_fire_pit_lit1.png")

      this.#loadImage("ghost_stick", "./sprites/ghost_stick.png")
      this.#loadImage("ghost_stick_lit0", "./sprites/ghost_stick_lit0.png")
      this.#loadImage("ghost_stick_lit1", "./sprites/ghost_stick_lit1.png")

      this.#loadImage("apple", "./sprites/apple.png")
      this.#loadImage("ghost_apple", "./sprites/ghost_apple.png")

      this.#loadImage("candle", "./sprites/candle.png")
      this.#loadImage("candle_lit0", "./sprites/candle_lit0.png")
      this.#loadImage("candle_lit1", "./sprites/candle_lit1.png")

      this.#loadImage("ghost_candle", "./sprites/ghost_candle.png")
      this.#loadImage("ghost_candle_lit0", "./sprites/ghost_candle_lit0.png")
      this.#loadImage("ghost_candle_lit1", "./sprites/ghost_candle_lit1.png")

      this.#loadImage("player_idle0", "./sprites/player/player_idle0.png")
      this.#loadImage("player_idle1", "./sprites/player/player_idle1.png")

      this.#loadImage("player_walk_side0", "./sprites/player/player_walk_side0.png")
      this.#loadImage("player_walk_side1", "./sprites/player/player_walk_side1.png")

      this.#loadImage("player_walk_straight0", "./sprites/player/player_walk_straight0.png")
      this.#loadImage("player_walk_straight1", "./sprites/player/player_walk_straight1.png")

      this.#loadImage("player_arms_empty_idle0", "./sprites/player/player_arms_empty_idle0.png")
      this.#loadImage("player_arms_empty_idle1", "./sprites/player/player_arms_empty_idle1.png")
      this.#loadImage("player_arms_empty_walk_straight", "./sprites/player/player_arms_empty_walk_straight.png")
      this.#loadImage("player_arms_empty_walk_side", "./sprites/player/player_arms_empty_walk_side.png")

      this.#loadImage("player_arms_holding_idle0", "./sprites/player/player_arms_holding_idle0.png")
      this.#loadImage("player_arms_holding_idle1", "./sprites/player/player_arms_holding_idle1.png")
      this.#loadImage("player_arms_holding_walk_straight", "./sprites/player/player_arms_holding_walk_straight.png")
      this.#loadImage("player_arms_holding_walk_side", "./sprites/player/player_arms_holding_walk_side.png")


      this.imagesLoaded = true

      resolve()
    })
  }

  getImage(id) {
    return this.images.get(id)
  }
}