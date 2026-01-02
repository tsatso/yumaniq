import { Section } from "@/components/Section";
import site from "../../../content/site.json";

export default function Privacy() {
  const s = site as any;
  return (
    <main>
      <Section kicker="Legal" title="Privacy Policy" backgroundImage={s.problem.backgroundImage} watermarkOpacity={0.04}>
        <div className="max-w-3xl space-y-4 text-white/85">
          <p>Placeholder. Actual privacy policy to be added.</p>
        </div>
      </Section>
    </main>
  );
}
