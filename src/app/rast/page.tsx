import site from "../../../content/site.json";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";

export default function RastPage() {
  const s = site as any;

  return (
    <main>
      <Section kicker="RAST" title="RAST: Robotic Adaptive Skill Transfer" backgroundImage={s.product.backgroundImage} watermarkOpacity={0.09}>
        <div className="max-w-3xl space-y-4 text-white/85">
          <p>
            Skilled movement breaks when conditions change: a different body after surgery, a different gravity in space, a different acoustic on stage.
          </p>
          <p>
            RAST captures the motor strategy behind expert performance and regenerates it for new conditions. Not by copying movement, but by preserving what the movement was trying to achieve.
          </p>
          <p>
            RAST is grounded in optimal control: the same foundations behind spacecraft guidance and precision robotics.
            We apply that rigor to motor behavior and real-time execution.
          </p>
          <p className="font-medium text-white/95">
            This is motor intelligence infrastructure: One extraction. Any dynamics.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Packaging</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              <li><span className="font-medium text-white/90">Intent Studio</span>: produce an intent package from demonstrations (cost structure + constraints)</li>
              <li><span className="font-medium text-white/90">RAST Runtime</span>: on-device integration alongside the existing control stack</li>
              <li><span className="font-medium text-white/90">Safety Guardian</span>: deterministic constraints + monitoring + audit logs</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button href="/#solutions" variant="secondary">
              See it work →
            </Button>
            <a
              href="https://www.linkedin.com/pulse/physics-intelligent-movement-series-index-1-8-nitsan-sharon-shdqf/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition border border-white/25 text-white hover:border-white/45"
            >
              The science →
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
