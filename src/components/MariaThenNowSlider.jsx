import { useState } from "react";
import "../css/ThenNowSlider.css";

/* =========================================================
   MARIA PLACE ARCHIVE DATA
========================================================= */

const places = [
  {
    id: 1,
    number: "01",

    title: "부산역",
    oldName: "釜山驛",
    currentName: "현재의 부산역",

    pairs: [
      {
        past:
          "/image/maria/place/busan-station-1930.jpg",

        present:
          "/image/maria/place/busan-station-2026.jpg",
      },
    ],

    description:
      "1930년대 부산역의 기록 사진과 현재 부산역의 모습을 함께 비교해봅니다. 부산의 관문이었던 공간이 시간의 흐름에 따라 어떻게 변화했는지 살펴볼 수 있습니다.",
  },

  {
    id: 2,
    number: "02",

    title: "초량 일대",
    oldName: "草梁",
    currentName: "현재의 부산 초량",

    pairs: [
      {
        past:
          "/image/maria/place/choryang-1930.jpg",

        present:
          "/image/maria/place/choryang-2026.jpg",
      },

      {
        past:
          "/image/maria/place/choryang-1930-02.jpg",

        present:
          "/image/maria/place/choryang-2026-02.jpg",
      },
    ],

    description:
      "초량 일대의 과거 기록 사진과 현재의 모습을 함께 비교해봅니다. 부산역과 인접한 이 지역의 거리와 주변 풍경이 시간에 따라 어떻게 달라졌는지 살펴볼 수 있습니다.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function MariaThenNowSlider() {
  const [selectedPlace, setSelectedPlace] =
    useState(0);

  const [selectedPair, setSelectedPair] =
    useState(0);

  const [sliderPosition, setSliderPosition] =
    useState(50);

  const currentPlace =
    places[selectedPlace];

  const currentPair =
    currentPlace.pairs[selectedPair];

  /* =======================================================
     장소 변경
  ======================================================= */

  const changePlace = (index) => {
    setSelectedPlace(index);
    setSelectedPair(0);
    setSliderPosition(50);
  };

  /* =======================================================
     사진 변경
  ======================================================= */

  const changePair = (index) => {
    setSelectedPair(index);
    setSliderPosition(50);
  };

  return (
    <div className="then-now-archive">

      {/* ===================================================
          01 / 02 장소 선택
      =================================================== */}

      <div className="place-top-tabs">

        {places.map((place, index) => (
          <button
            key={place.id}
            type="button"
            className={
              selectedPlace === index
                ? "place-top-tab active"
                : "place-top-tab"
            }
            onClick={() =>
              changePlace(index)
            }
          >
            <span>
              {place.number}
            </span>

            <strong>
              {place.title}
            </strong>
          </button>
        ))}

      </div>

      {/* ===================================================
          큰 사진 비교
      =================================================== */}

      <div className="then-now-image-area">

        {/* 현재 사진 */}

        <img
          className="then-now-image now-image"
          src={currentPair.present}
          alt={`${currentPlace.title} 현재 모습`}
        />

        {/* 과거 사진 */}

        <img
          className="then-now-image past-image"
          src={currentPair.past}
          alt={`${currentPlace.title} 과거 모습`}
          style={{
            clipPath: `inset(
              0 ${100 - sliderPosition}% 0 0
            )`,
          }}
        />

        {/* THEN */}

        <div className="place-image-label past-label">

          <span>THEN</span>

          <strong>過去</strong>

        </div>

        {/* NOW */}

        <div className="place-image-label now-label">

          <span>NOW</span>

          <strong>現在</strong>

        </div>

        {/* 중앙선 */}

        <div
          className="comparison-line"
          style={{
            left: `${sliderPosition}%`,
          }}
        >

          <div className="comparison-handle">

            <span>‹</span>

            <i />

            <span>›</span>

          </div>

        </div>

        {/* 드래그 */}

        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(event) =>
            setSliderPosition(
              Number(
                event.target.value
              )
            )
          }
          aria-label="과거와 현재 사진 비교"
        />

        {/* 사진 내부 안내 */}

        <div className="comparison-guide">

          <span>↔</span>

          손잡이를 움직여 과거와 현재를 비교해보세요

        </div>

        {/* 사진 하단 */}

        <div className="photo-caption photo-caption-left">

          <strong>過去</strong>

          <span>기록 속 풍경</span>

        </div>

        <div className="photo-caption photo-caption-right">

          <strong>現在</strong>

          <span>오늘의 풍경</span>

        </div>

      </div>

      {/* ===================================================
          PHOTO 01 / PHOTO 02
      =================================================== */}

      {currentPlace.pairs.length > 1 && (

        <div className="place-photo-selector">

          <span className="place-photo-selector-title">
            PHOTO ARCHIVE
          </span>

          <div className="place-photo-selector-buttons">

            {currentPlace.pairs.map(
              (_, index) => (

                <button
                  key={index}
                  type="button"
                  className={
                    selectedPair === index
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changePair(index)
                  }
                >
                  PHOTO{" "}

                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </button>

              )
            )}

          </div>

        </div>

      )}

      {/* ===================================================
          아래 설명
      =================================================== */}

      <div className="place-info-bottom">

        <div className="place-info-number">
          {currentPlace.number}
        </div>

        <div className="place-info-content">

          <span className="place-info-eyebrow">
            PLACE RECORD
          </span>

          <h3>
            {currentPlace.title}
          </h3>

          <div className="place-name-change">

            <div>
              <small>
                THEN
              </small>

              <strong>
                {currentPlace.oldName}
              </strong>
            </div>

            <span className="place-change-arrow">
              →
            </span>

            <div>
              <small>
                NOW
              </small>

              <strong>
                {currentPlace.currentName}
              </strong>
            </div>

          </div>

          <div className="place-info-rule" />

          <p className="place-description">
            {currentPlace.description}
          </p>

        </div>

      </div>

      {/* ===================================================
          SOURCE
      =================================================== */}

      <p className="then-now-source">

        ※ 과거 기록 사진과 현재 사진은
        동일한 촬영 각도가 아닌,
        해당 장소와 일대의 시대 변화를
        비교하기 위한 자료입니다.

      </p>

    </div>
  );
}