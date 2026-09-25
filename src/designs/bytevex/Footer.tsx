"use client";

import Link from "next/link";
import { Gauge, Headphones, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { useApi } from "@/lib/use-api";
import type { FooterColumn } from "@/lib/api";
import styles from "./footer.module.css";

const trustItems = [
  { icon: ShieldCheck, color: "#39c7ff", title: "100% Genuine Direct Import", detail: "Factory-direct authenticated serial numbers with customs clearance seal." },
  { icon: Gauge, color: "#39c7ff", title: "3000 MB/s Lab Verified", detail: "Thermal throttled stress-tested batch benchmark certificates included." },
  { icon: Shield, color: "#39c7ff", title: "5-Year Replacement Warranty", detail: "Direct Indian replacement guarantee on all cinema and V90 class flash media." },
  { icon: RefreshCw, color: "#22c55e", title: "Hassle-Free Indian RMA", detail: "Doorstep express reverse-pickup across 19,000+ pin codes in India." },
];

// Shown until/unless an admin-managed "footer" menu exists (Admin -> Menus).
const fallbackColumns: FooterColumn[] = [
  { title: "Shop by Category", links: [
    { label: "SD Cards (UHS-I & UHS-II)", href: "/category?cat=SD%20Cards" }, { label: "microSD Cards", href: "/category?cat=microSD%20Cards" },
    { label: "CFexpress Type A & B", href: "/category?cat=CFexpress%20Cards" }, { label: "Cinema SSD & Enclosures", href: "/category?q=SSD" },
    { label: "Card Readers & Hubs", href: "/category?cat=Card%20Readers" }, { label: "Adapters & Accessories", href: "/category?cat=Card%20Adapters" },
    { label: "All Products", href: "/category" },
  ] },
  { title: "Trade & Pro", links: [
    { label: "Pro Account", href: "/account" }, { label: "Creator Deals", href: "/category?deals=1" }, { label: "Bulk & Studio Orders", href: "/pages/bulk-orders" },
    { label: "Corporate Inquiries", href: "/pages/corporate-inquiries" }, { label: "GST Invoice Support", href: "/pages/gst-invoicing" }, { label: "Express Dispatch", href: "/pages/shipping" },
  ] },
  { title: "Customer Support", links: [
    { label: "Track Your Order", href: "/account?tab=orders" }, { label: "Returns & Refunds", href: "/pages/returns" }, { label: "Warranty & Service", href: "/pages/warranty" },
    { label: "Delivery Information", href: "/pages/shipping" }, { label: "Frequently Asked Questions", href: "/faqs" }, { label: "Contact Support", href: "/pages/contact" },
  ] },
  { title: "Guides & Tools", links: [
    { label: "Buying Guides", href: "/blog" }, { label: "Compare Products", href: "/compare" }, { label: "Find V90 SD Cards", href: "/category?q=V90" },
    { label: "CFexpress Finder", href: "/category?q=CFexpress" }, { label: "Choose a Card Reader", href: "/category?q=reader" }, { label: "Storage FAQs", href: "/faqs" },
  ] },
];

export default function Footer() {
  const menuRes = useApi<{ data: FooterColumn[] }>("/api/menus/footer");
  const columns = menuRes.data?.data?.length ? menuRes.data.data : fallbackColumns;
  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.trust} aria-label="Shopping benefits">
        {trustItems.map(({ icon: Icon, color, title, detail }) => <div className={styles.trustItem} key={title}><span className={styles.trustIcon} style={{ color }}><Icon size={18} strokeWidth={2.3} aria-hidden="true" /></span><span><strong>{title}</strong><small>{detail}</small></span></div>)}
      </div>
      <div className={styles.columns}>
        {columns.map((column) => <div className={styles.column} key={column.title}><h2>{column.title}</h2>
          {column.links.map((link) => <Link key={link.label + link.href} href={link.href}>{link.label}</Link>)}
        </div>)}
        <div className={styles.about}><h2>About BYTEVEX</h2>
          <p>Professional storage for creators, filmmakers and production teams. Speed-tested media, dependable fulfilment and support when it matters.</p>
          <div className={styles.certificates}><span>Lab Verified</span><span>GST Ready</span></div>
          <div className={styles.socials} aria-label="Social platforms"><span aria-label="Facebook">f</span><span aria-label="Instagram">◎</span><span aria-label="LinkedIn">in</span><span aria-label="YouTube">▶</span><span aria-label="Customer support"><Headphones size={17} /></span></div>
        </div>
      </div>
    </div>
    <div className={styles.paymentRow}><div className={styles.paymentInner}><div className={styles.payments}><span>ACCEPTED METHODS:</span><b>VISA</b><b>Mastercard</b><b>AMEX</b><b>UPI</b><b>Net Banking</b><b className={styles.trade}>B2B Orders</b></div><nav aria-label="Legal links"><Link href="/pages/privacy-policy">Privacy Policy</Link><Link href="/pages/terms-and-conditions">Terms of Sale</Link><Link href="/pages/returns">Returns &amp; Refunds</Link></nav></div></div>
    <div className={styles.legalRow}><div className={styles.legalInner}><span><span className={styles.brandMark}>✦</span> © {new Date().getFullYear()} BYTEVEX Flash Labs India. All rights reserved.</span><span><ShieldCheck size={19} /> Secure shopping with BYTEVEX</span></div></div>
  </footer>;
}
