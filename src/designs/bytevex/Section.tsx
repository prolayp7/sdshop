import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionProps } from "@/lib/parts";
import ProductCard from "./ProductCard";
import styles from "@/designs/bytevex/home.module.css";

export default function Section({ title, sub, items, link }: SectionProps) {
  if (!items || !items.length) return null;
  return (
    <section className={styles.site}>
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2>{title}</h2>
            {sub ? <p>{sub}</p> : null}
          </div>
          {link ? (
            <Link href={link.href}>
              {link.label} <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>
        <div className={styles.productGrid}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
