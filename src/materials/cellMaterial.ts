import { RepeatWrapping, NearestFilter, MeshBasicMaterial } from "three";
import cellTexturePath from "./assets/cell.png";
import { textureLoader } from "./loader";

const cellTexture = textureLoader.load(cellTexturePath);

cellTexture.wrapS = RepeatWrapping;
cellTexture.wrapT = RepeatWrapping;
cellTexture.repeat.set(50, 50);

cellTexture.magFilter = NearestFilter;

export const cellMaterial = new MeshBasicMaterial({
  map: cellTexture,
});
