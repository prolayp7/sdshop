"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowRight, LoaderCircle, Search, Truck } from "lucide-react";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import { trackGuestOrder, type GuestTrackedOrder } from "@/lib/account-api";
import { useHref } from "@/lib/design-context";
import Header from "@/designs/bytevex/Header";
import Footer from "@/designs/bytevex/Footer";
import styles from "./track-order.module.css";

function date(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function label(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}

export default function TrackOrderPage() {
  const href = useHref();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<GuestTrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setOrder(null);
    try {
      setOrder(await trackGuestOrder(orderNumber, email));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "We couldn't find that order. Check the order number and email, then try again.");
    } finally {
      setLoading(false);
    }
  }

  const shipment = order?.shipments[0];
  const trackingUrl = shipment?.trackingUrl && /^https?:\/\//i.test(shipment.trackingUrl) ? shipment.trackingUrl : null;

  return <>
    <Header />
    <Crumbs items={[{ label: "Home", href: href.home() }, { label: "Track an order" }]} />
    <main className={styles.page}>
      <div className={styles.wrap}>
        <section className={styles.panel}>
          <span className={styles.eyebrow}>ORDER SUPPORT</span>
          <h1>Track your order</h1>
          <p className={styles.intro}>Enter the order number and email address used at checkout.</p>
          <form className={styles.form} onSubmit={(event) => void submit(event)}>
            <label>Order number<input required maxLength={40} value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} autoComplete="off" /></label>
            <label>Email address<input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
            {error ? <p className={styles.error} role="alert"><AlertTriangle size={16} />{error}</p> : null}
            <button type="submit" disabled={loading || !orderNumber.trim() || !email.trim()}>{loading ? <LoaderCircle size={17} className={styles.spinner} /> : <Search size={17} />}{loading ? "Looking up order…" : "Find order"}</button>
          </form>
        </section>

        {order ? <section className={styles.result} aria-live="polite">
          <div className={styles.resultHead}><div><span>ORDER {order.orderNumber}</span><h2>{label(order.status)}</h2></div><span className={styles.payment}>{label(order.paymentStatus)}</span></div>
          <p className={styles.placed}>Placed {date(order.placedAt)}{order.shippingMethod ? ` · ${order.shippingMethod}` : ""}</p>
          {shipment ? <div className={styles.shipment}><Truck size={19} /><div><strong>{shipment.carrier}</strong><span>{shipment.trackingNumber || label(shipment.status)}</span></div>{trackingUrl ? <a href={trackingUrl} target="_blank" rel="noopener noreferrer">Track parcel <ArrowRight size={14} /></a> : null}</div> : <p className={styles.waiting}>Shipment tracking will appear here after dispatch.</p>}
          {order.statusHistory.length ? <ol className={styles.timeline}>{order.statusHistory.map((event, index) => <li key={`${event.status}-${event.createdAt}`}><span className={index === order.statusHistory.length - 1 ? styles.current : ""} /><div><strong>{label(event.status)}</strong><time>{date(event.createdAt)}</time></div></li>)}</ol> : null}
          <p className={styles.accountHint}>Have an account? <Link href={href.login({ next: href.account({ tab: "orders" }) })}>Sign in to view all orders</Link></p>
        </section> : null}
      </div>
    </main>
    <Footer />
  </>;
}