import { MeshLambertMaterial, Vector2 } from "three";
import { textureLoader } from "./loader";
import rockTexturePath from "../assets/rock.jpg";
import rockNormalMapPath from "../assets/rock-n.jpg";

const rockTexture = textureLoader.load(rockTexturePath);
const rockNormalMap = textureLoader.load(rockNormalMapPath);

export const rockMaterial = new MeshLambertMaterial({
  map: rockTexture,
  normalMap: rockNormalMap,
  normalScale: new Vector2(1, 1),
});
