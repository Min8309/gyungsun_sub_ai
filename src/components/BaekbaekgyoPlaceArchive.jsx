import { useState } from "react";
import "../css/BaekbaekgyoPlaceArchive.css";


/* =========================================================
   PLACE ARCHIVE DATA
========================================================= */

const places = [
  {
    id: 1,
    number: "01",

    title: "왕십리",
    oldName: "往十里",
    category: "CASE ORIGIN",

    subtitle: "사건 기록이 시작된 공간",

    images: [
      {
        src: "/image/baekbaekgyo/place/wangsimni-1930.jpg",
        label: "1930s",
        title: "1930년대 왕십리",
        description:
          "1930년대 왕십리 일대의 모습을 담은 기록 사진입니다.",
      },

      {
        src: "/image/baekbaekgyo/place/wangsimni-location.jpg",
        label: "LOCATION",
        title: "현재의 왕십리 일대",
        description:
          "오늘날 왕십리 일대를 통해 기록 속 공간의 현재 위치를 살펴봅니다.",
      },
    ],

    description:
      "백백교 사건 관련 기록에 등장하는 왕십리 일대를 과거 사진과 현재의 공간 자료를 통해 살펴봅니다.",
  },


  {
    id: 2,
    number: "02",

    title: "사건 기록 지도",
    oldName: "事件記錄",
    category: "CASE MAP",

    subtitle: "기록에 남은 사건의 공간",

    images: [
      {
        src: "/image/baekbaekgyo/place/incident-map.jpg",
        label: "MAP",
        title: "사건 관련 지점",
        description:
          "사건 기록에 등장하는 여러 지점을 한눈에 살펴볼 수 있도록 정리한 지도입니다.",
      },
    ],

    description:
      "백백교 사건은 하나의 장소에만 머물지 않았습니다. 기록에 등장하는 여러 지점을 지도 위에서 살펴보며 사건의 공간적 범위를 확인합니다.",
  },


  {
    id: 3,
    number: "03",

    title: "가평",
    oldName: "加平",
    category: "FIELD RECORD",

    subtitle: "수사가 향한 현장",

    images: [
      {
        src: "/image/baekbaekgyo/place/gapyeong-record.jpg",
        label: "ARCHIVE",
        title: "가평 현장 기록",
        description:
          "백백교 사건 수사 과정과 관련해 남겨진 가평 지역의 기록 자료입니다.",
      },
    ],

    description:
      "수사가 확대되면서 여러 지역이 사건 기록에 등장합니다. 가평과 관련해 남아 있는 자료를 통해 당시 수사가 향했던 공간을 살펴봅니다.",
  },
];


/* =========================================================
   COMPONENT
========================================================= */

export default function BaekbaekgyoPlaceArchive() {

  const [selectedPlace, setSelectedPlace] =
    useState(0);

  const [selectedImage, setSelectedImage] =
    useState(0);


  const currentPlace =
    places[selectedPlace];

  const currentImage =
    currentPlace.images[selectedImage];


  /* =======================================================
     PLACE CHANGE
  ======================================================= */

  const changePlace = (index) => {

    setSelectedPlace(index);

    setSelectedImage(0);

  };


  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

  const changeImage = (index) => {

    setSelectedImage(index);

  };


  return (

    <div className="baekbaek-place-archive">


      {/* ===================================================
          PLACE TABS
      =================================================== */}

      <div className="baekbaek-place-tabs">

        {places.map((place, index) => (

          <button
            key={place.id}
            type="button"

            className={
              selectedPlace === index
                ? "baekbaek-place-tab active"
                : "baekbaek-place-tab"
            }

            onClick={() =>
              changePlace(index)
            }
          >

            <span>
              {place.number}
            </span>

            <div>

              <small>
                {place.category}
              </small>

              <strong>
                {place.title}
              </strong>

            </div>

          </button>

        ))}

      </div>


      {/* ===================================================
          MAIN RECORD
      =================================================== */}

      <div className="baekbaek-place-main">


        {/* ===============================================
            IMAGE
        =============================================== */}

        <div className="baekbaek-place-image-area">

          <img
            src={currentImage.src}
            alt={`${currentPlace.title} ${currentImage.title}`}
          />


          <div className="baekbaek-place-image-label">

            <span>
              {currentImage.label}
            </span>

            <strong>
              {currentImage.title}
            </strong>

          </div>


          <div className="baekbaek-place-number">

            {currentPlace.number}

          </div>

        </div>


        {/* ===============================================
            INFO
        =============================================== */}

        <div className="baekbaek-place-info">

          <span className="baekbaek-place-eyebrow">
            {currentPlace.category}
          </span>


          <h3>
            {currentPlace.title}
          </h3>


          <div className="baekbaek-place-old-name">

            <span>
              RECORD
            </span>

            <strong>
              {currentPlace.oldName}
            </strong>

          </div>


          <div className="baekbaek-place-rule" />


          <strong className="baekbaek-place-subtitle">

            {currentPlace.subtitle}

          </strong>


          <p className="baekbaek-place-description">

            {currentPlace.description}

          </p>


          <div className="baekbaek-current-record">

            <span>
              CURRENT RECORD
            </span>

            <p>
              {currentImage.description}
            </p>

          </div>

        </div>

      </div>


      {/* ===================================================
          PHOTO SELECTOR
      =================================================== */}

      {currentPlace.images.length > 1 && (

        <div className="baekbaek-photo-selector">

          <span>
            PHOTO ARCHIVE
          </span>


          <div>

            {currentPlace.images.map(
              (image, index) => (

                <button
                  key={image.src}
                  type="button"

                  className={
                    selectedImage === index
                      ? "active"
                      : ""
                  }

                  onClick={() =>
                    changeImage(index)
                  }
                >

                  <img
                    src={image.src}
                    alt=""
                  />

                  <span>
                    PHOTO{" "}
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                </button>

              )
            )}

          </div>

        </div>

      )}


      {/* ===================================================
          SOURCE
      =================================================== */}

      <p className="baekbaek-place-source">

        ※ 본 아카이브는 사건 관련 기록에 등장하는
        장소와 공간 자료를 바탕으로 구성했습니다.

      </p>

    </div>

  );
}