import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { mapSheetRows, importDate, readWorkbook, extractPdfText } from '../src/lib/articleImport.js';
import { extractScannedPdf } from './pdfImport.mjs';
import { validateArticle, validateAnalysis } from './pipeline.mjs';
test('한글·영문 열 이름과 날짜를 기사 필드에 매핑',()=>{
 const rows=mapSheetRows([['기사 제목','원문 기사','발행일','신문명','출처 링크'],['제목','기사 본문','1931.8.4','신문','https://example.com']], '기사');
 assert.equal(rows[0].body,'기사 본문');assert.equal(rows[0].date,'1931-08-04');assert.equal(rows[0].source,'https://example.com');
 assert.equal(importDate('1931-02-30'),'');assert.equal(importDate(1234),'');assert.equal(importDate('1931년 8월 4일'),'1931-08-04');
 assert.throws(()=>mapSheetRows([['제목'],['기사']], '기록'));
});
test('실제 XLSX 파일에서 여러 기사, 엑셀 날짜, rich text를 읽음',async()=>{
 const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet('기사');sheet.addRow(['제목','본문','발행일','신문명']);
 const row=sheet.addRow(['첫 기사',{richText:[{text:'원문 '},{text:'기사'}]},new Date('1931-08-04T00:00:00Z'),'동아일보']);row.getCell(3).numFmt='yyyy-mm-dd';
 sheet.addRow(['두 번째 기사','둘째 원문','1933/5/18','신문']);
 const result=await readWorkbook(await workbook.xlsx.writeBuffer());assert.equal(result.length,2);assert.equal(result[0].body,'원문 기사');assert.equal(result[0].date,'1931-08-04');assert.equal(result[1].date,'1933-05-18');
});
test('PDF 페이지 순서와 줄바꿈을 보존하며 자원을 해제',async()=>{
 let destroyed=false;const text=await extractPdfText({numPages:2,getPage:async i=>({getTextContent:async()=>({items:[{str:`page ${i}`,hasEOL:true},{str:'text'}]}),cleanup(){}}),cleanup:async()=>{destroyed=true;}});
 assert.equal(text,'page 1\ntext\n\npage 2\ntext');assert.equal(destroyed,true);
});
test('실제 텍스트 PDF를 PDF.js로 판독',async()=>{
 const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const stream='BT /F1 12 Tf 50 750 Td (Newspaper article) Tj ET';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
 let pdf='%PDF-1.4\n';const offsets=[0];objects.forEach((object,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${object}\nendobj\n`;});const xref=pdf.length;pdf+=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 const task=pdfjs.getDocument({data:new Uint8Array(Buffer.from(pdf)),useSystemFonts:true});try {const document=await task.promise;assert.equal(await extractPdfText(document),'Newspaper article');} finally {await task.destroy();}
});
test('스캔 OCR은 PDF만 허용하고 읽힌 기사 필드를 반환',async()=>{
 await assert.rejects(extractScannedPdf(Buffer.from('not pdf').toString('base64'),'test-key'));
 const article={title:'원문 제목',body:'판독된 원문',date:'1931-08-04',newspaper:'신문'};
 const result=await extractScannedPdf(Buffer.from('%PDF-1.4\nfixture').toString('base64'),'test-key',async(url,options)=>{
  assert.equal(url,'https://api.openai.com/v1/responses');const payload=JSON.parse(options.body);assert.match(payload.input[0].content[0].file_data,/^data:application\/pdf;base64,/);
  return {ok:true,json:async()=>({output:[{content:[{type:'output_text',text:JSON.stringify(article)}]}]})};
 });assert.deepEqual(result,article);
});
test('제목 없는 새 기사 허용, 추천 제목 저장 및 과도한 길이 거절',()=>{
 const input={body:'원문',date:'1931-08-04',newspaper:'신문'};
 assert.equal(validateArticle(input,{allowUntitled:true}).title,'');assert.throws(()=>validateArticle(input));
 const analysis={summary:'요약',modernText:'풀이',script:'대본',people:[],places:[],dates:[],uncertainties:[],suggestedTitle:'부산 초량의 의문, 수사의 시작'};
 assert.equal(validateAnalysis(analysis).suggestedTitle,analysis.suggestedTitle);assert.throws(()=>validateAnalysis({...analysis,suggestedTitle:'가'.repeat(61)}));
});
