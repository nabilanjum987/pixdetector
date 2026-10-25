/* PixDetector shared video converter engine.
   Used by tools/video-converter.html and tools/video-to-mp4-converter.html.
   Re-encodes an uploaded video in the browser with MediaRecorder.
   Output is WebM ONLY: browsers cannot encode MP4 (H.264) natively.
   Video is drawn to a canvas, captured with captureStream, and recorded
   in real time (the video plays through once while recording).
   Audio is carried over when the browser allows it (AudioContext +
   MediaStreamDestination); if that fails, recording continues video-only
   and the page says so. Nothing is uploaded anywhere. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function toast(msg) {
    var t = $("toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function fmtKB(n) {
    return n < 1024 ? n + " B" : (n / 1024 < 1024 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB");
  }
  function fmtTime(s) {
    if (!isFinite(s) || s == null) return "0:00";
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }
  function pickMime() {
    var cands = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    for (var i = 0; i < cands.length; i++) {
      try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(cands[i])) return cands[i]; } catch (e) {}
    }
    return "";
  }

  var video = $("srcVideo"), canvas = $("cvCanvas");
  if (!video || !canvas) return;
  var ctx = canvas.getContext("2d");
  var file = null, fileName = "video", duration = 0, converting = false;
  var rec = null, chunks = [], rafId = 0, audioCtx = null, audioSrc = null, audioDest = null;
  var audioOK = false, audioWarned = false;

  function setStatus(msg) { var el = $("statusLine"); if (el) el.textContent = msg; }
  function setProgress(p) { var bar = $("progFill"); if (bar) bar.style.width = Math.max(0, Math.min(100, p)) + "%"; }

  function outDims() {
    var sel = $("sizeSelect"); var mode = sel ? sel.value : "original";
    var w = video.videoWidth || 1280, h = video.videoHeight || 720;
    if (mode === "720") { if (h > 720) { w = Math.round(w * 720 / h); h = 720; } }
    if (mode === "480") { if (h > 480) { w = Math.round(w * 480 / h); h = 480; } }
    if (mode === "360") { if (h > 360) { w = Math.round(w * 360 / h); h = 360; } }
    if (w % 2) w += 1; if (h % 2) h += 1;
    return { w: w, h: h };
  }
  function bitrate() {
    var sel = $("qualitySelect"); var q = sel ? sel.value : "medium";
    if (q === "high") return 5000000;
    if (q === "low") return 1000000;
    return 2500000;
  }

  function drawLoop() {
    if (!converting) return;
    if (video.readyState >= 2) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    rafId = requestAnimationFrame(drawLoop);
  }

  function stopConversion(cancelled) {
    converting = false;
    cancelAnimationFrame(rafId);
    try { video.pause(); } catch (e) {}
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch (e) {} }
    $("convertBtn").disabled = false;
    $("cancelBtn").disabled = true;
    if (cancelled) { setStatus("Conversion cancelled. Your original file was not changed."); setProgress(0); }
  }

  function finishRecording() {
    var blob = new Blob(chunks, { type: "video/webm" });
    chunks = [];
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName + "-converted.webm";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    var audioNote = audioOK ? " with audio" : " (video only — this browser would not let the audio track through)";
    setStatus("Done — downloaded " + fmtKB(blob.size) + " as WebM" + audioNote + ".");
    toast("Converted video downloaded (.webm).");
    $("convertBtn").disabled = false;
    $("cancelBtn").disabled = true;
  }

  function startConversion() {
    if (!file || converting) return;
    if (typeof MediaRecorder === "undefined") {
      setStatus("MediaRecorder is not supported in this browser. Try Chrome, Edge or Firefox.");
      return;
    }
    if (typeof canvas.captureStream !== "function") {
      setStatus("This browser can't capture video from a canvas. Try Chrome, Edge or Firefox.");
      return;
    }
    var dims = outDims();
    canvas.width = dims.w; canvas.height = dims.h;
    var stream;
    try { stream = canvas.captureStream(30); } catch (e) {
      setStatus("Could not start the video capture stream in this browser. Try Chrome or Firefox.");
      return;
    }
    /* Audio: route the video element's sound into a MediaStreamDestination
       so the recording keeps its audio. No sound plays out of the speakers. */
    audioOK = false;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioSrc = audioCtx.createMediaElementSource(video);
        audioDest = audioCtx.createMediaStreamDestination();
        audioSrc.connect(audioDest);
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      var atracks = audioDest.stream.getAudioTracks();
      if (atracks.length) { stream.addTrack(atracks[0]); audioOK = true; }
    } catch (e) {
      audioOK = false;
      if (!audioWarned) {
        audioWarned = true;
        setStatus("Note: audio could not be attached in this browser — the output will be video-only.");
      }
    }
    var mime = pickMime();
    chunks = [];
    try {
      rec = mime
        ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrate() })
        : new MediaRecorder(stream, { videoBitsPerSecond: bitrate() });
    } catch (e) {
      setStatus("Your browser refused to start the recorder (" + (e && e.message ? e.message : e) + "). Try Chrome or Firefox.");
      return;
    }
    rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
    rec.onstop = function () { if (!converting) return; converting = false; cancelAnimationFrame(rafId); finishRecording(); };
    rec.onerror = function () { stopConversion(true); setStatus("Recording failed in this browser. Try a shorter clip or a different browser."); };
    converting = true;
    $("convertBtn").disabled = true;
    $("cancelBtn").disabled = false;
    setStatus("Converting… the video plays through once in real time. Keep this tab open.");
    setProgress(0);
    try {
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () { stopConversion(true); setStatus("The video could not be played in this browser, so conversion stopped."); });
    } catch (e) {
      stopConversion(true);
      setStatus("The video could not be played in this browser, so conversion stopped.");
      return;
    }
    drawLoop();
    try { rec.start(250); } catch (e) { stopConversion(true); setStatus("The recorder could not start in this browser."); }
  }

  video.addEventListener("timeupdate", function () {
    if (converting && duration > 0) setProgress((video.currentTime / duration) * 100);
  });
  video.addEventListener("ended", function () {
    if (converting && rec && rec.state !== "inactive") { try { rec.stop(); } catch (e) {} }
  });
  video.addEventListener("loadedmetadata", function () {
    duration = video.duration || 0;
    var info = $("fileInfo");
    if (info && file) {
      info.textContent = file.name + " — " + (video.videoWidth || "?") + "×" + (video.videoHeight || "?") +
        " · " + fmtTime(duration) + " · " + fmtKB(file.size);
    }
    var dims = outDims();
    var out = $("outInfo");
    if (out) out.textContent = "Output: WebM (.webm), " + dims.w + "×" + dims.h + " at the quality you pick below. Runs at real-time speed — a " + fmtTime(duration) + " video takes about " + fmtTime(duration) + " to convert.";
  });

  $("videoFile").addEventListener("change", function () {
    var f = this.files[0];
    if (!f) return;
    if (!/^video\//.test(f.type) && !/\.(mp4|mov|webm|mkv|avi|m4v|ogv|3gp)$/i.test(f.name)) {
      var e = $("errorBox"); e.hidden = false; e.textContent = "Please choose a video file (MP4, MOV, WebM, MKV, AVI…).";
      return;
    }
    $("errorBox").hidden = true;
    file = f; fileName = f.name.replace(/\.[^.]+$/, "") || "video";
    var url = URL.createObjectURL(f);
    video.src = url;
    video.load();
    $("convertBtn").disabled = false;
    setStatus("Video loaded. Pick a size and quality, then press Convert.");
    setProgress(0);
  });
  $("sizeSelect").addEventListener("change", function () {
    if (video.videoWidth) { var d = outDims(); var out = $("outInfo"); if (out) out.textContent = "Output: WebM (.webm), " + d.w + "×" + d.h + " at the quality you pick below."; }
  });
  $("convertBtn").addEventListener("click", startConversion);
  $("cancelBtn").addEventListener("click", function () { stopConversion(true); });
  $("copyLink").addEventListener("click", function () {
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast("Link copied."); }, function () { toast("Copy was blocked."); });
  });
  var copyShare = $("copyShare");
  if (copyShare) copyShare.addEventListener("click", function () {
    var line = copyShare.getAttribute("data-share") || "";
    if (navigator.clipboard) navigator.clipboard.writeText(line + " " + location.href).then(function () { toast("Share line copied."); }, function () { toast("Copy was blocked."); });
  });
})();
