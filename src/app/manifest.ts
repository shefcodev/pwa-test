import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PWA Spike",
    short_name: "PWA Spike",
    description: "PWA for testing push notificaions with Nextjs",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon (192_192).png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon (512_512).png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
