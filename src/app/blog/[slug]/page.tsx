import { getPost, getAllPosts } from "@/lib/posts";
import { Section } from "@/components/Section";
import site from "../../../../content/site.json";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const s = site as any;

  if (!post) {
    return (
      <main>
        <Section kicker="Blog" title="Not found" backgroundImage={s.problem.backgroundImage} watermarkOpacity={0.05}>
          <p className="text-white/75">This post does not exist.</p>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section kicker="Blog" title={post.meta.title} backgroundImage={s.technology.backgroundImage} watermarkOpacity={0.06}>
        <div className="max-w-3xl">
          <div className="text-xs text-white/60">{post.meta.date}</div>
          <article
            className="prose prose-invert mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </Section>
    </main>
  );
}
