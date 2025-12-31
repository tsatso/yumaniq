import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { Section } from "@/components/Section";
import site from "../../../content/site.json";

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const s = site as any;

  return (
    <main>
      <Section kicker="Insights" title="Insights" backgroundImage={s.technology.backgroundImage} watermarkOpacity={0.06}>
        <div className="max-w-3xl space-y-6">
          {posts.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Link href={`/blog/${p.slug}`} className="text-lg font-semibold hover:underline">
                {p.title}
              </Link>
              <div className="mt-1 text-xs text-white/60">{p.date}</div>
              {p.summary ? <p className="mt-3 text-sm text-white/80">{p.summary}</p> : null}
            </div>
          ))}
          {!posts.length ? <p className="text-white/70">No posts yet.</p> : null}
        </div>
      </Section>
    </main>
  );
}
