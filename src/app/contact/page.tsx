import site from "../../../content/site.json";
import { Section } from "@/components/Section";

export default function ContactPage() {
  const s = site as any;

  return (
    <main>
      <Section kicker={s.contact.kicker} title="Contact" backgroundImage={s.contact.backgroundImage} watermarkOpacity={0.05}>
        <div className="max-w-3xl space-y-4 text-white/85">
          <p>{s.contact.line}</p>
          <p>
            Email:{" "}
            <a className="text-white underline underline-offset-4" href={`mailto:${s.contact.email}`}>
              {s.contact.email}
            </a>
          </p>
        </div>
      </Section>
    </main>
  );
}
