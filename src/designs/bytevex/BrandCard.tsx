"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandSummary } from "@/lib/types";
import { money } from "@/lib/catalogue";
import { useHref } from "@/lib/design-context";
import styles from "@/designs/bytevex/home.module.css";

export default function BrandCard({ brand: b }: { brand: BrandSummary }) {
  const href = useHref();
  return (
    <Link className={styles.brandCard} href={href.brand(b.slug)}>
      {b.logo ? (
        <span className={styles.brandMark}><Image src={b.logo} alt={b.logoAlt || ""} width={36} height={36} unoptimized className="h-full w-full object-contain" /></span>
      ) : (
        <span className={styles.brandMark}>{b.brand.slice(0, 2).toUpperCase()}</span>
      )}
      <h3>{b.brand}</h3>
      <p>{b.note.length > 96 ? b.note.slice(0, 94) + "…" : b.note}</p>
      <span className={styles.brandMeta}>
        <span><b>{b.count}</b> products</span>
        <span><b>{b.rating.toFixed(1)}</b>★</span>
        <span>from <b>{money(b.min).replace(".00", "")}</b></span>
      </span>
    </Link>
  );
}
