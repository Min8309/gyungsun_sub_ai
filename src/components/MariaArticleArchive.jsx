import { useEffect, useState } from 'react'

import { mariaArticleTimeline } from '../data/mariaArticleTimeline'

import '../css/ArticleArchive.css'


export default function MariaArticleArchive() {

  const [selectedArticle, setSelectedArticle] = useState(0)
  const [articleTab, setArticleTab] = useState('modern')
  const [visibleTalkCount, setVisibleTalkCount] = useState(0)

  const currentArticle =
    mariaArticleTimeline[selectedArticle]


  /* =========================================================
     ARTICLE SELECT
  ========================================================= */

  const selectArticle = index => {

    if (index === selectedArticle) return

    setSelectedArticle(index)

    setArticleTab('modern')

    setVisibleTalkCount(0)
  }


  /* =========================================================
     RECORD TALK
  ========================================================= */

  const recordTalk = [
    {
      question: '이 보도의 핵심은 무엇인가요?',

      answer:
        currentArticle.summary?.[0] ||
        currentArticle.modernText?.[0] ||
        '당시 보도의 핵심 내용을 기록에서 확인할 수 있습니다.'
    },

    {
      question: '당시 수사는 어떻게 진행되고 있었나요?',

      answer:
        currentArticle.summary?.[1] ||
        currentArticle.modernText?.[1] ||
        '후속 보도를 통해 당시 수사의 흐름을 확인할 수 있습니다.'
    },

    {
      question: '이 기록에서 주목할 부분은 무엇인가요?',

      answer:
        currentArticle.summary?.[2] ||
        currentArticle.modernText?.[2] ||
        '기사에 남은 표현과 후속 기록을 함께 살펴볼 수 있습니다.'
    }
  ]


  /* =========================================================
     RECORD TALK ANIMATION
  ========================================================= */

  useEffect(() => {

    if (articleTab !== 'modern') {

      setVisibleTalkCount(0)

      return
    }

    setVisibleTalkCount(0)

    const timers = recordTalk.map((_, index) =>
      setTimeout(() => {

        setVisibleTalkCount(index + 1)

      }, 700 + index * 1200)
    )

    return () => {

      timers.forEach(timer =>
        clearTimeout(timer)
      )
    }

  }, [selectedArticle, articleTab])


  return (

    <section className='report-history'>


      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className='report-history-title'>

        <span>
          東亞日報 ARCHIVE
        </span>

        <h2>
          東亞日報 보도 기록
        </h2>

        <p>
          신문은 부산 마리아 사건을 어떻게 추적했을까?
        </p>

      </div>



      {/* =====================================================
          TIMELINE
      ===================================================== */}

      <div className='report-timeline'>

        {mariaArticleTimeline.map(
          (article, index) => (

            <button
              key={article.id}
              type='button'

              className={`report-timeline-item ${
                selectedArticle === index
                  ? 'active'
                  : ''
              }`}

              onClick={() =>
                selectArticle(index)
              }
            >

              <span className='report-dot' />

              <strong>
                {article.date}
              </strong>

              <small>
                {article.label}
              </small>

            </button>

          )
        )}

      </div>



      {/* =====================================================
          READER
      ===================================================== */}

      <div className='report-reader'>


        {/* ===================================================
            LEFT / ORIGINAL
        =================================================== */}

        <div className='report-original'>

          <div className='report-original-head'>

            <div>

              <strong>
                原文記事
              </strong>

              <span>
                ORIGINAL ARCHIVE
              </span>

            </div>

            <p>
              {currentArticle.archiveInfo}
            </p>

          </div>



          <div className='newspaper-image-box'>

            <img
              className='newspaper-main-image'
              src={currentArticle.image}
              alt={`${currentArticle.date} 동아일보 마리아 사건 원문 지면`}
            />

          </div>



          <div className='original-guide'>

            <div className='original-guide-left'>

              <span className='blue-guide-box' />

              <div>

                <strong>
                  ARTICLE LOCATION
                </strong>

                <p>
                  파란색 테두리로 표시된 영역이
                  해당 날짜의 보도 기사입니다.
                </p>

              </div>

            </div>

          </div>


          <div className='original-caption'>

            ※ 동아일보에 보도된 실제 신문 지면입니다.

          </div>

        </div>



        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className='report-modern'>


          {/* =================================================
              TABS
          ================================================= */}

          <div className='report-tabs'>

            <button
              type='button'

              className={
                articleTab === 'modern'
                  ? 'active'
                  : ''
              }

              onClick={() =>
                setArticleTab('modern')
              }
            >

              <span>
                TODAY'S EDITION
              </span>

              현대판

            </button>


            <button
              type='button'

              className={
                articleTab === 'summary'
                  ? 'active'
                  : ''
              }

              onClick={() =>
                setArticleTab('summary')
              }
            >

              <span>
                SOCIAL EDITION
              </span>

              요약판

            </button>

          </div>



          {/* =================================================
              MODERN
          ================================================= */}

          {articleTab === 'modern' && (

            <article className='modern-news'>


              <div className='modern-news-top'>

                <div className='modern-news-category'>

                  <span>
                    ARCHIVE → TODAY
                  </span>

                  <i />

                  <strong>
                    {currentArticle.label}
                  </strong>

                </div>


                <time>
                  {currentArticle.date}
                </time>

              </div>



              <header className='modern-news-header'>

                <span className='news-kicker'>

                  1931년 동아일보 기록을 오늘의 언어로 읽다

                </span>


                <h3>
                  {currentArticle.title}
                </h3>


                {currentArticle.modernText?.[0] && (

                  <p className='modern-news-lead'>

                    {currentArticle.modernText[0]}

                  </p>

                )}

              </header>



              <div className='modern-news-divider'>

                <span />

              </div>



              <div className='modern-news-body'>

                {currentArticle.modernText
                  ?.slice(1)
                  .map((text, index) => (

                    <p key={index}>

                      {text}

                    </p>

                  ))}

              </div>



              {/* =============================================
                  RECORD TALK
              ============================================= */}

              <div className='record-talk'>

                <div className='record-talk-head'>

                  <div>

                    <span>
                      RECORD TALK
                    </span>

                    <h4>
                      기록에게 묻다
                    </h4>

                  </div>


                  <p>

                    이 기사에 대한 궁금한 점을
                    기록과 함께 풀어봅니다.

                  </p>

                </div>



                <div className='record-talk-window'>

                  {recordTalk.map(
                    (item, index) => (

                      <div

                        key={`${selectedArticle}-${index}`}

                        className={`talk-pair ${
                          index < visibleTalkCount
                            ? 'show'
                            : ''
                        }`}

                      >


                        <div className='talk-row question-row'>

                          <div className='talk-profile question-profile'>

                            Q

                          </div>


                          <div className='talk-message question-message'>

                            <small>
                              READER
                            </small>

                            <p>
                              {item.question}
                            </p>

                          </div>

                        </div>



                        <div className='talk-row answer-row'>

                          <div className='talk-message answer-message'>

                            <small>
                              ARCHIVE RECORD
                            </small>

                            <p>
                              {item.answer}
                            </p>

                          </div>


                          <div className='talk-profile answer-profile'>

                            錄

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>



              <footer className='modern-news-footer'>

                <span>
                  ORIGINAL REPORT
                </span>

                <strong>

                  東亞日報 · {currentArticle.date}

                </strong>

              </footer>

            </article>

          )}



          {/* =================================================
              SUMMARY
          ================================================= */}

          {articleTab === 'summary' && (

            <article className='social-summary'>


              <div className='social-summary-top'>

                <div>

                  <span>
                    SOCIAL EDITION
                  </span>

                  <strong>
                    {currentArticle.date}
                  </strong>

                </div>


                <span className='summary-badge'>

                  QUICK READ

                </span>

              </div>



              <div className='social-summary-title'>

                <small>

                  10초 만에 보는 오늘의 기록

                </small>


                <h3>

                  {currentArticle.title}

                </h3>

              </div>



              <div className='social-summary-points'>

                {currentArticle.summary?.map(
                  (text, index) => (

                    <div
                      className='social-summary-point'
                      key={index}
                    >

                      <span>

                        {String(index + 1)
                          .padStart(2, '0')}

                      </span>


                      <p>
                        {text}
                      </p>

                    </div>

                  )
                )}

              </div>



              {currentArticle.summary?.[0] && (

                <div className='one-line-summary'>

                  <span>
                    ONE LINE
                  </span>

                  <p>

                    “{currentArticle.summary[0]}”

                  </p>

                </div>

              )}



              <div className='social-keywords'>

                {currentArticle.keywords?.map(
                  keyword => (

                    <span key={keyword}>

                      #{keyword}

                    </span>

                  )
                )}

              </div>



              <div className='social-summary-bottom'>

                <span>
                  京城夜錄
                </span>

                <small>
                  ARCHIVE → TODAY
                </small>

              </div>

            </article>

          )}

        </div>

      </div>



      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className='newspaper-edition-footer'>

        <span>

          ORIGINAL REPORT · 東亞日報 · {currentArticle.date}

        </span>

        <strong>
          京城夜錄
        </strong>

        <span>
          ARCHIVE → TODAY
        </span>

      </div>

    </section>

  )
}