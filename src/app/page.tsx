import site from "../../content/site.json";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { SectionBackground } from "@/components/SectionBackground";

export default function HomePage() {
  const s = site as any;

  return (
    <main>
      {/* HERO */}
      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <SectionBackground
          image={s.hero.backgroundImage}
          opacity={s.hero.watermarkOpacity ?? 0.22}
          blurPx={s.hero.blurPx ?? 0}
          washOpacity={s.hero.washOpacity ?? 0.85}
          washType="gradient"
          position={s.hero.position ?? "center right"}
          // Darken bright art a bit
          artBrightness={s.hero.artBrightness ?? 0.58}
          artSaturation={s.hero.artSaturation ?? 0.92}
          artContrast={s.hero.artContrast ?? 1.05}

          // Keep seams hidden
          edgeFade={true}
          edgeFadeStrength={0.90}
        />

        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-widest text-white/70">{s.hero.kicker}</div>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
              {s.hero.headline}
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/85 whitespace-pre-line">
              {s.hero.body}
            </p>
            {s.hero.underTheHood ? (
              <p className="mt-4 text-sm text-white/70 whitespace-pre-line">{s.hero.underTheHood}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={s.hero.primaryCta.href} variant="primary">
                {s.hero.primaryCta.label}
              </Button>
              <Button href={s.hero.secondaryCta.href} variant="secondary">
                {s.hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section
        id="problem"
        kicker={s.problem.kicker}
        title={s.problem.headline}
        backgroundImage={s.problem.backgroundImage}
        watermarkOpacity={s.problem.watermarkOpacity}
        washOpacity={s.problem.washOpacity}
        blurPx={s.problem.blurPx}
        position={s.problem.position}
      >
        <div className="max-w-3xl space-y-4 text-white/85">
          {s.problem.body.map((p: string, idx: number) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </Section>

      {/* PRODUCT */}
      <Section
        id="product"
        kicker={s.product.kicker}
        title={s.product.headline}
        backgroundImage={s.product.backgroundImage}
        watermarkOpacity={s.product.watermarkOpacity}
        washOpacity={s.product.washOpacity}
        blurPx={s.product.blurPx}
        position={s.product.position}
      >
        <p className="max-w-3xl text-white/85">{s.product.intro}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {s.product.cards.map((c: any) => (
            <div key={c.title} className="rounded-2xl border border-white/15 bg-white/7 p-6">
              <div className="text-sm font-semibold">{c.title}</div>
              <p className="mt-3 text-sm text-white/80">{c.body}</p>
            </div>
          ))}
        </div>
        {s.product.deepLine ? (
          <p className="mt-6 max-w-3xl text-sm text-white/70">{s.product.deepLine}</p>
        ) : null}
      </Section>

      {/* SOLUTIONS */}
      <Section
        id="solutions"
        kicker={s.solutions.kicker}
        title={s.solutions.headline}
        backgroundImage={s.solutions.backgroundImage}
        watermarkOpacity={s.solutions.watermarkOpacity}
        washOpacity={s.solutions.washOpacity}
        blurPx={s.solutions.blurPx}
        position={s.solutions.position}
      >
        {s.solutions.intro ? (
          <p className="max-w-3xl text-white/85">{s.solutions.intro}</p>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {s.solutions.items.map((it: any) => (
            <div key={it.title} className="rounded-2xl border border-white/15 bg-white/7 p-6">
              <div className="text-sm font-semibold">{it.title}</div>
              <p className="mt-3 text-sm text-white/80">{it.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TECHNOLOGY */}
      <Section
        id="technology"
        kicker={s.technology.kicker}
        title={s.technology.headline}
        backgroundImage={s.technology.backgroundImage}
        watermarkOpacity={s.technology.watermarkOpacity}
        washOpacity={s.technology.washOpacity}
        blurPx={s.technology.blurPx}
        position={s.technology.position}
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-white/85">
          {s.technology.bullets.map((b: string) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-white/85">{s.technology.closing}</p>
      </Section>

      {/* TEAM */}
      <Section
        id="team"
        kicker={s.team.kicker}
        title={s.team.headline}
        backgroundImage={s.team.backgroundImage}
        watermarkOpacity={s.team.watermarkOpacity}
        washOpacity={s.team.washOpacity}
        blurPx={s.team.blurPx}
        position={s.team.position}
      >
           {/* Founding team */}
          <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
            <div className="text-sm font-semibold">
              {"Founding team"}
            </div>

            {/* Founder */}
            
              <div className="mt-5">
                <div className="text-sm font-semibold">{"Nitsan Sharon"}</div>
                <div className="mt-1 text-sm text-white/70">{"Founder and CEO"}</div>
                <p className="mt-3 text-sm text-white/80">{"I have spent decades building high-reliability systems where correctness and operational reality matter. Today I apply that mindset to Physical AI, turning rigorous movement science into software that can run in the loop, safely and measurably, in the real world."}</p>
              </div>
           

            {/* Divider */}
            <div className="my-6 h-px bg-white/10" /> 

            {/* Chief Scientist */}
            
              <div>
                <div className="text-sm font-semibold">{"Tomer Sela"}</div>
                <div className="mt-1 text-sm text-white/70">{"Chief Scientist"}</div>
                <p className="mt-3 text-sm text-white/80">{"I am an MSc in Mechanical Engineering from the Technion BCI Lab, focused on motor control. I bridge scientific rigor with practical implementation, drawing on R&D experience at Rafael on mission-critical autonomous systems."}</p>
              </div>
            

     
          </div>
                    {/* Collaborations */}
          {s.team.collaborations?.length ? (
            <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
              <div className="text-sm font-semibold">Research collaborations</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                {s.team.collaborations.map((c: string) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

         </Section>
      {/* CONTACT */}
      <Section
        id="contact"
        kicker={s.contact.kicker}
        title={s.contact.headline}
        backgroundImage={s.contact.backgroundImage}
        watermarkOpacity={s.contact.watermarkOpacity}
        washOpacity={s.contact.washOpacity}
        blurPx={s.contact.blurPx}
        position={s.contact.position}
      >
        <div className="max-w-3xl">
          <p className="text-white/85">{s.contact.line}</p>
          <p className="mt-4 text-sm">
            <a className="text-white underline underline-offset-4" href={`mailto:${s.contact.email}`}>
              {s.contact.email}
            </a>
          </p>
        </div>
      </Section>
    </main>
  );
}
