import React from "react";

type Props = {
  image?: string;
  opacity?: number;        // background image opacity
  blurPx?: number;         // blur amount in px
  washOpacity?: number;    // dark overlay opacity (0..1)
  position?: string;       // backgroundPosition
};

export function SectionBackground({
  image,
  opacity = 0.14,
  blurPx = 2,
  washOpacity = 0.45,
  position = "center"
}: Props) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Background image */}
      {image ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: position,
            opacity,
            filter: blurPx ? `blur(${blurPx}px)` : undefined,
            transform: blurPx ? "scale(1.04)" : undefined
          }}
        />
      ) : null}

      {/* Dark wash (keeps consistency + readability without killing art) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(5, 7, 10, ${washOpacity})` }}
      />

      {/* Very subtle vignette to keep sections consistent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 30% 20%, rgba(255,255,255,0.05), rgba(0,0,0,0) 55%)"
        }}
      />
    </div>
  );
}