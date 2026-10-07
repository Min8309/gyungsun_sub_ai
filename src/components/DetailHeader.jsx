import HeaderArticleLinks from './HeaderArticleLinks'
export default function DetailHeader() {
  return (
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
          <HeaderArticleLinks />
        <span>⌕</span>
        <span>☰</span>
      </div>

    </header>
  )
}