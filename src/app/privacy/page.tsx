import { Section } from "@/components/Section";
import site from "../../../content/site.json";

export default function Privacy() {
  const s = site as any;
  return (
    <main>
      <Section kicker="Legal" title="Privacy Policy" backgroundImage={s.problem.backgroundImage} watermarkOpacity={0.04}>
        <div className="max-w-3xl space-y-4 text-white/85">
          <p>This is a placeholder. Replace with your actual privacy policy.</p>
        </div>
      </Section>
    </main>
  );
}
