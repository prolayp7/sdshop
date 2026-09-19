"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftRight, Heart, Maximize2, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/catalogue";
import { useHref } from "@/lib/design-context";
import { useCompare } from "@/lib/basket";
import { openQuickView } from "@/lib/quickview";
import { AddToBasketButton, WishlistButton } from "@/components/interactive";
import CardVisual from "./CardVisual";
import styles from "@/designs/bytevex/home.module.css";

export default function ProductCard({ product }: { product: Product }) {
  const href = useHref();
  const compare = useCompare();
  const out = product.stockStatus === "out";
  const onSale = product.was && product.was > product.price;
  const kind = product.name.toLowerCase().includes("micro") ? "micro" : product.name.toLowerCase().includes("cfexpress") ? "cf" : "sd";
  const specs = Object.entries(product.specs).filter(([key]) => !["brand", "category"].includes(key.toLowerCase())).slice(0, 3);
  return <article className={styles.pc}>
    <div className={styles.pcMedia}>
      <Link href={href.product(product.slug)} className={styles.pcImage + (product.image ? "" : " " + styles.pcNoImg)} aria-label={product.name} tabIndex={-1}>
        {product.image ? <Image src={product.image} alt="" fill sizes="(max-width:700px) 50vw, 25vw" unoptimized /> : <CardVisual kind={kind} />}
      </Link>
      <div className={styles.pcCopy}>
        <span className={styles.pcBrand}>{product.brand}{product.subcategory ? ` · ${product.subcategory}` : ""}</span>
        <h3><Link href={href.product(product.slug)}>{product.name}</Link></h3>
        <p className={styles.pcPrice}><strong>{money(product.price)}</strong>{onSale ? <s>{money(product.was!)}</s> : null}</p>
      </div>
      <div className={styles.pcFoot}>
        <div>
          <span className={styles.pcStock + (out ? " " + styles.pcOut : "")}><i />{out ? "Out of stock" : product.stockStatus === "low" ? "Low stock" : "In stock"}</span>
          <span className={styles.pcSku}>SKU: {product.sku}</span>
        </div>
        <button type="button" className={styles.pcExpand} aria-label={`Quick view ${product.name}`} onClick={() => openQuickView(product.id)}><Maximize2 size={18} /></button>
      </div>
    </div>
    <div className={styles.pcBody}>
      <div className={styles.pcRating}>
        {product.reviews > 0 ? <span aria-label={`${product.rating} out of 5, ${product.reviews} reviews`}><Star size={14} fill="currentColor" /><b>{product.rating.toFixed(1)}</b> ({product.reviews} reviews)</span> : <span>No reviews yet</span>}
        {specs[0] ? <span className={styles.pcKey}><b>{specs[0][1]}</b> {specs[0][0]}</span> : null}
      </div>
      {specs.length > 1 ? <ul className={styles.pcSpecs}>{specs.slice(1).map(([key, value]) => <li key={key}><b>{value}</b> {key}</li>)}</ul> : null}
      <div className={styles.pcActions}>
        <AddToBasketButton product={product} disabled={out} hover className="flex-1! min-h-11! rounded-xl! text-sm!"><ShoppingBag size={16} /> {out ? "Out of stock" : "Add to Cart"}</AddToBasketButton>
        <WishlistButton product={product} className={styles.pcIcon} aria-label={`Save ${product.name} to wishlist`}><Heart size={17} /></WishlistButton>
        <button type="button" className={styles.pcIcon} aria-pressed={compare.has(product.id)} aria-label={`Compare ${product.name}`} onClick={() => compare.toggle(product)}><ArrowLeftRight size={17} /></button>
      </div>
    </div>
  </article>;
}
