// Toolbox data and rendering. Plain JavaScript, no framework.
// Each group is a card; each tool is a tile. A tile with a `repo` links to that GitHub repo.
// Positions are in banner pixels (1584 x 396, LinkedIn's banner size) and scale with the page.

const GH = "https://github.com/mat2m10/";

const GROUPS = [
  { id: "hw", title: "Hardware", x: 40, y: 28, tools: [
    { name: "Arduino", icon: "arduino", note: "10 years · prototyping at VLIZ, then scaled up" },
    { name: "Raspberry Pi", icon: "raspberrypi", note: "10 years · underwater data-acquisition module (VLIZ)" },
    { name: "BeagleBone Black", text: "BBB", color: "#d36b00", note: "10 years · embedded Linux for the VLIZ ROV module" },
    { name: "NVIDIA Jetson", icon: "nvidia", note: "Edge AI on robots and drones" },
  ]},
  { id: "rob", title: "Robotics", x: 360, y: 28, tools: [
    { name: "ROS 2", icon: "ros", note: "8 years · ROV control (Subairtech), real-time sensors (VLIZ)" },
    { name: "Ubuntu / Linux", icon: "ubuntu", note: "10 years · everything that runs on a robot" },
    { name: "C++", icon: "cplusplus", note: "Microcontrollers and ROS nodes" },
    { name: "ROVs & drones", text: "ROV", color: "#0b5e8c", note: "Underwater robots (Subairtech, VLIZ, Greenland) and autonomous drones (Malawi)" },
  ]},
  { id: "vis", title: "Perception & 3D", x: 680, y: 28, tools: [
    { name: "OpenCV", icon: "opencv", repo: "mini_orienter", note: "6 years · 6DoF pose tracking of miniatures, ~0.2° per frame" },
    { name: "ArUco markers", text: "ArUco", color: "#222", repo: "generate_aruco", note: "Print-ready marker sheets at exact physical size" },
    { name: "Photogrammetry", text: "3D", color: "#0d6b60", repo: "photogrammetry_template", note: "10 years · subsea mapping, turntable rig, Gaussian splatting" },
    { name: "Blender", icon: "blender", repo: "photogrammetry_table", note: "Simulation and synthetic training data" },
    { name: "Godot", icon: "godotengine", note: "Game prototypes" },
  ]},
  { id: "ml", title: "Machine learning", x: 1050, y: 28, tools: [
    { name: "PyTorch", icon: "pytorch", repo: "abyss", note: "Autoencoders for GWAS bias correction" },
    { name: "TensorFlow", icon: "tensorflow", note: "10 years · deep learning" },
    { name: "scikit-learn", icon: "scikitlearn", repo: "powercontrol", note: "Classic ML and statistics" },
    { name: "YOLO detection", text: "YOLO", color: "#7a3cff", repo: "pangolin_detector", note: "Pangolin detection from drone images (Malawi)" },
  ]},
  { id: "llm", title: "LLMs & agents", x: 1050, y: 212, tools: [
    { name: "Claude Code", icon: "claude", note: "Multi-agent development workflow with review bots" },
    { name: "LangChain", icon: "langchain", note: "RAG pipelines" },
    { name: "Ollama", icon: "ollama", note: "Local models" },
    { name: "Hugging Face", icon: "huggingface", note: "Models and datasets" },
  ]},
  { id: "lang", title: "Languages", x: 430, y: 212, tools: [
    { name: "Python", icon: "python", repo: "chasm", note: "Expert · 10+ years" },
    { name: "R", icon: "r", note: "Statistics and genetics" },
    { name: "Bash", icon: "gnubash", note: "Automation" },
    { name: "MATLAB / Simulink", text: "M", color: "#e16737", note: "Expert · 6 years" },
  ]},
  { id: "ops", title: "Infra & MLOps", x: 752, y: 212, tools: [
    { name: "Docker", icon: "docker", note: "Containerised pipelines, field deployments" },
    { name: "Kubernetes", icon: "kubernetes", note: "Helm deployments of RAG evaluation" },
    { name: "GitLab", icon: "gitlab", note: "Bots, CI, merge-request workflows" },
    { name: "MLflow", icon: "mlflow", note: "Experiment tracking" },
  ]},
  { id: "web", title: "Web & data", x: 752, y: 324, small: true, tools: [
    { name: "Ruby on Rails", icon: "rubyonrails", repo: "smart-tinmen-website", note: "Smart Tinmen website, NerdSquad" },
    { name: "JavaScript", icon: "javascript", repo: "OSL_NMM_helper", note: "Painting-light preview app" },
    { name: "HTML5", icon: "html5", repo: "mat2m10.github.io", note: "This page: plain HTML, CSS and JS" },
    { name: "PostgreSQL", icon: "postgresql", repo: "nerdsquad", note: "Expert · 6 years" },
  ]},
];

