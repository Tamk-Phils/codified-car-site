import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteLayout } from "@/components/SiteLayout";
import { postQuery, postsQuery } from "@/lib/queries";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    try {
      const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
      await context.queryClient.ensureQueryData(postsQuery);
      return { post };
    } catch (e) {
      console.warn("Blog post loader warning:", e);
      return { post: null };
    }
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post?.meta_title ?? post?.title ?? "Article";
    const description = (post?.meta_description ?? post?.excerpt ?? "").slice(0, 158);
    const image = post?.cover_image;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: (post?.keywords ?? []).join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt,
                image: post.cover_image ? [post.cover_image] : undefined,
                datePublished: post.published_at,
                author: { "@type": "Organization", name: post.author },
                publisher: { "@type": "Organization", name: "KJ Autos" },
                keywords: post.keywords?.join(", "),
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useQuery(postQuery(slug));
  const { data: posts = [] } = useQuery(postsQuery);
  if (!post) return null;

  const related = posts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <SiteLayout>
      <article className="container-page max-w-3xl py-12">
        <nav className="text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/blog" className="hover:text-hot">
            Blog
          </Link>{" "}
          / <span className="text-hot">{post.category}</span>
        </nav>
        <h1 className="mt-4 text-3xl leading-tight md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.author} • {formatDate(post.published_at)} • {post.read_minutes} min read
        </p>
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="mt-8 aspect-16/9 w-full rounded-lg object-cover"
          />
        ) : null}

        <div className="prose-article mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {post.keywords?.length ? (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground"
              >
                {keyword}
              </li>
            ))}
          </ul>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="container-page max-w-3xl border-t border-border py-12">
          <h2 className="text-2xl">Keep reading</h2>
          <ul className="mt-6 space-y-4">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: item.slug }}
                  className="font-semibold hover:text-hot"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </SiteLayout>
  );
}
