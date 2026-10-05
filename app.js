const $ = id => document.getElementById(id);

let current = null;

const API_URL =
  "https://plot-twist-ai-api.david-hilbun-83.workers.dev/api/generate";

function render(s) {
  current = s;

  $("production").classList.remove("hidden");
  $("title").textContent = s.title || "Untitled Story";
  $("stage").textContent = "DRAFT";
  $("hook").textContent = s.hook || "";
  $("genre").textContent = s.genre || $("style").value;
  $("voiceover").textContent = s.voiceover || "";
  $("ytTitle").textContent = s.ytTitle || s.title || "";
  $("thumbnail").textContent = s.thumbnail || "";
  $("description").textContent = s.description || "";

  const scenes = Array.isArray(s.scenes) ? s.scenes : [];

  $("scenes").innerHTML = scenes
    .map(x => {
      if (Array.isArray(x)) {
        return `<div class="scene">
          <strong>SCENE ${x[0]} — ${x[1]}</strong>
          <div class="muted">${x[2]}</div>
        </div>`;
      }

      return `<div class="scene">
        <strong>${x.title || "SCENE"}</strong>
        <div class="muted">${x.description || ""}</div>
      </div>`;
    })
    .join("");

  $("approved").classList.add("hidden");
  $("progressBar").style.width = "100%";
  $("progressText").textContent = "AI story package generated.";

  window.scrollTo({
    top: $("production").offsetTop - 10,
    behavior: "smooth"
  });
}

$("create").onclick = async () => {
  const command = $("command").value.trim();
  const length = $("length").value;
  const style = $("style").value;

  if (!command) {
    alert("Enter a story idea first.");
    return;
  }

  $("create").disabled = true;
  $("create").textContent = "GENERATING...";

  try {
    const prompt = `
Create an original fictional viral drama story package.

Story idea:
${command}

Style:
${style}

Target length:
${length}

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "Story title",
  "genre": "Genre/style",
  "hook": "Powerful opening hook",
  "voiceover": "Complete dramatic voiceover script",
  "scenes": [
    ["01", "Scene title", "Visual description"],
    ["02", "Scene title", "Visual description"],
    ["03", "Scene title", "Visual description"],
    ["04", "Scene title", "Visual description"],
    ["05", "Scene title", "Visual description"],
    ["06", "Scene title", "Visual description"],
    ["07", "Scene title", "Visual description"],
    ["08", "Scene title", "Visual description"]
  ],
  "thumbnail": "Detailed thumbnail image prompt",
  "ytTitle": "Clickable YouTube title",
  "description": "YouTube/social media description"
}

Make the opening immediately attention-grabbing.
Build suspense throughout the story.
Include emotional conflict and escalating revelations.
End with a major unexpected plot twist.
Keep the story fictional.
`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    let text =
      data.response ||
      data.result?.response ||
      data.result ||
      data.output ||
      data;

    if (typeof text !== "string") {
      text = JSON.stringify(text);
    }

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const story = JSON.parse(text);

    render(story);

  } catch (error) {
    console.error(error);

    alert(
      "The AI could not generate the story. Error: " +
      error.message
    );
  } finally {
    $("create").disabled = false;
    $("create").textContent = "CREATE";
  }
};

$("save").onclick = () => {
  if (!current) return;

  localStorage.setItem(
    "plotTwistDraft",
    JSON.stringify(current)
  );

  $("stage").textContent = "SAVED";
};

$("approve").onclick = () => {
  if (!current) return;

  $("stage").textContent = "APPROVED";
  $("approved").classList.remove("hidden");
};

const saved = localStorage.getItem("plotTwistDraft");

if (saved) {
  try {
    render(JSON.parse(saved));
  } catch (e) {
    console.error(e);
  }
}
