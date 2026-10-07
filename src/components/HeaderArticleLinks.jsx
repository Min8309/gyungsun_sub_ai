import { Link } from 'react-router-dom';
import '../css/HeaderArticleLinks.css';
export default function HeaderArticleLinks() {
 return <nav className="header-article-links" aria-label="경성신문 기사 메뉴"><Link to="/news">새 기사</Link><Link to="/admin">기사 관리</Link></nav>;
}
