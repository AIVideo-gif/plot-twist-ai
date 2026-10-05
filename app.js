const $=id=>document.getElementById(id);
let current=null;

function makeDemo(command,length,style){
  const lower=command.toLowerCase();
  let premise = command.trim() || "a husband discovers a secret second phone";
  let title = lower.includes("phone") ? "My Wife Had a Second Phone…" : "The Secret Nobody Was Supposed to Find";
  let hook = "I thought I knew my wife. Then I found a phone she had hidden from me.";
  if(lower.includes("millionaire")) { title="The Millionaire's Waitress"; hook="The millionaire offered her a fortune—but she asked him one question instead."; }
  if(lower.includes("funeral")) { title="The Woman at the Funeral"; hook="At my father's funeral, a stranger walked up and called me by a name I'd never heard."; }

  const scenes=[
    ["01","The hook","Close cinematic shot establishing the protagonist and the mysterious object or discovery."],
    ["02","The setup","Show the normal relationship or situation before the secret becomes clear."],
    ["03","The suspicion","The protagonist notices a small detail that does not make sense."],
    ["04","The escalation","A second clue raises the stakes and changes what the protagonist believes."],
    ["05","The discovery","The protagonist finds the evidence and realizes the situation is bigger than expected."],
    ["06","The confrontation","Emotional confrontation; keep dialogue natural and visually tense."],
    ["07","The reveal","Reveal the first major secret, then immediately introduce a second unexplained detail."],
    ["08","The twist","End on a visual and narration twist that forces viewers to want Part 2."]
  ];
  const voice = `I thought I knew the truth. ${hook.replace(/^I thought I knew my wife\. /,"")} But every clue made less sense than the one before it. I followed the trail, expecting to find one simple secret. Instead, I discovered something that changed everything I believed about the person standing beside me. And just when I thought I finally understood what was happening, I found one last message. It wasn't meant for me. It said: "You need to know what happened before you met her."`;
  return {
    title,genre:style,hook,voiceover:voice,scenes,
    thumbnail:"Close-up shocked protagonist holding the mysterious object, second character blurred in background, cinematic red/blue lighting, strong facial emotion, vertical 9:16.",
    ytTitle:title+" — You Won't Believe the Twist",
    description:`An original fictional cinematic drama created for PLOT TWIST AI.\n\nPremise: ${premise}\n\nYou never see it coming.\n\n#PlotTwistAI #Drama #Story #Shorts`,
    length
  };
}

function render(s){
  current=s;
  $("production").classList.remove("hidden");
  $("title").textContent=s.title;
  $("stage").textContent="DRAFT";
  $("hook").textContent=s.hook;
  $("genre").textContent=s.genre;
  $("voiceover").textContent=s.voiceover;
  $("ytTitle").textContent=s.ytTitle;
  $("thumbnail").textContent=s.thumbnail;
  $("description").textContent=s.description;
  $("scenes").innerHTML=s.scenes.map(x=>`<div class="scene"><strong>SCENE ${x[0]} — ${x[1]}</strong><div class="muted">${x[2]}</div></div>`).join("");
  $("approved").classList.add("hidden");
  $("progressBar").style.width="100%";
  $("progressText").textContent="Story package generated. Visual/video/voice provider integrations are ready to be connected.";
  window.scrollTo({top:$("production").offsetTop-10,behavior:"smooth"});
}

$("create").onclick=()=>{
  const command=$("command").value;
  const s=makeDemo(command,$("length").value,$("style").value);
  render(s);
};
$("save").onclick=()=>{
  if(!current)return;
  localStorage.setItem("plotTwistDraft",JSON.stringify(current));
  $("stage").textContent="SAVED";
};
$("approve").onclick=()=>{
  if(!current)return;
  $("stage").textContent="APPROVED";
  $("approved").classList.remove("hidden");
};
const saved=localStorage.getItem("plotTwistDraft");
if(saved){try{render(JSON.parse(saved))}catch(e){}}
