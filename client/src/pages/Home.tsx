import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Compass,
  Copy,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Instagram,
  MapPin,
  Menu,
  Music2,
  Pause,
  Play,
  Send,
  Sparkles,
  X,
} from "lucide-react";

/**
 * STYLE DECISION — Modern Javanese.
 * This page uses a warm bone-paper canvas, terracotta thread accents, indigo ink,
 * modular editorial composition, and minimal geometric motifs inspired by batik.
 */

const CONFIG = {
  couple: "Raka & Anjani",
  shortNames: "Raka · Anjani",
  dateLabel: "Sabtu, 24 Oktober 2026",
  eventDate: "2026-10-24T16:00:00+07:00",
  venue: "Pendopo Ndalem Puspa",
  address: "Jl. Kaliurang Km 7, Sleman, Daerah Istimewa Yogyakarta",
  mapsUrl: "https://maps.google.com/?q=Pendopo+Ndalem+Puspa+Yogyakarta",
  walletProvider: "BCA",
  walletNumber: "1234 5678 90",
  accountBank: "Bank Mandiri",
  accountNumber: "14000 2900 889",
  accountName: "Raka Pradipta",
  paymentLink: "https://contoh-pembayaran.test",
  ambientTrack: "https://cdn.pixabay.com/audio/2022/10/25/audio_946a6a07f7.mp3",
};

type GuestbookEntry = {
  id: string;
  name: string;
  status: string;
  message: string;
  createdAt: string;
};

