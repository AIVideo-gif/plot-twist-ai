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

  // CHARACTER ENGINE
  const characters = Array.isArray(s.characters)
    ? s.characters
    : [];

  const characterSection =
    document.getElementById("characters");

  if (characterSection) {
    characterSection.innerHTML = characters
      .map(character => `
        <div class="scene">
          <strong>${character.name || "CHARACTER"}</strong>
          <div class="muted">
            <b>Role:</b> ${character.role || ""}
            <br><br>
            <b>Age:</b> ${character.age || ""}
            <br><br>
            <b>Appearance:</b> ${character.appearance || ""}
            <br><br>
            <b>Clothing:</b> ${character.clothing || ""}
            <br><br>
            <b>Personality:</b> ${character.personality || ""}
            <br><br>
            <b>Voice:</b> ${character.voice || ""}
            <br><br>
            <b>Visual Prompt:</b> ${character.visualPrompt || ""}
          </div>
        </div>
      `)
      .join("");
  }

  $("approved").classList.add("hidden");
  $("progressBar").style.width = "100%";
  $("progressText").textContent =
    "AI story and character package generated.";

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

  "characters": [
    {
      "name": "Character name",
      "role": "Role in the story",
      "age": "Approximate age",
      "appearance": "Detailed permanent physical appearance",
      "clothing": "Signature clothing and style",
      "personality": "Personality and emotional traits",
      "voice": "Voice characteristics",
      "visualPrompt": "Detailed reusable visual prompt for keeping this character visually consistent across every scene"
    }
  ],

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

CHARACTER RULES:

Create a character profile for every important recurring character.

Give each character a specific and consistent physical appearance.

Include details such as:
age,
hair,
facial features,
body type,
clothing,
and distinctive features.

The visualPrompt must be detailed enough to reuse later for AI image and video generation.

Do not change a character's physical appearance between scenes unless the story specifically requires it.

SCENE RULES:

When a character appears in a scene, use the character's name in the visual description.

Make each scene visually cinematic and suitable for future AI image or video generation.

STORY RULES:

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
