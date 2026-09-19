"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Clock3, Cpu, FolderOpen, HardDrive, History, Info, MemoryStick, Search, X } from "lucide-react";
import type { ApiCategory, ListMeta } from "@/lib/api";
import type { Product } from "@/lib/types";
import { money } from "@/lib/catalogue";
import { useHref } from "@/lib/design-context";
import styles from "./search-box.module.css";

const RECENT_KEY = "bytevex-recent-searches";
const suggestedCategories = [
  { title: "SD Cards", caption: "SDXC Cinema Cards", query: "SDXC", icon: FolderOpen },
  { title: "microSD Cards", caption: "MicroSDXC Action", query: "microSD", icon: FolderOpen },
  { title: "CFexpress Cards", caption: "CFexpress Type B", query: "CFexpress", icon: Cpu },
];
const demoQueries = ["256gb camera card for Sony FX3", "256gb camera v90 300mb/s", "256gb camera microsd for dji drone", "256gb camera cfexpress type a"];

export default function SearchBox({ categories, onOpen }: { categories: ApiCategory[]; onOpen: () => void }) {
  const href = useHref();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<{ items: Product[]; meta: ListMeta; term: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [related, setRelated] = useState(false);
  const trimmed = query.trim();

  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")); } catch { setRecent([]); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(trimmed), 240);
    return () => window.clearTimeout(timer);
  }, [trimmed]);
  useEffect(() => {
    if (!open || !debounced) { setResults(null); setLoading(false); setError(false); return; }
    const controller = new AbortController();
    const run = async () => {
      setLoading(true); setError(false); setRelated(false);
      try {
        const load = async (term: string) => {
          const response = await fetch(`/api/products?q=${encodeURIComponent(term)}&perPage=24`, { signal: controller.signal });
          if (!response.ok) throw new Error(String(response.status));
          return response.json() as Promise<{ items: Product[]; meta: ListMeta }>;
        };
        let data = await load(debounced);
        let fallback = false;
        if (!data.items.length && debounced.includes(" ")) {
          const first = debounced.split(/\s+/)[0];
          data = await load(first);
          fallback = data.items.length > 0;
        }
        if (!controller.signal.aborted) {
          const cameraIntent = /camera|cinema|video|sony|fx3|drone|v90|v60/i.test(debounced);
          const items = cameraIntent ? [...data.items].sort((a, b) => Number(/memory|sd card|cfexpress/i.test(b.category + " " + b.subcategory)) - Number(/memory|sd card|cfexpress/i.test(a.category + " " + a.subcategory))) : data.items;
          setResults({ ...data, items: items.slice(0, 4), term: debounced });
          setRelated(fallback);
        }
      } catch {
        if (!controller.signal.aborted) { setResults(null); setError(true); }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void run();
    return () => controller.abort();
  }, [debounced, open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const querySuggestions = useMemo(() => {
    if (!trimmed) return ["V90 SD card", "256GB microSD", "CFexpress Type B", "USB-C card reader"];
    if (trimmed.toLowerCase() === "256gb camera") return demoQueries;
    return [`${trimmed} for Sony FX3`, `${trimmed} V90 300 MB/s`, `${trimmed} for DJI drone`, `${trimmed} CFexpress Type A`];
  }, [trimmed]);
  const visibleProducts = results?.items ?? [];
  const optionHrefs = [
    ...suggestedCategories.map(item => href.category({ cat: categories.find(cat => cat.title.toLowerCase() === item.title.toLowerCase())?.slug || item.title })),
    ...querySuggestions.map(item => href.category({ q: item })),
    ...visibleProducts.map(item => href.product(item.slug)),
    href.category({ q: trimmed }),
  ];
  const remember = (term: string) => {
    const next = [term, ...recent.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 4);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* private browsing */ }
  };
  const navigate = (url: string, term?: string) => {
    if (term) remember(term);
    setOpen(false); setActive(-1); inputRef.current?.blur(); router.push(url);
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!trimmed) return; navigate(active >= 0 ? optionHrefs[active] : href.category({ q: trimmed }), trimmed); };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { setOpen(false); setActive(-1); inputRef.current?.blur(); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive(index => (index + 1) % optionHrefs.length); }
    if (event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActive(index => index <= 0 ? optionHrefs.length - 1 : index - 1); }
  };
  const countFor = (title: string) => {
    const all = categories.flatMap(cat => [cat, ...cat.children]);
    return all.find(cat => cat.title.toLowerCase() === title.toLowerCase())?.productCount;
  };
  const panelOpen = open;
  return <div ref={rootRef} className={`${styles.root}${panelOpen ? ` ${styles.rootOpen}` : ""}`}>
    <form className={styles.form} role="search" onSubmit={submit}><Search size={19} aria-hidden="true" /><input ref={inputRef} type="search" autoComplete="off" role="combobox" aria-label="Search products" aria-autocomplete="list" aria-expanded={panelOpen} aria-controls="bytevex-search-panel" aria-activedescendant={active >= 0 ? `bytevex-search-option-${active}` : undefined} placeholder="Search by card type, capacity, device or model (e.g. Sony FX3, A7IV V90, DJI Air 3)" value={query} onChange={event => { setQuery(event.target.value); setActive(-1); }} onFocus={() => { setOpen(true); onOpen(); }} onKeyDown={onKeyDown} />{query ? <button className={styles.clear} type="button" aria-label="Clear search" onClick={() => { setQuery(""); inputRef.current?.focus(); }}><X size={14} /></button> : null}{panelOpen ? <kbd className={styles.esc}>ESC</kbd> : <button type="submit" className={styles.searchButton}>Search <ArrowRight size={16} /></button>}</form>
    {panelOpen ? <div id="bytevex-search-panel" className={styles.panel}>
      <div className={styles.panelMain}><aside className={styles.suggestions}>
        <h2>SUGGESTED CATEGORIES</h2><div className={styles.categoryList}>{suggestedCategories.map((item,index) => <Link key={item.title} id={`bytevex-search-option-${index}`} className={active === index ? styles.activeOption : ""} href={optionHrefs[index]} onClick={event => { event.preventDefault(); navigate(optionHrefs[index]); }}><item.icon size={16} /><strong>{item.caption}</strong><span>{countFor(item.title) ?? "Browse"}{countFor(item.title) ? " items" : ""}</span></Link>)}</div>
        <h2>SUGGESTED QUERIES</h2><div className={styles.queryList}>{querySuggestions.map((item,index) => <Link key={item} id={`bytevex-search-option-${3+index}`} className={active === 3+index ? styles.activeOption : ""} href={optionHrefs[3+index]} onClick={event => { event.preventDefault(); navigate(optionHrefs[3+index], item); }}><ArrowRight size={13} /><span>{item}</span></Link>)}</div>
        <div className={styles.recentHeading}><h2>RECENT SEARCHES</h2>{recent.length ? <button type="button" onClick={() => { setRecent([]); localStorage.removeItem(RECENT_KEY); }}>Clear All</button> : null}</div><div className={styles.recentList}>{recent.length ? recent.map(item => <div key={item}><button type="button" onClick={() => navigate(href.category({ q: item }), item)}><History size={13} />{item}</button><button type="button" aria-label={`Remove ${item} from recent searches`} onClick={() => { const next=recent.filter(value => value !== item); setRecent(next); localStorage.setItem(RECENT_KEY, JSON.stringify(next)); }}><X size={13} /></button></div>) : <p>Your recent searches will appear here.</p>}</div>
        <div className={styles.guarantee}><BadgeCheckIcon /><strong>ZERO-DROP GUARANTEE</strong><p>Find verified cards and reliable media for uninterrupted capture.</p></div>
      </aside>
      <section className={styles.products} aria-label="Search results"><div className={styles.productsHeading}><div><strong>{trimmed ? related ? "Related Products" : "Matching Products" : "Find your next card"}</strong><span>{trimmed ? ` (${loading && !results ? "searching" : `${results?.meta.total ?? 0} results`} for “${results?.term ?? trimmed}”)` : " Search products and accessories"}</span></div><small>↑ ↓ to navigate&nbsp; · &nbsp;↵ to select</small></div>
        <div className={styles.resultList} aria-live="polite">{loading && !visibleProducts.length ? <div className={styles.emptyState}>Searching the live catalogue…</div> : error ? <div className={styles.emptyState}>Search is temporarily unavailable. You can still view all results.</div> : visibleProducts.length ? visibleProducts.map((product,index) => <Link key={product.id} id={`bytevex-search-option-${7+index}`} className={`${styles.productRow}${active === 7+index ? ` ${styles.activeOption}` : ""}`} href={href.product(product.slug)} onClick={event => { event.preventDefault(); navigate(href.product(product.slug), trimmed); }}><span className={styles.productImage}>{product.image ? <img src={product.image} alt="" width={52} height={52} /> : /memory|sd card|cfexpress/i.test(product.category + " " + product.subcategory) ? <MemoryStick size={23} /> : <HardDrive size={22} />}</span><span className={styles.productCopy}><strong>{product.name}</strong><span className={styles.specs}><b>{product.category || "Media"}</b>{Object.entries(product.specs).slice(0, 3).map(([key,value]) => <b key={key}>{String(value)}</b>)}</span><small><span>★ {product.rating ? product.rating.toFixed(1) : "New"}</span> ({product.reviews} reviews) <i>● {product.stockStatus === "out" ? "Out of stock" : product.stockStatus === "low" ? `Low stock (${product.stock})` : "In stock"}</i></small></span><span className={styles.price}><strong>{money(product.price)}</strong>{product.was && product.was > product.price ? <s>{money(product.was)}</s> : null}</span><ArrowRight className={styles.rowArrow} size={15} /></Link>) : <div className={styles.emptyState}>{trimmed ? "No product matches yet. Try a shorter query or browse all results." : "Start typing to see matching products."}</div>}</div>
        <button className={styles.fallback} type="button" onClick={() => navigate(href.category({ q: trimmed }), trimmed)}><Info size={14} /> View all results for “{trimmed || "products"}” <ChevronDown size={14} /></button>
      </section></div>
      <div className={styles.panelFooter}><span><span className={styles.liveDot} /> Live catalogue search · Stock and prices are updated from the store</span><Link id={`bytevex-search-option-${optionHrefs.length-1}`} href={href.category({ q: trimmed })} onClick={event => { event.preventDefault(); navigate(href.category({ q: trimmed }), trimmed); }}>View All {results?.meta.total ?? ""} Results <ArrowRight size={15} /></Link></div>
    </div> : null}
  </div>;
}

function BadgeCheckIcon() { return <span aria-hidden="true">✦</span>; }
