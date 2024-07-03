import { NearestFilter, DoubleSide, MeshLambertMaterial } from "three";
import { textureLoader } from "./loader";
import tileTexturePath from "../assets/tile.png";

const tileTexture = textureLoader.load(tileTexturePath);

tileTexture.magFilter = NearestFilter;

export const tileMaterial = new MeshLambertMaterial({
  map: tileTexture,
  transparent: true,
});
