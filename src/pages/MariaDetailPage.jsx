import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MariaThenNowSlider from '../components/MariaThenNowSlider'
import MariaArchiveRadio from '../components/MariaArchiveRadio'
import MariaArticleArchive from '../components/MariaArticleArchive'

import '../css/DetailPage.css'
/* =========================================================
   HERO
========================================================= */

const heroSlides = [
  {
    image: '/image/maria/slider/maria-slider.jpg'
  }
]

/* =========================================================
   DETAIL PAGE
========================================================= */

export default function MariaDetailPage () {
  const navigate = useNavigate();

  /* =======================================================
     GLOBAL AUDIO
  ======================================================= */

  const bgmRef = useRef(null)
  const bellRef = useRef(null)
  const whooshRef = useRef(null)

  const [bgmPlaying, setBgmPlaying] = useState(false)

  /* BGM 초기 설정 */
  useEffect(() => {
    const bgm = bgmRef.current

    if (!bgm) return

    bgm.volume = 0.12
    bgm.loop = true

    const handlePlay = () => {
      setBgmPlaying(true)
    }

    const handlePause = () => {
      setBgmPlaying(false)
    }

    bgm.addEventListener('play', handlePlay)
    bgm.addEventListener('pause', handlePause)

    return () => {
      bgm.removeEventListener('play', handlePlay)
      bgm.removeEventListener('pause', handlePause)
    }
  }, [])

  /* BGM ON / OFF */
  const toggleBgm = async () => {
    const bgm = bgmRef.current

    if (!bgm) {
      console.log('BGM audio element 없음')
      return
    }

    try {
      if (bgm.paused) {
        bgm.volume = 0.12

        await bgm.play()

        setBgmPlaying(true)

        console.log('BGM 재생 시작')
      } else {
        bgm.pause()

        setBgmPlaying(false)

        console.log('BGM 정지')
      }
    } catch (error) {
      console.error('BGM 재생 실패:', error)
    }
  }

  /* 종소리 */
  const playBellSound = () => {
    if (!bellRef.current) return

    bellRef.current.currentTime = 0
    bellRef.current.volume = 0.55

    bellRef.current.play().catch(error => {
      console.error('Bell 재생 실패:', error)
    })
  }

  /* 페이지 전환 효과음 */
  const playWhooshSound = () => {
    if (!whooshRef.current) return

    whooshRef.current.currentTime = 0
    whooshRef.current.volume = 0.4

    whooshRef.current.play().catch(error => {
      console.error('Whoosh 재생 실패:', error)
    })
  }

  /* =======================================================
     HERO
  ======================================================= */

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(sliderTimer)
  }, [])

  /* =======================================================
     號外
  ======================================================= */

  const behindCards = [
    '/image/maria/behind/maria-behind01.png',
    '/image/maria/behind/maria-behind02.png'
  ]

  const [showBreakingNews, setShowBreakingNews] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [hasClosedBreakingNews, setHasClosedBreakingNews] = useState(false)

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      playBellSound()
      setShowBreakingNews(true)
    }, 10000)

    return () => clearTimeout(popupTimer)
  }, [])

  const nextCard = () => {
    playWhooshSound()

    setCurrentCard(prev => (prev === behindCards.length - 1 ? 0 : prev + 1))
  }

  const previousCard = () => {
    playWhooshSound()

    setCurrentCard(prev => (prev === 0 ? behindCards.length - 1 : prev - 1))
  }

  const closeBreakingNews = () => {
    setShowBreakingNews(false)
    setHasClosedBreakingNews(true)
  }

  const reopenBreakingNews = () => {
    setCurrentCard(0)
    playBellSound()
    setShowBreakingNews(true)
  }

  useEffect(() => {
    const handleKeyDown = event => {
      if (!showBreakingNews) return

      if (event.key === 'Escape') {
        setShowBreakingNews(false)
        setHasClosedBreakingNews(true)
      }

      if (event.key === 'ArrowRight') {
        playWhooshSound()

        setCurrentCard(prev => (prev === behindCards.length - 1 ? 0 : prev + 1))
      }

      if (event.key === 'ArrowLeft') {
        playWhooshSound()

        setCurrentCard(prev => (prev === 0 ? behindCards.length - 1 : prev - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showBreakingNews, behindCards.length])

  /* =======================================================
     PREVIOUS / NEXT CASE
  ======================================================= */

  const goPreviousCase = () => {
    navigate('/case/jukcheomjeong')
  }

  const goNextCase = () => {
    navigate('/case/sonkijeong')
  }
  return (
    <div className='archive-page'>
      {/* ===================================================
          AUDIO
      =================================================== */}

      <audio ref={bgmRef} src='/audio/maria/maria-bg.mp3' loop preload='auto' />

      <audio ref={bellRef} src='/audio/bell.mp3' preload='auto' />

      <audio ref={whooshRef} src='/audio/whoosh.mp3' preload='auto' />

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className='archive-header'>
        <div className='header-center'>
          <div className='archive-logo'>
            <strong>京城夜錄</strong>
            <span>KYUNGSUNG ARCHIVE</span>
          </div>

          <nav className='archive-nav'>
            <button className='active'>사회</button>
            <button>사기</button>
            <button>문화·예술</button>
            <button>인물</button>
            <button>부록</button>
          </nav>
        </div>

        <div className='header-icons'>
          <span>⌕</span>
          <span>☰</span>
        </div>
      </header>

      {/* ===================================================
          PREVIOUS / NEXT CASE
      =================================================== */}

      <button
        className='page-case-arrow page-case-arrow-left'
        onClick={goPreviousCase}
        aria-label='이전 사건'
      >
        ←<span className='arrow-tooltip'>이전 사건</span>
      </button>

      <button
        className='page-case-arrow page-case-arrow-right'
        onClick={goNextCase}
        aria-label='다음 사건'
      >
        →<span className='arrow-tooltip'>다음 사건</span>
      </button>

      {/* ===================================================
          HERO
      =================================================== */}
      <section className='hero-slider'>
        {/* 배경 이미지만 자동 슬라이드 */}
        <div className='hero-images'>
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={`부산 마리아 사건 배경 ${index + 1}`}
              className={
                index === currentSlide ? 'hero-slide active' : 'hero-slide'
              }
            />
          ))}
        </div>

        {/* 어두운 오버레이 */}
        <div className='hero-overlay' />

        {/* 텍스트는 사진과 관계없이 고정 */}
        <div className='hero-content'>
          <div className='hero-meta'>
            1931.08
            <span>|</span>
            釜山 ｜ 社會面
          </div>

          <h1>
            부산 마리아
            <br />
            참살 사건
          </h1>

          <p>1931년 부산, 신문 기록 속에서 추적하는 사건</p>
        </div>

        {/* 호외 다시보기 */}
        {hasClosedBreakingNews && !showBreakingNews && (
          <button
            className='breaking-reopen-button'
            onClick={reopenBreakingNews}
            aria-label='호외 다시 보기'
          >
            <span className='reopen-hanja'>號外</span>

            <span className='reopen-text'>다시보기</span>
          </button>
        )}
      </section>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className='detail-content'>
        {/* =================================================
    01. 東亞日報 보도 기록
================================================= */}

        <MariaArticleArchive />

        {/* =================================================
    02. PLACE ARCHIVE
================================================= */}

        <section className='then-now-section'>
          <div className='section-heading place-section-heading'>
            <span>PLACE ARCHIVE</span>

            <h2>
              <em>釜山,</em> 그때와 지금
            </h2>

            <p>기록 속 장소는 지금 어떻게 변했을까?</p>
          </div>

          <MariaThenNowSlider />
        </section>

        {/* =================================================
    03. ARCHIVE RADIO
================================================= */}

        <MariaArchiveRadio />
      </main>

      {/* ===================================================
          號外 POPUP
      =================================================== */}

      {showBreakingNews && (
        <div
          className='breaking-overlay'
          role='dialog'
          aria-modal='true'
          aria-label='부산 마리아 사건 호외'
        >
          <div className='breaking-popup'>
            <div className='breaking-label'>
              <span>號外</span>
              <strong>호외요!</strong>
            </div>

            <button
              className='breaking-close'
              onClick={closeBreakingNews}
              aria-label='호외 닫기'
            >
              ×
            </button>

            <button
              className='card-arrow card-arrow-left'
              onClick={previousCard}
              aria-label='이전 카드'
            >
              ‹
            </button>

            <div className='breaking-card'>
              <img
                src={behindCards[currentCard]}
                alt={`부산 마리아 사건 호외 카드 ${currentCard + 1}`}
              />
            </div>

            <button
              className='card-arrow card-arrow-right'
              onClick={nextCard}
              aria-label='다음 카드'
            >
              ›
            </button>

            <div className='breaking-pagination'>
              {behindCards.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  className={
                    index === currentCard
                      ? 'breaking-dot active'
                      : 'breaking-dot'
                  }
                  onClick={() => {
                    if (index === currentCard) return

                    playWhooshSound()
                    setCurrentCard(index)
                  }}
                  aria-label={`${index + 1}번째 호외 카드`}
                />
              ))}

              <span>
                {currentCard + 1} / {behindCards.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          BGM
      =================================================== */}

      <button
        className={`bgm-toggle ${bgmPlaying ? 'playing' : ''}`}
        onClick={toggleBgm}
        aria-label={bgmPlaying ? '배경음악 끄기' : '배경음악 켜기'}
      >
        <span className='bgm-icon'>{bgmPlaying ? '♪' : '×'}</span>

        <span>{bgmPlaying ? '소리 끄기' : '소리 켜기'}</span>
      </button>
    </div>
  )
}
