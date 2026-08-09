import os

tools = [
    {
        "slug": "ai-deepfake-checker",
        "emoji": "👁️",
        "title": "AI Deepfake Image Checker",
        "meta_desc": "Free AI deepfake checker. Detect face swaps, deepfakes and AI-manipulated faces instantly. No signup required.",
        "keywords": "ai deepfake checker, deepfake detector, face swap detector, deepfake image checker",
        "h1": "AI Deepfake Image Checker",
        "hero_p": "Detect face swaps, deepfakes and AI-manipulated faces with high accuracy. Our AI analyzes facial consistency, skin texture and lighting to identify synthetic faces.",
        "btn_text": "🔍 Check for Deepfakes",
        "loading_text": "Analyzing facial features for manipulation...",
        "prompt": """Analyze this image for signs of deepfake or face manipulation. Look for: face blending artifacts, skin texture mismatches between face and neck/ears, unnatural eye reflections or asymmetry, lighting inconsistencies specifically on the face vs background, blurry or inconsistent edges around hair and face, and unnatural teeth. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Deepfake Detected" OR "Appears Authentic" OR "Suspicious" OR "Uncertain", "confidence": "High/Medium/Low", "analysis": "2-3 sentence explanation with specific evidence.", "details": {"face_blending": "Natural/Artificial/Suspicious", "skin_texture": "Consistent/Inconsistent", "eye_authenticity": "Natural/Suspicious", "lighting_match": "Yes/No", "edge_quality": "Clean/Blurred/Suspicious", "overall_face": "Authentic/Manipulated/Uncertain"}}""",
        "about": "A deepfake checker analyzes images to detect when a real person's face has been replaced or altered using AI. Deepfakes can be used maliciously to create fake news, fraud, or non-consensual content.",
        "uses": [("🗞️ Media Verification", "Verify if news photos show real people"), ("💼 HR/KYC", "Check ID photos during verification"), ("⚖️ Legal Evidence", "Authenticate images in legal cases"), ("🔐 Security", "Detect fake profiles used in scams")],
        "related": [("ai-generated-image-checker.html", "🤖 AI Image Checker", "Detect AI-generated images"), ("ai-fake-image-checker.html", "🚫 Fake Image Checker", "Identify manipulated images"), ("ai-image-authenticity-checker.html", "✅ Authenticity Checker", "Verify real photos"), ("ai-image-verification-tool.html", "🔐 Verification Tool", "Professional verification")]
    },
    {
        "slug": "ai-fake-image-checker",
        "emoji": "🚫",
        "title": "AI Fake Image Checker",
        "meta_desc": "Free AI fake image checker. Detect manipulated, edited or AI-generated fake images used for misinformation. Instant results.",
        "keywords": "ai fake image checker, fake image detector, manipulated image checker, image forgery detector",
        "h1": "AI Fake Image Checker",
        "hero_p": "Detect fake, manipulated or AI-generated images used to spread misinformation. Our AI identifies editing artifacts, inconsistencies and AI generation signatures.",
        "btn_text": "🔍 Check If Image Is Fake",
        "loading_text": "Scanning for manipulation and fakery...",
        "prompt": """Analyze this image to determine if it is fake, manipulated, AI-generated, or being used to spread misinformation. Look for: cloning or copy-paste artifacts, inconsistent shadows and lighting, unnatural edges around edited objects, compression artifacts from re-saving, AI generation patterns, scale inconsistencies between objects. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Likely Fake" OR "Likely Real" OR "Manipulated" OR "AI Generated" OR "Uncertain", "confidence": "High/Medium/Low", "analysis": "2-3 sentence explanation with specific evidence.", "details": {"manipulation": "Detected/Not Detected/Possible", "ai_generated": "Yes/No/Uncertain", "inconsistencies": "Yes/No", "trust_score": "High/Medium/Low", "misinformation_risk": "High/Medium/Low", "editing_artifacts": "Present/None"}}""",
        "about": "Fake image checkers help identify digitally manipulated or AI-generated images that may be used to spread false information. With the rise of powerful AI tools, fake images have become increasingly convincing.",
        "uses": [("📰 Fact Checking", "Verify images in news and social media"), ("🏛️ Research", "Authenticate images for academic work"), ("🛡️ Brand Safety", "Protect your brand from fake images"), ("👤 Personal", "Verify images before sharing online")],
        "related": [("ai-generated-image-checker.html", "🤖 AI Image Checker", "Detect AI images"), ("ai-deepfake-checker.html", "👁️ Deepfake Checker", "Detect face manipulation"), ("ai-image-authenticity-checker.html", "✅ Authenticity Checker", "Verify genuine photos"), ("ai-image-verification-tool.html", "🔐 Verification Tool", "Professional verification")]
    },
    {
        "slug": "ai-image-authenticity-checker",
        "emoji": "✅",
        "title": "AI Image Authenticity Checker",
        "meta_desc": "Free AI image authenticity checker. Verify if a photo is genuine and unmodified or has been digitally altered. No signup needed.",
        "keywords": "ai image authenticity checker, image authenticity checker, photo authentication, verify image authenticity",
        "h1": "AI Image Authenticity Checker",
        "hero_p": "Verify whether a photograph is genuine and unmodified. Our AI checks for editing artifacts, manipulation signs, and AI generation patterns to certify image authenticity.",
        "btn_text": "🔍 Verify Authenticity",
        "loading_text": "Verifying image authenticity...",
        "prompt": """Analyze this image for its authenticity. Is it an original, unmodified genuine photograph? Or has it been digitally altered, AI-generated, or manipulated? Look for editing traces, clone stamps, content-aware fill artifacts, AI generation signatures, inconsistent noise patterns, and unnatural elements. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Authentic" OR "Manipulated" OR "AI Generated" OR "Likely Authentic" OR "Uncertain", "confidence": "High/Medium/Low", "analysis": "2-3 sentence explanation of your assessment.", "details": {"originality": "High/Medium/Low", "editing_traces": "Found/Not Found/Possible", "ai_signatures": "Present/Absent", "noise_pattern": "Natural/Artificial", "metadata_consistency": "Consistent/Inconsistent/Unknown", "authenticity_score": "High/Medium/Low"}}""",
        "about": "Image authenticity checking verifies whether a photograph is an original unmodified image or has been digitally altered. This is crucial for journalism, legal proceedings, and any situation where image integrity matters.",
        "uses": [("⚖️ Legal", "Authenticate images for legal proceedings"), ("📸 Photography", "Verify contest submission authenticity"), ("🏦 Insurance", "Check claim images for manipulation"), ("🎓 Academic", "Verify research images are unaltered")],
        "related": [("ai-generated-image-checker.html", "🤖 AI Image Checker", "Detect AI images"), ("ai-deepfake-checker.html", "👁️ Deepfake Checker", "Detect deepfakes"), ("ai-fake-image-checker.html", "🚫 Fake Checker", "Detect fake images"), ("ai-image-verification-tool.html", "🔐 Verification Tool", "Professional verification")]
    },
    {
        "slug": "ai-image-analyzer",
        "emoji": "🔬",
        "title": "AI Image Analyzer",
        "meta_desc": "Free AI image analyzer. Deep AI analysis of image content, objects, scenes and visual elements. Get detailed insights instantly.",
        "keywords": "ai image analyzer, image analysis tool, analyze image with ai, image content analyzer",
        "h1": "AI Image Analyzer",
        "hero_p": "Get deep AI-powered analysis of any image. Identify objects, scenes, colors, mood, text, faces and much more. Receive detailed insights in seconds.",
        "btn_text": "🔍 Analyze Image",
        "loading_text": "Performing deep image analysis...",
        "prompt": """Perform a comprehensive analysis of this image. Identify and describe everything you observe including objects, people, scenes, text, colors, mood, composition, and technical qualities. Also assess if it appears AI-generated or real. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Analysis Complete", "confidence": "High", "analysis": "Write 3-4 detailed sentences describing everything important in the image.", "details": {"scene_type": "describe the scene", "main_subjects": "list main subjects", "dominant_colors": "list 2-3 colors", "mood_atmosphere": "describe mood", "has_text": "Yes/No", "has_people": "Yes/No", "composition": "describe composition briefly", "image_origin": "Real Photo/AI Generated/Uncertain"}}""",
        "about": "An AI image analyzer uses advanced computer vision and machine learning to automatically analyze and extract information from images. It can identify objects, scenes, people, text, colors, and much more.",
        "uses": [("🛒 E-commerce", "Auto-tag product images at scale"), ("📱 Social Media", "Understand image content for moderation"), ("🔍 Research", "Extract data from image datasets"), ("♿ Accessibility", "Generate alt text for images")],
        "related": [("ai-image-analysis-tool.html", "📊 Analysis Tool", "Comprehensive analysis"), ("ai-image-content-checker.html", "🛡️ Content Checker", "Check content safety"), ("ai-image-quality-checker.html", "⭐ Quality Checker", "Check image quality"), ("ai-image-seo-checker.html", "📈 SEO Checker", "SEO optimization")]
    },
    {
        "slug": "ai-image-quality-checker",
        "emoji": "⭐",
        "title": "AI Image Quality Checker",
        "meta_desc": "Free AI image quality checker. Analyze sharpness, noise, exposure and overall technical quality of any image. Instant free results.",
        "keywords": "ai image quality checker, image quality analyzer, check image quality, photo quality checker",
        "h1": "AI Image Quality Checker",
        "hero_p": "Analyze the technical quality of any image. Get detailed scores for sharpness, noise levels, exposure, color accuracy and overall quality — powered by AI.",
        "btn_text": "🔍 Check Image Quality",
        "loading_text": "Analyzing image quality parameters...",
        "prompt": """Analyze the technical quality of this image. Evaluate sharpness, noise/grain levels, exposure (over/under/correct), color accuracy, contrast, compression artifacts, and overall print/web suitability. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Excellent Quality" OR "Good Quality" OR "Average Quality" OR "Poor Quality", "confidence": "High", "analysis": "2-3 sentences describing the main quality characteristics and any issues found.", "details": {"sharpness": "Sharp/Soft/Blurry", "noise_level": "Low/Medium/High", "exposure": "Correct/Overexposed/Underexposed", "color_accuracy": "Accurate/Oversaturated/Desaturated/Washed Out", "compression": "Minimal/Moderate/Heavy", "web_ready": "Yes/Needs Optimization/No", "print_ready": "Yes/Possibly/No", "overall_score": "Excellent/Good/Average/Poor"}}""",
        "about": "An AI image quality checker evaluates the technical aspects of an image to determine its suitability for various uses. It analyzes sharpness, noise, exposure, color, and other parameters to give you an objective quality assessment.",
        "uses": [("📸 Photography", "Check photos before delivering to clients"), ("🖨️ Printing", "Verify images are print-ready"), ("🌐 Web", "Ensure images are optimized for web"), ("🛒 E-commerce", "Quality control for product photos")],
        "related": [("ai-image-quality-analyzer.html", "📈 Quality Analyzer", "In-depth quality analysis"), ("ai-image-resolution-checker.html", "🖼️ Resolution Checker", "Check resolution and DPI"), ("ai-image-seo-checker.html", "📱 SEO Checker", "Image SEO analysis"), ("ai-image-analyzer.html", "🔬 Image Analyzer", "Full image analysis")]
    },
    {
        "slug": "ai-image-seo-checker",
        "emoji": "📈",
        "title": "AI Image SEO Checker",
        "meta_desc": "Free AI image SEO checker. Optimize your images for search engines with AI-powered SEO analysis and recommendations. Free tool.",
        "keywords": "ai image seo checker, image seo analyzer, image optimization checker, seo image checker",
        "h1": "AI Image SEO Checker",
        "hero_p": "Optimize your images for better search engine rankings. Our AI analyzes your images and provides specific SEO recommendations including alt text suggestions, format optimization and more.",
        "btn_text": "🔍 Check Image SEO",
        "loading_text": "Analyzing image for SEO opportunities...",
        "prompt": """Analyze this image from an SEO perspective. Assess what the image shows, suggest optimal alt text (specific and descriptive, under 125 characters), evaluate if the format/quality is web-optimized, check if it would rank well for image search, and identify SEO improvement opportunities. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Well Optimized" OR "Needs Optimization" OR "Poorly Optimized", "confidence": "High", "analysis": "2-3 sentences with specific SEO recommendations for this image.", "details": {"suggested_alt_text": "write a specific descriptive alt text under 125 chars", "image_subject": "describe main subject for SEO", "web_format_optimal": "Yes/No - suggest WebP if not", "file_size_estimate": "Small/Medium/Large", "search_intent_match": "High/Medium/Low", "accessibility_score": "Good/Fair/Poor", "seo_score": "High/Medium/Low"}}""",
        "about": "Image SEO is crucial for driving organic traffic from Google Images and improving overall page SEO. An AI image SEO checker helps you optimize alt text, format, size, and other factors that affect image search rankings.",
        "uses": [("🌐 Bloggers", "Optimize blog images for Google Images"), ("🛒 E-commerce", "Rank product images in search"), ("🏢 Businesses", "Improve website image SEO"), ("📊 SEO Agencies", "Audit client image optimization")],
        "related": [("ai-image-seo-analyzer.html", "🚀 SEO Analyzer", "Detailed SEO analysis"), ("ai-image-quality-checker.html", "⭐ Quality Checker", "Check image quality"), ("ai-image-performance-analyzer.html", "⚡ Performance Analyzer", "Web performance analysis"), ("ai-image-analyzer.html", "🔬 Image Analyzer", "Full image analysis")]
    },
    {
        "slug": "ai-image-content-checker",
        "emoji": "🛡️",
        "title": "AI Image Content Checker",
        "meta_desc": "Free AI image content checker. Check images for safe, appropriate content. Detect NSFW, violence and policy violations instantly.",
        "keywords": "ai image content checker, image content analyzer, nsfw image checker, image moderation tool",
        "h1": "AI Image Content Checker",
        "hero_p": "Check image content for safety and appropriateness. Our AI scans images for NSFW content, violence, hate symbols, and policy violations to keep your platform safe.",
        "btn_text": "🔍 Check Image Content",
        "loading_text": "Checking image content for safety...",
        "prompt": """Analyze the content of this image for safety and appropriateness. Identify what is shown, assess if it is suitable for general audiences, and flag any potentially problematic content. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Safe Content" OR "Potentially Sensitive" OR "Restricted Content" OR "Unsafe Content", "confidence": "High/Medium/Low", "analysis": "2-3 sentences describing the image content and any safety concerns.", "details": {"content_type": "describe main content type", "audience_suitability": "All Ages/Teen+/Adult Only", "nsfw": "None/Mild/Moderate/Explicit", "violence": "None/Mild/Moderate/Graphic", "hate_symbols": "None/Detected", "platform_safe": "Yes/Review Needed/No", "main_objects": "list what is visible"}}""",
        "about": "An AI image content checker automatically analyzes images to determine if they are appropriate for your platform, audience, or use case. Essential for content moderation, user-generated content platforms, and brand safety.",
        "uses": [("📱 Social Platforms", "Moderate user-generated image content"), ("🛒 Marketplaces", "Check product listing images"), ("🎓 Education", "Ensure appropriate content for students"), ("💼 Business", "Maintain brand-safe image libraries")],
        "related": [("ai-image-moderation-tool.html", "⚖️ Moderation Tool", "Automated moderation"), ("ai-image-content-analyzer.html", "🔎 Content Analyzer", "Deep content analysis"), ("ai-image-compliance-checker.html", "✔️ Compliance Checker", "Policy compliance"), ("ai-image-analyzer.html", "🔬 Image Analyzer", "Full image analysis")]
    },
    {
        "slug": "ai-image-moderation-tool",
        "emoji": "⚖️",
        "title": "AI Image Moderation Tool",
        "meta_desc": "Free AI image moderation tool. Automatically moderate images for inappropriate content, NSFW material and policy violations.",
        "keywords": "ai image moderation tool, image moderator, auto image moderation, content moderation tool",
        "h1": "AI Image Moderation Tool",
        "hero_p": "Automatically moderate images at scale. Our AI quickly identifies inappropriate, NSFW, violent or policy-violating content to keep your platform safe and compliant.",
        "btn_text": "🔍 Moderate This Image",
        "loading_text": "Running content moderation checks...",
        "prompt": """Perform content moderation analysis on this image. Determine if it violates common platform policies. Check for explicit content, violence, hate speech indicators, spam/scam patterns, or other policy violations. Respond ONLY with valid JSON: {"ai_probability": 0-100, "verdict": "Approved" OR "Review Required" OR "Rejected", "confidence": "High/Medium/Low", "analysis": "2-3 sentences explaining the moderation decision.", "details": {"explicit_content": "None/Low/Medium/High", "violence": "None/Low/Medium/High", "hate_speech_indicators": "None/Possible/Detected", "spam_indicators": "None/Possible/Detected", "policy_violation": "None/Possible/Confirmed", "action": "Approve/Human Review/Remove", "safe_for_all_ages": "Yes/No"}}""",
        "about": "AI image moderation helps platforms automatically screen user-uploaded content at scale. By flagging potentially inappropriate images before human review, it saves time and helps maintain community standards.",
        "uses": [("📱 Social Media", "Screen uploads before they go live"), ("🛒 Marketplaces", "Auto-moderate seller image uploads"), ("🎮 Gaming", "Moderate player-uploaded content"), ("💬 Forums", "Keep community images appropriate")],
        "related": [("ai-image-content-checker.html", "🛡️ Content Checker", "Content safety check"), ("ai-image-compliance-checker.html", "✔️ Compliance Checker", "Policy compliance"), ("ai-image-scanning-tool.html", "📡 Scanning Tool", "Deep image scan"), ("ai-image-validation-tool.html", "✅ Validation Tool", "Image validation")]
    },
]

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} - Free Tool | PixDetector</title>
<meta name="description" content="{meta_desc}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="https://pixdetector.vercel.app/tools/{slug}">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
<script>
window.TOOL_PROMPT = `{prompt}`;
</script>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">Pix<span>Detector</span></a>
    <div class="nav-links">
      <a href="/#tools">All Tools</a>
      <a href="/#how">How it Works</a>
      <a href="/#faq">FAQ</a>
    </div>
    <div class="nav-badge">FREE</div>
  </div>
