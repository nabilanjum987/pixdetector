const GROQ_API_KEY = "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";

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
    const base64 = await fileToBase64(selectedFile);
    const prompt = window.TOOL_PROMPT || `Analyze this image carefully. Respond ONLY with valid JSON, no extra text:
{"ai_probability": 75, "verdict": "AI Generated", "confidence": "High", "analysis": "Explain your verdict in 2-3 sentences.", "details": {"texture_quality": "Natural", "lighting": "Consistent", "artifacts": "None Found", "hands_fingers": "Normal", "background": "Realistic", "overall_realism": "High"}}

verdict must be one of: "AI Generated", "Real Photo", "Likely AI", "Likely Real", "Uncertain"
confidence must be one of: "High", "Medium", "Low"`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: base64 }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API error: ' + response.status);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) throw new Error('No response from API');

    const text = data.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const result = JSON.parse(jsonMatch[0]);
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