// ===== Helpers =====
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const SHUFFLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randChar(){
  return SHUFFLE_CHARS[Math.floor(Math.random() * SHUFFLE_CHARS.length)];
}

// Builds "0","0","0"... spans inside container, returns the span list
function buildCodeSpans(container, length, placeholderChar){
  container.innerHTML = "";
  const spans = [];
  for(let i=0; i<length; i++){
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = placeholderChar;
    container.appendChild(span);
    spans.push(span);
  }
  return spans;
}

// Reveals finalString one character at a time, shuffling briefly before landing
async function revealCode(containerEl, placeholderChar, finalString, delayBefore = 500){
  const spans = buildCodeSpans(containerEl, finalString.length, placeholderChar);
  await sleep(delayBefore);

  for(let i=0; i<finalString.length; i++){
    const span = spans[i];
    const shuffleCycles = 8;
    for(let c=0; c<shuffleCycles; c++){
      span.textContent = randChar();
      await sleep(35);
    }
    span.textContent = finalString[i];
    span.classList.add("settled");
    await sleep(120);
  }
}

// Types text into el one character at a time. Preserves line breaks.
function typeText(el, text, speed = 18){
  return new Promise(resolve => {
    el.textContent = "";
    let i = 0;
    function step(){
      if(i < text.length){
        el.textContent += text[i];
        i++;
        setTimeout(step, speed);
      } else {
        colorizeBrackets(el);
        resolve();
      }
    }
    step();
  });
}

// After typing completes, wrap bracketed HUD lines like [TRANSMISSION...] in accent color
function colorizeBrackets(el){
  const lines = el.textContent.split("\n");
  el.innerHTML = lines.map(line => {
    const trimmed = line.trim();
    if(trimmed.startsWith("[") && trimmed.endsWith("]")){
      return `<span class="bracket">${line}</span>`;
    }
    return line;
  }).join("\n");
}

// ===== Screen navigation =====
function goToScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
  window.scrollTo(0,0);
  initScreen(id);
}

const screenInitialized = {};

function initScreen(id){
  if(screenInitialized[id]) return;
  screenInitialized[id] = true;

  if(id === "screen-1") initScreen1();
  if(id === "screen-2") initScreen2();
  if(id === "screen-6") initScreen6();
  // screens 3,4,5 (riddles) are wired up globally, no per-screen init needed
}

// ===== Screen 1: Password =====
async function initScreen1(){
  const codeEl = document.getElementById("code-1");
  await revealCode(codeEl, "0", "LMXXX", 500);
  const wrap = document.getElementById("password-wrap");
  wrap.classList.add("show");
  const boxes = Array.from(document.querySelectorAll(".pw-box"));
  boxes[0].focus();
  wirePasswordBoxes(boxes);
}

function wirePasswordBoxes(boxes){
  const CORRECT = "2823";
  const hint = document.getElementById("pw-hint");

  boxes.forEach((box, idx) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^0-9]/g, "").slice(0,1);
      if(box.value && idx < boxes.length - 1){
        boxes[idx+1].focus();
      }
      if(boxes.every(b => b.value.length === 1)){
        checkPassword();
      }
    });

    box.addEventListener("keydown", (e) => {
      if(e.key === "Backspace" && !box.value && idx > 0){
        boxes[idx-1].focus();
      }
    });
  });

  function checkPassword(){
    const entered = boxes.map(b => b.value).join("");
    if(entered === CORRECT){
      hint.classList.remove("show");
      goToScreen("screen-2");
    } else {
      hint.classList.add("show");
      boxes.forEach(b => { b.classList.add("shake"); });
      setTimeout(() => {
        boxes.forEach(b => { b.value = ""; b.classList.remove("shake"); });
        boxes[0].focus();
      }, 400);
    }
  }
}

// ===== Screen 2: Transmission 1 =====
const TRANSMISSION_1 = `[TRANSMISSION RECIEVED//2056]
[SENDER: Col.Kalyani, Resistance Commander]

The ancient Seven Kingdoms spoke of a cosmic alignment LM29, marking the birth of The Chosen One. But they looked in the wrong direction. The world you are destined to lead does not lie in the past. It is here, in the future.

The prophecy is true. To ensure its survival, the Seven Galaxies of the Resistance have united under your leadership to launch Project LMXXX. Using our combined technology, we have breached the time-space continuum to send it back in time to reach you on the day marking the dawn of your thirtieth winter.

However, to stop Project LMXXX from falling into the wrong hands, we have kept it encrypted, and only you can decode it.

Listen very carefully! Ahead are three riddles that only you can solve. Each one will give you a number that will unlock the next riddle. 

When all three riddles are solved, you will have three numbers. Keep it safe. When the day comes, the three numbers will help you activate Project LMXXX.`;

async function initScreen2(){
  const textEl = document.getElementById("transmission-1");
  const btn = document.getElementById("btn-to-riddle-1");
  await typeText(textEl, TRANSMISSION_1, 14);
  btn.classList.remove("hidden");
}

document.getElementById("btn-to-riddle-1").addEventListener("click", () => {
  goToScreen("screen-3");
});

// ===== Screens 3-5: Riddles =====
document.querySelectorAll(".answer-form").forEach(form => {
  const correctAnswer = form.dataset.answer;
  const targetScreen = form.dataset.target;
  const input = form.querySelector(".answer-box");
  const error = form.querySelector(".error-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if(value === correctAnswer){
      error.classList.remove("show");
      goToScreen(targetScreen);
    } else {
      error.classList.add("show");
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 400);
      input.select();
    }
  });
});

// ===== Screen 6: Final =====
const TRANSMISSION_2 = `[TRANSMISSION INCOMING // YEAR: 2056]
[SENDER: Col.Kalyani, Resistance Commander]

The prophecy is true. Very soon Project LMXXX will appear before you. Keep this code safe, as it is only way to activate the Project LMXXX.

The Future is with you.`;

async function initScreen6(){
  const codeEl = document.getElementById("code-2");
  await revealCode(codeEl, "0", "453", 500);
  const frame = document.getElementById("final-frame");
  frame.classList.remove("hidden");
  const textEl = document.getElementById("transmission-2");
  await typeText(textEl, TRANSMISSION_2, 14);
}

// ===== Boot =====
initScreen("screen-1");
