import Game from "./game.js";
import ScreensManager from "./screens_manager.js";

const screens = new ScreensManager()

screens.setScreen("main_menu")

const game = new Game()
// game.startGame()

document.querySelector(".start_playing_button").onclick = () => {
  screens.setScreen("img")
  game.startGame()
}