import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { reviewsQuery } from "@/lib/queries";

export const Route = createFileRoute("/avis-client")({
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQuery),
  head: () => ({
    meta: [
      { title: "Customer Reviews | Bank Seized Cars" },
      {
        name: "description",
        content:
          "Real reviews from buyers who purchased bank repossessed cars, trucks and SUVs from us and had them delivered across the United States.",
      },
      { property: "og:title", content: "Customer Reviews | Bank Seized Cars" },
      { property: "og:description", content: "Verified buyer reviews of our repossessed vehicles." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/avis-client" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/avis-client" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { data: reviews } = useSuspenseQuery(reviewsQuery);
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <SiteLayout>
      <PageHero
        breadcrumb="Reviews"
        title="Customer reviews"
        subtitle={`Rated ${average} out of 5 by ${reviews.length} verified buyers.`}
      />
      <div className="container-page grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <blockquote key={review.id} className="rounded-lg border border-border bg-card p-6">
            <p className="text-primary">{"★".repeat(review.rating)}</p>
            <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
            <footer className="mt-4 text-sm font-semibold">
              {review.name} — <span className="text-muted-foreground">{review.location}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </SiteLayout>
  );
}
