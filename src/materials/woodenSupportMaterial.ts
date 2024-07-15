import { MeshLambertMaterial, NearestFilter } from "three";
import { textureLoader } from "./loader";
import sideTexturePath from "../assets/wooden-support-side.png";
import topTexturePath from "../assets/wooden-support-top.png";
import bottomTexturePath from "../assets/wooden-support-bottom.png";

function getMaterialFromPath(path: string) {
  const texture = textureLoader.load(path);

  texture.magFilter = NearestFilter;

  return new MeshLambertMaterial({
    map: texture,
    transparent: true,
    side: 2,
  });
}

const sideMaterial = getMaterialFromPath(sideTexturePath);
const topMaterial = getMaterialFromPath(topTexturePath);
const bottomMaterial = getMaterialFromPath(bottomTexturePath);

export const woodSupportMaterials = [
  sideMaterial,
  sideMaterial,
  topMaterial,
  bottomMaterial,
  sideMaterial,
  sideMaterial,
];
