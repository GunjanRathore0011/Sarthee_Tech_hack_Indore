// utils/virusTotal.js
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

const VT = axios.create({
  baseURL: 'https://www.virustotal.com/api/v3',
  headers: { 'x-apikey': process.env.VT_API_KEY }
});

// Buffer se SHA-256 hash
function sha256Buffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// VT pe existing report lao (hash se)
async function vtGetFileReportByHash(sha256) {
  try {
    const { data } = await VT.get(`/files/${sha256}`);
    return data; // report mila
  } catch (e) {
    if (e.response && e.response.status === 404) return null; // report nahi
    throw e;
  }
}

// Buffer upload karke analysis start karo, phir poll
async function vtUploadBufferAndAnalyze(buf, filename='upload.bin') {
  const form = new FormData();
  form.append('file', buf, { filename });

  // upload -> analysis id
  const up = await VT.post('/files', form, { headers: form.getHeaders() });
  const analysisId = up.data?.data?.id;

  // poll until completed
  for (let i=0; i<20; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const poll = await VT.get(`/analyses/${analysisId}`);
    const status = poll.data?.data?.attributes?.status;
    if (status === 'completed') return poll.data;
  }
  throw new Error('VirusTotal analysis timed out');
}

// Stats ko simple verdict me map
function vtSummarizeStats(stats = {}) {
  const { malicious=0, suspicious=0, harmless=0, undetected=0 } = stats;
  const score = malicious*2 + suspicious;
  let verdict = 'safe';
  if (score >= 5) verdict = 'high-risk';
  else if (score >= 2) verdict = 'suspicious';
  return { verdict, score, malicious, suspicious, harmless, undetected };
}

// High-level: buffer do, final VT summary return
async function scanBufferWithVT(buf, filename='upload.bin') {
  const sha256 = sha256Buffer(buf);

  // 1) hash se pehle report dhoondo (fast path)
  let fileReport = await vtGetFileReportByHash(sha256);

  // 2) nahi mila to upload+poll -> phir fresh file report lao
  if (!fileReport) {
    await vtUploadBufferAndAnalyze(buf, filename);
    fileReport = await vtGetFileReportByHash(sha256);
  }

  const stats = fileReport?.data?.attributes?.last_analysis_stats || {};
  const summary = vtSummarizeStats(stats);

  return {
    sha256,
    stats,
    ...summary,
    vtLink: `https://www.virustotal.com/gui/file/${sha256}`
  };
}

module.exports = {
  scanBufferWithVT,
  sha256Buffer,
  vtGetFileReportByHash,
  vtUploadBufferAndAnalyze,
  vtSummarizeStats
};
