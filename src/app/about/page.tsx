import site from "../../../content/site.json";
import { Section } from "@/components/Section";

export default function AboutPage() {
  const s = site as any;

  return (
    <main>
      <Section kicker="About" title="About Yumaniq" backgroundImage={s.team.backgroundImage} watermarkOpacity={0.06}>
        <div className="max-w-3xl space-y-6 text-white/85">
          <p>
            Yumaniq builds motor intelligence infrastructure for Physical AI — focusing on transfer across changing environments,
            safety constraints, and personalization to each user.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">{s.team.headline}</div>
            <div className="mt-1 text-sm text-white/70">{s.team.role}</div>
            <p className="mt-4 text-sm text-white/80">{s.team.bio}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Research collaborations</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              {s.team.collaborations.map((c: string) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
