import { useEffect, useRef, useState } from "react";

import "../css/ArchiveRadio.css";



/* =========================================================

   ARCHIVE RADIO DATA

\========================================================= */



const radioCases = [
  {
    id: 1,
    channel: "CH 01",
    year: "1968년 · 신동아",
    shortYear: "1968",
    title: "차관 기사 한 줄에\n정권은 기자를 겨눴다",
    image: "/image/sonkijeong/case/sonkijeong-case01.jpg",
    audio: "/audio/sonkijeong/sonkijeong_radio01.mp3",
    description:
      "1968년 월간 《신동아》는 외자 도입과 정치자금 의혹을 다룬 기사를 보도했습니다. 이후 해당 호가 압수되고 관련 언론인이 구속되는 등 강한 압박이 이어졌습니다. 권력이 불편해하는 내용을 보도한 언론이 직접적인 제재를 받았다는 점에서 당시 언론 통제의 모습을 보여주는 사례입니다.",
  },
  {
    id: 2,
    channel: "CH 02",
    year: "1974~1975년 · 동아일보",
    shortYear: "1974",
    title: "가장 큰 기사는\n비어 있는 광고면이었다",
    image: "/image/sonkijeong/case/sonkijeong-case02.jpg",
    audio: "/audio/sonkijeong/sonkijeong_radio02.mp3",
    description:
      "자유언론실천선언 이후 광고 계약이 대규모로 해약되자 동아일보 지면에는 광고가 사라진 빈 공간이 등장했습니다. 채워지지 않은 광고면 자체가 언론이 받고 있던 압박을 독자에게 보여주는 상징이 되었습니다.",
  },
  {
    id: 3,
    channel: "CH 03",
    year: "1980년 · 언론 검열",
    shortYear: "1980",
    title: "검열이 지운 자리를\n그대로 비워 두다",
    image: "/image/sonkijeong/case/sonkijeong-case03.jpg",
    audio: "/audio/sonkijeong/sonkijeong_radio03.mp3",
    description:
      "1980년 비상계엄 확대 이후 언론에 대한 사전 검열이 강화됐습니다. 삭제된 기사나 사설을 다른 내용으로 채우는 대신 빈 공간으로 남긴 지면은 검열의 존재 자체를 독자에게 드러내는 방식이 되었습니다.",
  },
  {
    id: 4,
    channel: "CH 04",
    year: "1986년 · 보도지침 폭로",
    shortYear: "1986",
    title: "정부가 매일 보낸\n보도 가이드라인을 세상에 공개하다",
    image: "/image/sonkijeong/case/sonkijeong-case04.jpg",
    audio: "/audio/sonkijeong/sonkijeong_radio04.mp3",
    description:
      "1986년에는 정부가 언론사에 전달하던 보도지침의 존재가 공개됐습니다. 무엇을 보도할지뿐 아니라 사진의 크기와 기사 배치까지 통제하려 했던 시스템이 드러나면서 국가 권력과 언론 통제의 관계가 다시 사회적 쟁점이 됐습니다.",
  },
];





/* =========================================================

   CHANNEL POSITION

\========================================================= */



/* 5개 채널을 주파수판에 균등하게 배치 */

const channelPositions = [6, 28, 50, 72, 94];





/* 다이얼 각도 */

const dialAngles = [-120, -60, 0, 60, 120];

/* =========================================================

   COMPONENT

\========================================================= */



export default function SonkijeongArchiveRadio() {

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

      "/audio/radio-static.mp3"

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

      .catch(() => { });

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

        .catch(() => { });

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

          `radio-machine ${isTuning

            ? "is-tuning"

            : ""

          } ${isPlaying

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