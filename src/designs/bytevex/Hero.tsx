"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, CheckCircle, Clock, CreditCard, Database, Gauge, Gift, Globe, HelpCircle, Headphones, Info, Lock, Mail, MapPin, Package, PackageCheck, Percent, Phone, ReceiptText, RefreshCw, RotateCcw, Search, Settings, Share2, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, ThumbsUp, Truck, Users, Video, Wallet, Zap, type LucideIcon } from "lucide-react";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShinyButton } from "@/components/ui/shiny-button";
import Text3DFlip from "@/components/ui/text-3d-flip";
import { AuroraText } from "@/components/ui/aurora-text";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import type { HomeBundle } from "@/lib/api";
import CardVisual from "./CardVisual";
import styles from "@/designs/bytevex/home.module.css";

type HeroSlide = HomeBundle["hero"]["slides"][number];
type HeroBadge = HomeBundle["hero"]["badges"][number];
export type HeroDispatch = { enabled: boolean; text: string; description: string } | null;

const TRUST_ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck, "package-check": PackageCheck, headphones: Headphones, truck: Truck,
  "badge-check": BadgeCheck, "check-circle": CheckCircle, lock: Lock, "credit-card": CreditCard,
  "rotate-ccw": RotateCcw, clock: Clock, star: Star, "thumbs-up": ThumbsUp, gift: Gift,
  percent: Percent, tag: Tag, "map-pin": MapPin, phone: Phone, mail: Mail,
  "help-circle": HelpCircle, info: Info, award: Award, zap: Zap, package: Package,
  "shopping-bag": ShoppingBag, wallet: Wallet, "receipt-text": ReceiptText, settings: Settings,
  "refresh-cw": RefreshCw, "share-2": Share2, sparkles: Sparkles, globe: Globe, users: Users,
};
const THUMB_TAG: Record<string, string> = { cf: "VPG", reader: "USB" };

