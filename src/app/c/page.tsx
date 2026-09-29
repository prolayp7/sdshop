import { notFound, permanentRedirect } from "next/navigation";
import { CategoryView, carriedQuery, categoryMetadata, categoryPath, loadCategory, single, type SearchParams } from "./category-view";

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props) {
  const query = await searchParams;
  const name = single(query.sub) || single(query.cat);
  if (name) {
    const { category } = await loadCategory(name);
    if (!category) notFound();
    permanentRedirect(`${categoryPath(category.slug)}${carriedQuery(query, ["cat", "sub"])}`);
  }
  return categoryMetadata({ category: null, query, canonical: "/c" });
}

export default async function Page({ searchParams }: Props) {
  const query = await searchParams;
  const name = single(query.sub) || single(query.cat);
  if (name) {
    const { category } = await loadCategory(name);
    if (!category) notFound();
    permanentRedirect(`${categoryPath(category.slug)}${carriedQuery(query, ["cat", "sub"])}`);
  }
  const { tree } = await loadCategory("");
  return <CategoryView category={null} tree={tree} query={query} canonical="/c" />;
}