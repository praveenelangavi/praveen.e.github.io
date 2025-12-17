/* script.js
   - tsparticles background
   - Three.js hero + project mini-scenes
   - GSAP page transitions (smooth fullpage scroll)
   - Projects and skills population (uses resume info embedded below)
   - Contact form validation + fake send
*/

// ---------- Resume data (extracted from your uploaded resume) ----------
(function () {
  emailjs.init("rY2f5LLVBskfFR6Da"); // PUBLIC KEY
})();


const resume = {
  name: 'Praveen E',
  title: 'Aspiring Cloud Application Developer',
  intro:
    "Motivated and enthusiastic beginner aspiring to build a career as a Cloud Application Developer. Familiar with basics of cloud computing, Docker and containerization. Proficient in Java & Python.",
  email: 'praveenelangavii@gmail.com',
  phone: '9363738665',
  linkedIn: 'https://www.linkedin.com/in/praveen-e-b06769327',
  skills: [
    { name: 'Java', level: 78 },
    { name: 'Python', level: 74 },
    { name: 'C', level: 60 },
    { name: 'Linux', level: 70 },
    { name: 'AWS', level: 65 },
    { name: 'Networking', level: 60 }
  ]
};

// ---------- DOM helpers ----------
document.getElementById('year').textContent = new Date().getFullYear();

// nav buttons -> smooth scroll
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = btn.dataset.target;
    const section = document.getElementById(target);
    if (section) {
      // GSAP smooth scroll
      gsap.to(window, {duration: 0.9, scrollTo: {y: section, offsetY: 80}, ease: "power3.out"});
      document.querySelectorAll('.nav-btn').forEach(n=>n.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

// anchor scroll links
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const href = a.getAttribute('href').replace('#','');
    const el = document.getElementById(href);
    if(el) gsap.to(window, {duration:0.8, scrollTo:{y:el, offsetY:80}, ease:"power2.out"});
  });
});

// ---------- tsparticles background ----------
window.addEventListener('load', async () => {
  if (window.tsParticles) {
    tsParticles.load('tsparticles', {
      fpsLimit: 60,
      interactivity: {
        events: { onHover: { enable: true, mode: 'repulse' }, onClick: { enable: true, mode: 'push' } }
      },
      particles: {
       number: { value: 26 },

        color: { value: ['#d4af37', '#9ae6b4', '#7dd3fc'] },
        shape: { type: 'circle' },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 4 } },
        links: { enable: true, color: '#2b2b2b', distance: 140, opacity: 0.08 },
        move: { enable: true, speed: 0.6 }

      },
      detectRetina: true
    });
  }
});

