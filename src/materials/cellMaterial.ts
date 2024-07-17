import { RepeatWrapping, NearestFilter, MeshLambertMaterial } from "three";
import cellTexturePath from "../assets/cell.png";
import { textureLoader } from "./loader";

const cellTexture = textureLoader.load(cellTexturePath);

cellTexture.wrapS = RepeatWrapping;
cellTexture.wrapT = RepeatWrapping;
cellTexture.repeat.set(64, 64);

cellTexture.magFilter = NearestFilter;

export const cellMaterial = new MeshLambertMaterial({
  map: cellTexture,
});
