import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
};

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : [];
  const posts = files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/i, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title || slug),
        date: String(data.date || ""),
        summary: data.summary ? String(data.summary) : undefined
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPost(slug: string): Promise<{ meta: PostMeta; html: string } | null> {
  const fileCandidates = [path.join(BLOG_DIR, `${slug}.md`), path.join(BLOG_DIR, `${slug}.mdx`)];
  const file = fileCandidates.find((f) => fs.existsSync(f));
  if (!file) return null;

  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const html = marked.parse(content) as string;

  return {
    meta: {
      slug,
      title: String(data.title || slug),
      date: String(data.date || ""),
      summary: data.summary ? String(data.summary) : undefined
    },
    html
  };
}
