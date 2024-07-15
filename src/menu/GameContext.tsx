import { createContext } from "react";
import { Game } from "../Game";


export const GameContext = createContext<Game | null>(null);