// Arrows between groups: [from, to, from-side, to-side]
const LINKS = [
  ["hw", "rob", "right", "left"],
  ["rob", "vis", "right", "left"],
  ["vis", "ml", "right", "left"],
  ["ml", "llm", "bottom", "top"],
  ["lang", "ops", "right", "left"],
  ["rob", "lang", "bottom", "top"],
];

const BANNER = new URLSearchParams(location.search).has("banner");

function tile(t) {
  const el = document.createElement(t.repo && !BANNER ? "a" : "div");
  el.className = "tile" + (t.repo ? " linked" : "");
  if (t.repo && !BANNER) {
    el.href = GH + t.repo;
    el.target = "_blank";
    el.rel = "noopener";
  }
  if (t.icon) {
    const img = document.createElement("img");
    img.src = `assets/icons/${t.icon}.svg`;
    img.alt = t.name;
    el.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.className = "txt";
    span.textContent = t.text;
    span.style.color = t.color;
    if (t.text.length > 3) span.classList.add("long");
    el.appendChild(span);
  }
  el.dataset.name = t.name;
  el.dataset.note = t.note + (t.repo ? `\n→ github.com/mat2m10/${t.repo}` : "");
  return el;
}

function render() {
  const stage = document.getElementById("stage");
  for (const g of GROUPS) {
    const card = document.createElement("section");
    card.className = "card" + (g.small ? " small" : "");
    card.id = g.id;
    card.style.left = g.x + "px";
    card.style.top = g.y + "px";
    const h = document.createElement("h2");
    h.textContent = g.title;
    card.appendChild(h);
    const row = document.createElement("div");
    row.className = "tiles";
    g.tools.forEach(t => row.appendChild(tile(t)));
    card.appendChild(row);
    stage.appendChild(card);
  }
  drawLinks();
  if (!BANNER) setupTooltip();
}

function anchor(el, side) {
  const x = el.offsetLeft, y = el.offsetTop, w = el.offsetWidth, h = el.offsetHeight;
  return { left: [x, y + h / 2], right: [x + w, y + h / 2],
           top: [x + w / 2, y], bottom: [x + w / 2, y + h] }[side];
}

function drawLinks() {
  const svg = document.getElementById("links");
  for (const [a, b, sa, sb] of LINKS) {
    const [x1, y1] = anchor(document.getElementById(a), sa);
    const [x2, y2] = anchor(document.getElementById(b), sb);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Orthogonal elbow, like a wiring diagram
    const d = (sa === "right" || sa === "left")
      ? `M${x1},${y1} H${(x1 + x2) / 2} V${y2} H${x2}`
      : `M${x1},${y1} V${(y1 + y2) / 2} H${x2} V${y2}`;
    path.setAttribute("d", d);
    path.setAttribute("marker-end", "url(#arrow)");
    svg.appendChild(path);
  }
}

function setupTooltip() {
  const tip = document.getElementById("tip");
  document.querySelectorAll(".tile").forEach(el => {
    el.addEventListener("mouseenter", () => {
      tip.innerHTML = `<b>${el.dataset.name}</b><br>${el.dataset.note.replace("\n", "<br>")}`;
      tip.classList.add("on");
    });
    el.addEventListener("mousemove", e => {
      tip.style.left = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8) + "px";
      tip.style.top = e.clientY + 18 + "px";
    });
    el.addEventListener("mouseleave", () => tip.classList.remove("on"));
  });
}

// Scale the fixed 1584 x 396 stage to the window width (the banner render uses scale 1).
function fit() {
  if (BANNER) return;
  const s = Math.min(1, (document.documentElement.clientWidth - 32) / 1584);
  const wrap = document.getElementById("wrap");
  wrap.style.transform = `scale(${s})`;
  wrap.parentElement.style.height = 396 * s + "px";
}

document.documentElement.classList.toggle("banner", BANNER);
render();
fit();
addEventListener("resize", fit);
