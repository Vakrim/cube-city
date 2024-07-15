import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Menu } from "../menu/Menu";

export class MenuRenderer {
  init() {
    ReactDOM.createRoot(document.getElementById("gui")!).render(
      <StrictMode>
        <Menu />
      </StrictMode>
    );
  }
}
