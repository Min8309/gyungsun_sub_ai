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
