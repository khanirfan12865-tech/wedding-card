// src/WeddingCard.jsx
import React, { useEffect, useRef, useState } from "react";
import "./WeddingCard.css";

const targetNikahDate = new Date("2026-03-29T23:00:00+05:30");

const WeddingCard = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, expired: false });
  const [activePage, setActivePage] = useState("invitation");
  const [guestName, setGuestName] = useState("Respected Guest");
  const [attendanceResponse, setAttendanceResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reveal main page after Bismillah intro (shorter delay as requested)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetNikahDate.getTime() - now;
      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, expired: true });
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown({ days, hours, minutes, expired: false });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawName = params.get("name");
      if (rawName && rawName.trim().length > 0) {
        const withSpaces = rawName.replace(/\+/g, " ");
        const decoded = decodeURIComponent(withSpaces);
        setGuestName(decoded || "Respected Guest");
      }
    } catch {
      setGuestName("Respected Guest");
    }
  }, []);

  useEffect(() => {
    // Replaced IntersectionObserver with reliable CSS animations to fix blank screen issues.
  }, [activePage]);

  const handleToggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // ensure audio is not muted and volume is up
    audio.muted = false;
    audio.volume = 1;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => {
          // playback started
        })
        .catch((err) => {
          // ignore autoplay / interruption errors
          console.warn("Audio play interrupted:", err);
        });
    }
    setIsPlaying((prev) => !prev);
  };

  const handleAddToCalendar = (type) => {
    const isNikah = type === "nikah";
    const title = isNikah
      ? "Nikah Ceremony – Shamsher & Shagufta"
      : "Walima Reception – Shamsher & Shagufta";
    const location = isNikah
      ? "At Cherki Lohapur, Moh. Haidar Nagar, P.S. Cherki, Dist. Gaya (Bihar)"
      : "Dumrawan Masjid, Gaya, Bihar";

    // Use local-style date-times (no timezone) for simplicity
    const start = isNikah ? "20260329T230000" : "20260331T230000";
    const end = isNikah ? "20260330T003000" : "20260401T003000";

    const details =
      "We warmly invite you to join us for this blessed occasion. Please remember the couple in your duas.";

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", title);
    url.searchParams.set("dates", `${start}/${end}`);
    url.searchParams.set("details", details);
    url.searchParams.set("location", location);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const handlePrintCard = () => {
    // Hint: best used on desktop for saving as PDF/printing
    window.print();
  };

  const handleShareWhatsApp = () => {
    try {
      const currentUrl = window.location.href;
      const message =
        "Assalamu Alaikum,\nAapko hamari shaadi mein dawat hai.\nYeh hamara digital card hai:\n" +
        currentUrl;
      const encoded = encodeURIComponent(message);
      const shareUrl = `https://wa.me/?text=${encoded}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Unable to open WhatsApp share:", err);
    }
  };

  const InvitationPage = () => (
    <>
      <header className="wedding-header">
        <p className="bismillah-arabic animate fade delay-1">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="bismillah animate fade delay-2">
          In the Name of Allah, the Most Gracious, the Most Merciful
        </p>
        <h1 className="animate fade delay-2">Wedding Invitation</h1>
        <div className="save-date-badge animate fade delay-3">
          Save The Date – 29 &amp; 31 March 2026
        </div>
        <p className="verse animate fade delay-3">
          “And among His signs is that He created for you mates from among
          yourselves, that you may find tranquility in them, and He placed
          between you love and mercy.” — Quran 30:21
        </p>
        <p className="urdu-line animate fade delay-4">
          Nikah ek khoobsurat bandhan hai, jismein mohabbat, rehmat aur barkat hoti
          hai.
        </p>

        <div className="wc-guest-block highlighted-invite animate fade delay-4">
          <p className="wc-guest-greeting">
            Dear {guestName || "Respected Guest"} &amp; Family,
          </p>
          <p className="wc-guest-message">
            This invitation is especially for you and your loved ones. Your presence and
            duas will mean a lot to both of our families, and we feel blessed to share
            this special day with you.
          </p>
          <p className="wc-guest-message wc-guest-message-secondary">
            Aapki ek muskurahat aur ek dua hamare liye bohot badi barkat hai.
          </p>
        </div>
      </header>

      <div className="elegant-divider animate rise delay-5" aria-hidden="true"><span className="divider-diamond"></span></div>

      <section className="couple-grid">
        <div className="person-card groom animate rise delay-5">
          <p className="label">The Groom</p>
          <p className="name premium-name">Shamsher Khan</p>
          <p className="parent">Son of Shabir Khan</p>
        </div>
        <div className="person-card bride animate rise delay-5">
          <p className="label">The Bride</p>
          <p className="name premium-name">Shagufta Khatoon</p>
          <p className="parent">Daughter of Shamsir Alam</p>
        </div>
      </section>

      <div className="elegant-divider animate rise delay-6" aria-hidden="true"><span className="divider-diamond"></span></div>

      <section className="info-grid">
        <div className="info-card animate rise delay-6">
          <h2 className="premium-title">Nikah Ceremony</h2>
          <div className="info-compact">
            <p>
              <span>Date</span>
              <strong>29 March 2026</strong>
            </p>
            <p>
              <span>Time</span>
              <strong>11:00 PM</strong>
            </p>
          </div>
          <div className="location-row">
            <span>Location</span>
            <strong className="wc-event-location">
              At Cherki Lohapur, Moh. Haidar Nagar,<br />
              P.S. Cherki, Dist. Gaya (Bihar)
            </strong>
          </div>
          <div className="card-actions">
            <a
              className="map-button"
              href="https://www.google.com/maps/search/?api=1&query=Cherki+Lohapur,+Gaya,+Bihar"
              target="_blank"
              rel="noreferrer"
              aria-label="Open location in Google Maps"
            >
              <span className="icon">📍</span> Open Location in Google Maps
            </a>
            <button
              type="button"
              className="calendar-btn"
              onClick={() => handleAddToCalendar("nikah")}
              aria-label="Add Nikah ceremony to calendar"
            >
              <span className="icon">📅</span> Add Nikah to Calendar
            </button>
          </div>
        </div>

        <div className="info-card animate rise delay-6">
          <h2 className="premium-title">Walima Reception</h2>
          <div className="info-compact">
            <p>
              <span>Date</span>
              <strong>31 March 2026</strong>
            </p>
            <p>
              <span>Time</span>
              <strong>11:00 PM</strong>
            </p>
          </div>
          <div className="location-row">
            <span>Location</span>
            <strong className="wc-event-location">
              Dumrawan Masjid, Gaya, Bihar
            </strong>
          </div>
          <div className="card-actions">
            <a
              className="map-button"
              href="https://www.google.com/maps/search/?api=1&query=Dumrawan+Masjid,+Gaya,+Bihar"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Dumrawan Masjid location in Google Maps"
            >
              <span className="icon">📍</span> Open Masjid in Google Maps
            </a>
            <button
              type="button"
              className="calendar-btn"
              onClick={() => handleAddToCalendar("walima")}
              aria-label="Add Walima reception to calendar"
            >
              <span className="icon">📅</span> Add Walima to Calendar
            </button>
          </div>
        </div>
      </section>

      <section className="countdown-section animate fade delay-7">
        <div className="countdown-display">
          {countdown.expired ? (
            <div className="celebration-section animate scale-up">
              <div className="celebration-glow"></div>
              <div className="confetti-container">
                {[...Array(12)].map((_, i) => <span key={i} className={`confetti-piece p${i}`}></span>)}
              </div>

              <div className="wedding-rings-icon">
                <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="30" r="20" fill="none" stroke="#f5c189" strokeWidth="3" />
                  <circle cx="60" cy="30" r="20" fill="none" stroke="#f5c189" strokeWidth="3" />
                </svg>
              </div>

              <h3 className="celebration-title premium-title">Nikah Mubarak</h3>
              <p className="celebration-subtitle">Alhamdulillah, The Big Day Has Arrived</p>

              <p className="celebration-dua arabic-script" dir="rtl">
                بارك الله لكما وبارك عليكما وجمع بينكما في خير
              </p>
            </div>
          ) : (
            <>
              <h3 className="premium-subtitle">Countdown to Nikah</h3>
              <div className="countdown-blocks">
                <div className="count-block">
                  <span className="count-digit">{countdown.days}</span>
                  <span className="count-label">Days</span>
                </div>
                <div className="count-block">
                  <span className="count-digit">{countdown.hours}</span>
                  <span className="count-label">Hrs</span>
                </div>
                <div className="count-block">
                  <span className="count-digit">{countdown.minutes}</span>
                  <span className="count-label">Mins</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="host-section animate fade delay-7">
        <h3 className="premium-subtitle">Hosted By</h3>
        <p>Mr. &amp; Mrs. Shabir Khan &amp; Family</p>
        <p>Mr. &amp; Mrs. Shamsir Alam &amp; Family</p>
      </section>

      <section className="rsvp-section animate fade delay-8">
        <h3 className="premium-subtitle">RSVP</h3>
        <p>
          <span className="icon">☎</span> Phone: +91 9504639220
        </p>
        <p>
          <span className="icon">✉</span> Email: neyajkhan0709181@gmail.com
        </p>
      </section>

      <section className="attendance-section animate fade delay-8">
        <p className="attendance-question">
          Will you be able to join us, In Sha Allah?
        </p>
        <div className="attendance-buttons">
          <button
            type="button"
            className="attendance-btn attendance-yes"
            onClick={() =>
              setAttendanceResponse(
                "Alhamdulillah, we are happy you will join us!"
              )
            }
          >
            In Sha Allah, I will attend 🤍
          </button>
          <button
            type="button"
            className="attendance-btn attendance-whatsapp"
            onClick={() => {
              const msg = encodeURIComponent(`Assalamu Alaikum, In Sha Allah main (${guestName}) zaroor shamil hounga! 🤍`);
              window.open(`https://wa.me/919504639220?text=${msg}`, "_blank");
            }}
          >
            <span className="icon">💬</span> RSVP via WhatsApp
          </button>
        </div>
        {attendanceResponse && (
          <p className="attendance-response">{attendanceResponse}</p>
        )}
      </section>

      <div className="nasheed-control">
        <button
          type="button"
          className="nasheed-btn music-toggle-btn"
          onClick={handleToggleMusic}
          aria-label={
            isPlaying ? "Pause Nikah nasheed audio" : "Play Nikah nasheed audio"
          }
        >
          {isPlaying ? "Pause Nikah Nasheed ❚❚" : "Play Nikah Nasheed ♪"}
        </button>
      </div>

      <div className="share-control">
        <button
          type="button"
          className="share-btn whatsapp-share-btn"
          onClick={handleShareWhatsApp}
          aria-label="Share this wedding invitation on WhatsApp"
        >
          Share on WhatsApp 📩
        </button>
      </div>

      <footer className="invitation-footer animate fade delay-9">
        <p>We request the honor of your presence and duas on this blessed occasion.</p>
        <p className="urdu-footer">
          Aap ki hazri aur duaon se yeh din aur bhi yaadgaar ho jayega.
        </p>
        <button
          type="button"
          className="calendar-btn download-btn"
          onClick={handlePrintCard}
          aria-label="Download or print this wedding card"
        >
          Download Card
        </button>
      </footer>
    </>
  );

  const DetailsPage = () => (
    <>
      <header className="details-header animate fade delay-1">
        <p className="details-kicker">Details &amp; Duas</p>
        <h2>With Hearts Full of Shukr</h2>
        <p className="details-subtext">
          A gentle glimpse into the duas, schedule, and etiquette for this blessed
          celebration.
        </p>
      </header>

      <div className="elegant-divider animate rise delay-2" aria-hidden="true"><span className="divider-diamond"></span></div>

      <section className="journey-section animate rise delay-3">
        <h3>Our Journey</h3>
        <p className="journey-text">
          Alhamdulillah, our paths crossed in the most beautiful way. What started as a
          family introduction blossomed into a journey of respect, understanding, and
          sab'r. We are excited to step into this new chapter of life with the blessings
          of our beloved parents and the guidance of Allah.
        </p>
      </section>

      <div className="elegant-divider animate rise delay-3" aria-hidden="true"><span className="divider-diamond"></span></div>

      <section className="duas-section animate rise delay-3">
        <h3>Our Duas &amp; Hopes</h3>
        <div className="dua-cards">
          <article className="dua-card">May Allah bless this nikah with love, mercy and barakah.</article>
          <article className="dua-card">
            We pray that Shamsher and Shagufta become a means of khair for each other.
          </article>
          <article className="dua-card">
            May their home always be filled with iman, sukoon and smiles.
          </article>
          <article className="dua-card">
            Dua hai ke yeh rishta hamesha mohabbat, izzat aur barkat se bhara rahe.
          </article>
        </div>
      </section>

      <section className="timeline-section animate rise delay-4">
        <h3>Program Schedule</h3>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-heading">
              <h4>Nikah</h4>
              <p>29 March 2026 · Cherki Lohapur, Gaya (Bihar)</p>
            </div>
            <ul>
              <li>
                <span>10:30 PM</span> Guests arrival
              </li>
              <li>
                <span>11:00 PM</span> Nikah ceremony &amp; dua
              </li>
            </ul>
          </div>

          <div className="timeline-item">
            <div className="timeline-heading">
              <h4>Walima</h4>
              <p>31 March 2026 · Dumrawan Masjid, Gaya, Bihar</p>
            </div>
            <ul>
              <li>
                <span>10:30 PM</span> Guests arrival
              </li>
              <li>
                <span>11:00 PM</span> Walima program &amp; dinner
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="etiquette-section animate rise delay-5">
        <h3>Dress &amp; Etiquette</h3>
        <ul>
          <li>Kindly dress modestly in a way suitable for the masjid.</li>
          <li>Please try to arrive 15–20 minutes early.</li>
          <li>We request you to keep the environment calm and respectful.</li>
          <li>Remember us in your duas throughout the evening.</li>
        </ul>
      </section>

      <section className="locations-section animate rise delay-6">
        <div className="location-card">
          <h4>Nikah Ceremony</h4>
          <p>Cherki Lohapur, Gaya</p>
          <div className="map-preview">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115822.75336683526!2d84.88720496155694!3d24.88241065094269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32affffffffff%3A0xeab4ddb75496a7eb!2sCherki%2C%20Bihar!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              width="100%"
              height="120"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              title="Nikah Map Preview"
            />
          </div>
        </div>
        <div className="location-card">
          <h4>Walima Reception</h4>
          <p>Dumrawan Masjid, Gaya</p>
          <div className="map-preview">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3370783857503!2d84.99222487443194!3d24.92055624285226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32bffffffffff%3A0x1111111111111111!2sGaya%2C%20Bihar!5e0!3m2!1sen!2sin!4v1711200000001!5m2!1sen!2sin"
              width="100%"
              height="120"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              title="Walima Map Preview"
            />
          </div>
        </div>
      </section>
    </>
  );

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="intro-bg-pattern"></div>
        <div className="intro-moon-outline" />
        <div className="intro-particles">
          {[...Array(8)].map((_, i) => <span key={i} />)}
        </div>
        <div className="loading-content">
          <p className="loading-arabic animate-bismillah premium-shimmer">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="loading-english animate-english">
            Bismillah hir Rahmanir Rahim
          </p>
          <div className="loading-progress-container">
            <div className="loading-line-intro-premium"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wedding-page">
      <div className="petal petal-one" aria-hidden />
      <div className="petal petal-two" aria-hidden />
      <div className="petal petal-three" aria-hidden />
      <div className="pattern-overlay" aria-hidden />
      <div className="floating-petals" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <button
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <div className="music-icon">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z" /></svg>
          )}
        </div>
      </button>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrows">
          <span></span>
          <span></span>
        </div>
      </div>

      <article className={`wedding-card ${activePage === "details" ? "details-active" : ""}`}>
        <div className="card-motif" aria-hidden />
        <div className="corner flourish-tl" aria-hidden />
        <div className="corner flourish-tr" aria-hidden />
        <div className="corner flourish-bl" aria-hidden />
        <div className="corner flourish-br" aria-hidden />

        <div className="monogram animate fade delay-1">
          <div className="monogram-ring">
            <img src="/logo_final.png" alt="S & S Logo" className="monogram-img" />
          </div>
        </div>

        <div className="page-toggle" role="tablist" aria-label="Wedding sections">
          <button
            type="button"
            className={`toggle-btn ${activePage === "invitation" ? "active" : ""}`}
            onClick={() => setActivePage("invitation")}
            role="tab"
            aria-selected={activePage === "invitation"}
          >
            Invitation
          </button>
          <button
            type="button"
            className={`toggle-btn ${activePage === "details" ? "active" : ""}`}
            onClick={() => setActivePage("details")}
            role="tab"
            aria-selected={activePage === "details"}
          >
            Details &amp; Duas
          </button>
        </div>

        <div
          key={activePage}
          className={`page-panel ${activePage === "details" ? "panel-details" : "panel-invitation"}`}
        >
          {activePage === "invitation" ? <InvitationPage /> : <DetailsPage />}
        </div>

        {/* Single persistent audio element for nasheed (always mounted) */}
        <audio ref={audioRef} src="/nasheed.mp3" loop controls={false} />
      </article>
    </div>
  );
};

export default WeddingCard;