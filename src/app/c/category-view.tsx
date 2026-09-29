import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import CategoryPage from "@/designs/bytevex/CategoryPage";
import { fetchCategoryTree, fetchCategoryBySlug, fetchProducts, fetchHome, type ApiCategory, type ProductListParams } from "@/lib/api";
import { findCategory, plainText } from "@/lib/category";

export type SearchParams = Record<string, string | string[] | undefined>;
export const single = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
export const categoryPath = (slug: string) => `/c/${encodeURIComponent(slug)}`;

export const loadCategory = cache(async (name: string) => {
  const tree = await fetchCategoryTree();
  const node = name ? findCategory(tree, name) : null;
  const detail = node ? await fetchCategoryBySlug(node.slug) : null;
  return { tree, category: node && detail ? { ...node, ...detail, children: node.children } : node };
});

export function carriedQuery(query: SearchParams, drop: string[]) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (!drop.includes(key) && typeof value === "string") params.set(key, value);
  const text = params.toString();
  return text ? `?${text}` : "";
}

const siteOrigin = cache(async () => {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL).origin;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3002";
  const protocol = requestHeaders.get("x-forwarded-proto") === "https" ? "https" : "http";
  return new URL(`${protocol}://${host}`).origin;
});

function parseSchema(value?: string | null): unknown {
  try { return value ? JSON.parse(value) : null; } catch { return null; }
}

export async function categoryMetadata({ category, query, canonical }: { category: ApiCategory | null; query: SearchParams; canonical: string }): Promise<Metadata> {
  const title = category?.metaTitle || category?.pageHeader || category?.title || (single(query.q) ? `Search results for "${single(query.q)}"` : single(query.deals) === "1" ? "Today's Best Deals" : "All products");
  const description = category?.metaDescription || plainText(category?.description);
  return {
    metadataBase: new URL(await siteOrigin()),
    title, description, keywords: category?.metaKeywords || undefined,
    alternates: { canonical },
    robots: { index: category?.isIndexable !== false && !query.deals && !query.q, follow: true },
    openGraph: { type: "website", title: category?.ogTitle || title, description: category?.ogDescription || description, url: canonical,
      images: category?.ogImage ? [{ url: category.ogImage, alt: category.ogImageAlt || title }] : [] },
    twitter: { card: category?.twitterCard === "SUMMARY" ? "summary" : "summary_large_image", title: category?.twitterTitle || title, description: category?.twitterDescription || description,
      images: category?.twitterImage ? [category.twitterImage] : [] },
  };
}

export async function CategoryView({ category, tree, query, canonical }: { category: ApiCategory | null; tree: ApiCategory[]; query: SearchParams; canonical: string }) {
  const q = single(query.q);
  const initialParams: ProductListParams = {
    category: category?.slug, perPage: 12,
    q: q || undefined,
    onSale: single(query.deals) === "1" || undefined,
    sort: single(query.sort) === "price-asc" ? "price_asc" : single(query.sort) === "price-desc" ? "price_desc" : "newest",
  };
  for (const [urlKey, apiKey] of [["min", "priceMin"], ["max", "priceMax"]] as const) {
    const value = single(query[urlKey]);
    if (value && Number.isFinite(Number(value)) && Number(value) >= 0) initialParams[apiKey] = Number(value);
  }
  const [initialProducts, home, origin] = await Promise.all([fetchProducts(initialParams).catch(() => null), fetchHome().catch(() => null), siteOrigin()]);
  const schema = category?.schemaType === "CUSTOM" ? parseSchema(category.customSchema) : {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: category?.pageHeader || category?.title || (single(query.deals) === "1" ? "Today's Best Deals" : "All products"),
    mainEntity: initialProducts ? { "@type": "ItemList", numberOfItems: initialProducts.meta.total,
      itemListElement: initialProducts.items.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: new URL(`/product/${encodeURIComponent(product.slug)}`, origin).href })) } : undefined,
    description: plainText(category?.description), url: new URL(canonical, origin).href,
  };
  const faqSchema = parseSchema(category?.faqSchema) || (category?.faqs?.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: category.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  } : null);
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
    { "@type": "ListItem", position: 2, name: category?.title || (single(query.deals) === "1" ? "Today's Best Deals" : "All products"), item: new URL(canonical, origin).href },
  ] };
  return <>
    {[schema, faqSchema, breadcrumbs].filter(Boolean).map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />)}
    <CategoryPage key={`${canonical}?${JSON.stringify(query)}`} initialProducts={initialProducts} benefits={home?.hero.badges.slice(0, 3) ?? []} category={category} tree={tree} initialMin={single(query.min)} initialMax={single(query.max)} initialSort={single(query.sort)} deals={single(query.deals) === "1"} initialQuery={q} />
  </>;
}