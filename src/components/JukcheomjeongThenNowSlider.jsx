import { useState } from "react";
import "../css/ThenNowSlider.css";

/* =========================================================
   PLACE ARCHIVE DATA
========================================================= */

const places = [
  {
    id: 1,
    number: "01",

    title: "죽첨정 일대",
    oldName: "竹添町",
    currentName: "현재의 서울",

    pairs: [
      {
        past:
          "/image/Jukcheomjeong/place/apartment-past.jpg",

        present:
          "/image/Jukcheomjeong/place/apartment-present.jpg",
      },
    ],

    description:
      "기록 사진에 남아 있는 죽첨정 일대의 과거 모습과 현재의 풍경을 함께 비교해봅니다. 같은 공간에 쌓인 시간의 변화를 사진을 통해 살펴볼 수 있습니다.",
  },

  {
    id: 2,
    number: "02",

    title: "조선식산은행",
    oldName: "朝鮮殖産銀行",
    currentName: "현재의 서울",

    pairs: [
      {
        past:
          "/image/Jukcheomjeong/place/bank-past01.jpg",

        present:
          "/image/Jukcheomjeong/place/bank-present01.jpg",
      },

      {
        past:
          "/image/Jukcheomjeong/place/bank-past02.png",

        present:
          "/image/Jukcheomjeong/place/bank-present02.jpg",
      },
    ],

    description:
      "조선식산은행과 그 주변 공간의 과거 기록을 현재의 모습과 함께 살펴봅니다. 서로 다른 시기의 사진을 통해 건물과 거리, 주변 풍경이 어떻게 달라졌는지 비교할 수 있습니다.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function JukcheomjeongThenNowSlider(){
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
          사진이 2세트 이상인 장소에서만 표시
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