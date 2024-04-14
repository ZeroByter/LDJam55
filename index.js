import Game from "./game.js";
import ScreensManager from "./screens_manager.js";
import World from "./world.js";

const screens = new ScreensManager()

screens.setScreen("main_menu")

const loadingContainer = document.querySelector(".images_loading_container")
const loadingBar = document.querySelector(".images_loading_bar")
const loadingText = document.querySelector(".images_loading_text")

const startPlayingButtons = document.querySelectorAll(".start_playing_button")

const disablePlayButtons = () => {
  startPlayingButtons.forEach(button => button.setAttribute("disabled", true))
}
const enablePlayButtons = () => {
  startPlayingButtons.forEach(button => button.removeAttribute("disabled"))
}

disablePlayButtons()

let game = new Game((a) => {
  loadingBar.style.width = `${a * 100}%`
  loadingText.innerHTML = `${Math.round(a * 100)}%`

  if (a == 1) {
    loadingContainer.style.display = "none"
    enablePlayButtons()
  }
})

// screens.setScreen("fuck")
// game.startGame()

for (const button of startPlayingButtons) {
  button.onclick = () => {
    screens.setScreen("meme")
    game.world = new World()

    game.isRecording = true
    game.replayRecordStart = -1
    game.lastReplayRecord = 0
    game.replayRecordDelay = 100

    game.startGame()
  }
}

const mainMenuButtons = document.querySelectorAll(".main_menu_button")
for (const button of mainMenuButtons) {
  button.onclick = () => {
    screens.setScreen("main_menu")
    game && game.stopGame()
  }
}
