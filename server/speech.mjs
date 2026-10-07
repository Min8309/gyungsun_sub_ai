import { providerRequest } from './pipeline.mjs';
export const DEFAULT_SPEECH = { provider: 'openai', voiceId: 'alloy', instructions: '한국어로 차분하고 명료하게, 경성신문 라디오 진행자처럼 읽으세요. 일정한 속도로 발음하고 문장 사이에 자연스러운 쉼을 두세요. 과장된 연기나 광고 같은 억양은 피하세요.' };
const voices = ['alloy','ash','ballad','coral','echo','fable','nova','onyx','sage','shimmer','verse','marin','cedar'];
export function validateSpeech(value = DEFAULT_SPEECH) {
 if (!['openai','elevenlabs'].includes(value.provider)) throw new Error('음성 서비스를 선택해 주세요.');
 if (typeof value.voiceId !== 'string' || !value.voiceId.trim()) throw new Error('기존 목소리의 보이스 이름 또는 ID를 입력해 주세요.');
 const voiceId=value.voiceId.trim();
 if(value.provider==='openai' && !voices.includes(voiceId) && !/^voice_[A-Za-z0-9_-]{1,120}$/.test(voiceId)) throw new Error('OpenAI 보이스 이름 또는 등록된 커스텀 voice_ ID를 확인해 주세요.');
 if(value.provider==='elevenlabs' && !/^[A-Za-z0-9_-]{1,120}$/.test(voiceId)) throw new Error('ElevenLabs 보이스 ID를 확인해 주세요.');
 if(typeof value.instructions !== 'string' || value.instructions.length>2000) throw new Error('톤 지시는 2,000자 이하로 입력해 주세요.');
 return {provider:value.provider,voiceId,instructions:value.instructions};
}
export async function synthesize(script, settings, key, request=fetch) {
 const profile=validateSpeech(settings);
 if(profile.provider==='openai')return providerRequest('audio/speech',key,{model:'gpt-4o-mini-tts',voice:profile.voiceId.startsWith('voice_')?{id:profile.voiceId}:profile.voiceId,input:script,response_format:'mp3',instructions:profile.instructions},request);
 if(typeof key!=='string'||!key.trim()||key.length>500)throw new Error('사용 권한이 있는 ElevenLabs API 키를 입력해 주세요.');
 const response=await request(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(profile.voiceId)}?output_format=mp3_44100_128`,{
 method:'POST',headers:{'xi-api-key':key.trim(),'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text:script,model_id:'eleven_multilingual_v2',voice_settings:{stability:0.65,similarity_boost:0.85,style:0,use_speaker_boost:true}}),signal:AbortSignal.timeout(90000)
 });
 if(!response.ok)throw new Error(response.status===401?'ElevenLabs API 키 인증에 실패했습니다.':response.status===429?'ElevenLabs 사용량 한도를 확인해 주세요.':`ElevenLabs 보이스 요청 실패 (${response.status}). 키의 보이스 접근 권한을 확인해 주세요.`);
 return response;
}