</nav>
<div class="tool-page">
  <div class="tool-page-inner">
    <div class="breadcrumb">
      <a href="/">Home</a><span>›</span>
      <a href="/#tools">Tools</a><span>›</span>
      {title}
    </div>
    <div class="tool-page-header">
      <h1>{emoji} {h1}</h1>
      <p>{hero_p}</p>
    </div>
    <div class="upload-zone" id="uploadZone">
      <input type="file" accept="image/*" id="fileInput" onchange="handleFile(this.files[0])">
      <div class="upload-icon">📁</div>
      <h3>Drop your image here</h3>
      <p>or click to browse from your device</p>
      <div class="upload-formats">
        <span class="format-tag">JPG</span><span class="format-tag">PNG</span>
        <span class="format-tag">WebP</span><span class="format-tag">HEIC</span>
      </div>
    </div>
    <div class="preview-wrap" id="previewWrap">
      <img id="imgPreview" class="preview-img" src="" alt="Preview">
      <div class="preview-info">
        <div class="preview-name" id="previewName"></div>
        <div class="preview-meta" id="previewMeta"></div>
        <button class="btn-analyze" id="analyzeBtn" onclick="analyzeImage()">{btn_text}</button>
      </div>
    </div>
    <div class="loading-wrap" id="loadingWrap">
      <div class="spinner"></div>
      <div class="loading-title">{loading_text}</div>
      <div class="loading-step" id="loadingStep">Scanning pixel patterns...</div>
    </div>
    <div class="error-box" id="errorBox"></div>
    <div class="results-wrap" id="resultsWrap">
      <div class="result-card">
        <div class="verdict-row">
          <div class="verdict-emoji" id="verdictEmoji">🤔</div>
          <div>
            <div class="verdict-label">Verdict</div>
            <div class="verdict-text" id="verdictText">Analyzing...</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label"><span>AI/Issue probability</span><span id="aiPct">0%</span></div>
          <div class="bar-track"><div class="bar-fill bar-ai" id="aiBar" style="width:0%"></div></div>
        </div>
        <div class="bar-row">
          <div class="bar-label"><span>Real/Authentic probability</span><span id="realPct">0%</span></div>
          <div class="bar-track"><div class="bar-fill bar-real" id="realBar" style="width:0%"></div></div>
        </div>
        <div class="details-grid" id="detailsGrid"></div>
        <div class="analysis-box">
          <div class="analysis-label">AI Analysis</div>
          <div class="analysis-text" id="analysisText"></div>
        </div>
        <button class="btn-reset" onclick="resetTool()">🔄 Check Another Image</button>
      </div>
    </div>
    <div class="tool-about">
      <h2>About This Tool</h2>
      <p>{about}</p>
      <h2 style="margin-top:28px">Who Uses This Tool?</h2>
      <div class="use-cases">{use_cases_html}</div>
    </div>
    <div class="related-tools">
      <h2>Related Tools</h2>
      <div class="related-grid">{related_html}</div>
    </div>
  </div>
