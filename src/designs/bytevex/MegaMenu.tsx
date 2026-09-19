"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Camera, ChevronRight, Clapperboard, Cpu, CreditCard, Database, Gauge, HardDrive, Headphones, MemoryStick, MonitorPlay, Package, Plane, ShieldCheck, SlidersHorizontal, Smartphone, Truck, Zap } from "lucide-react";
import type { ApiCategory } from "@/lib/api";
import { useHref } from "@/lib/design-context";
import styles from "./mega-menu.module.css";

const architectures = [
  { title: "SDXC & SDHC Cinema", detail: "UHS-II & UHS-I · Up to 300 MB/s", category: "SD Cards", icon: MemoryStick },
  { title: "MicroSD Action & Mobile", detail: "A2 App Perf · V30 & V60", category: "microSD Cards", icon: Smartphone },
  { title: "CFexpress Type B", detail: "PCIe 3.0 ×2 · Extreme 1750 MB/s", category: "CFexpress Cards", icon: Zap, featured: true },
  { title: "CFexpress Type A", detail: "Sony FX3 / FX6 / A1 Alpha Native", query: "CFexpress Type A", icon: Camera },
  { title: "Ingest Docks & Readers", detail: "Thunderbolt 4 · 40Gbps Dual-Slot", category: "Card Readers", icon: HardDrive },
  { title: "Cinema SSDs & CFast 2.0", detail: "RED, ARRI & Blackmagic Media", query: "SSD", icon: Database },
];
const capacities = [
  { title: "64GB – 128GB", detail: "FHD / 4K Standard · reliable photo", query: "128GB" },
  { title: "256GB", detail: "Pro sweet spot · 4K60 workflows", query: "256GB", featured: true },
  { title: "512GB", detail: "ProRes 422 · Continuous High Frame", query: "512GB" },
  { title: "1TB – 2TB", detail: "Cinema 8K All-Intra Master multi-cam", query: "1TB" },
];
const speedClasses = [
  { badge: "V90", title: "Cinema 8K", detail: "Min 90 MB/s continuous", query: "V90" },
  { badge: "V60", title: "4K ProRes", detail: "Min 60 MB/s sustained", query: "V60" },
  { badge: "V30", title: "Drone & Vlog", detail: "Min 30 MB/s broadcast", query: "V30" },
  { badge: "A2", title: "App Perf 2", detail: "4000 Read IOPS", query: "A2" },
  { badge: "II", title: "UHS-II Dual Bus", detail: "Up to 312 MB/s pinout", query: "UHS-II" },
  { badge: "PCIe", title: "NVMe Protocol", detail: "Direct Host bus link", query: "NVMe" },
];
const devices = [
  { title: "Cinema Cameras", detail: "FX3, FX6, RED, BMD", query: "cinema", icon: Clapperboard },
  { title: "Mirrorless Hybrid", detail: "A7S III, R5 II, Z8, X-T5", query: "mirrorless", icon: Camera },
  { title: "Aerial Drones", detail: "Mavic 3 Pro, Inspire 3", query: "drone", icon: Plane },
  { title: "Action & 360 Cams", detail: "GoPro 12/13, Ace Pro", query: "action", icon: Gauge },
  { title: "Handheld Consoles", detail: "Steam Deck, ROG Ally", query: "gaming", icon: MonitorPlay },
  { title: "Surveillance & Dash", detail: "24/7 Loop Write Armor", query: "endurance", icon: ShieldCheck },
];

