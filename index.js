import Game from "./game.js";
import ScreensManager from "./screens_manager.js";
import World from "./world.js";

const screens = new ScreensManager()

screens.setScreen("main_menu")

let game = new Game()

const startPlayingButtons = document.querySelectorAll(".start_playing_button")
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
