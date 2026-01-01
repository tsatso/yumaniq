import site from "../../content/site.json";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { SectionBackground } from "@/components/SectionBackground";

export default function HomePage() {
  const s = site as any;

  const teamPeople =
    Array.isArray(s.team?.people) && s.team.people.length
      ? s.team.people
      : [{ name: s.team?.headline, role: s.team?.role, bio: s.team?.bio }].filter(
          (p: any) => p?.name || p?.role || p?.bio
        );

  return (
    <main>
    {/* HERO */}
    <section className="relative overflow-hidden py-20 md:py-28 border-b border-white/10">
      <SectionBackground
        image={s.hero.backgroundImage}
        opacity={1}
        blurPx={0}
        washOpacity={0}
        position="center"
      />

      {/* Force content above background stack */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-white/60">{s.hero.kicker}</div>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            {s.hero.headline}
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/85 whitespace-pre-line">
            {s.hero.body}
          </p>
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
      </Section>

      {/* APPLICATIONS */}
      <Section
        id="applications"
        kicker={s.applications.kicker}
        title={s.applications.headline}
        backgroundImage={s.applications.backgroundImage}
        watermarkOpacity={s.applications.watermarkOpacity}
        washOpacity={s.applications.washOpacity}
        blurPx={s.applications.blurPx}
        position={s.applications.position}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {s.applications.items.map((it: any) => (
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
        <div className="max-w-3xl space-y-4">
          {/* Founding team card */}
          <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
            <div className="text-sm font-semibold">Founding team</div>

            {/* Founder */}
            <div className="mt-5">
              <div className="text-sm font-semibold">{s.team.founder?.name}</div>
              <div className="mt-1 text-sm text-white/70">{s.team.founder?.role}</div>
              <p className="mt-3 text-sm text-white/80">{s.team.founder?.bio}</p>
            </div>

            <div className="my-6 h-px bg-white/10" />

            {/* Chief Scientist */}
            <div>
              <div className="text-sm font-semibold">{s.team.chiefScientist?.name}</div>
              <div className="mt-1 text-sm text-white/70">{s.team.chiefScientist?.role}</div>
              <p className="mt-3 text-sm text-white/80">{s.team.chiefScientist?.bio}</p>
            </div>
          </div>

          {/* Collaborations */}
          {s.team.collaborations?.length ? (
            <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
              <div className="text-sm font-semibold">Research collabsdfsdforations</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                {s.team.collaborations.map((c: string) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
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