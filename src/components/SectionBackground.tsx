import React from "react";

type Props = {
  image?: string;
  opacity?: number;
  blurPx?: number;
  washOpacity?: number;
  position?: string;
};

// Background helper for sections.
// Keeps artwork visible while maintaining readable foreground text.
export function SectionBackground({
  image,
  opacity = 0.18,
  blurPx = 2,
  washOpacity = 0.25,
  position = "center"
}: Props) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Artwork layer */}
      {image ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: position,
            opacity,
            // A little saturation/contrast helps watermarks survive dark themes.
            filter: `blur(${blurPx}px) saturate(1.15) contrast(1.05)`,
            transform: "scale(1.06)"
          }}
        />
      ) : null}

      {/* Dark wash (tunable). Lower values reveal more art. */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(5,7,10,${washOpacity})` }}
      />

      {/* Subtle vignette for readability without killing the art */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 30% 20%, rgba(5,7,10,0.10) 0%, rgba(5,7,10,0.40) 55%, rgba(5,7,10,0.65) 100%)"
        }}
      />
    </div>
  );
}
