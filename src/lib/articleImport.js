export const IMPORT_LIMIT = 20 * 1024 * 1024;
const aliases = {
 title:['제목','기사제목','title'], body:['본문','원문','원문기사','기사본문','내용','body','content'],
 date:['발행일','발행날짜','날짜','date','publicationdate'], newspaper:['신문명','신문','매체','newspaper'],
 source:['출처','출처링크','링크','source','url'], image:['이미지','이미지url','자료이미지url','image','imageurl']
};
export function cellText(value) {
 if(value===null||value===undefined)return '';
 if(value instanceof Date)return value.toISOString().slice(0,10);
 if(typeof value==='object') {
  if('result' in value)return cellText(value.result);
  if(value.richText)return value.richText.map(item=>item.text).join('');
  if('text' in value)return String(value.text);
  return '';
 }
 return String(value).trim();
}
export function importDate(value) {
 if(value instanceof Date)return value.toISOString().slice(0,10);
 if(typeof value==='number')return ''; // 서식 없는 숫자는 날짜인지 확인할 수 없으므로 자동 추측하지 않습니다.
 const text=cellText(value);const match=text.match(/^(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})\s*(?:일|\.)?$/);
 if(!match)return '';
 const result=`${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
 const stamp=Date.parse(result);return !Number.isNaN(stamp)&&new Date(stamp).toISOString().slice(0,10)===result?result:'';
}
export function mapSheetRows(rows, sheetName) {
 const headerIndex=rows.findIndex(row=>row.some(value=>cellText(value)));
 if(headerIndex<0)return [];
 const headers=rows[headerIndex].map(value=>cellText(value).toLowerCase().replace(/[\s_()（）]/g,''));
 const columns=Object.fromEntries(Object.entries(aliases).map(([key,names])=>[key,headers.findIndex(name=>names.includes(name))]));
 if(columns.body<0)throw new Error(`${sheetName}: '본문' 또는 '원문 기사' 열이 필요합니다.`);
 const imported=[];
 for(let i=headerIndex+1;i<rows.length;i++) {
  if(!rows[i].some(value=>cellText(value)))continue;
  const article=Object.fromEntries(Object.entries(columns).map(([key,index])=>[key,index<0?'':key==='date'?importDate(rows[i][index]):cellText(rows[i][index])]));
  if(!article.body)throw new Error(`${sheetName} ${i+1}행: 본문이 없습니다.`);
  if(article.body.length>50000)throw new Error(`${sheetName} ${i+1}행: 본문은 50,000자 이하로 나누어 주세요.`);
  imported.push({...article,sheetName,row:i+1,dateWarning:columns.date>=0&&cellText(rows[i][columns.date])&&!article.date?'발행일을 확인하여 직접 입력해 주세요.':''});
 }
 return imported;
}
export async function readWorkbook(buffer) {
 const {default:ExcelJS}=await import('exceljs');
 const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(buffer);
 if(workbook.worksheets.length>30)throw new Error('엑셀은 시트 30개 이하로 나누어 주세요.');
 const articles=[];
 for(const sheet of workbook.worksheets) {
  if(sheet.rowCount>1001 || sheet.columnCount>100)throw new Error(`${sheet.name}: 시트는 1,000개 기사·100개 열 이하로 나누어 주세요.`);
  const rows=[];sheet.eachRow({includeEmpty:true},row=>{rows.push(Array.from({length:sheet.columnCount},(_,i)=>row.getCell(i+1).value));});
  if(!rows.some(row=>row.some(value=>cellText(value))))continue;
  articles.push(...mapSheetRows(rows,sheet.name));
 }
 if(!articles.length)throw new Error('엑셀에서 본문이 있는 기사를 찾지 못했습니다.');
 if(articles.length>1000)throw new Error('한 파일의 기사는 1,000개 이하로 나누어 주세요.');
 return articles;
}
export async function readPdf(buffer) {
 const pdfjs=await import('pdfjs-dist');
 const worker=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
 pdfjs.GlobalWorkerOptions.workerSrc=worker.default;
 const task=pdfjs.getDocument({data:new Uint8Array(buffer),isEvalSupported:false});
 let document;
 try {document=await task.promise;} catch(error) {await task.destroy();if(error.name==='PasswordException')throw new Error('암호가 설정된 PDF입니다. 암호를 해제한 파일을 업로드해 주세요.');throw error;}
 try {return await extractPdfText(document);} finally {await task.destroy();}
}
export async function extractPdfText(document) {
 try {
  if(document.numPages>100)throw new Error('PDF는 100쪽 이하로 나누어 주세요.');
  const pages=[];
  for(let i=1;i<=document.numPages;i++) {
   const page=await document.getPage(i);const content=await page.getTextContent();
   pages.push(content.items.map(item=>typeof item.str==='string'?item.str+(item.hasEOL?'\n':' '):'').join('').trim());
   page.cleanup();
  }
  const text=pages.filter(Boolean).join('\n\n');
  if(text.length>50000)throw new Error('PDF 본문이 50,000자를 넘습니다. 기사 단위로 나누어 주세요.');
  return text;
 } finally {await document.cleanup();}
}
