"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Database, Gauge, Headphones, PackageCheck, Search, ShieldCheck, Truck, Video } from "lucide-react";
import { useHref } from "@/lib/design-context";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AuroraText } from "@/components/ui/aurora-text";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShinyButton } from "@/components/ui/shiny-button";
import Text3DFlip from "@/components/ui/text-3d-flip";
import CardVisual from "./CardVisual";
import styles from "@/designs/bytevex/home.module.css";

const slides = [
  { id: "sd", eyebrow: "NEW GEN PRO MEDIA · BUILT FOR CREATORS", lineOne: "Sustained speed.", lineTwo: "Zero dropped frames.", description: "Choose memory cards by format, capacity and speed class. Find dependable media for cameras, drones and demanding creative workflows.", cta: "Shop SD cards", category: "SD Cards", metrics: [["FORMAT", "SD · microSD"], ["SPEED CLASS", "V30 — V90"], ["CAPACITY", "64 GB — 1 TB"], ["WORKFLOW", "4K · 8K"]], kind: "sd", capacity: "256", rating: "V30 · A2", companion: "micro", companionCapacity: "128", name: "BYTEVEX Ultra Pro 256GB", subline: "Built for uninterrupted capture.", specs: ["256 GB", "V30 · A2", "4K READY"] },
  { id: "micro", eyebrow: "COMPACT FORMAT · SERIOUS PERFORMANCE", lineOne: "Small card.", lineTwo: "Big possibilities.", description: "Reliable microSD media for drones, action cameras and handheld devices. Choose the capacity and speed your next shoot demands.", cta: "Shop microSD cards", category: "microSD Cards", metrics: [["FORMAT", "microSDXC"], ["SPEED CLASS", "V30 · A2"], ["CAPACITY", "128 GB — 1 TB"], ["WORKFLOW", "DRONE · ACTION"]], kind: "micro", capacity: "256", rating: "V30 · A2", companion: "sd", companionCapacity: "128", name: "BYTEVEX microSD Ultra 256GB", subline: "Capture more from every angle.", specs: ["256 GB", "V30 · A2", "4K READY"] },
  { id: "cf", eyebrow: "PRO WORKFLOWS · HIGH-BITRATE READY", lineOne: "Keep rolling.", lineTwo: "At full speed.", description: "Move into demanding cinema and mirrorless workflows with high-throughput CFexpress media built for long takes and fast transfers.", cta: "Shop CFexpress", category: "CFexpress Cards", metrics: [["FORMAT", "CFexpress"], ["RATING", "VPG 400"], ["CAPACITY", "256 · 512 GB"], ["WORKFLOW", "CINEMA · RAW"]], kind: "cf", capacity: "512", rating: "VPG 400", companion: "cf", companionCapacity: "256", name: "BYTEVEX CFexpress Pro 512GB", subline: "Made for demanding capture.", specs: ["512 GB", "VPG 400", "RAW READY"] },
  { id: "reader", eyebrow: "FROM CAMERA TO EDIT · WITHOUT WAITING", lineOne: "Finish the shot.", lineTwo: "Keep the flow.", description: "Pair your cards with fast, dependable readers and spend less time moving files between camera, studio and edit suite.", cta: "Shop card readers", category: "Card Readers & Hubs", metrics: [["FORMAT", "MULTI-CARD"], ["INTERFACE", "USB-C"], ["TRANSFER", "10 GB/S"], ["WORKFLOW", "INGEST · EDIT"]], kind: "reader", capacity: "USB-C", rating: "10 Gb/s", companion: "sd", companionCapacity: "256", name: "BYTEVEX Reader Pro", subline: "Get to the edit faster.", specs: ["USB-C", "10 Gb/s", "PRO INGEST"] },
] as const;

