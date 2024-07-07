import { MeshLambertMaterial, Vector2 } from "three";
import { textureLoader } from "./loader";
import woodTexturePath from "../assets/wood.jpg";
import woodNormalMapPath from "../assets/wood-n.jpg";

const woodTexture = textureLoader.load(woodTexturePath);
const woodNormalMap = textureLoader.load(woodNormalMapPath);

export const woodMaterial = new MeshLambertMaterial({
  map: woodTexture,
  normalMap: woodNormalMap,
  normalScale: new Vector2(1, 1),
});
