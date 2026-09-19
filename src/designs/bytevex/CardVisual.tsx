import styles from "@/designs/bytevex/home.module.css";

export default function CardVisual({ kind = "sd", small = false, capacity, series, rating }: { kind?: string; small?: boolean; capacity?: string; series?: string; rating?: string }) {
  return <div className={styles.cardVisual + (small ? " " + styles.cardVisualSmall : "") + " " + styles[kind]} aria-hidden="true">
    <div className={styles.cardCut} />
    <span className={styles.cardBrand}>BYTEVEX</span><span className={styles.cardSeries}>{series ?? (kind === "cf" ? "CFexpress" : kind === "reader" ? "READER PRO" : "ULTRA PRO")}</span>
    <b>{capacity ?? (kind === "cf" ? "512" : kind === "micro" ? "256" : kind === "reader" ? "USB-C" : "128")}<small>{kind === "reader" ? "" : "GB"}</small></b>
    <span className={styles.cardFooterText}>{rating ?? (kind === "reader" ? "10 Gb/s" : kind === "cf" ? "VPG 400" : "V30 · A2")}</span>
  </div>;
}
