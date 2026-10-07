import { useEffect, useRef, useState } from "react";
import "../css/ArchiveRadio.css";

/* =========================================================
   ARCHIVE RADIO DATA
========================================================= */

const radioCases = [
  {
    id: 1,
    channel: "CH 01",
    year: "1930년대 ~ 해방 전후",
    shortYear: "1930s",

    title: "약이 없던 시절,\n사람들은 아이의 무덤을 팠다",

    image:
      "/image/Jukcheomjeong/case/Jukcheomjeong-case01.png",

    audio:
      "/audio/Jukcheomjeong/Jukcheomjeong-radio01.mp3",

    description:
      "당시 사회에 남아 있던 민간신앙과 불안은 여러 사건의 배경이 되었습니다. 기록을 통해 그 시대 사람들이 질병과 죽음, 미신을 어떻게 받아들였는지 살펴봅니다.",
  },

  {
    id: 2,
    channel: "CH 02",
    year: "1953년 · 전북 남원",
    shortYear: "1953",

    title: "미신이 빼앗은 건\n아이 하나가 아니었다",

    image:
      "/image/Jukcheomjeong/case/Jukcheomjeong-case02.png",

    audio:
      "/audio/Jukcheomjeong/Jukcheomjeong-radio02.mp3",

    description:
      "전쟁 직후의 혼란과 불안 속에서도 비슷한 믿음과 사건은 계속해서 기록에 등장했습니다. 시대는 달라졌지만 사회적 불안과 미신이 결합되는 모습은 반복해서 나타납니다.",
  },

  {
    id: 3,
    channel: "CH 03",
    year: "1970년대",
    shortYear: "1970s",

    title: "갓난아이 무덤만\n골라 판 사람들",

    image:
      "/image/Jukcheomjeong/case/Jukcheomjeong-case03.png",

    audio:
      "/audio/Jukcheomjeong/Jukcheomjeong-radio03.mp3",

    description:
      "산업화가 진행되던 시기에도 오래된 믿음은 완전히 사라지지 않았습니다. 과거와 비슷한 사건들이 다시 기록되면서 사회 변화와 민간신앙이 공존했던 모습을 보여줍니다.",
  },

  {
    id: 4,
    channel: "CH 04",
    year: "2010년대 초",
    shortYear: "2010s",

    title: "죽첨정의 미신은\n캡슐이 되어 돌아왔다",

    image:
      "/image/Jukcheomjeong/case/Jukcheomjeong-case04.png",

    audio:
      "/audio/Jukcheomjeong/Jukcheomjeong-radio04.mp3",

    description:
      "오래된 믿음과 이야기는 현대에 들어 새로운 형태로 변주되기도 합니다. 과거의 기록이 어떻게 다른 모습으로 반복되고 소비되는지 살펴볼 수 있는 사례입니다.",
  },
];

/* =========================================================
   CHANNEL POSITION
========================================================= */

const channelPositions = [8, 36, 64, 92];

/* 다이얼 각도 */
const dialAngles = [-120, -40, 40, 120];

/* =========================================================
   COMPONENT
========================================================= */

