import { useEffect, useState } from "react";

export default function BreakingNewsPopup({
  isOpen,
  onClose,
  playWhooshSound,
  cards = [],
}) {
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentCard(0);
    }
  }, [isOpen]);

  const nextCard = () => {
    if (cards.length === 0) return;

    playWhooshSound?.();

    setCurrentCard((prev) =>
      prev === cards.length - 1 ? 0 : prev + 1
    );
  };

  const previousCard = () => {
    if (cards.length === 0) return;

    playWhooshSound?.();

    setCurrentCard((prev) =>
      prev === 0 ? cards.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }

      if (event.key === "ArrowRight") {
        nextCard();
      }

      if (event.key === "ArrowLeft") {
        previousCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, cards.length]);

  if (!isOpen) return null;

  return (
    <div
      className="breaking-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="죽첨정 사건 호외"
    >
      <div className="breaking-popup">

        {/* CLOSE */}
        <button
          type="button"
          className="breaking-close"
          onClick={onClose}
          aria-label="호외 닫기"
        >
          ×
        </button>

        {/* PREVIOUS */}
        <button
          type="button"
          className="breaking-arrow breaking-prev"
          onClick={previousCard}
          aria-label="이전 호외"
        >
          ‹
        </button>

        {/* CARD */}
        <div className="breaking-card-wrap">
          {cards.length > 0 && (
            <img
              className="breaking-card-image"
              src={cards[currentCard]}
              alt={`죽첨정 사건 호외 카드 ${currentCard + 1}`}
            />
          )}
        </div>

        {/* NEXT */}
        <button
          type="button"
          className="breaking-arrow breaking-next"
          onClick={nextCard}
          aria-label="다음 호외"
        >
          ›
        </button>

        {/* PAGINATION */}
        <div className="breaking-pagination">
          <div className="breaking-dots">
            {cards.map((_, index) => (
              <button
                key={index}
                type="button"
                className={currentCard === index ? "active" : ""}
                onClick={() => {
                  playWhooshSound?.();
                  setCurrentCard(index);
                }}
                aria-label={`호외 ${index + 1}번 보기`}
              />
            ))}
          </div>

          <span className="breaking-counter">
            {currentCard + 1} / {cards.length}
          </span>
        </div>
      </div>
    </div>
  );
}