</div>
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">Pix<span>Detector</span></div>
        <p>Free AI image detection and analysis tools.</p>
      </div>
      <div class="footer-links">
        <h4>Top Tools</h4>
        <a href="ai-generated-image-checker.html">AI Image Checker</a>
        <a href="ai-deepfake-checker.html">Deepfake Checker</a>
        <a href="ai-fake-image-checker.html">Fake Image Checker</a>
      </div>
      <div class="footer-links">
        <h4>Analysis</h4>
        <a href="ai-image-analyzer.html">Image Analyzer</a>
        <a href="ai-image-quality-checker.html">Quality Checker</a>
        <a href="ai-image-seo-checker.html">SEO Checker</a>
      </div>
      <div class="footer-links">
        <h4>Company</h4>
        <a href="../about.html">About Us</a>
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 PixDetector.com — Free AI Image Detection Tools</p>
    </div>
  </div>
</footer>
<script src="../js/api-config.js"></script>
<script src="../js/tool.js"></script>
</body>
</html>'''

os.makedirs('/home/claude/pixdetector/tools', exist_ok=True)

for tool in tools:
    use_cases_html = ''.join([
        f'<div class="use-case"><h4>{u[0]}</h4><p>{u[1]}</p></div>'
        for u in tool['uses']
    ])
    related_html = ''.join([
        f'<a href="{r[0]}" class="related-card"><h4>{r[1]}</h4><p>{r[2]}</p></a>'
        for r in tool['related']
    ])
    html = TEMPLATE.format(
        slug=tool['slug'],
        emoji=tool['emoji'],
        title=tool['title'],
        meta_desc=tool['meta_desc'],
        keywords=tool['keywords'],
        h1=tool['h1'],
        hero_p=tool['hero_p'],
        btn_text=tool['btn_text'],
        loading_text=tool['loading_text'],
        prompt=tool['prompt'].replace('`', '\\`'),
        about=tool['about'],
        use_cases_html=use_cases_html,
        related_html=related_html
    )
    path = f'/home/claude/pixdetector/tools/{tool["slug"]}.html'
    with open(path, 'w') as f:
        f.write(html)
    print(f'Created: {tool["slug"]}.html')

print(f'\nTotal: {len(tools)} tool pages generated!')
