import React from "react";
import { SectionBackground } from "./SectionBackground";

type Props = {
  id?: string;
  kicker?: string;
  title?: string;
  children: React.ReactNode;
  backgroundImage?: string;
  watermarkOpacity?: number;
  washOpacity?: number;
  blurPx?: number;
  position?: string;
};

export function Section({
  id,
  kicker,
  title,
  children,
  backgroundImage,
  watermarkOpacity = 0.16,
  washOpacity = 0.25,
  blurPx = 2,
  position
}: Props) {
  return (
    <section id={id} className="relative isolate py-16 md:py-24 border-b border-white/10">
      <SectionBackground
        image={backgroundImage}
        opacity={watermarkOpacity}
        washOpacity={washOpacity}
        blurPx={blurPx}
        position={position || "center"}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {kicker ? (
          <div className="text-sm uppercase tracking-[0.22em] text-white/75">{kicker}</div>
        ) : null}
        {title ? (
          <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
