import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { analyze, generateHeaderImages, validateArticle, validateAnalysis } from './pipeline.mjs';
import { extractScannedPdf } from './pdfImport.mjs';
import { DEFAULT_SPEECH, validateSpeech, synthesize } from './speech.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const dataRoot = path.join(root, '.newsroom.local');
await fs.mkdir(dataRoot, { recursive: true, mode: 0o700 });
const vite = await (await import('vite')).createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
const load = async id => JSON.parse(await fs.readFile(path.join(dataRoot, `${id}.json`), 'utf8'));
const save = async article => {
  const temp = path.join(dataRoot, `${article.id}.${randomUUID()}.tmp`);
  await fs.writeFile(temp, JSON.stringify(article), { mode: 0o600 });
  await fs.rename(temp, path.join(dataRoot, `${article.id}.json`));
};
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
const body = async (req, limit = 150000) => {
  let content = ''; for await (const chunk of req) { content += chunk; if (content.length > limit) throw new Error('입력 데이터가 너무 큽니다.'); }
  return JSON.parse(content || '{}');
};
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith('/api/')) return vite.middlewares(req, res);
  try {
    // 로컬 개발용 관리자: 다른 사이트의 요청으로 API 키/기사 작업을 실행하지 못하게 합니다.
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return json(res, 403, { error: '같은 사이트에서만 요청할 수 있습니다.' });
    if (req.method === 'POST' && url.pathname === '/api/import/pdf-ocr') {
      const input = await body(req, 14500000);
      return json(res, 200, { article: await extractScannedPdf(input.data, input.apiKey) });
    }
    if (req.method === 'GET' && url.pathname === '/api/articles') {
      const files = (await fs.readdir(dataRoot)).filter(name => name.endsWith('.json'));
      const articles = await Promise.all(files.map(name => load(name.slice(0, -5))));
      return json(res, 200, articles.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
    }
    const match = url.pathname.match(/^\/api\/articles\/([a-f0-9-]{36})(?:\/(speech|publish|audio|images|header-[01]))?$/);
    if (req.method === 'POST' && url.pathname === '/api/articles') {
      const input = await body(req); const source = validateArticle(input, { allowUntitled: true });
      const speechSettings = validateSpeech(input.speechSettings || DEFAULT_SPEECH);
      const analysis = await analyze(source, input.apiKey);
      const article = { ...source, ...analysis, title: analysis.suggestedTitle, originalTitle: source.title, id: randomUUID(), status: 'draft', createdAt: new Date().toISOString(), audio: null, headerImages: [], speechSettings };
      await save(article); return json(res, 201, article);
    }
    if (!match) return json(res, 404, { error: '기사를 찾을 수 없습니다.' });
    const [, id, action] = match; const article = await load(id);
    if (req.method === 'GET' && action?.startsWith('header-')) {
      const file = article.headerImages?.[Number(action.slice(-1))];
      if (!file) return json(res, 404, { error: '생성된 헤더 이미지가 없습니다.' });
      const bytes = await fs.readFile(path.join(dataRoot, file));
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' }); return res.end(bytes);
    }
    if (req.method === 'POST' && action === 'images') {
      if (article.status === 'published') throw new Error('발행한 기사입니다.');
      const input = await body(req);
      const images = await generateHeaderImages(article, input.apiKey);
      const files = images.map(() => `${id}-${randomUUID()}.png`);
      try {
        for (let i = 0; i < images.length; i++) await fs.writeFile(path.join(dataRoot, files[i]), images[i], { mode: 0o600 });
        article.headerImages = files; await save(article);
      } catch (error) { await Promise.all(files.map(file => fs.rm(path.join(dataRoot, file), { force: true }))); throw error; }
      return json(res, 200, article);
    }
    if (req.method === 'GET' && action === 'audio') {
      if (!article.audio) return json(res, 404, { error: '생성된 음성이 없습니다.' });
      const bytes = await fs.readFile(path.join(dataRoot, article.audio));
      res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' }); return res.end(bytes);
    }
    if (req.method === 'GET' && !action) return json(res, 200, article);
    if (req.method === 'PUT' && !action) {
      const input = await body(req); const fields = { ...validateArticle(input), ...validateAnalysis(input), speechSettings: validateSpeech(input.speechSettings || article.speechSettings || DEFAULT_SPEECH) };
      if (article.status === 'published') throw new Error('발행한 기사는 이 버전에서 수정할 수 없습니다.');
      if (fields.script !== article.script || JSON.stringify(fields.speechSettings) !== JSON.stringify(article.speechSettings || DEFAULT_SPEECH)) article.audio = null;
      if (['title', 'body', 'summary', 'modernText'].some(key => fields[key] !== article[key]) || JSON.stringify(fields.places) !== JSON.stringify(article.places)) article.headerImages = [];
      Object.assign(article, fields); await save(article); return json(res, 200, article);
    }
    if (req.method === 'POST' && action === 'speech') {
      if (article.status === 'published') throw new Error('발행한 기사입니다.');
      const input = await body(req);
      const response = await synthesize(article.script, article.speechSettings || DEFAULT_SPEECH, input.apiKey);
      const file = `${id}-${randomUUID()}.mp3`;
      await fs.writeFile(path.join(dataRoot, file), Buffer.from(await response.arrayBuffer()), { mode: 0o600 });
      article.audio = file; await save(article); return json(res, 200, article);
    }
    if (req.method === 'POST' && action === 'publish') {
      if (article.headerImages && article.headerImages.length !== 2) throw new Error('기사 내용에 맞는 헤더 이미지 2장을 생성한 후 발행해 주세요.');
      if (!article.audio) throw new Error('음성을 생성한 후 발행해 주세요.');
      article.status = 'published'; await save(article); return json(res, 200, article);
    }
    json(res, 405, { error: '지원하지 않는 요청입니다.' });
  } catch (error) {
    const message = error.code === 'ENOENT' ? '기사를 찾을 수 없습니다.' : error instanceof SyntaxError ? '데이터 형식을 확인해 주세요.' : error.name === 'TimeoutError' ? 'AI 요청 시간이 초과되었습니다. 다시 시도해 주세요.' : error.message;
    json(res, error.code === 'ENOENT' ? 404 : 400, { error: message });
  }
}).listen(5174, '127.0.0.1', () => console.log('경성신문 관리자 서버: port 5174 (로컬 개발용)'));