const gallery = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1300&q=85", alt: "Pasangan berjalan bersama di ruang terbuka", caption: "Langkah pertama, menuju satu cerita." },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1300&q=85", alt: "Dekorasi bunga putih dan meja pernikahan", caption: "Detail kecil yang kami pilih dengan hati." },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1300&q=85", alt: "Momen bahagia pasangan pengantin", caption: "Tawa yang ingin kami bawa sampai nanti." },
  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1300&q=85", alt: "Tangan pasangan dengan cincin pernikahan", caption: "Janji yang dirawat, hari demi hari." },
  { src: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=1300&q=85", alt: "Kursi dan dekorasi intimate wedding", caption: "Ruang sederhana untuk rasa yang besar." },
  { src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1300&q=85", alt: "Buket bunga pernikahan bernuansa lembut", caption: "Warna-warna dari hari yang kami nantikan." },
];

const navItems = [
  { id: "story", label: "Cerita" },
  { id: "events", label: "Acara" },
  { id: "gallery", label: "Galeri" },
  { id: "rsvp", label: "RSVP" },
  { id: "gift", label: "Tanda kasih" },
];

function getGuestName() {
  if (typeof window === "undefined") return "Tamu undangan";
  const value = new URLSearchParams(window.location.search).get("to");
  return value?.trim() || "Tamu undangan";
}

function toCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function makeCalendarUrl() {
  const start = new Date(CONFIG.eventDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${CONFIG.couple}`,
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
    details: `Menghadiri pernikahan ${CONFIG.couple}. Mohon hadir 30 menit lebih awal. Zona waktu WIB (UTC+7).`,
    location: `${CONFIG.venue}, ${CONFIG.address}`,
    ctz: "Asia/Jakarta",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function makeDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${CONFIG.venue}, ${CONFIG.address}`)}`;
}

function useCountdown(target: string) {
  const getTime = () => Math.max(0, new Date(target).getTime() - Date.now());
  const [remaining, setRemaining] = useState(getTime);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getTime()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

function Mark({ light = false }: { light?: boolean }) {
  return (
    <span className={`mark ${light ? "mark-light" : ""}`} aria-label="Emblem Raka dan Anjani">
      <span className="mark-shape mark-shape-a">R</span><span className="mark-shape mark-shape-b">A</span>
    </span>
  );
}

function SectionKicker({ number, children, light = false }: { number: string; children: string; light?: boolean }) {
  return <div className={`section-kicker ${light ? "section-kicker-light" : ""}`}><span>{number}</span><i />{children}</div>;
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { onDone(); return; }
    const timer = window.setInterval(() => setProgress((value) => {
      if (value >= 100) { window.clearInterval(timer); window.setTimeout(onDone, 120); return 100; }
      return Math.min(100, value + 14);
    }), 70);
    return () => window.clearInterval(timer);
  }, [onDone]);
  return <div className="preloader" role="status" aria-label="Menyiapkan undangan" style={{ "--progress": `${progress}%` } as React.CSSProperties}>
    <div className="preloader-inner"><Mark /><p>Raka <em>&</em> Anjani</p><span>Memuat cerita kami</span><div className="preloader-line"><b /></div></div>
  </div>;
}

function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  return <section className="cover" aria-label="Sampul undangan">
    <div className="cover-photo" />
    <div className="cover-wash" />
    <div className="cover-batik" aria-hidden="true" />
    <div className="cover-content">
      <div className="cover-brand-anchor"><Mark light /><span>RA / 26</span></div>
      <div className="cover-topline"><span>Undangan Pernikahan</span><span>01 <i /></span></div>
      <div className="cover-copy">
        <p className="eyebrow light-eyebrow">Kepada Yth.</p>
        <h1>{guest}</h1>
        <p className="cover-invite">Dengan penuh sukacita, kami mengundang Anda untuk hadir di hari pernikahan kami.</p>
        <div className="cover-couple"><span>Raka</span><b>&</b><span>Anjani</span></div>
        <p className="cover-date">{CONFIG.dateLabel} <span>·</span> Yogyakarta</p>
        <button className="open-button" onClick={onOpen}><span>Buka Undangan</span><ArrowDownRight size={17} /></button>
      </div>
      <div className="cover-paper-panel"><div className="paper-panel-stamp">RA<br /><span>26</span></div><div><span>Lokasi perayaan</span><strong>{CONFIG.venue}</strong><small>{CONFIG.address}</small></div><ArrowDownRight size={18} /></div>
      <p className="cover-note">Geser untuk membuka cerita <ChevronDown size={15} /></p>
    </div>
  </section>;
}

function Header({ openMusic, musicOn }: { openMusic: () => void; musicOn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 32); window.addEventListener("scroll", listener, { passive: true }); return () => window.removeEventListener("scroll", listener); }, []);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <a className="header-brand" href="#intro" aria-label="Kembali ke awal"><Mark /><span>{CONFIG.shortNames}</span></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{navItems.map((item) => <button key={item.id} onClick={() => go(item.id)}>{item.label}</button>)}</nav>
    <div className="header-actions"><button className="music-mini" onClick={openMusic} aria-label={musicOn ? "Matikan musik" : "Nyalakan musik"}><Music2 size={15} /><span>{musicOn ? "Musik on" : "Musik off"}</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
    {menuOpen && <nav className="mobile-menu" aria-label="Navigasi mobile">{navItems.map((item, index) => <button key={item.id} style={{ "--i": index } as React.CSSProperties} onClick={() => go(item.id)}><span>0{index + 2}</span>{item.label}<ArrowDownRight size={16} /></button>)}</nav>}
  </header>;
}

function Intro() {
  return <section id="intro" className="intro section-shell">
    <div className="intro-stamp">24<br /><span>OCT</span><br />26</div>
    <div className="intro-copy"><SectionKicker number="02">Sebuah awal</SectionKicker><h2>Satu langkah kecil<br /><em>menuju selamanya.</em></h2><p className="lead">Kami menemukan rumah dalam percakapan-percakapan sederhana, lalu memilih untuk pulang ke tempat yang sama—setiap hari.</p><button className="text-link" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}>Baca cerita kami <ArrowDownRight size={18} /></button></div>
    <div className="intro-aside"><span className="vertical-label">THE BEGINNING · 2019—2026</span><div className="intro-image"><img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85" alt="Pasangan berjalan berdua dengan hangat" /></div></div>
  </section>;
}

function Story() {
  return <section id="story" className="story section-shell dark-section">
    <div className="story-top"><SectionKicker number="03" light>Cerita kami</SectionKicker><p className="story-aside">Yang tumbuh perlahan<br />biasanya tinggal lebih lama.</p></div>
    <div className="story-layout"><div className="story-title"><h2>Dari<br /><em>“halo”</em><br />menjadi<br /><strong>rumah.</strong></h2></div><div className="story-body"><p className="story-lead">Kami bertemu di antara riuh pekerjaan dan kopi sore yang terlalu manis. Tak ada adegan dramatis, hanya percakapan yang terasa mudah untuk dilanjutkan.</p><p>Enam tahun berlalu dengan banyak perjalanan, meja makan, dan rencana-rencana kecil. Dari sana kami belajar: cinta bukan tentang menemukan hidup yang sempurna, melainkan memilih untuk merawat hidup yang kami punya.</p><div className="signature"><span>Dengan cinta,</span><b>Raka & Anjani</b></div></div><div className="story-photo"><img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85" alt="Pasangan duduk berdampingan menikmati sore" /><span>Yogyakarta, 2024</span></div></div>
  </section>;
}

function EventCard({ type, time, note }: { type: string; time: string; note: string }) {
  return <article className="event-item"><div className="event-index">0{type === "Akad Nikah" ? "1" : "2"}</div><div className="event-main"><h3>{type}</h3><p className="event-time">{time}</p><p>{CONFIG.venue}<br />{CONFIG.address}</p><span className="event-note">{note}</span></div></article>;
}

function Events() {
  const calendarUrl = useMemo(makeCalendarUrl, []);
  return <section id="events" className="events section-shell"><div className="events-heading"><SectionKicker number="04">Hari yang dinanti</SectionKicker><h2>Datang dan<br /><em>rayakan bersama.</em></h2><p>Kehadiran dan doa Anda adalah bagian paling hangat dari hari kami.</p></div><div className="events-list"><EventCard type="Akad Nikah" time="15.30 WIB · Sabtu, 24 Oktober 2026" note="Mohon hadir 30 menit sebelumnya" /><EventCard type="Resepsi" time="18.30—21.00 WIB · Sabtu, 24 Oktober 2026" note="Dress code: nuansa earth tone" /></div><div className="event-actions"><a href={calendarUrl} target="_blank" rel="noreferrer"><CalendarDays size={17} />Add to Calendar<ExternalLink size={14} /></a><a href={makeDirectionsUrl()} target="_blank" rel="noreferrer"><Compass size={17} />Penunjuk Arah<ExternalLink size={14} /></a><a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} />Lihat Lokasi<ExternalLink size={14} /></a></div></section>;
}

function Countdown() {
  const time = useCountdown(CONFIG.eventDate);
  const items = [[time.days, "Hari"], [time.hours, "Jam"], [time.minutes, "Menit"], [time.seconds, "Detik"]];
  return <section className="countdown-band"><div><SectionKicker number="05" light>Menuju hari kita</SectionKicker><h2>Waktu berjalan,<br /><em>rasa menetap.</em></h2></div><div className="countdown-values" aria-label="Hitung mundur menuju acara">{items.map(([value, label]) => <div key={label as string}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div></section>;
}

function Gallery({ onSelect }: { onSelect: (index: number) => void }) {
  return <section id="gallery" className="gallery section-shell"><div className="gallery-heading"><div><SectionKicker number="06">Potongan hari</SectionKicker><h2>Yang ingin<br /><em>kami simpan.</em></h2></div><p>Beberapa bingkai dari perjalanan yang membawa kami sampai di sini.</p></div><div className="gallery-grid">{gallery.map((item, index) => <button key={item.src} className={`gallery-tile tile-${index + 1}`} onClick={() => onSelect(index)} aria-label={`Buka foto ${index + 1}: ${item.caption}`}><img src={item.src} alt={item.alt} /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div></section>;
}

function Lightbox({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (next: number) => void }) {
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key === "ArrowLeft") onChange((index - 1 + gallery.length) % gallery.length); if (event.key === "ArrowRight") onChange((index + 1) % gallery.length); }; window.addEventListener("keydown", handler); document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; }; }, [index, onClose, onChange]);
  const item = gallery[index];
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto"><button className="lightbox-close" onClick={onClose} aria-label="Tutup galeri"><X size={23} /></button><button className="lightbox-arrow prev" onClick={() => onChange((index - 1 + gallery.length) % gallery.length)} aria-label="Foto sebelumnya"><ArrowLeft /></button><figure><img src={item.src} alt={item.alt} /><figcaption><span>{String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>{item.caption}</figcaption></figure><button className="lightbox-arrow next" onClick={() => onChange((index + 1) % gallery.length)} aria-label="Foto berikutnya"><ArrowRight /></button></div>;
}

function Rsvp({ onSubmitted }: { onSubmitted: (entry: GuestbookEntry) => void }) {
  const [form, setForm] = useState({ name: "", status: "Hadir", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim() || !form.message.trim()) return; const entry = { ...form, id: crypto.randomUUID(), name: form.name.trim(), message: form.message.trim(), createdAt: new Date().toISOString() }; onSubmitted(entry); setSubmitted(true); setForm({ name: "", status: "Hadir", message: "" }); };
  return <section id="rsvp" className="rsvp section-shell dark-section"><div className="rsvp-intro"><SectionKicker number="07" light>Konfirmasi kehadiran</SectionKicker><h2>Suara Anda<br /><em>berarti bagi kami.</em></h2><p>Mohon isi konfirmasi dan titipkan doa untuk perjalanan baru kami.</p></div><div className="rsvp-form-wrap">{submitted ? <div className="success-state"><span><Check size={24} /></span><h3>Terima kasih.</h3><p>Konfirmasi dan doa Anda sudah kami terima.</p><button className="text-link light-link" onClick={() => setSubmitted(false)}>Kirim pesan lain <ArrowRight size={17} /></button></div> : <form onSubmit={submit}><label htmlFor="guest-name">Nama lengkap<input id="guest-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tulis nama Anda" required /></label><label htmlFor="attendance">Kehadiran<select id="attendance" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Hadir</option><option>Belum bisa memastikan</option><option>Tidak dapat hadir</option></select></label><label htmlFor="guest-message">Pesan / doa<textarea id="guest-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tuliskan doa terbaik Anda" rows={4} required /></label><button className="submit-button" type="submit">Kirim konfirmasi <Send size={16} /></button></form>}</div></section>;
}

function Guestbook({ entries }: { entries: GuestbookEntry[] }) {
  return <section className="guestbook section-shell"><div className="guestbook-heading"><SectionKicker number="08">Buku tamu</SectionKicker><h2>Catatan baik<br /><em>untuk kami.</em></h2><span className="guest-count">{entries.length} pesan tersimpan</span></div><div className="guestbook-list">{entries.length === 0 ? <div className="guest-empty"><Sparkles size={19} /><p>Belum ada pesan di halaman ini.<br />Jadilah yang pertama meninggalkan doa.</p></div> : entries.map((entry) => <article className="guest-entry" key={entry.id}><div><strong>{entry.name}</strong><span>{entry.status} · {new Date(entry.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span></div><p>{entry.message}</p></article>)}</div></section>;
}

function Gift() {
  const [copied, setCopied] = useState("");
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); setCopied(label); window.setTimeout(() => setCopied(""), 1800); } catch { setCopied("gagal"); } };
  return <section id="gift" className="gift section-shell"><div className="gift-heading"><SectionKicker number="09">Tanda kasih</SectionKicker><h2>Doa Anda<br /><em>sudah cukup.</em></h2><p>Jika berkenan, Anda dapat menitipkan tanda kasih melalui pilihan berikut. Terima kasih atas niat baiknya.</p></div><div className="gift-details"><div className="gift-account"><div className="account-top"><span>{CONFIG.walletProvider}</span><Heart size={17} fill="currentColor" /></div><strong>{CONFIG.walletNumber}</strong><small>a.n. {CONFIG.accountName}</small><button onClick={() => copy(CONFIG.walletNumber, "wallet")}><Copy size={15} />{copied === "wallet" ? "Tersalin" : "Salin nomor"}</button></div><div className="gift-account indigo-account"><div className="account-top"><span>{CONFIG.accountBank}</span><Heart size={17} fill="currentColor" /></div><strong>{CONFIG.accountNumber}</strong><small>a.n. {CONFIG.accountName}</small><button onClick={() => copy(CONFIG.accountNumber, "bank")}><Copy size={15} />{copied === "bank" ? "Tersalin" : "Salin nomor"}</button></div><a className="payment-link" href={CONFIG.paymentLink} target="_blank" rel="noreferrer"><span><ExternalLink size={18} />{CONFIG.paymentLink.replace("https://", "")}</span><ArrowUpRightIcon /></a></div></section>;
}

function ArrowUpRightIcon() { return <ArrowDownRight size={18} className="rotate-up" />; }

function MusicToggle({ musicOn, onToggle }: { musicOn: boolean; onToggle: () => void }) {
  return <button className={`music-toggle ${musicOn ? "is-playing" : ""}`} onClick={onToggle} aria-label={musicOn ? "Matikan musik" : "Nyalakan musik"}>{musicOn ? <Pause size={16} /> : <Play size={16} />}<span>{musicOn ? "Musik on" : "Musik off"}</span><i /></button>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const guest = useMemo(getGuestName, []);
  const finishLoading = () => setLoading(false);
  useEffect(() => { try { const saved = localStorage.getItem("raka-anjani-guestbook"); if (saved) setEntries(JSON.parse(saved)); } catch { /* ignore unavailable storage */ } }, []);
  useEffect(() => { document.body.classList.toggle("invite-locked", !opened); return () => document.body.classList.remove("invite-locked"); }, [opened]);
  const openInvitation = () => { setOpened(true); window.setTimeout(() => document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" }), 300); };
  const submitEntry = (entry: GuestbookEntry) => { const next = [entry, ...entries]; setEntries(next); try { localStorage.setItem("raka-anjani-guestbook", JSON.stringify(next)); } catch { /* storage is optional */ } };
  const toggleMusic = () => { if (!audioRef.current) return; if (musicOn) { audioRef.current.pause(); setMusicOn(false); } else { audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false)); } };
  return <>
    {loading && <Preloader onDone={finishLoading} />}
    {!opened && !loading && <Cover guest={guest} onOpen={openInvitation} />}
    {opened && <div className="invitation-page"><audio ref={audioRef} src={CONFIG.ambientTrack} loop preload="none" aria-hidden="true" /><Header openMusic={toggleMusic} musicOn={musicOn} /><main><Intro /><Story /><Events /><Countdown /><Gallery onSelect={setLightboxIndex} /><Rsvp onSubmitted={submitEntry} /><Guestbook entries={entries} /><Gift /></main><footer className="site-footer"><Mark light /><p>Terima kasih telah menjadi<br /><em>bagian dari hari kami.</em></p><div><span>{CONFIG.shortNames}</span><span>{CONFIG.dateLabel}</span></div><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a></footer><MusicToggle musicOn={musicOn} onToggle={toggleMusic} /><nav className="mobile-bottom-nav" aria-label="Navigasi cepat">{navItems.slice(0, 4).map((item) => <button key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}><span>{item.id === "story" ? "01" : item.id === "events" ? "02" : item.id === "gallery" ? "03" : "04"}</span>{item.label}</button>)}</nav></div>}
    {lightboxIndex !== null && <Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />}
  </>;
}
