import { useState } from "react";
import "../css/SonkijeongMemoryArchive.css";

/* =========================================================
   SONKIJEONG MEMORY ARCHIVE DATA
========================================================= */

const records = [
  {
    id: 1,
    number: "01",
    year: "ARCHIVE 01",

    title: "사진으로 남은 손기정의 기록",

    image:
      "/image/sonkijeong/place/sonkijeong-record01.png",

    description:
      "손기정과 그의 시대를 보여주는 기록 이미지입니다. 당시의 사진과 자료를 통해 한 선수의 기록이 남겨진 시간을 살펴봅니다.",
  },

  {
    id: 2,
    number: "02",
    year: "ARCHIVE 02",

    title: "신문과 기록 속 손기정",

    image:
      "/image/sonkijeong/place/sonkijeong-record02.png",

    description:
      "신문과 인쇄물에 남겨진 손기정 관련 기록입니다. 한 인물이 당시 사회에서 어떻게 기록되고 기억되었는지 살펴볼 수 있습니다.",
  },

  {
    id: 3,
    number: "03",
    year: "ARCHIVE 03",

    title: "기억을 보존하는 자료",

    image:
      "/image/sonkijeong/place/sonkijeong-record03.png",

    description:
      "손기정과 관련된 시대의 흔적을 보여주는 자료입니다. 사진뿐 아니라 남겨진 기록과 물건 역시 역사를 기억하는 중요한 단서가 됩니다.",
  },

  {
    id: 4,
    number: "04",
    year: "ARCHIVE 04",

    title: "시간을 넘어 남은 기록",

    image:
      "/image/sonkijeong/place/sonkijeong-record04.png",

    description:
      "시간이 흐른 뒤에도 보존되고 기억되는 손기정 관련 기록을 살펴봅니다. 하나의 기록이 어떻게 다음 세대의 기억으로 이어지는지를 보여줍니다.",
  },

  {
    id: 5,
    number: "05",
    year: "ARCHIVE 05",

    title: "오늘까지 이어지는 기억",

    image:
      "/image/sonkijeong/place/sonkijeong-record05.png",

    description:
      "손기정의 기록은 당시의 사건에 머물지 않고 이후에도 여러 형태로 기억되고 있습니다. 남겨진 자료를 통해 그 기억의 흔적을 살펴봅니다.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function SonkijeongMemoryArchive() {
  const [selectedRecord, setSelectedRecord] =
    useState(0);

  const currentRecord =
    records[selectedRecord];

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousRecord = () => {
    setSelectedRecord((prev) =>
      prev === 0
        ? records.length - 1
        : prev - 1
    );
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const nextRecord = () => {
    setSelectedRecord((prev) =>
      prev === records.length - 1
        ? 0
        : prev + 1
    );
  };

  return (
    <section className="son-memory-section">

      {/* ===================================================
          SECTION TITLE
      =================================================== */}

      <div className="son-memory-heading">

        <span className="son-memory-eyebrow">
          MEMORY ARCHIVE
        </span>

        <h2>
          기록으로 남은
          <br />
          <em>손기정의 시간</em>
        </h2>

        <p>
          사진과 기록을 따라
          한 선수와 그 시대의 흔적을 살펴봅니다.
        </p>

      </div>


      {/* ===================================================
          MAIN ARCHIVE
      =================================================== */}

      <div className="son-memory-main">

        {/* ===============================================
            IMAGE
        =============================================== */}

        <div className="son-memory-image-area">

          <div className="son-memory-image-frame">

            <img
              src={currentRecord.image}
              alt={currentRecord.title}
            />

          </div>


          {/* RECORD NUMBER */}

          <div className="son-memory-image-number">

            <span>
              RECORD
            </span>

            <strong>
              {currentRecord.number}
            </strong>

          </div>


          {/* PREVIOUS */}

          <button
            type="button"
            className="son-memory-arrow son-memory-prev"
            onClick={previousRecord}
            aria-label="이전 기록"
          >
            ‹
          </button>


          {/* NEXT */}

          <button
            type="button"
            className="son-memory-arrow son-memory-next"
            onClick={nextRecord}
            aria-label="다음 기록"
          >
            ›
          </button>

        </div>


        {/* ===============================================
            TEXT
        =============================================== */}

        <div className="son-memory-info">

          <span className="son-memory-record-label">
            {currentRecord.year}
          </span>

          <div className="son-memory-rule" />

          <span className="son-memory-small">
            SON KEE-CHUNG RECORD
          </span>

          <h3>
            {currentRecord.title}
          </h3>

          <p>
            {currentRecord.description}
          </p>


          {/* COUNTER */}

          <div className="son-memory-counter">

            <strong>
              {String(
                selectedRecord + 1
              ).padStart(2, "0")}
            </strong>

            <span>/</span>

            <span>
              {String(
                records.length
              ).padStart(2, "0")}
            </span>

          </div>

        </div>

      </div>


      {/* ===================================================
          THUMBNAILS
      =================================================== */}

      <div className="son-memory-thumbnails">

        {records.map((record, index) => (

          <button
            key={record.id}
            type="button"
            className={
              selectedRecord === index
                ? "son-memory-thumb active"
                : "son-memory-thumb"
            }
            onClick={() =>
              setSelectedRecord(index)
            }
          >

            <div className="son-memory-thumb-image">

              <img
                src={record.image}
                alt=""
              />

            </div>

            <span>
              {record.number}
            </span>

          </button>

        ))}

      </div>


      {/* ===================================================
          SOURCE
      =================================================== */}

      <p className="son-memory-source">
        ※ 본 섹션은 손기정과 관련된 사진 및
        기록 자료를 아카이브 형식으로 구성했습니다.
      </p>

    </section>
  );
}