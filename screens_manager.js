export default class ScreensManager {
  constructor() {

  }

  setScreen(name, data) {
    /** @type {HTMLDivElement[]} */
    const screens = document.querySelectorAll(".screens > div")

    for (const screen of screens) {
      screen.style.display = "none"
    }

    const screen = document.querySelector(`.screens > .${name}`)
    if (screen) {
      screen.style.display = null
    }
  }
}