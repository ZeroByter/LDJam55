import Game from "./game.js"

export default class Renderer {
  constructor() {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    window.onresize = (e) => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    this.canvas = canvas
    this.ctx = ctx

    this.debugLines = []
  }

  render(time) {

    if (!Game.gameInstance.images.imagesLoaded) {
      return;
    }

    const canvas = this.canvas
    const ctx = this.ctx

    if (!Game.gameInstance.isRunning) {
      ctx.clearRect(0, 0, 99999, 9999)
      return
    }

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const world = Game.gameInstance.world
    const camera = Game.gameInstance.camera

    const size = camera.scale

    const fraction = size == Math.floor(size) ? 0 : 1
    const entities = world.getEntities()

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        const tileIndex = x + y * world.width

        const tile = world.tiles[tileIndex]

        const drawXY = camera.worldToScreen(x, y)

        const drawX = Math.floor(drawXY.x)
        const drawY = Math.floor(drawXY.y)

        if (drawX + size < 0 || drawY + size < 0 || drawX > canvas.width || drawY > canvas.height) {
          continue
        }

        try {
          ctx.drawImage(Game.gameInstance.images.getImage(tile), drawX, drawY, size + fraction, size + fraction)
        } catch (e) {
          console.error(tile)
          throw e
        }
      }
    }

    for (const [_, entity] of entities) {
      entity.renderBetweenTiles(time, ctx, canvas)
    }

    const effects = world.getEffects()
    for (const [_, effect] of effects) {
      effect.renderBetweenTiles(time, ctx, canvas)
    }

    for (let y = 0; y < world.height; y++) {
      for (let x = 0; x < world.width; x++) {
        const tileIndex = x + y * world.width

        const aboveTile = world.aboveTiles[tileIndex]

        const drawXY = camera.worldToScreen(x, y)

        const drawX = Math.floor(drawXY.x)
        const drawY = Math.floor(drawXY.y)

        if (drawX + size < 0 || drawY + size < 0 || drawX > canvas.width || drawY > canvas.height) {
          continue
        }

        if (aboveTile) {
          const image = Game.gameInstance.images.getImage(aboveTile)
          if (image == null) {
            console.error(`image ${aboveTile} doesnt exist`)
          }
          ctx.drawImage(image, drawX, drawY, size + fraction, size + fraction)
        }
      }
    }

    for (const [_, entity] of entities) {
      entity.render(time, ctx, canvas)
    }

    for (const [_, effect] of effects) {
      effect.preRender(time, ctx, canvas)
    }

    for (const [_, effect] of effects) {
      effect.render(time, ctx, canvas)
    }

    // cool animation thing
    // for (let y = 0; y < world.height; y++) {
    //   for (let x = 0; x < world.width; x++) {
    //     const drawXY = camera.worldToScreen(x, y)

    //     const drawX = Math.floor(drawXY.x)
    //     const drawY = Math.floor(drawXY.y)

    //     if (drawX + size < 0 || drawY + size < 0 || drawX > canvas.width || drawY > canvas.height) {
    //       continue
    //     }

    //     ctx.fillStyle = `hsla(${Math.random() * 360}deg 100% ${time / 100}% / ${time / 10000})`
    //     ctx.fillRect(drawX, drawY, size + fraction, size + fraction)
    //   }
    // }

    ctx.strokeStyle = "red"
    ctx.lineWidth = 2
    for (let i = 0; i < this.debugLines.length / 2; i++) {
      const [p1x, p1y] = this.debugLines[i * 2]
      const [p2x, p2y] = this.debugLines[i * 2 + 1]

      const p1 = Game.gameInstance.camera.worldToScreen(p1x, p1y)
      const p2 = Game.gameInstance.camera.worldToScreen(p2x, p2y)

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }
  }
}