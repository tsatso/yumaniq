import React from "react";

const baseColor = "rgba(7,10,15,1)";

type Props = {
  image?: string;

  // Artwork controls
  opacity?: number;         // art opacity
  blurPx?: number;
  position?: string;

  // Readability wash
  washOpacity?: number;     // overall dark wash intensity
  washType?: "solid" | "gradient";

  // Make art darker without killing opacity
  artBrightness?: number;   // 0.0 - 1.0 (lower = darker)
  artSaturation?: number;   // 0.0 - 2.0
  artContrast?: number;     // 0.0 - 2.0

  // Seam hiding between sections
  edgeFade?: boolean;       // fade top and bottom to base bg
  edgeFadeStrength?: number; // 0.0 - 1.0
};

export function SectionBackground({
  image,
  opacity = 0.14,
  blurPx = 2,
  position = "center",

  washOpacity = 0,
  washType = "solid",

  artBrightness = 0.65,
  artSaturation = 0.95,
  artContrast = 1.05,

  edgeFade = true,
  edgeFadeStrength = 0.85
}: Props) {
  /*const base = "rgba(7,10,15,1)"; // your dark base*/

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0" style={{ background: "var(--ink-grad)" }} />
      {/* Artwork */}
      {image ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: position,
            opacity,
            filter: [
              blurPx ? `blur(${blurPx}px)` : "",
              `brightness(${artBrightness})`,
              `saturate(${artSaturation})`,
              `contrast(${artContrast})`
            ].filter(Boolean).join(" "),
            transform: "scale(1.04)"
          }}
        />
      ) : null}

      {/* Readability wash */}
      {washType === "gradient" ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,10,15,0.88) 0%, rgba(7,10,15,0.72) 45%, rgba(7,10,15,0.38) 100%)",
            opacity: washOpacity
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: baseColor,
            opacity: washOpacity
          }}
        />
      )}

      {/* Edge fade to hide seams between sections */}
      {edgeFade ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(7,10,15,${edgeFadeStrength}) 0%,
              rgba(7,10,15,0) 25%,
              rgba(7,10,15,0) 75%,
              rgba(7,10,15,${edgeFadeStrength}) 100%
            )`
          }}
        />
      ) : null}
    </div>
  );
}