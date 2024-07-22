import { MeshBasicMaterial } from "three";

export const errorGhostMaterial = new MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.5,
});

export const ghostMaterial = new MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});
