import { notFound } from "next/navigation";
import { CategoryView, categoryMetadata, categoryPath, loadCategory, type SearchParams } from "../category-view";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

async function resolve(slug: string) {
  const result = await loadCategory(slug);
  const category = result.category;
  if (!category) notFound();
  return { tree: result.tree, category };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const { category } = await resolve(slug);
  return categoryMetadata({ category, query, canonical: categoryPath(category.slug) });
}

export default async function Page({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const { category, tree } = await resolve(slug);
  return <CategoryView category={category} tree={tree} query={query} canonical={categoryPath(category.slug)} />;
}