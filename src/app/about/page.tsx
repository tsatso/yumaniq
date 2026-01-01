import site from "../../../content/site.json";
import { Section } from "@/components/Section";

export default function AboutPage() {
  const s = site as any;

  const founder = s.team?.founder;
  const chief = s.team?.chiefScientist;

  return (
    <main>
      <Section
        kicker={s.about?.kicker ?? "About"}
        title={s.about?.headline ?? "About Yumaniq"}
        backgroundImage={s.team?.backgroundImage}
        watermarkOpacity={0.06}
        washOpacity={s.team?.washOpacity ?? 0.55}
        blurPx={s.team?.blurPx ?? 0}
        position={s.team?.position ?? "center"}
      >
        {s.about?.intro ? (
          <p className="max-w-3xl text-white/80">{s.about.intro}</p>
        ) : null}

        <div className="mt-8 max-w-3xl space-y-4">
          {/* Founding team */}
          <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
            <div className="text-sm font-semibold">
              {s.team?.foundingTitle ?? "Founding team"}
            </div>

            {/* Founder */}
            {founder ? (
              <div className="mt-5">
                <div className="text-sm font-semibold">{founder.name}</div>
                <div className="mt-1 text-sm text-white/70">{founder.role}</div>
                <p className="mt-3 text-sm text-white/80">{founder.bio}</p>
              </div>
            ) : null}

            {/* Divider */}
            {founder && chief ? <div className="my-6 h-px bg-white/10" /> : null}

            {/* Chief Scientist */}
            {chief ? (
              <div>
                <div className="text-sm font-semibold">{chief.name}</div>
                <div className="mt-1 text-sm text-white/70">{chief.role}</div>
                <p className="mt-3 text-sm text-white/80">{chief.bio}</p>
              </div>
            ) : null}

            {/* Safety fallback if keys are missing */}
            {!founder && !chief ? (
              <p className="mt-4 text-sm text-white/70">
                Team details are not configured in site.json.
              </p>
            ) : null}
          </div>

          {/* Collaborations */}
          {s.team?.collaborations?.length ? (
            <div className="rounded-2xl border border-white/15 bg-white/7 p-6">
              <div className="text-sm font-semibold">Research collaborations</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                {s.team.collaborations.map((c: string) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>
    </main>
  );
}