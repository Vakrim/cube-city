import { WebGLRenderer } from "three";

export const renderer = new WebGLRenderer({ antialias: false });
renderer.setSize(screen.width, screen.height);
document.body.appendChild(renderer.domElement);
