import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/Newsroom.css';
const empty = { title:'', body:'', date:'', newspaper:'', source:'', image:'' };
async function api(url, method='GET', value) {
 const r=await fetch(url,{method,headers:value?{'Content-Type':'application/json'}:{},body:value?JSON.stringify(value):undefined});
 const data=await r.json(); if(!r.ok) throw new Error(data.error || '요청 실패'); return data;
}
function Shell({children}) { return <main className="newsroom"><header><Link to="/news">京城新聞</Link><nav><Link to="/news">기사 목록</Link><Link to="/admin">편집국</Link><Link to="/case/jukcheomjeong">기존 기록</Link></nav></header>{children}</main>; }
function HeaderSlides({article}) {
 const [index,setIndex]=useState(0); const [paused,setPaused]=useState(false);
 const files=article.headerImages || [];
 useEffect(()=>{if(files.length!==2 || paused)return;const timer=setInterval(()=>setIndex(i=>(i+1)%2),6000);return()=>clearInterval(timer);},[files.length,paused]);
 if(files.length!==2)return null;
 return <section className="news-hero" aria-label="기사 헤더 일러스트 슬라이드">
 {files.map((file,i)=><img key={file} src={`/api/articles/${article.id}/header-${i}?v=${file}`} alt={`${article.title} 사건 분위기 삽화 ${i+1} (AI 생성)`} className={index===i?'active':''} aria-hidden={index!==i}/>)}
 <div className="news-hero-text"><small>{article.date} · {article.newspaper}</small><h1>{article.title}</h1><p>{article.summary}</p></div>
 <span className="news-illustration-label">AI 생성 사건 삽화 · 기록 사진이 아닙니다</span>
 <div className="news-hero-controls"><button type="button" onClick={()=>{setIndex(i=>(i+1)%2);setPaused(true);}} aria-label="이전 이미지">←</button><span>{index+1} / 2</span><button type="button" onClick={()=>setPaused(v=>!v)}>{paused?'자동 재생':'일시 정지'}</button><button type="button" onClick={()=>{setIndex(i=>(i+1)%2);setPaused(true);}} aria-label="다음 이미지">→</button></div>
 </section>;
}
function Card({article}) { return <Link className="news-card" to={`/articles/${article.id}`}>{(article.headerImages?.[0]||article.image)&&<img src={article.headerImages?.[0]?`/api/articles/${article.id}/header-0?v=${article.headerImages[0]}`:article.image} alt={article.headerImages?.[0]?"AI 생성 사건 삽화":"기사 자료"}/>}<small>{article.date} · {article.newspaper}</small><h2>{article.title}</h2><p>{article.summary}</p><span>읽고 듣기 →</span></Link>; }
export function NewsList() {
 const [articles,setArticles]=useState([]); const [error,setError]=useState('');
 useEffect(()=>{api('/api/articles').then(setArticles).catch(e=>setError(e.message));},[]);
 return <Shell><h1>경성신문 기사 기록</h1>{error&&<p role="alert">{error}</p>}<div className="news-grid">{articles.filter(a=>a.status==='published').map(a=><Card key={a.id} article={a}/>)}</div>{!articles.some(a=>a.status==='published')&&<p>아직 발행된 기사가 없습니다.</p>}</Shell>;
}
export function ArticlePage() {
 const {id}=useParams(); const [article,setArticle]=useState(null); const [error,setError]=useState('');
 useEffect(()=>{let active=true;api(`/api/articles/${id}`).then(a=>{if(active)setArticle(a);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[id]);
 return <Shell>{error?<p role="alert">{error}</p>:!article?<p>불러오는 중…</p>:<article className="news-detail">
 {article.status==='draft'&&<p className="notice">초안 미리보기 · 아직 발행되지 않았습니다.</p>}<HeaderSlides key={article.id} article={article}/>{article.headerImages?.length!==2&&<><small>{article.date} · {article.newspaper}</small><h1>{article.title}</h1>{article.image&&<img className="news-cover" src={article.image} alt="기사 자료"/>}</>}
 <h2>핵심 정리</h2><p>{article.summary}</p><h2>현대어 풀이</h2><p>{article.modernText}</p>{[['people','인물'],['places','장소'],['dates','사건 날짜'],['uncertainties','확인 필요 사항']].map(([key,label])=><section key={key}><h3>{label}</h3><p>{article[key].join(' · ')||'원문에 명시되지 않음'}</p></section>)}
 <h2>경성 라디오</h2>{article.audio?<><audio controls src={`/api/articles/${id}/audio`}/><a href={`/api/articles/${id}/audio`} download={`${article.title}.mp3`}>음성 다운로드</a></>:<p>음성 생성 전입니다.</p>}<p>{article.script}</p><details><summary>원문 기사</summary><p>{article.body}</p></details>{article.source&&<p><a href={article.source} target="_blank" rel="noreferrer">원문 출처 ↗</a></p>}</article>}</Shell>;
}
export default function Newsroom() {
 const [form,setForm]=useState(empty);const [apiKey,setApiKey]=useState('');const [articles,setArticles]=useState([]);const [selected,setSelected]=useState(null);const [autoImages,setAutoImages]=useState(true);const [busy,setBusy]=useState('');const [error,setError]=useState('');const [message,setMessage]=useState('');
 useEffect(()=>{api('/api/articles').then(setArticles).catch(e=>setError(e.message));},[]);
 const refresh=async()=>setArticles(await api('/api/articles'));
 const select=a=>{setSelected(a.id);setForm(a);};
 const change=(key,value)=>setForm(prev=>({...prev,[key]:value}));
 const run=async(label,task)=>{setBusy(label);setError('');setMessage('');try{await task();}catch(e){setError(e.message);}finally{setBusy('');}};
 const generate=e=>{e.preventDefault();run('기사 분석과 대본 생성 중…',async()=>{const article=await api('/api/articles','POST',{...form,apiKey});select(article);await refresh();if(autoImages){setBusy('기사 저장 완료 · 헤더 일러스트 2장 생성 중… (수 분 소요)');select(await api(`/api/articles/${article.id}/images`,'POST',{apiKey}));await refresh();}setMessage('카드와 대본을 만들었습니다. 이미지·내용을 검토한 뒤 음성을 생성하세요.');});};
 const save=async()=>{const a=await api(`/api/articles/${selected}`,'PUT',form);select(a);await refresh();return a;};
 const speech=()=>run('저장 및 음성 생성 중…',async()=>{await save();select(await api(`/api/articles/${selected}/speech`,'POST',{apiKey}));await refresh();setMessage('한국어 음성을 생성했습니다. 미리 듣고 발행하세요.');});
 const images=()=>run('저장 및 헤더 일러스트 2장 생성 중… (수 분 소요)',async()=>{await save();select(await api(`/api/articles/${selected}/images`,'POST',{apiKey}));await refresh();setMessage('헤더 이미지 2장을 생성했습니다. 상세페이지에도 연결됩니다.');});
 const publish=()=>run('발행 중…',async()=>{const a=await save();if(!a.audio)throw new Error('현재 대본으로 음성을 다시 생성하세요.');select(await api(`/api/articles/${selected}/publish`,'POST',{}));await refresh();setMessage('기사 목록과 상세페이지에 발행했습니다.');});
 return <Shell><h1>경성신문 편집국</h1><p>기사 입력 → 내용 정리 → 카드·대본 → 헤더 삽화 2장 → 음성 → 검토·발행</p><p className="notice">로컬 개발용 관리자입니다. 인터넷 공개 전에 관리자 인증과 접근 권한을 추가해야 합니다.</p><div className="news-layout"><section>
 {/* API 키 입력란: 본인 또는 사용 허락을 받은 다른 사람의 OpenAI API 키를 입력합니다.
     키는 React 메모리에만 보관하며 localStorage, 기사 파일, 로그에 저장하지 않습니다.
     같은 출처 서버를 통해 OpenAI에만 전달하고 새로고침 시 지워집니다. */}
 <label>OpenAI API 키<input type="password" autoComplete="off" spellCheck={false} value={apiKey} onChange={e=>setApiKey(e.target.value)} disabled={!!busy} placeholder="사용 권한이 있는 API 키"/></label><p className="help">본인 또는 사용 허락을 받은 다른 사람의 키를 입력하세요. 키 소유자에게 분석·이미지·음성 API 요금이 발생합니다. 이미지 생성에는 해당 모델의 사용 권한이 필요합니다. 키는 저장하지 않습니다.</p><button disabled={!!busy} onClick={()=>setApiKey('')}>키 지우기</button>
 <form onSubmit={generate}><fieldset disabled={!!busy||form.status==='published'}>{[['title','제목','text'],['date','발행일','date'],['newspaper','신문명','text'],['source','출처 링크 (선택)','url'],['image','자료 이미지 URL (선택)','url']].map(([key,label,type])=><label key={key}>{label}<input type={type} value={form[key]} required={['title','date','newspaper'].includes(key)} onChange={e=>change(key,e.target.value)}/></label>)}<label>원문 기사<textarea rows={8} required maxLength={50000} value={form.body} onChange={e=>change('body',e.target.value)}/></label>
 {!selected?<><label className="news-check"><input type="checkbox" checked={autoImages} onChange={e=>setAutoImages(e.target.checked)}/>기사 생성 후 헤더 일러스트 2장도 자동 생성</label><p className="help">어두운 세피아 판화 스타일. 이미지 2장 생성에 추가 요금과 시간이 필요합니다.</p><button className="primary" disabled={!apiKey}>기사 자동 생성</button></>:<><h2>생성 결과 편집</h2>{[['summary','카드 요약'],['modernText','현대어 풀이'],['script','라디오 대본']].map(([key,label])=><label key={key}>{label}<textarea rows={key==='script'?8:4} maxLength={key==='script'?4000:undefined} value={form[key]} onChange={e=>change(key,e.target.value)}/></label>)}{[['people','인물'],['places','장소'],['dates','사건 날짜'],['uncertainties','확인 필요 사항']].map(([key,label])=><label key={key}>{label} (한 줄에 하나)<textarea rows={2} value={form[key].join('\n')} onChange={e=>change(key,e.target.value.split('\n'))}/></label>)}<div className="news-actions"><button type="button" onClick={()=>run('저장 중…',async()=>{await save();setMessage('저장했습니다.');})}>수정 저장</button><button type="button" disabled={!apiKey} onClick={images}>{form.headerImages?.length===2?'헤더 이미지 2장 다시 생성':'헤더 이미지 2장 생성'}</button><button type="button" disabled={!apiKey} onClick={speech}>저장하고 음성 생성</button><button type="button" className="primary" disabled={!form.audio||form.headerImages?.length!==2} onClick={publish}>검토 완료·발행</button></div></>}
 </fieldset></form>{busy&&<p role="status">{busy}</p>}{error&&<p className="error" role="alert">{error}</p>}{message&&<p role="status">{message}</p>}{selected&&<><h2>헤더 슬라이드 미리보기</h2><HeaderSlides key={selected} article={form}/>{form.headerImages?.length!==2&&<p>헤더 이미지 생성 전입니다. 생성 실패 시 아래 버튼으로 다시 시도할 수 있습니다.</p>}<p className="help">기사 제목·본문·요약·풀이·장소 수정 후 저장하면 이미지 연결이 해제됩니다. 새 내용으로 다시 생성하세요.</p><h2>카드 미리보기</h2><Card article={form}/>{form.audio&&<audio key={form.audio} controls src={`/api/articles/${selected}/audio?v=${form.audio}`}/>}<p className="help">대본을 수정하여 저장하면 음성 연결이 해제됩니다. 새 대본으로 음성을 다시 생성하세요.</p></>}
 </section><aside><h2>기사 보관함</h2><button disabled={!!busy} onClick={()=>{setSelected(null);setForm(empty);setError('');setMessage('');}}>＋ 새 기사</button>{articles.map(a=><button className="saved-article" key={a.id} disabled={!!busy} onClick={()=>{select(a);setError('');setMessage('');}}><small>{a.status==='published'?'발행 완료':'초안'} · {a.date}</small><strong>{a.title}</strong></button>)}</aside></div></Shell>;
}
