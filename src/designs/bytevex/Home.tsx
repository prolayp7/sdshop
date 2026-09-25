"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Box, Camera, Check, Database, HardDrive, HelpCircle, Receipt, RefreshCw, Search, ShieldCheck, Smartphone, Star, Video } from "lucide-react";
import { useApi } from "@/lib/use-api";
import type { Product } from "@/lib/types";
import type { ApiFaqCategory, HomeBundle } from "@/lib/api";
import { useHref } from "@/lib/design-context";
import styles from "@/designs/bytevex/home.module.css";
import Header from "./Header";
import Footer from "./Footer";
import Hero, { HeroDispatch } from "./Hero";
import CardVisual from "./CardVisual";
import ProductCard from "./ProductCard";

const categories = [
  { name: "Cameras & Hybrids", detail: "V90 · UHS-II · 8K", icon: Camera, query: "camera" },
  { name: "Drones & Action", detail: "A2 · V30 · 4K60", icon: Video, query: "drone" },
  { name: "Handheld Gaming", detail: "A2 · U3 · Extended", icon: Smartphone, query: "gaming" },
  { name: "Phones & Tablets", detail: "microSDXC · App-ready", icon: Smartphone, query: "phone" },
  { name: "Dashcams & CCTV", detail: "High endurance · 24/7", icon: Camera, query: "endurance" },
  { name: "Professional SSD", detail: "Cinema workflows", icon: HardDrive, query: "ssd" },
];
const architectures = [
  { label: "SDXC / CINEMA CARDS", title: "SDXC Cinema Cards", text: "Reliable UHS-II media for demanding stills and video workflows.", kind: "sd", query: "SD Cards" },
  { label: "A2 / MOBILE STORAGE", title: "MicroSDXC Cards", text: "Compact performance for drones, action cameras and handhelds.", kind: "micro", query: "microSD Cards" },
  { label: "VPG / PRO MEDIA", title: "CFexpress Type A / B", text: "High-throughput recording for cinema and mirrorless systems.", kind: "cf", query: "CFexpress Cards" },
  { label: "WORKFLOW / TRANSFER", title: "Ingest Readers & Docks", text: "Move full shoots quickly with readers built for your workflow.", kind: "reader", query: "Card Readers" },
];
const guideCards = [
  { label: "TECHNICAL NOTE", title: "Cinema Quad Packs + Hard Cases", text: "Keep a day's media organised, protected and ready for your next shoot." },
  { label: "FIELD GUIDE", title: "Cockpit & Highway Dashcam Series", text: "Understand endurance ratings for continuous recording." },
  { label: "STUDIO GUIDE", title: "Enterprise GST & Bulk PO Accounts", text: "Compare media for teams and repeat purchasing." },
];
const faqIcons = [HelpCircle, BadgeCheck, Receipt, RefreshCw];

