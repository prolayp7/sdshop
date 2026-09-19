"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, Minus, Package, Plus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { money, exVat } from "@/lib/catalogue";
import { AddToBasketButton, WishlistButton } from "@/components/interactive";
import { useHref } from "@/lib/design-context";
import { useCompare } from "@/lib/basket";
import { openQuickView } from "@/lib/quickview";

export default function CategoryProductCard({ product: p }: { product: Product }) {
  const href = useHref();
  const compare = useCompare();
  const [qty, setQty] = useState(1);
  const badge = p.was && p.was > p.price ? `Save ${money(p.was - p.price)}` : p.isNew ? "New" : null;
  const stockText = p.stockStatus === "out" ? "Out of Stock" : p.stockStatus === "low" ? `Low Stock — ${p.stock} left` : `${p.stock} In Stock`;
  return <article className="category-product">
    <div className="cp-head">
      <span className="cp-brand"><i />{p.brand}<em>{p.subcategory || p.category}</em></span>
      <label className="cp-cmp"><input type="checkbox" checked={compare.has(p.id)} onChange={() => compare.toggle(p)} aria-label={`Compare ${p.name}`} />CMP</label>
      <WishlistButton product={p} className="cp-wish category-wishlist" aria-label={`Save ${p.name} to wishlist`}><Heart size={14} /></WishlistButton>
    </div>
    <div className="category-product-visual">
      {badge ? <span className="category-product-badge">{badge}</span> : null}
      <Link href={href.product(p.slug)} aria-label={p.name}>
        {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.name} loading="lazy" width={280} height={260} />
        ) : <div className="category-image-placeholder"><Package size={52} /><span>Image unavailable</span></div>}
      </Link>
    </div>
    {Object.keys(p.specs).length > 0 ? <dl className="category-product-specs">{Object.entries(p.specs).slice(0, 3).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl> : null}
    <div className="category-product-info">
      <div className="cp-meta"><span>SKU: {p.sku}</span>{p.reviews > 0 ? <span className="cp-rating" aria-label={`${p.rating} out of 5, ${p.reviews} reviews`}><Star size={11} fill="currentColor" /><b>{p.rating.toFixed(1)}</b> ({p.reviews})</span> : null}</div>
      <h3><Link href={href.product(p.slug)}>{p.name}</Link></h3>
    </div>
    <div className="category-product-buy">
      <div className="cp-pricebox">
        <div className="category-product-price"><strong>{money(p.price)}</strong><span>inc VAT</span>{p.was && p.was > p.price ? <s>{money(p.was)}</s> : null}</div>
        <div className="cp-pricefoot"><span className="cp-ex">Ex VAT: {exVat(p.price)}</span><span className={`category-stock ${p.stockStatus}`}><i />{stockText}</span></div>
      </div>
      <div className="category-product-actions">
        <div className="cp-qty"><button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={11} /></button><span aria-live="polite">{qty}</span><button type="button" aria-label="Increase quantity" onClick={() => setQty(qty + 1)}><Plus size={11} /></button></div>
        <AddToBasketButton product={p} qty={qty} disabled={p.stockStatus === "out"} hover className="flex-1!"><ShoppingCart size={15} />{p.stockStatus === "out" ? "Out of stock" : "Quick Add"}</AddToBasketButton>
        <button type="button" aria-label={`Quick view ${p.name}`} className="category-view-product" onClick={() => openQuickView(p.id)}><Eye size={16} /></button>
      </div>
    </div>
  </article>;
}
