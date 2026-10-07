import { useEffect, useState } from "react";

export default function DetailHero({
  slides = [],
  showReopenButton,
  onReopenBreakingNews,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* =========================================================
     HERO AUTO SLIDE
  ========================================================= */

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  /* 사건이 바뀌면 첫 번째 슬라이드부터 */
  useEffect(() => {
    setCurrentSlide(0);
  }, [slides]);

  return (
    <section className="hero-slider">

      {/* ===============================================
          HERO IMAGES
      =============================================== */}

      <div className="hero-images">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            className={
              index === currentSlide
                ? "active"
                : ""
            }
          />
        ))}
      </div>

      {/* ===============================================
          DARK OVERLAY
      =============================================== */}

      <div className="hero-overlay" />

      {/* ===============================================
          FIXED HERO TEXT
      =============================================== */}

      <div className="hero-content">

        <span className="hero-meta">
          1933.05 | 京城 ｜ 社會面
        </span>

        <h1>
          죽첨정에서 발견된
          <br />
          의문의 사건
        </h1>

        <p>
          경성을 뒤흔든 의문의 사건
        </p>

      </div>

      {/* ===============================================
          號外 다시보기
      =============================================== */}

      {showReopenButton && (
        <button
          type="button"
          className="breaking-news-reopen"
          onClick={onReopenBreakingNews}
        >
          號外 다시보기
        </button>
      )}

    </section>
  );
}