export default function Hero() {
  const href = useHref();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slide = slides[activeIndex];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, activeIndex]);

  const selectSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return <>
    <div className={styles.dispatch}><span className={styles.liveDot} /> <b>Performance media for every capture</b><span>Explore SD, microSD, CFexpress and high-speed readers.</span></div>
    <section className={styles.hero} aria-label="Featured BYTEVEX products" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <FlickeringGrid className={styles.heroGrid} squareSize={3} gridGap={13} color="#39c7ff" maxOpacity={0.2} flickerChance={0.08} aria-hidden="true" />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} key={slide.id}>
          <span className={styles.heroTag}><AnimatedGradientText colorFrom="#39c7ff" colorTo="#b8edff" speed={0.7}>{slide.eyebrow}</AnimatedGradientText></span>
          <h1><Text3DFlip as="span" className={styles.heroFlip} textClassName={styles.heroFlipFace} flipTextClassName={styles.heroFlipFace} rotateDirection="top" staggerDuration={0.025} transition={{ type: "spring", damping: 25, stiffness: 160 }}>{slide.lineOne}</Text3DFlip><AuroraText className={styles.heroAurora} colors={["#39c7ff", "#78ddff", "#168ff8", "#39c7ff"]} speed={0.65}>{slide.lineTwo}</AuroraText></h1>
          <p>{slide.description}</p>
          <div className={styles.heroButtons}><ShinyButton className={styles.primaryButton} href={href.category({ cat: slide.category })}>{slide.cta} <ArrowRight size={17} /></ShinyButton><Link className={styles.outlineButton} href="#device-finder"><Search size={17} /> Find a card for your device</Link></div>
          <div className={styles.metrics}>{slide.metrics.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
          <div className={styles.heroTrust}><span />TRUSTED BY CREATORS. ENGINEERED FOR MORE.</div>
        </div>

        <div className={styles.heroShowcase}
          onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => { if (touchStartX.current === null) return; const distance = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(distance) > 45) selectSlide(activeIndex + (distance < 0 ? 1 : -1)); touchStartX.current = null; }}
        >
          <div className={styles.showcaseTop}><span className={styles.showcaseLabel}>PRO MEDIA / CAMERA READY</span><div className={styles.showcaseControls}><strong>{slide.kind === "reader" ? "READER PRO" : "ULTRA PRO"}</strong><span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><div className={styles.showcaseDots} role="group" aria-label="Choose featured product">{slides.map((item, index) => <button type="button" key={item.id} className={index === activeIndex ? styles.activeDot : ""} aria-label={`Show ${item.name}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => selectSlide(index)} />)}</div></div></div>
          <div className={styles.showcaseScene} key={slide.id}>
            <div className={styles.sceneGlow} /><div className={styles.sceneHorizon} /><div className={styles.scenePlatform} />
            <div className={styles.sceneSideCard}><CardVisual kind={slide.companion} capacity={slide.companionCapacity} small /></div>
            <div className={styles.sceneMainCard}><CardVisual kind={slide.kind} capacity={slide.capacity} rating={slide.rating} /></div>
            <div className={styles.sceneFrontCard}><CardVisual kind={slide.kind === "reader" ? "micro" : slide.companion} capacity={slide.kind === "reader" ? "128" : slide.companionCapacity} small /></div>
            <div className={styles.sceneSpecs}><span><Database size={17} />{slide.specs[0]}</span><span><Gauge size={17} />{slide.specs[1]}</span><span><Video size={17} />{slide.specs[2]}</span></div>
          </div>
          <div className={styles.showcaseBottom}><div><strong>{slide.name}</strong><span>{slide.subline}</span></div><Link href={href.category({ cat: slide.category })}>View range <ArrowRight size={16} /></Link><div className={styles.showcaseThumbs} role="group" aria-label="Featured product thumbnails">{slides.map((item, index) => <button type="button" key={item.id} className={index === activeIndex ? styles.activeThumb : ""} aria-label={`Show ${item.name}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => selectSlide(index)}><span className={styles.thumbCard}><small>BYTEVEX</small><b>{item.capacity}</b><i>{item.kind === "cf" ? "VPG" : item.kind === "reader" ? "USB" : "V30"}</i></span></button>)}</div></div>
          <div className={styles.showcaseSwipe}>Swipe to explore the range</div>
        </div>
      </div>
    </section>
    <div className={styles.trustStrip}><span><ShieldCheck size={18} /> Format-first shopping</span><span><PackageCheck size={18} /> Clear product specifications</span><span><Headphones size={18} /> Help choosing media</span><span><Truck size={18} /> Delivery options at checkout</span></div>
  </>;
}
