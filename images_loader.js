export default class SpritesLoader {
  #globalProgressCallback

  constructor() {
    this.totalImagesCount = 3
    this.#globalProgressCallback = null

    this.images = new Map()

    this.imagesLoaded = false

    this.loadImages();
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
      let newImage = new Image
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
          this.#globalProgressCallback(Object.keys(images).length / totalImageCount)
        }

        resolve()
      }
      newImage.src = path
    })
  }

  loadImages(progressCallback) {
    return new Promise(async resolve => {
      this.#globalProgressCallback = progressCallback

      await this.#loadImage("concrete", "./sprites/concrete.png")

      await this.#loadImage("grass0", "./sprites/grass0.png")
      await this.#loadImage("grass1", "./sprites/grass1.png")
      await this.#loadImage("grass2", "./sprites/grass2.png")

      await this.#loadImage("ritual_center", "./sprites/ritual_center.png")
      await this.#loadImage("ritual_apple", "./sprites/ritual_apple.png")
      await this.#loadImage("ritual_candle", "./sprites/ritual_candle.png")
      await this.#loadImage("ritual_skull", "./sprites/ritual_skull.png")

      await this.#loadImage("tree", "./sprites/tree.png")

      await this.#loadImage("skull", "./sprites/skull.png")

      await this.#loadImage("fire_pit", "./sprites/fire_pit.png")
      await this.#loadImage("fire_pit_lit0", "./sprites/fire_pit_lit0.png")
      await this.#loadImage("fire_pit_lit1", "./sprites/fire_pit_lit1.png")

      await this.#loadImage("stick", "./sprites/stick.png")
      await this.#loadImage("stick_lit0", "./sprites/stick_lit0.png")
      await this.#loadImage("stick_lit1", "./sprites/stick_lit1.png")

      await this.#loadImage("apple", "./sprites/apple.png")
      await this.#loadImage("candle", "./sprites/candle.png")
      await this.#loadImage("candle_lit0", "./sprites/candle_lit0.png")
      await this.#loadImage("candle_lit1", "./sprites/candle_lit1.png")

      await this.#loadImage("player_idle0", "./sprites/player/player_idle0.png")
      await this.#loadImage("player_idle1", "./sprites/player/player_idle1.png")

      await this.#loadImage("player_walk_side0", "./sprites/player/player_walk_side0.png")
      await this.#loadImage("player_walk_side1", "./sprites/player/player_walk_side1.png")

      await this.#loadImage("player_walk_straight0", "./sprites/player/player_walk_straight0.png")
      await this.#loadImage("player_walk_straight1", "./sprites/player/player_walk_straight1.png")

      await this.#loadImage("player_arms_empty_idle0", "./sprites/player/player_arms_empty_idle0.png")
      await this.#loadImage("player_arms_empty_idle1", "./sprites/player/player_arms_empty_idle1.png")
      await this.#loadImage("player_arms_empty_walk_straight", "./sprites/player/player_arms_empty_walk_straight.png")
      await this.#loadImage("player_arms_empty_walk_side", "./sprites/player/player_arms_empty_walk_side.png")

      await this.#loadImage("player_arms_holding_idle0", "./sprites/player/player_arms_holding_idle0.png")
      await this.#loadImage("player_arms_holding_idle1", "./sprites/player/player_arms_holding_idle1.png")
      await this.#loadImage("player_arms_holding_walk_straight", "./sprites/player/player_arms_holding_walk_straight.png")
      await this.#loadImage("player_arms_holding_walk_side", "./sprites/player/player_arms_holding_walk_side.png")


      this.imagesLoaded = true

      resolve()
    })
  }

  getImage(id) {
    return this.images.get(id)
  }
}