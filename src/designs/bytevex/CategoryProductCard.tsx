"use client";

import Link from "next/link";
import { ArrowLeftRight, Check, Heart, ImageOff, ShoppingCart, Star, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { exVat, money } from "@/lib/catalogue";
import { AddToBasketButton, WishlistButton } from "@/components/interactive";
import { useHref } from "@/lib/design-context";
import { useCompare } from "@/lib/basket";
import styles from "./category-grid.module.css";

export default function CategoryProductCard({ product: p, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const href = useHref();
  const compare = useCompare();
  const available = p.stockStatus !== "out";
  const onSale = Boolean(p.was && p.was > p.price);
  const specs = Object.entries(p.specs).slice(0, 3);
  return <article className={`${styles.card}${layout === "list" ? ` ${styles.listCard}` : ""}`}>
    <div className={styles.media}>
      {onSale ? <span className={styles.badge}>Sale</span> : p.isNew ? <span className={styles.badge}>New</span> : null}
      <Link href={href.product(p.slug)} aria-label={`View ${p.name}`} tabIndex={-1}>
        {p.image ? <img src={p.image} alt="" loading="lazy" width={280} height={280} /> : <span className={styles.placeholder}><ImageOff size={29} /><small>Image unavailable</small></span>}
      </Link>
    </div>
    <div className={styles.details}>
      <div className={styles.rating} aria-label={`${p.rating.toFixed(1)} out of 5 stars from ${p.reviews} reviews`}><span><Star size={14} fill="currentColor" /> {p.rating ? p.rating.toFixed(1) : "New"}</span><small>({p.reviews})</small></div>
      <h3><Link href={href.product(p.slug)} title={p.name}>{p.name}</Link></h3>
      <dl className={styles.specs}>{(specs.length ? specs : [["Type", p.subcategory || p.category]]).map(([key, value]) => <div key={key}><dt title={key}>{key}</dt><dd>{String(value)}</dd></div>)}</dl>
    </div>
    <div className={styles.purchase}>
      <p className={`${styles.stock} ${styles[p.stockStatus]}`}><span />{p.stockStatus === "out" ? "Out of stock" : p.stockStatus === "low" ? `Low stock — ${p.stock} left` : `In stock (${p.stock} available)`}</p>
      <p className={styles.delivery}><Truck size={15} /> Delivery options at checkout</p>
      <div className={styles.price}><strong>{money(p.price)}</strong>{onSale ? <s>{money(p.was!)}</s> : null}</div>
      <div className={styles.vat}><span>Inc. VAT</span><span>{exVat(p.price)} ex. VAT</span></div>
      <div className={styles.buyActions}>
        <AddToBasketButton product={p} disabled={!available} hover className="flex-1! min-h-10! rounded-xl! px-2! text-[13px]! whitespace-nowrap"><ShoppingCart size={14} />{available ? "Add to Cart" : "Out of stock"}</AddToBasketButton>
        <WishlistButton product={p} className={styles.iconBtn} aria-label={`Save ${p.name} to wishlist`}><Heart size={17} /></WishlistButton>
        <button className={styles.iconBtn} type="button" aria-pressed={compare.has(p.id)} aria-label={`${compare.has(p.id) ? "Remove" : "Add"} ${p.name} ${compare.has(p.id) ? "from" : "to"} comparison`} onClick={() => compare.toggle(p)}>{compare.has(p.id) ? <Check size={17} /> : <ArrowLeftRight size={17} />}</button>
      </div>
    </div>
  </article>;
}
