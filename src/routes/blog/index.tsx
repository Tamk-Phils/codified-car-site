import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { postsQuery } from "@/lib/queries";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Repo Car Blog | Buying Guides & Auction Advice" },
      {
        name: "description",
        content:
          "Expert guides on buying bank repossessed cars: inspections, titles, financing, shipping and how to spot a genuine repo deal in the USA.",
      },
      { property: "og:title", content: "Repo Car Blog | Bank Seized Cars" },
      {
        property: "og:description",
        content: "Buying guides, inspection checklists and title advice for repossessed vehicles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(posts.map((p) => p.category))].sort();
  const visible = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Blog"
        title="Repossessed car buying guides"
        subtitle="Everything we've learned moving bank repossessions — written for buyers, not for search engines."
      />
      <div className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category === null ? "hero" : "outline"}
            onClick={() => setCategory(null)}
          >
            All ({posts.length})
          </Button>
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "hero" : "outline"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <Link to="/blog/$slug" params={{ slug: post.slug }}>
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-16/9 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-widest text-hot">{post.category}</p>
                <h2 className="mt-2 text-base leading-snug">
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-hot">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatDate(post.published_at)} • {post.read_minutes} min read
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
