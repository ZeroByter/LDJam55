export default class Inputs {
  constructor() {
    this.keys = new Map()

    window.addEventListener("keydown", e => {
      this.#onKeyDown(e)
    })

    window.addEventListener("keyup", e => {
      this.#onKeyUp(e)
    })
  }

  #onKeyDown(e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }

    let key = e.code.toLowerCase().replace("key", "")
    if (key == " ") key = "space"

    if (!this.keys.has(key)) {
      this.keys.set(key, {
        isPressed: true,
      })
    }
  }

  #onKeyUp(e) {
    let key = e.code.toLowerCase().replace("key", "")
    if (key == " ") key = "space"

    this.keys.delete(key)
  }

  isKeyPressed(key) {
    if (!this.keys.has(key)) {
      return false
    }

    return this.keys.get(key).isPressed
  }

  isKeyDown(key) {
    return this.keys.has(key)
  }
}