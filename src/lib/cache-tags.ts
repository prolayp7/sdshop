export const CacheTags = {
  homepage: "homepage",
  settings: "settings",
  menus: "menus",
  categories: "categories",
  category: (id: number) => `category:${id}`,
  categorySlug: (slug: string) => `category-slug:${slug}`,
  products: "products",
  attributes: "attributes",
  product: (id: number) => `product:${id}`,
  productSlug: (slug: string) => `product-slug:${slug}`,
  brands: "brands",
  brand: (id: number) => `brand:${id}`,
  brandSlug: (slug: string) => `brand-slug:${slug}`,
  cmsPageSlug: (slug: string) => `cms-page-slug:${slug}`,
  faqs: "faqs",
  testimonials: "testimonials",
} as const;

const FIXED_TAGS = new Set(["homepage", "settings", "menus", "categories", "products", "attributes", "brands", "faqs", "testimonials"]);
const RESOURCE_TAG = /^(category|product|brand)(-slug)?:[a-z0-9-]{1,200}$|^cms-page-slug:[a-z0-9-]{1,200}$/;

export function isKnownCacheTag(tag: unknown): tag is string {
  return typeof tag === "string" && (FIXED_TAGS.has(tag) || RESOURCE_TAG.test(tag));
}

const FIXED_PATHS = new Set(["/", "/brands", "/c", "/deals", "/faqs", "/testimonials"]);
const SLUG = "[a-z0-9][a-z0-9-]{0,199}";
const PUBLIC_PATHS = [
  new RegExp(`^/brand/${SLUG}$`),
  new RegExp(`^/c/${SLUG}(?:/${SLUG})*$`),
  new RegExp(`^/pages/${SLUG}$`),
  new RegExp(`^/product/${SLUG}$`),
];

export function isRevalidatablePath(path: unknown): path is string {
  return typeof path === "string" && path.length <= 300 && (FIXED_PATHS.has(path) || PUBLIC_PATHS.some((pattern) => pattern.test(path)));
}