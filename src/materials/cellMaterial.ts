import { RepeatWrapping, NearestFilter, MeshLambertMaterial } from "three";
import cellTexturePath from "../assets/cell.png";
import { textureLoader } from "./loader";
import { WORLD_MAP_SIZE } from "../components/WorldMap";

const cellTexture = textureLoader.load(cellTexturePath);

cellTexture.wrapS = RepeatWrapping;
cellTexture.wrapT = RepeatWrapping;
cellTexture.repeat.set(WORLD_MAP_SIZE, WORLD_MAP_SIZE);

cellTexture.magFilter = NearestFilter;

export const cellMaterial = new MeshLambertMaterial({
  map: cellTexture,
});
