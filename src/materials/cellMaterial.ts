import {
  RepeatWrapping,
  NearestFilter,
  MeshBasicMaterial,
  MeshLambertMaterial,
} from "three";
import cellTexturePath from "../assets/cell.png";
import { textureLoader } from "./loader";
import { WORLD_MAP_SIZE } from "../WorldMap";

const cellTexture = textureLoader.load(cellTexturePath);

cellTexture.wrapS = RepeatWrapping;
cellTexture.wrapT = RepeatWrapping;
cellTexture.repeat.set(WORLD_MAP_SIZE, WORLD_MAP_SIZE);

cellTexture.magFilter = NearestFilter;

export const cellMaterial = new MeshLambertMaterial({
  map: cellTexture,
});