export default function Hero({ slides, badges, dispatch, trustLine }: { slides: HeroSlide[]; badges: HeroBadge[]; dispatch: HeroDispatch; trustLine: string | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slide = slides[Math.min(activeIndex, slides.length - 1)];

  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, activeIndex, slides.length]);

  const selectSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  if (!slides.length || !slide) return null;

  const metrics = slide.metrics ?? [];
  const specs = slide.specs ?? [];

  return <>
    {dispatch?.enabled ? <div className={styles.dispatch}><span className={styles.liveDot} /> <b>{dispatch.text}</b><span>{dispatch.description}</span></div> : null}
    <section className={styles.hero} aria-label="Featured BYTEVEX products" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <FlickeringGrid className={styles.heroGrid} squareSize={3} gridGap={13} color="#39c7ff" maxOpacity={0.2} flickerChance={0.08} aria-hidden="true" />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} key={slide.id}>
          {slide.eyebrow ? <span className={styles.heroTag}><AnimatedGradientText colorFrom="#39c7ff" colorTo="#b8edff" speed={0.7}>{slide.eyebrow}</AnimatedGradientText></span> : null}
          <h1><Text3DFlip as="span" className={styles.heroFlip} textClassName={styles.heroFlipFace} flipTextClassName={styles.heroFlipFace} rotateDirection="top" staggerDuration={0.025} transition={{ type: "spring", damping: 25, stiffness: 160 }}>{slide.headline}</Text3DFlip>{slide.headlineHighlight ? <AuroraText className={styles.heroAurora} colors={["#39c7ff", "#78ddff", "#168ff8", "#39c7ff"]} speed={0.65}>{slide.headlineHighlight}</AuroraText> : null}</h1>
          {slide.subheading ? <p>{slide.subheading}</p> : null}
          {slide.ctaLabel || slide.secondaryCtaLabel ? <div className={styles.heroButtons}>
            {slide.ctaLabel ? <ShinyButton className={styles.primaryButton} href={slide.ctaUrl ?? "#"}>{slide.ctaLabel} <ArrowRight size={17} /></ShinyButton> : null}
            {slide.secondaryCtaLabel ? <Link className={styles.outlineButton} href={slide.secondaryCtaUrl ?? "#"}><Search size={17} /> {slide.secondaryCtaLabel}</Link> : null}
          </div> : null}
          {metrics.length ? <div className={styles.metrics}>{metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><b>{metric.value}</b></div>)}</div> : null}
          {trustLine ? <div className={styles.heroTrust}><span />{trustLine}</div> : null}
        </div>

        <div className={styles.heroShowcase}
          onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => { if (touchStartX.current === null) return; const distance = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(distance) > 45) selectSlide(activeIndex + (distance < 0 ? 1 : -1)); touchStartX.current = null; }}
        >
          <div className={styles.showcaseTop}>{slide.showcaseLabel ? <span className={styles.showcaseLabel}>{slide.showcaseLabel}</span> : null}<div className={styles.showcaseControls}>{slide.badgeLabel ? <strong>{slide.badgeLabel}</strong> : null}<span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>{slides.length > 1 ? <div className={styles.showcaseDots} role="group" aria-label="Choose featured product">{slides.map((item, index) => <button type="button" key={item.id} className={index === activeIndex ? styles.activeDot : ""} aria-label={`Show ${item.productName ?? item.headline}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => selectSlide(index)} />)}</div> : null}</div></div>
          <div className={styles.showcaseScene} key={slide.id}>
            <div className={styles.sceneGlow} /><div className={styles.sceneHorizon} /><div className={styles.scenePlatform} />
            {slide.visualCompanionKind ? <div className={styles.sceneSideCard}><CardVisual kind={slide.visualCompanionKind} capacity={slide.visualCompanionCapacity ?? undefined} small /></div> : null}
            <div className={styles.sceneMainCard}><CardVisual kind={slide.visualKind ?? "sd"} capacity={slide.visualCapacity ?? undefined} rating={slide.visualRating ?? undefined} /></div>
            {slide.visualCompanionKind ? <div className={styles.sceneFrontCard}><CardVisual kind={slide.visualKind === "reader" ? "micro" : slide.visualCompanionKind} capacity={slide.visualKind === "reader" ? "128" : (slide.visualCompanionCapacity ?? undefined)} small /></div> : null}
            {specs.length ? <div className={styles.sceneSpecs}>{[Database, Gauge, Video].slice(0, specs.length).map((SpecIcon, index) => <span key={specs[index]}><SpecIcon size={17} />{specs[index]}</span>)}</div> : null}
          </div>
          <div className={styles.showcaseBottom}>{slide.productName ? <div><strong>{slide.productName}</strong>{slide.productSubline ? <span>{slide.productSubline}</span> : null}</div> : null}{slide.ctaUrl ? <Link href={slide.ctaUrl}>View range <ArrowRight size={16} /></Link> : null}{slides.length > 1 ? <div className={styles.showcaseThumbs} role="group" aria-label="Featured product thumbnails">{slides.map((item, index) => <button type="button" key={item.id} className={index === activeIndex ? styles.activeThumb : ""} aria-label={`Show ${item.productName ?? item.headline}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => selectSlide(index)}><span className={styles.thumbCard}><small>BYTEVEX</small><b>{item.visualCapacity ?? "—"}</b><i>{THUMB_TAG[item.visualKind ?? ""] ?? "V30"}</i></span></button>)}</div> : null}</div>
          <div className={styles.showcaseSwipe}>Swipe to explore the range</div>
        </div>
      </div>
    </section>
    {badges.length ? <div className={styles.trustStrip}>{badges.map((badge) => { const Icon = TRUST_ICONS[badge.icon ?? ""] ?? ShieldCheck; return <span key={badge.id}><Icon size={18} /> {badge.label}</span>; })}</div> : null}
  </>;
}
