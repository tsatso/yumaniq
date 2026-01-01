import site from "../../../content/site.json";
import { Section } from "@/components/Section";

export default function RastPage() {
  const s = site as any;

  return (
    <main>
      <Section kicker="RAST" title="RAST: Robotic Adaptive Skill Transfer" backgroundImage={s.product.backgroundImage} watermarkOpacity={0.09}>
        <div className="max-w-3xl space-y-4 text-white/85">
          <p>
            RAST decouples what a system wants to achieve from how it moves.
            Using Inverse Optimal Control, we extract the optimization strategy, the cost structure, behind expert movement.
            This “motor signature” captures intent, not trajectory, enabling transfer across physics changes where imitation learning breaks.
          </p>
          <p>
            RAST is grounded in optimal control: the same foundations behind spacecraft guidance and precision robotics.
            We apply that rigor to motor behavior and real-time execution.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold">Packaging</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              <li><span className="font-medium text-white/90">Intent Studio</span>: produce an intent package from demonstrations (cost structure + constraints)</li>
              <li><span className="font-medium text-white/90">RAST Runtime</span>: on-device integration alongside the existing control stack</li>
              <li><span className="font-medium text-white/90">Safety Guardian</span>: deterministic constraints + monitoring + audit logs</li>
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
