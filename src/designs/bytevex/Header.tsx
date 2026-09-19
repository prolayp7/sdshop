"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight,  BadgeCheck, ChevronDown, ClipboardCheck, Cpu, Headphones, Heart, Menu, ReceiptText, ShoppingBag, Truck, UserRound, X } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useApi } from "@/lib/use-api";
import MegaMenu from "./MegaMenu";
import SearchBox from "./SearchBox";
import type { ApiCategory, ApiGeneralSettings } from "@/lib/api";
import { useHref } from "@/lib/design-context";
import { BasketTotal } from "@/components/BasketBadge";
import { useCartCount } from "@/lib/cart";
import { useWishlist, useCompare } from "@/lib/basket";
import { useCustomerAuth } from "@/lib/storefront-client";
import styles from "@/designs/bytevex/home.module.css";

const nav = [
  { label: "SD Cards (UHS-II / UHS-I)", category: "SD Cards" },
  { label: "microSD Cards", category: "microSD Cards" },
  { label: "CFexpress Type A/B", category: "CFexpress Cards" },
  { label: "Cinema SSD & Enclosures", query: "SSD" },
  { label: "High-Speed Card Readers & Hubs", category: "Card Readers" },
];

export default function Header() {
  const href = useHref();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const cartCount = useCartCount();
  const { isLoggedIn } = useCustomerAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const settings = useApi<{ data: ApiGeneralSettings }>("/api/settings/general").data?.data ?? {};
  const menuCategoriesRes = useApi<{ items: ApiCategory[] }>("/api/categories");

  useEffect(() => {
    if (!megaOpen) return;
    function closeOnOutside(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setMegaOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [megaOpen]);
  return <div className={styles.site + " " + styles.stickyTop}>
    <header className={styles.header}>
      <FlickeringGrid className={styles.headerGrid} squareSize={3} gridGap={13} color="#0a1730" maxOpacity={1} flickerChance={0.1} aria-hidden="true" />
      <div className={styles.topbar}>
        <span className={styles.topDelivery}><Truck size={15} /><span>Free express delivery across India over<br />₹1,999</span></span>
        <span className={styles.topVerified}><BadgeCheck size={15} /> 3000 MB/s Benchmark Lab Verified</span>
        <Link href={href.account({ tab: "orders" })}><ClipboardCheck size={15} /> Track BlueDart AWB</Link>
        <Link href={href.account()}><ReceiptText size={15} /> GST B2B Invoice Support</Link>
        <a href="tel:+918040008900" className={styles.topSupport}><Headphones size={15} /> <span>24/7 Pro Support:</span> <b>+91 80 4000 8900</b></a>
      </div>
      <div className={styles.headerMain}>
        <Link href={href.home()} className={styles.logo} aria-label="BYTEVEX home">{settings.logo ? <span className={styles.logoAsset}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={settings.logo} alt="" /></span> : null}</Link>
        <SearchBox categories={menuCategoriesRes.data?.items ?? []} onOpen={() => setMegaOpen(false)} />
        <div className={styles.headerActions}>
          <Link href={href.compare()} className={styles.headerIconAction}><span className={styles.actionIcon}><ArrowLeftRight size={22} /><span className={styles.countBadge}>{compareCount}</span></span><span>Compare</span></Link>
          <Link href={href.account({ tab: "wishlist" })} className={styles.headerIconAction}><span className={styles.actionIcon}><Heart size={22} /><span className={styles.countBadge}>{wishlistCount}</span></span><span>Wishlist</span></Link>
          <span className={styles.actionDivider} />
          <Link href={isLoggedIn ? href.account() : href.login()} className={styles.accountAction}><span className={styles.userCircle}><UserRound size={19} /></span><span><small>Pro Account</small><b>{isLoggedIn ? "My Account" : "Sign In"}</b></span></Link>
          <Link href={href.basket()} className={styles.cart}><span className={styles.actionIcon}><ShoppingBag size={22} />{cartCount > 0 && <span className={styles.countBadge}>{cartCount}</span>}</span><span><small>CART TOTAL</small><b><BasketTotal /></b></span></Link>
        </div>
        <button className={styles.menuButton} onClick={() => { setMenuOpen(!menuOpen); setMegaOpen(false); }} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      <nav ref={navRef} className={styles.nav + (menuOpen ? " " + styles.navOpen : "")} aria-label="Product categories" onPointerLeave={event => { if (event.pointerType === "mouse" || event.pointerType === "pen") setMegaOpen(false); }}>
        <div className={styles.navShell}>
          <button type="button" className={styles.shopButton} aria-expanded={megaOpen} aria-controls="shop-mega-menu" onPointerEnter={event => { if (event.pointerType === "mouse" || event.pointerType === "pen") setMegaOpen(true); }} onClick={event => { const pointerType = (event.nativeEvent as PointerEvent).pointerType; setMegaOpen(open => pointerType === "mouse" || pointerType === "pen" ? true : !open); }}><span className={styles.shopDot} />Shop Products <ChevronDown size={15} /></button>
          <div className={styles.navLinks}>
            {nav.map(item => <Link key={item.label} onClick={() => setMegaOpen(false)} href={href.category(item.category ? { cat: item.category } : { q: item.query })}>{item.label}</Link>)}
            <Link href="#device-finder" className={styles.deviceNav} onClick={() => setMegaOpen(false)}><Cpu size={15} /> Device Compatibility Finder</Link>
            <Link href={href.category({ deals: 1 })} onClick={() => setMegaOpen(false)}>Pro Creator Deals</Link>
            <Link href={href.account()} onClick={() => setMegaOpen(false)}>Studio Corporate Inquiries</Link>
          </div>
          {megaOpen && <MegaMenu categories={menuCategoriesRes.data?.items ?? []} onNavigate={() => setMegaOpen(false)} /> }
        </div>
      </nav>
    </header>
  </div>;
}