export default function Home() {
  const href = useHref();
  const router = useRouter();
  const [query, setQuery] = useState("");
  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) router.push(href.category({ q: query.trim() }));
  }
  const [activeTab, setActiveTab] = useState("All products");
  const productQuery = activeTab === "All products" ? "/api/products?perPage=4" : "/api/products?perPage=4&category=" + encodeURIComponent(activeTab === "microSD" ? "microsd-cards" : activeTab === "CFexpress" ? "cfexpress-cards" : "sd-cards");
  const productsRes = useApi<{ items: Product[] }>(productQuery);
  const products = productsRes.data?.items ?? [];
  const homeRes = useApi<{ home: HomeBundle }>("/api/home");
  const heroConfig = homeRes.data?.home.homepageSections.find((section) => section.type === "HERO")?.config ?? {};
  const dispatch: HeroDispatch = typeof heroConfig.dispatchText === "string" || typeof heroConfig.dispatchDescription === "string"
    ? { enabled: heroConfig.dispatchEnabled !== false, text: typeof heroConfig.dispatchText === "string" ? heroConfig.dispatchText : "", description: typeof heroConfig.dispatchDescription === "string" ? heroConfig.dispatchDescription : "" }
    : null;
  const trustLine = typeof heroConfig.trustLine === "string" ? heroConfig.trustLine : null;
  const faqsRes = useApi<{ items: ApiFaqCategory[] }>("/api/faqs");
  const faqs = (faqsRes.data?.items ?? []).flatMap((category) => category.faqs);
  return <>
    <Header />
    <div className={styles.site}>
      <Hero slides={homeRes.data?.home.hero.slides ?? []} badges={homeRes.data?.home.hero.badges ?? []} dispatch={dispatch} trustLine={trustLine} />

      <section id="device-finder" className={styles.section + " " + styles.finder}><div className={styles.sectionHead}><div><span className={styles.kicker}>MATCH YOUR WORKFLOW</span><h2>Precision engineered for your gear</h2></div><p>Select your device type to explore cards with the right format and performance class.</p></div><div className={styles.deviceGrid}>{categories.map(({ name, detail, icon: Icon, query: q }) => <Link href={href.category({ q })} key={name} className={styles.device}><Icon size={25} /><strong>{name}</strong><span>{detail}</span><ArrowRight size={14} /></Link>)}</div></section>

      <section className={styles.section + " " + styles.architecture}><div className={styles.sectionHead}><div><span className={styles.kicker}>FLASH ARCHITECTURES</span><h2>Primary flash architectures</h2></div><Link href={href.category()}>View all categories <ArrowRight size={16} /></Link></div><div className={styles.archGrid}>{architectures.map(item => <Link href={href.category({ cat: item.query })} className={styles.archCard} key={item.title}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p><div className={styles.archVisual}><CardVisual kind={item.kind} small /></div><strong>Explore range <ArrowRight size={15} /></strong></Link>)}</div></section>

      <section id="bestsellers" className={styles.section + " " + styles.bestsellers}><div className={styles.sectionHead}><div><span className={styles.kicker}>PROVEN IN THE FIELD</span><h2>Battle-tested pro media</h2></div><div className={styles.tabs} role="group" aria-label="Filter featured products">{["All products", "SD Cards", "microSD", "CFexpress"].map(tab => <button type="button" key={tab} className={activeTab === tab ? styles.activeTab : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div></div><div className={styles.productGrid}>{productsRes.loading ? <p className={styles.state}>Loading products…</p> : productsRes.error ? <p className={styles.state}>Products are unavailable right now. Please try again later.</p> : products.length ? products.map(product => <ProductCard product={product} key={product.id} />) : <p className={styles.state}>No products found in this range.</p>}</div></section>

      <section className={styles.finderBanner}><div><span className={styles.kicker}>COMPATIBILITY STARTS HERE</span><h2>Not sure which card fits your camera or drone?</h2><p>Search by device or explore formats and speed classes before you buy.</p><form onSubmit={submitSearch}><label htmlFor="device-search">Search your device or card type</label><div><Search size={18} /><input id="device-search" placeholder="e.g. Sony FX3, DJI Air 3, V90" value={query} onChange={e => setQuery(e.target.value)} /><button type="submit">Find media <ArrowRight size={15} /></button></div></form></div><Database size={110} strokeWidth={.7} aria-hidden="true" /></section>

      <section className={styles.section + " " + styles.editorial}><div className={styles.editorialGrid}>{guideCards.map((card, i) => <Link href={i === 2 ? href.account() : "/blog"} key={card.title}><span className={styles.kicker}>{card.label}</span><h3>{card.title}</h3><p>{card.text}</p><strong>Read more <ArrowRight size={15} /></strong></Link>)}</div></section>

      <section id="guides" className={styles.section + " " + styles.guides}><div className={styles.sectionHead}><div><span className={styles.kicker}>DECODING FLASH STORAGE</span><h2>Understanding speed classes & interfaces</h2></div><Link href="/blog">Explore all guides <ArrowRight size={16} /></Link></div><div className={styles.guideGrid}><Link href="/blog"><span>01 / SD SPEED CLASS</span><h3>V30, V60 or V90?</h3><p>Understand sustained write ratings and choose for your camera&apos;s recording mode.</p><strong>Read the guide <ArrowRight size={15} /></strong></Link><Link href="/blog"><span>02 / APPLICATION CLASS</span><h3>What A1 and A2 mean</h3><p>Compare app performance classes for phones, tablets and handheld gaming.</p><strong>Read the guide <ArrowRight size={15} /></strong></Link><Link href="/blog"><span>03 / INTERFACES</span><h3>UHS-I, UHS-II and CFexpress</h3><p>See how card and reader interfaces affect transfer speed and compatibility.</p><strong>Read the guide <ArrowRight size={15} /></strong></Link></div></section>

      <section className={styles.darkBand}><div className={styles.darkInner}><span className={styles.kicker}>WORKFLOW SUPPORT</span><h2>Media for every stage of the shoot.</h2><p>Choose the format your device requires, then compare speed class, capacity and reader compatibility.</p><div className={styles.benefits}><div><ShieldCheck /><b>Device compatibility</b><span>Start with the manufacturer&apos;s supported formats.</span></div><div><Database /><b>Speed class clarity</b><span>Understand sustained write requirements.</span></div><div><HardDrive /><b>Workflow-ready readers</b><span>Move footage to your editing station.</span></div><div><Box /><b>Storage accessories</b><span>Keep cards sorted and protected.</span></div></div></div></section>

      <section className={styles.section + " " + styles.testimonials}><div className={styles.sectionHead}><div><span className={styles.kicker}>CHOOSE WITH CONFIDENCE</span><h2>Real workflows. Clear specifications.</h2></div></div><div className={styles.quoteGrid}><div><Star /><h3>For creators</h3><p>Compare video speed class, capacity and card format side by side before choosing media.</p></div><div><Star /><h3>For studios</h3><p>Find repeatable specifications for teams using the same camera systems.</p></div><div><Star /><h3>For everyday capture</h3><p>Filter compact cards for action cameras, drones and mobile devices.</p></div></div></section>

      <section className={styles.section + " " + styles.knowledge}><div className={styles.sectionHead}><div><span className={styles.kicker}>THE FLASH MEMORY KNOWLEDGE HUB</span><h2>Learn before you load.</h2></div><Link href="/blog">Read all articles <ArrowRight size={16} /></Link></div><div className={styles.knowledgeGrid}><Link href="/blog"><span>GUIDE · COMPATIBILITY</span><h3>The SD card speed labels that actually matter</h3><p>A practical way to read UHS, V-class and app performance markings.</p><strong>Read article <ArrowRight size={14} /></strong></Link><Link href="/blog"><span>GUIDE · CAMERAS</span><h3>How to choose media for 4K and 8K recording</h3><p>Start with your camera&apos;s codec and bitrate, then choose the right sustained speed.</p><strong>Read article <ArrowRight size={14} /></strong></Link><Link href="/blog"><span>GUIDE · WORKFLOW</span><h3>Card readers and the path to faster offloads</h3><p>The card, reader and computer port all shape transfer performance.</p><strong>Read article <ArrowRight size={14} /></strong></Link></div></section>

      {faqs.length ? <section className={styles.section + " " + styles.faq}><div className={styles.sectionHead}><div><span className={styles.kicker}>Help &amp; technical inquiries</span><h2>Frequently Asked Questions</h2></div></div><div className={styles.faqGrid}>{faqs.map((faq, index) => { const Icon = faqIcons[index % faqIcons.length]; return <div className={styles.faqCard} key={faq.id}><header><h3>{faq.question}</h3><Icon size={17} /></header><p>{faq.answer}</p></div>; })}</div></section> : null}
      <div className={styles.finalStrip}><span><Check size={17} /> Compare formats</span><span><Check size={17} /> Check your device</span><span><Check size={17} /> Choose by speed class</span><Link href={href.category()}>Browse all media <ArrowRight size={16} /></Link></div>
    </div>
    <Footer />
  </>;
}