export default function ArchiveRadio() {
  const [selectedChannel, setSelectedChannel] =
    useState(0);

  const [displayChannel, setDisplayChannel] =
    useState(0);

  const [frequencyPosition, setFrequencyPosition] =
    useState(channelPositions[0]);

  const [dialRotation, setDialRotation] =
    useState(dialAngles[0]);

  const [isTuning, setIsTuning] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [showMore, setShowMore] =
    useState(false);

  const audioRef = useRef(null);
  const staticRef = useRef(null);

  const tuningTimerRef = useRef(null);

  const dragStartXRef = useRef(0);
  const dragStartRotationRef = useRef(0);

  const currentCase =
    radioCases[displayChannel];

  /* =========================================================
     AUDIO 생성
  ========================================================= */

  useEffect(() => {
    const voiceAudio = new Audio(
      radioCases[0].audio
    );

    const staticAudio = new Audio(
      "/audio/Jukcheomjeong/radio-static.mp3"
    );

    voiceAudio.preload = "auto";

    staticAudio.preload = "auto";
    staticAudio.loop = true;
    staticAudio.volume = 0.34;

    audioRef.current = voiceAudio;
    staticRef.current = staticAudio;

    const handleTimeUpdate = () => {
      if (!voiceAudio.duration) return;

      setCurrentTime(
        voiceAudio.currentTime
      );

      setDuration(
        voiceAudio.duration
      );

      setProgress(
        (voiceAudio.currentTime /
          voiceAudio.duration) *
          100
      );
    };

    const handleLoadedMetadata = () => {
      setDuration(
        voiceAudio.duration || 0
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    voiceAudio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    voiceAudio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    voiceAudio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      clearTimeout(
        tuningTimerRef.current
      );

      voiceAudio.pause();
      staticAudio.pause();

      voiceAudio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      voiceAudio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      voiceAudio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, []);

  /* =========================================================
     시간 표시
  ========================================================= */

  const formatTime = (seconds) => {
    if (
      !seconds ||
      Number.isNaN(seconds)
    ) {
      return "00:00";
    }

    const minute =
      Math.floor(seconds / 60);

    const second =
      Math.floor(seconds % 60);

    return `${String(minute).padStart(
      2,
      "0"
    )}:${String(second).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================================================
     지지직 시작
  ========================================================= */

  const startStatic = () => {
    const staticAudio =
      staticRef.current;

    if (!staticAudio) return;

    staticAudio.currentTime = 0;

    staticAudio
      .play()
      .catch(() => {});
  };

  /* =========================================================
     지지직 종료
  ========================================================= */

  const stopStatic = () => {
    const staticAudio =
      staticRef.current;

    if (!staticAudio) return;

    staticAudio.pause();
    staticAudio.currentTime = 0;
  };

  /* =========================================================
     현재 음성 정지
  ========================================================= */

  const stopVoice = () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.pause();

    setIsPlaying(false);
  };

  /* =========================================================
     채널 도착 후 오디오 재생
  ========================================================= */

  const playChannel = (index) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.pause();

    audio.src =
      radioCases[index].audio;

    audio.currentTime = 0;

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        /*
          브라우저가 자동 재생을 막는 경우
          채널은 정상적으로 변경되고
          PLAY 버튼으로 재생 가능
        */
        setIsPlaying(false);
      });
  };

  /* =========================================================
     채널 튜닝
  ========================================================= */

  const tuneToChannel = (index) => {
    if (
      index < 0 ||
      index >= radioCases.length
    ) {
      return;
    }

    if (
      isTuning &&
      index === selectedChannel
    ) {
      return;
    }

    clearTimeout(
      tuningTimerRef.current
    );

    stopVoice();

    setIsTuning(true);
    setShowMore(false);

    startStatic();

    /* 빨간 주파수 점 이동 */

    requestAnimationFrame(() => {
      setFrequencyPosition(
        channelPositions[index]
      );

      setDialRotation(
        dialAngles[index]
      );
    });

    /*
      튜닝 시간.
      CSS의 주파수 이동시간과 맞춤.
    */

    tuningTimerRef.current =
      setTimeout(() => {
        stopStatic();

        setSelectedChannel(index);
        setDisplayChannel(index);

        setIsTuning(false);

        playChannel(index);
      }, 1100);
  };

  /* =========================================================
     다이얼 클릭
     클릭할 때 다음 채널
  ========================================================= */

  const handleDialClick = () => {
    if (isDragging) return;

    const next =
      (selectedChannel + 1) %
      radioCases.length;

    tuneToChannel(next);
  };

  /* =========================================================
     다이얼 드래그 시작
  ========================================================= */

  const handleDialPointerDown = (
    event
  ) => {
    if (isTuning) return;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    setIsDragging(true);

    dragStartXRef.current =
      event.clientX;

    dragStartRotationRef.current =
      dialRotation;

    stopVoice();
    startStatic();

    setIsTuning(true);
  };

  /* =========================================================
     다이얼 드래그
  ========================================================= */

  const handleDialPointerMove = (
    event
  ) => {
    if (!isDragging) return;

    const difference =
      event.clientX -
      dragStartXRef.current;

    let newRotation =
      dragStartRotationRef.current +
      difference * 0.75;

    newRotation = Math.max(
      dialAngles[0],
      Math.min(
        dialAngles[
          dialAngles.length - 1
        ],
        newRotation
      )
    );

    setDialRotation(newRotation);

    /*
      회전값을 주파수 위치로 변환
    */

    const minAngle =
      dialAngles[0];

    const maxAngle =
      dialAngles[
        dialAngles.length - 1
      ];

    const percentage =
      (newRotation - minAngle) /
      (maxAngle - minAngle);

    const minPosition =
      channelPositions[0];

    const maxPosition =
      channelPositions[
        channelPositions.length - 1
      ];

    const position =
      minPosition +
      percentage *
        (maxPosition -
          minPosition);

    setFrequencyPosition(position);
  };

  /* =========================================================
     다이얼 드래그 종료
     가장 가까운 채널에 스냅
  ========================================================= */

  const handleDialPointerUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    let closestIndex = 0;
    let closestDistance = Infinity;

    dialAngles.forEach(
      (angle, index) => {
        const distance =
          Math.abs(
            dialRotation - angle
          );

        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;

          closestIndex = index;
        }
      }
    );

    clearTimeout(
      tuningTimerRef.current
    );

    /*
      드래그 끝난 후
      정확한 채널 위치로 스냅
    */

    setFrequencyPosition(
      channelPositions[
        closestIndex
      ]
    );

    setDialRotation(
      dialAngles[
        closestIndex
      ]
    );

    tuningTimerRef.current =
      setTimeout(() => {
        stopStatic();

        setSelectedChannel(
          closestIndex
        );

        setDisplayChannel(
          closestIndex
        );

        setIsTuning(false);
        setShowMore(false);

        playChannel(
          closestIndex
        );
      }, 500);
  };

  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  const togglePlay = () => {
    if (isTuning) return;

    const audio =
      audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();

      setIsPlaying(false);
    } else {
      /*
        src가 다른 경우 현재 채널 연결
      */

      const targetAudio =
        radioCases[
          selectedChannel
        ].audio;

      if (
        !audio.src.includes(
          targetAudio
        )
      ) {
        audio.src =
          targetAudio;

        audio.currentTime = 0;
      }

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  /* =========================================================
     진행바 직접 이동
  ========================================================= */

  const changeProgress = (
    event
  ) => {
    const audio =
      audioRef.current;

    if (
      !audio ||
      !audio.duration
    ) {
      return;
    }

    const nextProgress =
      Number(
        event.target.value
      );

    audio.currentTime =
      (nextProgress / 100) *
      audio.duration;

    setProgress(
      nextProgress
    );
  };

  return (
    <section className="archive-radio">

      {/* ===================================================
          SECTION HEADER
      =================================================== */}

      <div className="radio-section-heading">

        <span>
          ARCHIVE RADIO
        </span>

        <h2>
          時代의 周波數
        </h2>

        <p>
          시대를 달리해 반복해서 나타난
          기록을 라디오 주파수처럼
          따라가 봅니다.
        </p>

      </div>

      {/* ===================================================
          RADIO BODY
      =================================================== */}

      <div
        className={
          `radio-machine ${
            isTuning
              ? "is-tuning"
              : ""
          } ${
            isPlaying
              ? "is-playing"
              : ""
          }`
        }
      >

        {/* =================================================
            LEFT SCREEN
        ================================================= */}

        <div className="radio-visual">

          <div className="radio-visual-window">

            <img
              key={currentCase.image}
              src={currentCase.image}
              alt={currentCase.title}
              className="radio-case-image"
            />

            {/* 튜닝 노이즈 */}

            <div className="radio-static-overlay" />

            <div className="radio-image-vignette" />

            <div className="radio-image-channel">
              {currentCase.channel}
            </div>

          </div>

          <div className="radio-speaker-lines">
            <i />
            <i />
            <i />
            <i />
          </div>

        </div>

        {/* =================================================
            RIGHT CONTROL
        ================================================= */}

        <div className="radio-control">

          {/* ON AIR */}

          <div className="radio-top">

            <div className="radio-brand">

              <span>
                京城夜錄
              </span>

              <small>
                ARCHIVE RECEIVER
              </small>

            </div>

            <div
              className={
                isPlaying
                  ? "on-air active"
                  : "on-air"
              }
            >

              <i />

              <span>
                ON AIR
              </span>

            </div>

          </div>

          {/* CURRENT CASE */}

          <div className="radio-current-case">

            <span className="radio-current-year">
              {isTuning
                ? "TUNING..."
                : currentCase.year}
            </span>

            <h3>
              {isTuning
                ? "주파수를 맞추는 중입니다"
                : currentCase.title
                    .split("\n")
                    .map(
                      (
                        line,
                        index
                      ) => (
                        <span
                          key={
                            index
                          }
                        >
                          {
                            line
                          }

                          {index <
                            currentCase.title.split(
                              "\n"
                            )
                              .length -
                              1 && (
                            <br />
                          )}
                        </span>
                      )
                    )}
            </h3>

          </div>

          {/* =================================================
              FREQUENCY SCALE
          ================================================= */}

          <div className="frequency-panel">

            <div className="frequency-label-row">

              {radioCases.map(
                (item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      selectedChannel ===
                        index &&
                      !isTuning
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      tuneToChannel(
                        index
                      )
                    }
                  >
                    <strong>
                      {
                        item.channel
                      }
                    </strong>

                    <span>
                      {
                        item.shortYear
                      }
                    </span>
                  </button>
                )
              )}

            </div>

            <div className="frequency-track">

              <div className="frequency-line" />

              {channelPositions.map(
                (
                  position,
                  index
                ) => (
                  <span
                    key={index}
                    className="frequency-station"
                    style={{
                      left: `${position}%`,
                    }}
                  />
                )
              )}

              {/* 움직이는 빨간 점 */}

              <div
                className={
                  isTuning
                    ? "frequency-pointer tuning"
                    : "frequency-pointer"
                }
                style={{
                  left: `${frequencyPosition}%`,
                }}
              >
                <i />

                <span />
              </div>

            </div>

            <div className="frequency-status">

              <span>
                AM
              </span>

              <strong>
                {isTuning
                  ? "SEARCHING SIGNAL"
                  : `${currentCase.channel} · ${currentCase.shortYear}`}
              </strong>

            </div>

          </div>

          {/* =================================================
              PLAYER + DIAL
          ================================================= */}

          <div className="radio-bottom-controls">

            <div className="radio-player">

              <div className="radio-player-row">

                <button
                  type="button"
                  className="radio-play-button"
                  onClick={
                    togglePlay
                  }
                  disabled={
                    isTuning
                  }
                  aria-label={
                    isPlaying
                      ? "일시정지"
                      : "재생"
                  }
                >
                  {isPlaying
                    ? "Ⅱ"
                    : "▶"}
                </button>

                <div className="radio-progress-area">

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={
                      progress
                    }
                    onChange={
                      changeProgress
                    }
                    className="radio-progress"
                  />

                  <div className="radio-time">

                    <span>
                      {formatTime(
                        currentTime
                      )}
                    </span>

                    <span>
                      {formatTime(
                        duration
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                TUNING DIAL
            ================================================= */}

            <div className="radio-dial-area">

              <span className="dial-title">
                TUNE
              </span>

              <button
                type="button"
                className={
                  isDragging
                    ? "radio-dial dragging"
                    : "radio-dial"
                }
                onClick={
                  handleDialClick
                }
                onPointerDown={
                  handleDialPointerDown
                }
                onPointerMove={
                  handleDialPointerMove
                }
                onPointerUp={
                  handleDialPointerUp
                }
                onPointerCancel={
                  handleDialPointerUp
                }
                aria-label="라디오 채널 다이얼"
              >

                <div
                  className="radio-dial-inner"
                  style={{
                    transform: `rotate(${dialRotation}deg)`,
                  }}
                >
                  <i />
                </div>

              </button>

              <small>
                DRAG
              </small>

            </div>

          </div>

          {/* =================================================
              MORE
          ================================================= */}

          <button
            type="button"
            className={
              showMore
                ? "radio-more-button active"
                : "radio-more-button"
            }
            onClick={() =>
              setShowMore(
                (prev) => !prev
              )
            }
          >
            <span>
              기록 더 읽기
            </span>

            <strong>
              {showMore
                ? "−"
                : "+"}
            </strong>
          </button>

          <div
            className={
              showMore
                ? "radio-more-content open"
                : "radio-more-content"
            }
          >
            <p>
              {
                currentCase.description
              }
            </p>
          </div>

        </div>

      </div>

      <p className="radio-notice">
        ※ 다이얼을 좌우로 움직여
        주파수를 맞추면 해당 시대의
        기록을 오디오로 들을 수 있습니다.
      </p>

    </section>
  );
}