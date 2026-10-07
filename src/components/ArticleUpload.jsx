import { useState } from 'react';
import { IMPORT_LIMIT, readPdf, readWorkbook } from '../lib/articleImport';
export default function ArticleUpload({disabled,apiKey,onImport,onBusy}) {
 const [pending,setPending]=useState(null);const [rows,setRows]=useState([]);const [rowIndex,setRowIndex]=useState(0);const [error,setError]=useState('');const [status,setStatus]=useState('');const [loading,setLoading]=useState(false);
 const work=async task=>{setLoading(true);onBusy(true);setError('');setStatus('파일을 읽는 중…');try{await task();}catch(e){setError(e.message);setStatus('');}finally{setLoading(false);onBusy(false);}};
 const upload=e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;
 work(async()=>{
  setPending(null);setRows([]);setRowIndex(0);
  if(file.size>IMPORT_LIMIT)throw new Error('파일은 20MB 이하로 업로드해 주세요.');
  const extension=file.name.split('.').pop().toLowerCase();
  if(extension==='pdf') {
   const text=await readPdf(await file.arrayBuffer());
   if(!text.trim()){setPending(file);setStatus('텍스트가 없는 스캔 PDF입니다. 아래 OCR 버튼으로 본문을 읽을 수 있습니다.');return;}
   onImport({body:text});setStatus('PDF 본문을 입력란에 불러왔습니다. 제목·발행일·신문명을 입력하고 추출 순서를 확인해 주세요.');
  } else if(extension==='xlsx') {const articles=await readWorkbook(await file.arrayBuffer());setRows(articles);setStatus(`기사 ${articles.length}개를 읽었습니다. 목록에서 선택한 뒤 입력란에 적용하세요.`);}
  else throw new Error('PDF 또는 .xlsx 파일을 선택해 주세요. 예전 .xls 파일은 엑셀에서 .xlsx로 저장해 주세요.');
 });};
 const ocr=()=>work(async()=>{
  if(!apiKey)throw new Error('OCR에 사용할 OpenAI API 키를 입력해 주세요.');
  if(pending.size>10*1024*1024)throw new Error('스캔 PDF OCR은 10MB 이하로 나누어 주세요.');
  setStatus('스캔 PDF를 읽는 중… OCR API 요금이 발생합니다.');
  const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('파일을 읽을 수 없습니다.'));reader.readAsDataURL(pending);});
  const response=await fetch('/api/import/pdf-ocr',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data,apiKey})});
  const result=await response.json();if(!response.ok)throw new Error(result.error||'OCR에 실패했습니다.');
  onImport(result.article);setPending(null);setStatus('OCR 결과를 불러왔습니다. 옛 글자·이름·날짜와 본문을 원본과 비교해 수정해 주세요.');
 });
 return <section className="article-upload"><h2>PDF·엑셀로 기사 불러오기</h2><label>기사 파일<input type="file" accept=".pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={upload} disabled={disabled||loading}/></label>
 <p className="help">PDF는 본문을 추출합니다. 엑셀은 첫 행에 제목·본문·발행일·신문명·출처 링크·자료 이미지 URL 열을 넣고, 한 행에 기사 하나를 작성하세요. 파일은 20MB 이하, PDF는 100쪽 이하입니다.</p><a href="/article-import-template.csv" download>엑셀 작성 양식 다운로드 (CSV)</a><p className="help">양식을 엑셀에서 열어 작성한 뒤 .xlsx로 저장하세요. 파일 불러오기는 현재 입력란을 채우며, 저장·생성·발행은 별도로 진행합니다.</p>
 {rows.length>0&&<><label>불러올 기사<select value={rowIndex} disabled={disabled||loading} onChange={e=>setRowIndex(Number(e.target.value))}>{rows.map((row,index)=><option value={index} key={index}>{row.sheetName} {row.row}행 · {row.title||'제목 없음'}</option>)}</select></label><p>{rows[rowIndex].body.slice(0,220)}{rows[rowIndex].body.length>220?'…':''}</p>{rows[rowIndex].dateWarning&&<p className="help">{rows[rowIndex].dateWarning}</p>}<button type="button" disabled={disabled||loading} onClick={()=>{const {title,body,date,newspaper,source,image}=rows[rowIndex];onImport({title,body,date,newspaper,source,image});setStatus('선택한 기사를 입력란에 적용했습니다. 내용을 확인해 주세요.');}}>선택 기사 입력란에 적용</button></>}
 {pending&&<><p className="help">스캔 PDF는 OCR 버튼을 누를 때 OpenAI로 전송됩니다. 키 소유자에게 요금이 발생하며 최대 10MB입니다. 일반 PDF와 엑셀은 브라우저에서 읽습니다.</p><button type="button" disabled={disabled||loading||!apiKey} onClick={ocr}>스캔 PDF OCR로 읽기</button></>}
 {status&&<p role="status">{status}</p>}{error&&<p className="error" role="alert">{error}</p>}</section>;
}
