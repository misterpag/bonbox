import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bonbox",
    short_name: "Bonbox",
    description: "Les bons points de l'école, version coffre au trésor.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1b4b",
    theme_color: "#7c3aed",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
