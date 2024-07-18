import { CanvasTexture, MeshLambertMaterial } from "three";

function createTextCanvas(text: string) {
  const offscreenCanvas = new OffscreenCanvas(50, 50);
  const ctx = offscreenCanvas.getContext("2d");

  if (!ctx) {
    throw new Error("2d context not supported");
  }

  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 25, 25);

  const texture = new CanvasTexture(offscreenCanvas);

  return new MeshLambertMaterial({
    map: texture,
    transparent: true,
  });
}

export const numberMaterials = Array.from({ length: 10 }, (_, i) =>
  createTextCanvas(i.toString()),
);
