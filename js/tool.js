let selectedFile = null;

function handleFile(file) {
  if (!file) return;
  selectedFile = file;
  document.getElementById('previewWrap').style.display = 'flex';
  document.getElementById('uploadZone').style.display = 'none';
  document.getElementById('previewName').textContent = file.name;
  document.getElementById('previewMeta').textContent =
    (file.size / 1024).toFixed(1) + ' KB · ' + file.type.split('/')[1].toUpperCase();
  const reader = new FileReader();
  reader.onload = e => document.getElementById('imgPreview').src = e.target.result;
  reader.readAsDataURL(file);
}

async function analyzeImage() {
  if (!selectedFile) return;
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('loadingWrap').style.display = 'flex';
  document.getElementById('resultsWrap').style.display = 'none';
  document.getElementById('errorBox').style.display = 'none';

  try {
    const dataUrl = await fileToBase64(selectedFile);
    const mimeType = selectedFile.type;
    const base64 = dataUrl.split(',')[1];
    const prompt = window.TOOL_PROMPT || `Analyze this image carefully. Respond ONLY with valid JSON, no extra text:
{"ai_probability": 75, "verdict": "AI Generated", "confidence": "High", "analysis": "Explain your verdict in 2-3 sentences.", "details": {"texture_quality": "Natural", "lighting": "Consistent", "artifacts": "None Found", "hands_fingers": "Normal", "background": "Realistic", "overall_realism": "High"}}

verdict must be one of: "AI Generated", "Real Photo", "Likely AI", "Likely Real", "Uncertain"
confidence must be one of: "High", "Medium", "Low"`;

    // Calls our own serverless function (/api/analyze), which holds the Groq
    // API key server-side. Never call the Groq API directly from the browser —
    // that exposes the key to anyone viewing page source.
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, mimeType, prompt })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'API error: ' + response.status);
    }

    const result = await response.json();
    showResults(result);

  } catch (e) {
    console.error('Analysis error:', e);
    document.getElementById('loadingWrap').style.display = 'none';
    document.getElementById('errorBox').style.display = 'block';
    document.getElementById('errorBox').textContent = '⚠️ Analysis failed: ' + e.message;
  }
}

function showResults(r) {
  document.getElementById('loadingWrap').style.display = 'none';
  document.getElementById('resultsWrap').style.display = 'block';

  const ai = parseInt(r.ai_probability) || 50;
  const real = 100 - ai;

  document.getElementById('aiPct').textContent = ai + '%';
  document.getElementById('realPct').textContent = real + '%';
  document.getElementById('aiBar').style.width = ai + '%';
  document.getElementById('realBar').style.width = real + '%';
  document.getElementById('verdictText').textContent = r.verdict || 'Uncertain';
  document.getElementById('analysisText').textContent = r.analysis || '';

  const emojis = {
    'AI Generated': '🤖',
    'Real Photo': '📷',
    'Likely AI': '🤖',
    'Likely Real': '📷',
    'Uncertain': '🤔'
  };
  document.getElementById('verdictEmoji').textContent = emojis[r.verdict] || '🤔';

  if (r.details) {
    const grid = document.getElementById('detailsGrid');
    grid.innerHTML = Object.entries(r.details).map(([k, v]) =>
      `<div class="detail-item"><span class="detail-key">${k.replace(/_/g, ' ')}</span><span class="detail-val">${v}</span></div>`
    ).join('');
  }
}

function resetTool() {
  selectedFile = null;
  document.getElementById('uploadZone').style.display = 'flex';
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('resultsWrap').style.display = 'none';
  document.getElementById('errorBox').style.display = 'none';
  document.getElementById('fileInput').value = '';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });
  zone.addEventListener('click', () => document.getElementById('fileInput').click());
});
