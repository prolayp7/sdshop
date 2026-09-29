"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, ChevronRight, Clapperboard, Cpu, CreditCard, Database, Gauge, HardDrive, MemoryStick, MonitorPlay, Package, Plane, ShieldCheck, Smartphone, Zap } from "lucide-react";
import type { ApiMegaMenuContent } from "@/lib/api";
import styles from "./mega-menu.module.css";

const icons = { ArrowRight, BadgeCheck, Camera, Clapperboard, Cpu, CreditCard, Database, Gauge, HardDrive, MemoryStick, MonitorPlay, Package, Plane, ShieldCheck, Smartphone, Zap };
type IconName = keyof typeof icons;
const iconFor = (name: string) => icons[name as IconName] ?? Package;

export default function MegaMenu({ id, content, onNavigate }: { id: string; content: ApiMegaMenuContent; onNavigate: () => void }) {
  return <div id={id} className={styles.menu} aria-label="Shop product categories">
    <div className={styles.columns}>
      {content.sections.map((section) => {
        const HeadingIcon = iconFor(section.icon);
        if (section.id === "capacity") return <section className={styles.capacity} key={section.id} aria-labelledby={`${id}-${section.id}`}>
          <div className={styles.heading}><HeadingIcon size={16} /><h2 id={`${id}-${section.id}`}>{section.title}</h2></div>
          <div className={styles.capacityList}>{section.entries.map((entry, index) => <Link key={`${entry.title}-${index}`} className={`${styles.capacityItem}${entry.featured ? ` ${styles.capacityFeatured}` : ""}`} href={entry.href || "/c"} onClick={onNavigate}><strong>{entry.title}</strong><small>{entry.detail}</small>{entry.badge ? <span><BadgeCheck size={10} />{entry.badge}</span> : null}</Link>)}</div>
          {section.runtimeTitle || section.metrics?.length ? <div className={styles.runtime}><small>{section.runtimeTitle}</small><div>{section.metrics?.map((metric, index) => <span key={`${metric.label}-${index}`}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}</div></div> : null}
        </section>;
        if (section.id === "speed") return <section className={styles.speed} key={section.id} aria-labelledby={`${id}-${section.id}`}>
          <div className={styles.heading}><HeadingIcon size={16} /><h2 id={`${id}-${section.id}`}>{section.title}</h2></div>
          <div className={styles.speedList}>{section.entries.map((entry, index) => <Link key={`${entry.title}-${index}`} href={entry.href || "/c"} onClick={onNavigate}><span className={styles.speedBadge}>{entry.badge || "›"}</span><span><strong>{entry.title}</strong><small>{entry.detail}</small></span><ChevronRight size={14} /></Link>)}</div>
        </section>;
        if (section.id === "devices") return <section className={styles.devices} key={section.id} aria-labelledby={`${id}-${section.id}`}>
          <div className={styles.heading}><HeadingIcon size={16} /><h2 id={`${id}-${section.id}`}>{section.title}</h2></div>
          <div className={styles.deviceList}>{section.entries.map((entry, index) => { const EntryIcon = iconFor(entry.icon); return <Link key={`${entry.title}-${index}`} href={entry.href || "/c"} onClick={onNavigate}><EntryIcon size={17} /><span><strong>{entry.title}</strong><small>{entry.detail}</small></span></Link>; })}</div>
        </section>;
        return <section className={styles.architecture} key={section.id} aria-labelledby={`${id}-${section.id}`}>
          <div className={styles.heading}><HeadingIcon size={16} /><h2 id={`${id}-${section.id}`}>{section.title}</h2><span>{section.entries.length}<small>Categories</small></span></div>
          <div className={styles.architectureList}>{section.entries.map((entry, index) => { const EntryIcon = iconFor(entry.icon); return <Link key={`${entry.title}-${index}`} className={`${styles.architectureItem}${entry.featured ? ` ${styles.architectureFeatured}` : ""}`} href={entry.href || "/c"} onClick={onNavigate}><span className={styles.architectureIcon}><EntryIcon size={18} /></span><span className={styles.architectureCopy}><strong>{entry.title}</strong><small>{entry.detail}</small></span>{entry.badge ? <span className={styles.modelCount}>{entry.badge}</span> : null}</Link>; })}</div>
        </section>;
      })}
      <aside className={styles.promo}><div className={styles.promoCard}><div className={styles.promoTop}><span>{content.promo.eyebrow}</span><BadgeCheck size={17} /></div><h2>{content.promo.title}</h2><p>{content.promo.description}</p><div className={styles.promoLine} /><p>{content.promo.detail}</p><span className={styles.benchmark}>{content.promo.benchmark}</span></div><div className={styles.promoBottom}><span>{content.promo.voucherLabel} <b>{content.promo.voucherCode}</b></span><Link href={content.promo.href || "/c?deals=1"} onClick={onNavigate}>{content.promo.ctaLabel}<ArrowRight size={17} /></Link></div></aside>
    </div>
    <div className={styles.bottomBar}><span><CreditCard size={15} />{content.footer.message} <strong>{content.footer.emphasis}</strong> {content.footer.detail}</span><div><Link href={content.footer.firstLinkHref || "#device-finder"} onClick={onNavigate}>{content.footer.firstLinkLabel}</Link><Link href={content.footer.secondLinkHref || "/c"} onClick={onNavigate}>{content.footer.secondLinkLabel}<ArrowRight size={15} /></Link></div></div>
  </div>;
}