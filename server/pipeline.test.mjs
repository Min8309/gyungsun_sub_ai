import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, validateAnalysis, providerRequest } from './pipeline.mjs';
const article = { title:' 기록 ', body:'원문', date:'1931-08-04', newspaper:'동아일보', source:'https://example.com/article' };
test('기사 필수 값과 안전한 출처를 검증하고 API 키를 저장 대상에서 제외',()=>{
 const result=validateArticle({...article,apiKey:'private-key'});assert.equal(result.title,'기록');assert.equal('apiKey' in result,false);
 assert.throws(()=>validateArticle({...article,date:'1931-02-30'}));assert.throws(()=>validateArticle({...article,body:''}));assert.throws(()=>validateArticle({...article,source:'javascript:alert(1)'}));assert.throws(()=>validateArticle({...article,body:'x'.repeat(50001)}));
});
test('구조화된 AI 응답만 받아들이고 음성 입력 길이를 제한',()=>{
 const data={summary:'요약',modernText:'풀이',script:'대본',people:[],places:[],dates:[],uncertainties:[]};
 assert.deepEqual(validateAnalysis(data),data);assert.throws(()=>validateAnalysis({...data,places:'서울'}));assert.throws(()=>validateAnalysis({...data,script:'x'.repeat(4001)}));
});
test('키 없이 외부 호출하지 않음',async()=>{let called=false;await assert.rejects(providerRequest('chat/completions','',{},()=>{called=true;}));assert.equal(called,false);});
test('키는 고정 OpenAI 목적지에만 전달',async()=>{
 await providerRequest('audio/speech','test-key',{input:'대본'},async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/audio/speech');assert.equal(options.headers.Authorization,'Bearer test-key');assert.equal(JSON.parse(options.body).input,'대본');return {ok:true};});
});
test('공급자 오류와 비밀을 사용자에게 그대로 반환하지 않음',async()=>{
 for(const status of [401,429,500])await assert.rejects(providerRequest('audio/speech','test-key',{},async()=>({ok:false,status,json:()=>({secret:'private-key'})})),error=>!error.message.includes('private-key'));
});

const { headerImagePrompt, generateHeaderImages } = await import('./pipeline.mjs');
const imageArticle = { ...article, summary:'서울의 사건', modernText:'수사 기록', places:['서울'], uncertainties:['발생 시각 불명'] };
test('헤더 프롬프트는 같은 기사에서 서로 다른 장면과 판화 스타일을 지정',()=>{
 assert.notEqual(headerImagePrompt(imageArticle,0),headerImagePrompt(imageArticle,1));
 for(const index of [0,1]){const prompt=headerImagePrompt(imageArticle,index);assert.match(prompt,/세피아/);assert.match(prompt,/왼쪽 40%/);assert.match(prompt,/글자·제목/);assert.match(prompt,/수사 기록/);}
});
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
test('헤더 생성은 서로 다른 프롬프트로 가로 PNG 두 장을 반환',async()=>{
 const prompts=[];const result=await generateHeaderImages(imageArticle,'test-key',async(url,options)=>{
  assert.equal(url,'https://api.openai.com/v1/images/generations');const body=JSON.parse(options.body);assert.equal(body.model,'gpt-image-1');assert.equal(body.size,'1536x1024');assert.equal(body.n,1);prompts.push(body.prompt);
  return {ok:true,json:async()=>({data:[{b64_json:png.toString('base64')}]})};
 });assert.equal(result.length,2);assert.notEqual(prompts[0],prompts[1]);assert.deepEqual(result[0],png);
});
test('이미지 누락·손상과 두 번째 이미지 실패를 성공으로 처리하지 않음',async()=>{
 for(const data of [{data:[]},{data:[{b64_json:Buffer.from('not-png').toString('base64')}]}])await assert.rejects(generateHeaderImages(imageArticle,'test-key',async()=>({ok:true,json:async()=>data})));
 let calls=0;await assert.rejects(generateHeaderImages(imageArticle,'test-key',async()=>++calls===1?{ok:true,json:async()=>({data:[{b64_json:png.toString('base64')}]})}:{ok:false,status:429}));assert.equal(calls,2);
});