export default function MegaMenu({ categories, onNavigate }: { categories: ApiCategory[]; onNavigate: () => void }) {
  const href = useHref();
  const allCategories = categories.flatMap(category => [category, ...category.children]);
  const categoryHref = (title: string) => {
    const matching = allCategories.find(category => category.title.toLowerCase() === title.toLowerCase());
    return href.category({ cat: matching?.slug || title });
  };
  const categoryCount = (title: string) => allCategories.find(category => category.title.toLowerCase() === title.toLowerCase())?.productCount;
  return <div id="shop-mega-menu" className={styles.menu} aria-label="Shop product categories">
    <div className={styles.columns}>
      <section className={styles.architecture} aria-labelledby="mega-architecture"><div className={styles.heading}><Cpu size={16} /><h2 id="mega-architecture">Flash<br />Architecture</h2><span>{architectures.length}<small>Categories</small></span></div>
        <div className={styles.architectureList}>{architectures.map(({ title, detail, category, query, icon: Icon, featured }) => <Link key={title} className={`${styles.architectureItem}${featured ? ` ${styles.architectureFeatured}` : ""}`} href={category ? categoryHref(category) : href.category({ q: query })} onClick={onNavigate}><span className={styles.architectureIcon}><Icon size={18} /></span><span className={styles.architectureCopy}><strong>{title}</strong><small>{detail}</small></span>{categoryCount(category || title) ? <span className={styles.modelCount}>{categoryCount(category || title)}<small>models</small></span> : null}</Link>)}</div>
      </section>
      <section className={styles.capacity} aria-labelledby="mega-capacity"><div className={styles.heading}><Database size={16} /><h2 id="mega-capacity">Capacity Tier</h2></div>
        <div className={styles.capacityList}>{capacities.map(item => <Link key={item.title} className={`${styles.capacityItem}${item.featured ? ` ${styles.capacityFeatured}` : ""}`} href={href.category({ q: item.query })} onClick={onNavigate}><strong>{item.title}</strong><small>{item.detail}</small>{item.featured ? <span><BadgeCheck size={13} /> MOST POPULAR</span> : null}</Link>)}</div>
        <div className={styles.runtime}><small>256GB RUNTIME INDEX</small><div><span><strong>142 Min</strong><small>4K 60P RAW</small></span><span><strong>7,400+</strong><small>RAW Photos</small></span></div></div>
      </section>
      <section className={styles.speed} aria-labelledby="mega-speed"><div className={styles.heading}><Gauge size={16} /><h2 id="mega-speed">Speed Class</h2></div>
        <div className={styles.speedList}>{speedClasses.map(item => <Link key={item.badge} href={href.category({ q: item.query })} onClick={onNavigate}><span className={styles.speedBadge}>{item.badge}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><ChevronRight size={14} /></Link>)}</div>
      </section>
      <section className={styles.devices} aria-labelledby="mega-devices"><div className={styles.heading}><Package size={16} /><h2 id="mega-devices">Device<br />Archetype</h2></div>
        <div className={styles.deviceList}>{devices.map(({ title, detail, query, icon: Icon }) => <Link key={title} href={href.category({ q: query })} onClick={onNavigate}><Icon size={17} /><span><strong>{title}</strong><small>{detail}</small></span></Link>)}</div>
      </section>
      <aside className={styles.promo}><div className={styles.promoCard}><div className={styles.promoTop}><span>STUDIO BUNDLE</span><BadgeCheck size={17} /></div><h2>RED &amp; ARRI CFexpress Pro Pack</h2><p>Save 25% + Free 40Gbps Thunderbolt Card Reader included with every twin-card kit.</p><div className={styles.promoLine} /><p>BYTEVEX Extreme Pro SDXC UHS-II V90 Memory Card Studio Presentation</p><span className={styles.benchmark}>300 MB/s BENCHMARK</span></div><div className={styles.promoBottom}><span>Exclusive Voucher <b>CINEMA25</b></span><Link href={href.category({ deals: 1 })} onClick={onNavigate}>Explore Cinema Kits <ArrowRight size={17} /></Link></div></aside>
    </div>
    <div className={styles.bottomBar}><span><CreditCard size={15} /> Need enterprise procurement? <strong>GST Invoicing &amp; Bulk Cine Studio Fleet pricing</strong> available.</span><div><Link href={`${href.home()}#device-finder`} onClick={onNavigate}><SlidersHorizontal size={15} /> Interactive Compatibility Finder</Link><Link href={href.category()} onClick={onNavigate}>View All Storage Products <ArrowRight size={15} /></Link></div></div>
  </div>;
}
