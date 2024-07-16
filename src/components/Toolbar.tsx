import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Menu } from "../toolbar/Root";
import { Game } from "../Game";
import { GameContext } from "../toolbar/GameContext";

export class Toolbar {
  constructor(private game: Game) {}

  init() {
    ReactDOM.createRoot(document.getElementById("gui")!).render(
      <StrictMode>
        <GameContext.Provider value={this.game}>
          <Menu />
        </GameContext.Provider>
      </StrictMode>,
    );
  }
}
