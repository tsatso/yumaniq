import { Section } from "@/components/Section";
import site from "../../../content/site.json";

export default function Privacy() {
  const s = site as any;
  return (
    <main>
      <Section kicker="Legal" title="Privacy Policy" backgroundImage={s.problem.backgroundImage} watermarkOpacity={0.04}>
        <div className="max-w-3xl space-y-6 text-white/85">
          <p>
            Yumaniq is based in Tel Aviv, Israel. This site is a company website. It has no
            accounts, no logins and no shopping.
          </p>

          <div>
            <h2 className="text-sm font-semibold text-white">What we collect</h2>
            <div className="mt-3 space-y-3">
              <p>
                We use Vercel Web Analytics to count page views and see which pages people
                read. It does not use cookies, does not follow you to other sites, and does not
                identify you. We see aggregate figures such as pages viewed, country, referring site
                and device type.
              </p>
              <p>
                Our hosting provider, Vercel, processes technical request data, including IP
                addresses, to serve the site and protect it from abuse.
              </p>
              <p>
                If you email us, we keep your message and address in order to reply and to continue
                the conversation.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">What we do not do</h2>
            <p className="mt-3">
              We do not sell or share data with advertisers, and we do not build profiles of
              visitors.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Your rights</h2>
            <p className="mt-3">
              Write to{" "}
              <a className="text-white underline underline-offset-4" href={`mailto:${s.contact.email}`}>
                {s.contact.email}
              </a>{" "}
              to ask what we hold about you, to correct it or to have it deleted.
            </p>
          </div>

          <p className="text-sm text-white/60">Last updated September 2026.</p>
        </div>
      </Section>
    </main>
  );
}