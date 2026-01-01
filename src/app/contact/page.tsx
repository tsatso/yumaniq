import site from "../../../content/site.json";
import { Section } from "@/components/Section";

export default function ContactPage() {
  const s = site as any;

  return (
    <main>
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
