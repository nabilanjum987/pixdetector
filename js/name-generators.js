/* PixDetector name generators — one shared engine for the 5 name-tool pages.
   Plain JS, no dependencies, everything runs in the browser. */
(function () {
  "use strict";

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function uniq(list, n) {
    var out = [], seen = {};
    for (var i = 0; i < list.length && out.length < n; i++) {
      var s = list[i];
      if (s && !seen[s.toLowerCase()]) { seen[s.toLowerCase()] = 1; out.push(s); }
    }
    return out;
  }

  var ADJ = ["Bold", "Bright", "Golden", "Swift", "Clever", "Fresh", "Honest", "Lively",
    "Quiet", "Brave", "Gentle", "Sharp", "Warm", "Wild", "Calm", "Proud", "Happy", "True"];
  var NOUN = ["Craft", "Story", "Spark", "Path", "Light", "Wave", "Bloom", "North",
    "Harbor", "Meadow", "Summit", "River", "Ember", "Willow", "Atlas", "Beacon"];
  var VERB = ["builds", "brews", "crafts", "delivers", "designs", "grows", "makes", "shapes"];

  /* ---------------- slogan generator ---------------- */
  var SLOGAN_TEMPLATES = {
    punchy: [
      "{brand} — {topic}, done right.",
      "{adj} {topic}, every single time.",
      "{brand}. {topic} that feels {adj}.",
      "Good {topic}. Great {brand}.",
      "{topic}, made {adj}.",
      "Your {topic}, our {noun}.",
      "{brand}: {topic} without the hassle.",
      "Say yes to {adj} {topic}."
    ],
    premium: [
      "{brand} — {topic}, done properly.",
      "Trusted {topic}, from {brand}.",
      "{brand}: quality {topic}, every time.",
      "The professional choice for {topic}.",
      "{brand} — {topic} you can rely on.",
      "Serious {topic}. Straightforward {brand}."
    ],
    funny: [
      "{brand}: {topic} with a wink.",
      "{topic}? {brand} has you covered (and then some).",
      "Warning: our {topic} may cause smiling.",
      "{brand} — {topic}, minus the boring bits.",
      "Life is short. Get better {topic}."
    ],
    bold: [
      "{brand}. {topic}. No excuses.",
      "We do {topic}. We do it {adj}.",
      "{brand} — {topic} that leads.",
      "Own your {topic}. Choose {brand}.",
      "{adj} {topic}. Zero compromise."
    ],
    clever: [
      "{brand}. {topic}.",
      "{adj} {topic}.",
      "{topic}, by {brand}.",
      "{brand} — simply {topic}.",
      "{brand}: {topic} with a twist.",
      "The {topic} that thinks different."
    ]
  };

  function slogans(brand, topic, tone, n) {
    brand = (brand || "Your Brand").trim() || "Your Brand";
    topic = (topic || "great service").trim().toLowerCase() || "great service";
    var pool = SLOGAN_TEMPLATES[tone] || SLOGAN_TEMPLATES.punchy;
    var out = [], tries = 0;
    while (out.length < n && tries < n * 12) {
      tries++;
      var t = pick(pool);
      var s = t.replace(/\{brand\}/g, brand)
        .replace(/\{topic\}/g, topic)
        .replace(/\{adj\}/g, pick(ADJ).toLowerCase())
        .replace(/\{noun\}/g, pick(NOUN).toLowerCase())
        .replace(/\{verb\}/g, pick(VERB));
      out = uniq(out.concat([s]), n);
    }
    return out;
  }

  /* ---------------- username generator ---------------- */
  var USER_WORDS = {
    aesthetic: ["luna", "aura", "velvet", "mist", "rose", "noir", "sage", "wren", "opal", "fern", "dusk", "pearl", "willow", "ember", "fable", "lumen"],
    gamer: ["shadow", "nova", "viper", "ghost", "zero", "blaze", "storm", "wolf", "raven", "vex", "onyx", "slash", "frost", "havoc", "pixel", "turbo"],
    professional: ["hq", "labs", "studio", "co", "official", "pro", "works", "daily", "group", "media", "design", "made", "hub", "prime"],
    cute: ["bubbly", "peachy", "mochi", "sunny", "honey", "berry", "pudding", "cloudy", "cupcake", "boba", "mango", "twinkle", "cocoa", "sprinkles"],
    minimal: ["x", "io", "hq", "co", "ly", "go", "up", "in", "by", "me", "tv", "lab"]
  };
  var USER_PATTERNS = [
    function (s, w) { return s + w; },
    function (s, w) { return w + s; },
    function (s, w) { return s + "_" + w; },
    function (s, w) { return s + "." + w; },
    function (s, w) { return w + "_" + s; },
    function (s, w) { return s + w + "x"; },
    function (s, w) { return "the" + s + w; },
    function (s, w) { return s + "the" + w; }
  ];

  function usernames(seed, style, maxLen, useNumbers, useSep, n) {
    seed = (seed || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    var bank = USER_WORDS[style] || USER_WORDS.aesthetic;
    var out = [], tries = 0;
    var seeds = seed ? [seed] : shuffle(bank).slice(0, 3);
    while (out.length < n && tries < n * 20) {
      tries++;
      var s = seed || pick(seeds);
      var w = pick(bank);
      var name;
      if (!seed) {
        name = pick(bank) + pick(bank);
      } else {
        name = pick(USER_PATTERNS)(s, w);
      }
      if (useSep && Math.random() < 0.35) name = name.replace(/_|\./, pick(["_", "."]));
      if (useNumbers) {
        var r = Math.random();
        if (r < 0.5) name += String(Math.floor(Math.random() * 90) + 10);
        else if (r < 0.75) name += String(2000 + Math.floor(Math.random() * 26));
        else name += "_" + String(Math.floor(Math.random() * 900) + 100);
      }
      name = name.toLowerCase().replace(/[^a-z0-9_.]/g, "").replace(/__+/g, "_").replace(/\.\.+/g, ".");
      if (name.length > maxLen) name = name.slice(0, maxLen).replace(/[_.]$/, "");
      if (name.length >= 3) out = uniq(out.concat([name]), n);
    }
    return out;
  }

  /* ---------------- acronym generator ---------------- */
  var SMALL_WORDS = ["a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "by", "at", "from"];
  var BACKRONYM = {
    a: ["Amazing", "Awesome", "Active", "Adventurous", "Able"], b: ["Bold", "Bright", "Brave", "Brilliant", "Balanced"],
    c: ["Creative", "Clever", "Calm", "Caring", "Curious"], d: ["Dynamic", "Daring", "Driven", "Dependable", "Dreamy"],
    e: ["Energetic", "Excellent", "Efficient", "Engaging", "Epic"], f: ["Friendly", "Focused", "Fearless", "Flexible", "Fun"],
    g: ["Great", "Genuine", "Gifted", "Generous", "Grounded"], h: ["Honest", "Happy", "Helpful", "Heroic", "Humble"],
    i: ["Inspiring", "Innovative", "Intelligent", "Inclusive", "Imaginative"], j: ["Joyful", "Just", "Jolly", "Judicious"],
    k: ["Kind", "Keen", "Knowledgeable", "Kindhearted"], l: ["Loyal", "Lively", "Logical", "Leading", "Loved"],
    m: ["Motivated", "Mindful", "Modern", "Magnificent", "Merry"], n: ["Noble", "Natural", "Nimble", "Notable", "Nurturing"],
    o: ["Open", "Original", "Optimistic", "Organized", "Outstanding"], p: ["Positive", "Passionate", "Practical", "Powerful", "Proud"],
    q: ["Quick", "Quality", "Quiet", "Quirky"], r: ["Reliable", "Resilient", "Remarkable", "Respectful", "Radiant"],
    s: ["Smart", "Strong", "Steady", "Supportive", "Skilled"], t: ["Trusted", "Talented", "Thoughtful", "Team", "Tenacious"],
    u: ["Unique", "United", "Upbeat", "Understanding"], v: ["Valiant", "Vibrant", "Versatile", "Visionary"],
    w: ["Wise", "Warm", "Winning", "Welcoming", "Witty"], x: ["eXtraordinary", "eXciting", "eXpert"],
    y: ["Young", "Yearning", "Youthful"], z: ["Zealous", "Zesty", "Zen"]
  };

  function acronymFromPhrase(phrase, skipSmall) {
    var words = phrase.split(/[\s\-_]+/).filter(Boolean);
    var kept = skipSmall
      ? words.filter(function (w) { return SMALL_WORDS.indexOf(w.toLowerCase()) === -1; })
      : words;
    if (!kept.length) kept = words;
    var letters = kept.map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
    return { letters: letters, words: kept };
  }
  function backronym(word) {
    var letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
    var words = letters.map(function (l) { return pick(BACKRONYM[l.toLowerCase()] || [l]); });
    return { letters: letters.join(""), words: words };
  }
  function pronounceableScore(letters) {
    var vowels = (letters.match(/[AEIOU]/g) || []).length;
    if (!vowels) return "Hard to say — no vowel sounds. It will read letter by letter.";
    if (letters.length <= 5 && vowels >= 1) return "Sayable — it reads close to a word.";
    return "Mixed — some people will say it as a word, others letter by letter.";
  }

  /* ---------------- fantasy name generator ---------------- */
  var FANTASY = {
    elf: {
      pre: ["Ae", "Cele", "El", "Gal", "Il", "Luth", "Mir", "Syl", "Thrand", "Nae", "Fael", "Elen", "Ael", "Quen"],
      mid: ["a", "e", "i", "il", "an", "ar", "el", "or", ""],
      suf: ["iel", "wen", "dor", "ion", "ara", "thil", "las", "mir", "dil", "nia", "riel", "andil"],
      sur: ["Moonwhisper", "Starweaver", "Leafsong", "Dawnrunner", "Silverleaf", "Nightbloom", "Windrider", "Sunshard"]
    },
    dwarf: {
      pre: ["Bal", "Dor", "Far", "Gar", "Har", "Thor", "Grim", "Bor", "Dain", "Kild", "Brum", "Oin"],
      mid: ["a", "e", "i", "o", "u", ""],
      suf: ["in", "ak", "grim", "or", "dain", "rik", "ur", "ain", "ek", "ar"],
      sur: ["Stonefist", "Ironforge", "Oakenshield", "Battlehammer", "Deepdelver", "Goldbeard", "Anvilborn", "Rockseeker"]
    },
    orc: {
      pre: ["Gor", "Khar", "Mog", "Ur", "Zog", "Rag", "Thrak", "Durg", "Mok", "Snag", "Ghor", "Brak"],
      mid: ["a", "u", "o", ""],
      suf: ["gash", "gul", "ruk", "thak", "zog", "nak", "dush", "gore", "mash"],
      sur: ["Skullcrusher", "Bloodaxe", "Bonegrinder", "Warhowl", "Ironjaw", "Doombringer", "Fleshrender", "Gorefang"]
    },
    human: {
      pre: ["Ald", "Ed", "Rod", "Wil", "Hen", "Mar", "Gar", "Os", "Theo", "Bran", "Ced", "Row"],
      mid: ["a", "e", "i", ""],
      suf: ["ric", "mund", "win", "ford", "ric", "gar", "bert", "ward", "son", "ley"],
      sur: ["Ashford", "Blackwood", "Fairfax", "Holloway", "Kingsley", "Ravensworth", "Thornfield", "Wexford"]
    },
    dragon: {
      pre: ["Pyr", "Ign", "Vex", "Sma", "Drak", "Ember", "Cind", "Verm", "Azi", "Nidh"],
      mid: ["a", "o", "u", ""],
      suf: ["ax", "ion", "thar", "gor", "rax", "oth", "zath", "mir"],
      sur: ["Flamewing", "Stormscale", "Ashenmaw", "Goldhoard", "Nightfire", "Cindermaw", "Skyrender", "Emberheart"]
    },
    wizard: {
      pre: ["Al", "Mer", "El", "Zar", "Mor", "Gand", "Rad", "Sar", "Bel", "Thal"],
      mid: ["a", "e", "i", ""],
      suf: ["bus", "lin", "dor", "thos", "gast", "ron", "azar", "wyn"],
      sur: ["the Grey", "the Wise", "Stormcaller", "Runekeeper", "Spellweaver", "the Wanderer", "Lightbringer", "Starweaver"]
    },
    demon: {
      pre: ["Az", "Bel", "Mal", "Meph", "Zar", "Ab", "Lil", "Vor", "Xan", "Mor"],
      mid: ["a", "e", "i", "o", "u", ""],
      suf: ["oth", "zur", "mal", "rax", "goth", "zath", "pher", "dion"],
      sur: ["the Cruel", "Soulrender", "Hellcaller", "the Tormentor", "Doomwhisper", "Bloodpact", "the Fallen", "Nightmare"]
    },
    celestial: {
      pre: ["Aur", "Ser", "Gab", "Rap", "Uri", "Zad", "Cass", "Han", "Mich", "Sar"],
      mid: ["a", "e", "i", ""],
      suf: ["ael", "iel", "iel", "on", "eth", "ariel", "iel", "iel"],
      sur: ["the Radiant", "Lightbearer", "Dawnbringer", "the Watcher", "Harbinger", "the Merciful", "Starwarden", "the Just"]
    },
    goblin: {
      pre: ["Sn", "Gr", "Nib", "Zik", "Muk", "Fiz", "Rik", "Tib", "Wob", "Pik"],
      mid: ["a", "i", "o", ""],
      suf: ["ik", "zit", "nob", "gik", "nip", "git", "ble", "tch"],
      sur: ["Quickfingers", "the Sneak", "Mudfoot", "Shinykeeper", "the Tinkerer", "Ratcatcher", "Pocketpicker", "the Scurrier"]
    }
  };
  var PLACE_PRE = ["Iron", "Storm", "Ember", "Mist", "Raven", "Thorn", "Silver", "Dragon", "Wolf", "Shadow", "Copper", "Frost"];
  var PLACE_SUF = ["ford", "shire", "hold", "fall", "mere", "wick", "gate", "haven", "crest", "brook", "moor", "spire"];

  function fantasyNames(race, gender, kind, n) {
    var r = FANTASY[race] || FANTASY.elf;
    var out = [], tries = 0;
    while (out.length < n && tries < n * 20) {
      tries++;
      var name;
      if (kind === "place") {
        name = pick(PLACE_PRE) + pick(PLACE_SUF);
        if (Math.random() < 0.3) name = pick(PLACE_PRE) + " " + pick(PLACE_SUF).replace(/^./, function (c) { return c.toUpperCase(); });
      } else {
        name = pick(r.pre) + pick(r.mid) + pick(r.suf);
        if (gender === "female" && /[^aeiou]$/i.test(name) && Math.random() < 0.5) name += "a";
        if (Math.random() < 0.55) name += " " + pick(r.sur);
        name = cap(name);
      }
      out = uniq(out.concat([name]), n);
    }
    return out;
  }

  /* ---------------- team name generator ---------------- */
  var TEAM_ANIMALS = ["Wolves", "Sharks", "Eagles", "Tigers", "Falcons", "Panthers", "Cobras", "Rhinos", "Hawks", "Bears", "Lions", "Dragons", "Vipers", "Stallions"];
  var TEAM_ADJ = {
    funny: ["Soggy", "Sleepy", "Grumpy", "Wobbly", "Clumsy", "Dizzy", "Sneaky", "Lazy", "Goofy", "Wonky"],
    fierce: ["Savage", "Iron", "Thunder", "Raging", "Fearless", "Blazing", "Venomous", "Relentless", "Storming", "Mighty"],
    classic: ["United", "Royal", "Golden", "City", "Metro", "Central", "National", "Premier", "Elite", "Victory"],
    cool: ["Midnight", "Neon", "Shadow", "Crimson", "Electric", "Frozen", "Cosmic", "Phantom", "Turbo", "Zenith"],
    modern: ["Apex", "Nova", "Prime", "Ultra", "Vertex", "Pixel", "Quantum", "Solar", "Lunar", "Orbit"],
    mythical: ["Phoenix", "Kraken", "Griffin", "Titan", "Valkyrie", "Hydra", "Sphinx", "Pegasus", "Minotaur", "Basilisk"]
  };
  var TEAM_PUNS = {
    soccer: ["Net Results", "Goal Diggers", "Kickin' It", "The Offsiders", "Cleats & Treats", "Sofa King Good", "Penalty Box Heroes", "Grass Stains"],
    basketball: ["Ball Don't Lie", "Hoop There It Is", "The Sixth Men", "Net Worth", "Dribble Me This", "Full Court Pressed", "The Rebounders", "Swish Kebabs"],
    football: ["Fourth and Long", "The Blitz Kids", "Gridiron Gang", "Hail Marys", "Pigskin Pirates", "The Fumblers", "End Zone Dancers", "Sack Lunch"],
    baseball: ["The Batty Crew", "Hit It & Quit It", "Base Invaders", "The Strikeouts", "Diamond Dogs", "Sluggers Anonymous", "Pitch Please", "Curveball Kings"],
    volleyball: ["Spike Girls", "Net Gains", "Block Party", "Set It Up", "Serve-ivors", "Bump Set Spike", "Ace Ventura", "The Diggers"],
    hockey: ["Puck Yeah", "Ice to Meet You", "The Zambonis", "Slapshot Squad", "Stick Figures", "The Hat Tricks", "Frozen Assets", "Puck Luck"],
    esports: ["Lag Lords", "Alt F4 Club", "Respawn Kings", "The Rage Quitters", "AFK Legends", "No Scope Squad", "GG EZ", "The Tiltproof"],
    fantasy: ["Hurts So Good", "Curry in a Hurry", "Judge Dredd", "Luka Magic", "Mahomes Alone", "Kelce You Later", "Turn Your Head and Goff", "Bijan Mustard", "Chase the Ace", "My Ball Zach Ertz"],
    quiz: ["The Quizzard of Oz", "Smartacus", "Quiz Khalifa", "The Trivia Newton John", "Knowledge Is Power", "The Brain Trust", "Fact Hunters", "Ctrl Alt Defeat"],
    work: ["The Deadline Dodgers", "Synergy Squad", "Ctrl Alt Elite", "The Overachievers", "Meeting Makers", "The Brainstormers", "Spreadsheet Warriors", "The Pivoters"],
    running: ["The Sole Survivors", "Run Like the Winded", "Pace Makers", "The Joggers", "Tortoise Power", "Chafing the Dream", "The Runaways", "Sole Mates"]
  };

  function teamNames(sport, style, theme, n) {
    theme = (theme || "").trim();
    var out = [], tries = 0;
    var adjBank = TEAM_ADJ[style] || TEAM_ADJ.funny;
    while (out.length < n && tries < n * 20) {
      tries++;
      var name;
      var r = Math.random();
      if (style === "punny" || r < 0.3) {
        var puns = TEAM_PUNS[sport] || TEAM_PUNS.quiz;
        name = pick(puns);
        if (theme && Math.random() < 0.4) name = cap(theme) + " " + name;
      } else if (theme && r < 0.65) {
        name = cap(theme) + " " + pick(TEAM_ANIMALS);
      } else {
        name = pick(adjBank) + " " + pick(TEAM_ANIMALS);
      }
      if (style === "classic" && Math.random() < 0.4) name = "The " + name;
      out = uniq(out.concat([name]), n);
    }
    return out;
  }

  /* ---------------- "why this name fits" lines ---------------- */
  var FANTASY_FIT = {
    elf: "Soft vowels and a flowing ending \u2014 fits an elf of the old forests.",
    dwarf: "Hard consonants and a heavy ending \u2014 fits a dwarf of the mountain halls.",
    orc: "Harsh clusters and a guttural sound \u2014 fits an orc of the war-bands.",
    human: "Plain and grounded \u2014 fits a human of the kingdoms.",
    dragon: "Long and rolling \u2014 fits an ancient dragon.",
    wizard: "Old and arcane \u2014 fits a learned spellcaster.",
    demon: "Dark and hissing \u2014 fits a demon of the lower planes.",
    celestial: "Bright and high \u2014 fits a celestial of the upper planes.",
    goblin: "Short and sneaky \u2014 fits a goblin of the warrens."
  };
  function fantasyFit(race, kind) {
    if (kind === "place") return "Two meaningful parts, like a real town name \u2014 fits a place on the map.";
    return FANTASY_FIT[race] || FANTASY_FIT.elf;
  }
  var TEAM_FIT = {
    funny: "A joke the whole group gets \u2014 best for casual leagues and quiz nights.",
    fierce: "A name that sounds like a warning \u2014 best for competitive leagues.",
    classic: "A safe, proud name \u2014 best for school teams and work teams.",
    cool: "Short and sharp \u2014 best for esports and social handles.",
    punny: "A pun on the sport itself \u2014 best when the joke lands at once.",
    modern: "Clean and current \u2014 best for new teams that want a fresh feel.",
    mythical: "A creature name with a story \u2014 best when the mascot matters."
  };
  function teamFit(sport, style) {
    if (sport === "fantasy") return "A player-name pun \u2014 best for fantasy football and basketball leagues; keep it under 20 characters so the app does not clip it.";
    return TEAM_FIT[style] || TEAM_FIT.funny;
  }

  /* ---------------- split people into fair teams ---------------- */
  function splitTeams(text, nTeams) {
    var names = (text || "").split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    var teams = [];
    for (var i = 0; i < nTeams; i++) teams.push({ name: "Team " + (i + 1), members: [] });
    var shuffled = shuffle(names);
    shuffled.forEach(function (nm, i) { teams[i % nTeams].members.push(nm); });
    return teams;
  }

  /* ---------------- generic UI wiring ---------------- */
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function copyText(text, doneMsg) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { toast(doneMsg || "Copied."); }, function () { toast("Copy was blocked — select the text manually."); });
    } else { toast("Copy is not supported in this browser."); }
  }
  var FAV_KEY = "pixdetector-name-favs";
  function getFavs() {
    try { var v = JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); return Array.isArray(v) ? v : []; }
    catch (_) { return []; }
  }
  function saveFavs(list) { try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (_) {} }
  function isFav(value) { return getFavs().indexOf(value) !== -1; }
  function toggleFav(value) {
    var list = getFavs();
    var i = list.indexOf(value);
    if (i === -1) list.push(value); else list.splice(i, 1);
    saveFavs(list);
    renderFavBar();
  }
  function renderFavBar() {
    var list = document.getElementById("favBarList");
    if (!list) return;
    var favs = getFavs();
    list.innerHTML = "";
    if (!favs.length) {
      var p = document.createElement("p");
      p.className = "result-empty";
      p.textContent = "Nothing pinned yet \u2014 use the \u2606 Pin button on any result to keep it here.";
      list.appendChild(p);
      return;
    }
    favs.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "result-row";
      var span = document.createElement("span");
      span.className = "result-text";
      span.textContent = item;
      var acts = document.createElement("span");
      acts.className = "result-actions";
      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "fav-btn";
      rm.textContent = "\u2715 Remove";
      rm.addEventListener("click", function () { toggleFav(item); });
      acts.appendChild(rm);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-one";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () { copyText(item, "Copied: " + item); });
      acts.appendChild(btn);
      row.appendChild(span);
      row.appendChild(acts);
      list.appendChild(row);
    });
  }
  function initFavBar() {
    renderFavBar();
    var c = document.getElementById("copyFavsBtn");
    if (c) c.addEventListener("click", function () {
      var favs = getFavs();
      if (!favs.length) { toast("Pin some names first."); return; }
      copyText(favs.join("\n"), favs.length + " pinned names copied.");
    });
    var x = document.getElementById("clearFavsBtn");
    if (x) x.addEventListener("click", function () {
      saveFavs([]); renderFavBar(); toast("Shortlist cleared.");
    });
  }
  var CHECK_PLATFORMS = [
    { label: "Instagram", url: function (n) { return "https://www.instagram.com/" + n; } },
    { label: "X", url: function (n) { return "https://x.com/" + n; } },
    { label: "TikTok", url: function (n) { return "https://www.tiktok.com/@" + n; } },
    { label: "Reddit", url: function (n) { return "https://www.reddit.com/user/" + n; } }
  ];
  function emptyState(container, emptyMsg) {
    var p = document.createElement("p");
    p.className = "result-empty";
    p.textContent = emptyMsg || "Nothing generated yet.";
    container.appendChild(p);
  }
  function buildResultRow(item, noteText, withChecks) {
    var row = document.createElement("div");
    row.className = "result-row";
    var span = document.createElement("span");
    span.className = "result-text";
    span.textContent = item;
    row.appendChild(span);
    if (noteText) {
      var note = document.createElement("span");
      note.className = "result-note";
      note.textContent = noteText;
      row.appendChild(note);
    }
    if (withChecks) {
      var checks = document.createElement("div");
      checks.className = "check-links";
      var lab = document.createElement("span");
      lab.className = "check-label";
      lab.textContent = "Check:";
      checks.appendChild(lab);
      CHECK_PLATFORMS.forEach(function (pf) {
        var a = document.createElement("a");
        a.href = pf.url(encodeURIComponent(item));
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "Check on " + pf.label;
        checks.appendChild(a);
      });
      row.appendChild(checks);
    }
    var acts = document.createElement("span");
    acts.className = "result-actions";
    var pin = document.createElement("button");
    pin.type = "button";
    pin.className = "fav-btn";
    pin.setAttribute("aria-pressed", isFav(item) ? "true" : "false");
    pin.textContent = isFav(item) ? "\u2605 Pinned" : "\u2606 Pin";
    pin.addEventListener("click", function () {
      toggleFav(item);
      var pinned = isFav(item);
      pin.setAttribute("aria-pressed", pinned ? "true" : "false");
      pin.textContent = pinned ? "\u2605 Pinned" : "\u2606 Pin";
      toast(pinned ? "Pinned to your shortlist." : "Removed from your shortlist.");
    });
    acts.appendChild(pin);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-one";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () { copyText(item, "Copied: " + item); });
    acts.appendChild(btn);
    row.appendChild(acts);
    return row;
  }
  function renderResults(container, items, emptyMsg) {
    renderResultsWithNotes(container, items, null, emptyMsg);
  }
  function renderResultsWithNotes(container, items, notes, emptyMsg) {
    container.innerHTML = "";
    if (!items.length) { emptyState(container, emptyMsg); return; }
    items.forEach(function (item, idx) {
      container.appendChild(buildResultRow(item, notes ? notes[idx] : null, false));
    });
  }
  function renderUsernames(container, items, emptyMsg) {
    container.innerHTML = "";
    if (!items.length) { emptyState(container, emptyMsg); return; }
    items.forEach(function (item) {
      container.appendChild(buildResultRow(item, null, true));
    });
  }
  function wireCopyAll(btnId, getItems) {
    var b = document.getElementById(btnId);
    if (!b) return;
    b.addEventListener("click", function () {
      var items = getItems();
      if (!items.length) { toast("Generate some names first."); return; }
      copyText(items.join("\n"), items.length + " names copied.");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFavBar);
  else initFavBar();

  window.NameGen = {
    slogans: slogans, usernames: usernames,
    acronymFromPhrase: acronymFromPhrase, backronym: backronym, pronounceableScore: pronounceableScore,
    fantasyNames: fantasyNames, teamNames: teamNames,
    fantasyFit: fantasyFit, teamFit: teamFit, splitTeams: splitTeams,
    getFavs: getFavs, toggleFav: toggleFav, isFav: isFav, renderFavBar: renderFavBar,
    toast: toast, copyText: copyText, renderResults: renderResults,
    renderResultsWithNotes: renderResultsWithNotes, renderUsernames: renderUsernames, wireCopyAll: wireCopyAll
  };
})();