// ---------- Hero Three.js small scene ----------
function createHeroScene(containerId){
  const container = document.getElementById(containerId);
  if(!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 100);
  camera.position.set(0,0,4);

  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(5,10,7);
  scene.add(dir);

  // rotating "cloud" box
  const geo = new THREE.BoxGeometry(1.4,1.4,1.4);
  const mat = new THREE.MeshStandardMaterial({color:0x7dd3fc, metalness:0.6, roughness:0.2});
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // subtle floating
  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    mesh.rotation.x = 0.35 * Math.sin(t*0.6) + t*0.1;
    mesh.rotation.y = t*0.15;
    mesh.position.y = Math.sin(t*0.7)*0.12;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // resize
  window.addEventListener('resize', ()=> {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}

// ---------- Projects grid with small three canvases ----------
const projectsGrid = document.getElementById('projects-grid');

const projects = [
  {
    id: 1,
    title: "Cloud-Based Student Management System",
    desc: "Java • MySQL • AWS EC2 • RDS"
  },
  {
    id: 2,
    title: "Dockerized Java Web Application",
    desc: "Java • Spring Boot • Docker"
  },
  {
    id: 3,
    title: "Serverless Contact Form API",
    desc: "Python • AWS Lambda • API Gateway"
  },
  {
    id: 4,
    title: "Cloud Resource Monitoring Tool",
    desc: "Python • AWS • CloudWatch"
  },
  {
    id: 5,
    title: "Interactive Portfolio Website",
    desc: "HTML • CSS • JavaScript • Three.js"
  },
  {
    id: 6,
    title: "Linux Automation Scripts",
    desc: "Linux • Bash • Shell Scripting"
  }
];

projects.forEach(proj => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <div class="project-preview" id="proj-${proj.id}-preview"></div>
    <strong>${proj.title}</strong>
    <div style="color:var(--muted);font-size:13px">${proj.desc}</div>
  `;
  projectsGrid.appendChild(card);

  // create small three.js scene per preview
  (function initMiniScene(containerId, color){
    const container = document.getElementById(containerId);
    if(!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth/container.clientHeight, 0.1, 100);
    camera.position.set(0,0,3.2);
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(6, 8, 6);
    const glowLight = new THREE.PointLight(0x38bdf8, 0.8, 10);
    glowLight.position.set(0, 0, 3);
    scene.add(glowLight);



    const geom = new THREE.TorusGeometry(0.6, 0.16, 32, 100);

    const mat = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,        // AWS cloud blue
  metalness: 0.25,
  roughness: 0.4,
  emissive: 0x0284c7,     // subtle glow
  emissiveIntensity: 0.35
});

    const obj = new THREE.Mesh(geom, mat);
    scene.add(obj);

    function anim(){
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.013;
      renderer.render(scene,camera);
      requestAnimationFrame(anim);
    }
    anim();

    window.addEventListener('resize', ()=>{
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w/h; camera.updateProjectionMatrix();
      renderer.setSize(w,h);
    });
  })(`proj-${proj.id}-preview`, 0x9ae6b4 + (proj.id*1000));

});

// ---------- Populate skills and animate bars ----------
const skillsList = document.getElementById('skills-list');
resume.skills.forEach((s,i)=>{
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.innerHTML = `
    <div class="skill-avatar">${s.name[0]}</div>
    <div style="flex:1">
      <div style="display:flex;justify-content:space-between"><strong>${s.name}</strong><span style="color:var(--muted)">${s.level}%</span></div>
      <div class="skill-bar"><div class="skill-bar-fill" style="width:0%"></div></div>
    </div>
  `;
  skillsList.appendChild(row);
  // reveal with GSAP when scrolled into view
  gsap.to(row.querySelector('.skill-bar-fill'), {
    width: `${s.level}%`,
    duration: 1.2,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: row,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

// ---------- Page transitions: cinematic smooth on wheel/keyboard ----------
let isAnimating = false;
const sections = Array.from(document.querySelectorAll('.section'));
let currentIndex = 0;

function scrollToIndex(index){
  if(isAnimating || index<0 || index>=sections.length) return;
  isAnimating = true;
  const target = sections[index];
  gsap.to(window, {
  duration: 1.25,
  scrollTo: { y: target, offsetY: 80 },
  ease: "expo.out"
});

}
function updateNavActive(){
  const id = sections[currentIndex].id;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.target === id));
}
let wheelTimeout;

window.addEventListener('wheel', (e) => {
  if (isAnimating) return;

  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 60) {
      scrollToIndex(Math.min(currentIndex + 1, sections.length - 1));
    } else if (e.deltaY < -60) {
      scrollToIndex(Math.max(currentIndex - 1, 0));
    }
  }, 120); // delay smooths scrolling
}, { passive: true });

window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowDown') scrollToIndex(Math.min(currentIndex + 1, sections.length-1));
  if(e.key === 'ArrowUp') scrollToIndex(Math.max(currentIndex - 1, 0));
});

// set initial scroll sync
setTimeout(()=>{ // let initial paint happen
  // Find nearest section to scroll to
  const scrollY = window.scrollY;
  let idx = sections.findIndex((s,i)=> {
    const top = s.getBoundingClientRect().top + window.scrollY;
    return scrollY <= top + s.offsetHeight/2;
  });
  if(idx === -1) idx = 0;
  currentIndex = idx;
  updateNavActive();
}, 300);

// ---------- Small entrance animations for sections ----------
gsap.utils.toArray('.section').forEach((sec, i) => {
  gsap.from(sec, {
    opacity: 0, y: 30, duration: 0.9, ease: 'power2.out', delay: 0.08 * i,
    scrollTrigger: { trigger: sec, start: 'top 80%', toggleActions: 'play none none reverse' }
  });
});

// ---------- Contact form validation + fake send ----------
const form = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  statusEl.textContent = "";

  emailjs
    .send("praveen_id", "template_vwr0fwq", {
      from_name: form.name.value,
      from_email: form.email.value,
      message: form.message.value,
    })
    .then(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";
      statusEl.style.color = "lightgreen";
      statusEl.textContent = "Message sent successfully!";
      form.reset();
    })
    .catch((error) => {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";
      statusEl.style.color = "#ff6b6b";
      statusEl.textContent = "Failed to send message!";
      console.error(error);
    });
});


// ---------- small hover effects for project cards ----------
let lastMove = 0;

document.addEventListener('mousemove', e => {
  const now = performance.now();
  if (now - lastMove < 40) return; // throttle
  lastMove = now;

  document.querySelectorAll('.project-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rx = (dy / rect.height) * 4;
    const ry = -(dx / rect.width) * 4;
    card.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
});

// reset transform on mouse leave
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mouseleave', ()=> card.style.transform = 'none');
});
/* ===============================
   PROJECT MODAL FUNCTIONALITY
================================ */

// Project data (long descriptions)
const projectData = [
  {
    title: "Cloud-Based Student Management System",
    description:
      "A cloud-based student management system built using Java and AWS. It allows administrators and faculty to manage student records, attendance, courses, and academic performance with secure role-based access.",
    tech: [
      "Java",
      "MySQL",
      "AWS EC2",
      "AWS RDS"
    ],
    features: [
      "Role-based authentication system",
      "Cloud-hosted backend for scalability",
      "Centralized student database",
      "Secure and reliable data storage"
    ]
  },
  {
    title: "Dockerized Java Web Application",
    description:
      "A Java Spring Boot web application containerized using Docker to ensure consistent deployment across environments. Demonstrates modern DevOps and containerization practices.",
    tech: [
      "Java",
      "Spring Boot",
      "Docker"
    ],
    features: [
      "Docker container for easy deployment",
      "Microservice-ready architecture",
      "Environment consistency",
      "CI/CD pipeline compatibility"
    ]
  },
  {
    title: "Serverless Contact Form API",
    description:
      "A serverless backend API developed using AWS Lambda and API Gateway to process contact form submissions efficiently without managing servers.",
    tech: [
      "Python",
      "AWS Lambda",
      "API Gateway"
    ],
    features: [
      "Fully serverless architecture",
      "Auto-scaling and cost-effective",
      "Secure REST API endpoints",
      "Fast request processing"
    ]
  }
  ,
{
  title: "Cloud Resource Monitoring Tool",
  description:
    "A cloud monitoring tool built using Python and AWS services to track system performance, resource utilization, and operational health of cloud infrastructure in real time.",
  tech: [
    "Python",
    "AWS",
    "CloudWatch"
  ],
  features: [
    "Real-time cloud resource monitoring",
    "CPU, memory, and network usage tracking",
    "AWS CloudWatch integration",
    "Alert-ready architecture"
  ]
},
{
  title: "Interactive Portfolio Website",
  description:
    "A modern interactive portfolio website showcasing projects, skills, and experience with smooth animations, 3D visuals, and responsive design.",
  tech: [
    "HTML",
    "CSS",
    "JavaScript",
    "Three.js"
  ],
  features: [
    "Responsive modern UI",
    "3D visuals using Three.js",
    "Smooth animations with GSAP",
    "Optimized performance and accessibility"
  ]
},
{
  title: "Linux Automation Scripts",
  description:
    "A collection of Linux shell scripts designed to automate routine system administration tasks, improve productivity, and enhance system reliability.",
  tech: [
    "Linux",
    "Bash",
    "Shell Scripting"
  ],
  features: [
    "Automated backup scripts",
    "System monitoring utilities",
    "Log management automation",
    "Time-saving administrative tasks"
  ]
}

];

// Modal elements
const modal = document.getElementById("project-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalTech = document.getElementById("modal-tech");
const modalFeatures = document.getElementById("modal-features");

// Attach click events to project cards
document.querySelectorAll(".project-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    const project = projectData[index];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalDesc.textContent = project.description;

    modalTech.innerHTML = "";
    project.tech.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      modalTech.appendChild(li);
    });

    modalFeatures.innerHTML = "";
    project.features.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      modalFeatures.appendChild(li);
    });

    modal.style.display = "flex";
  });
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
