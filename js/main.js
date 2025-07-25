const app = document.querySelector("#app");
const delay = ms => new Promise(res => setTimeout(res, ms));
const closeButton = document.getElementById('close-button');
const minimizeButton = document.getElementById('minimize-button');
const maximizeButton = document.getElementById('maximize-button');

const titleBar = document.querySelector('.menu');
const container = document.querySelector('.container');

let isDragging = false;
let offsetX, offsetY;

titleBar.addEventListener('mousedown', (event) => {
  isDragging = true;
  offsetX = event.clientX - container.getBoundingClientRect().left;
  offsetY = event.clientY - container.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    container.style.left = (event.clientX - offsetX) + 'px';
    container.style.top = (event.clientY - offsetY) + 'px';
    container.style.position = 'absolute';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Close the browser tab
closeButton.addEventListener('click', () => {
  window.close();
});

// Minimize the terminal window
minimizeButton.addEventListener('click', () => {
  const app = document.getElementById('app');
  const container = document.querySelector('.container');
  const titleText = document.querySelector('.title-text');

  if (container.classList.contains('minimized')) {
    container.classList.remove('minimized');
    app.style.display = 'flex';
    titleText.style.display = 'block';
  } else {
    container.classList.add('minimized');
    app.style.display = 'none';
    titleText.style.display = 'none';
  }
});

// Maximize/fullscreen the terminal window
maximizeButton.addEventListener('click', () => {
  const container = document.querySelector('.container');
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) { // Firefox
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) { // Chrome, Safari and Opera
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) { // IE/Edge
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
});
    
    
app.addEventListener("keypress", async function(event){
  if(event.key === "Enter"){
    await delay(150);
   getInputValue();
   
    removeInput();
    await delay(150);
    new_line();
  }
});

app.addEventListener("click", function(event){
  const input = document.getElementById("commandInput");
  input.focus();
})


async function open_terminal(){
  createText("Starting server...");
  await delay(1000);
  createText("Connected to server! Continuing...");
  await delay(400);
  createText("You can run several commands:");
  createCode("help", "See all commands.");
  await delay(250);
  new_line();
}


function new_line(){
  const p = document.createElement("p");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");
  p.setAttribute("class", "path")
  p.textContent = "# user";
  span1.textContent = " in";
  span2.textContent = " ~/lukiiimohhU";
  p.appendChild(span1);
  p.appendChild(span2);
  app.appendChild(p);
  const div = document.createElement("div");
  div.setAttribute("class", "type")
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone")
  const input = document.createElement("input");
  input.id = "commandInput";
  div.appendChild(i);
  div.appendChild(input);
  app.appendChild(div);
  input.focus();
}

function removeInput(){
  const div = document.querySelector(".type");
  app.removeChild(div);
}

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
  setTimeout(function() {
    document.body.removeChild(img);
  }, 20000);
}

let animationFrame = null;
let animationActive = false;
let xPos = null;
let yPos = null;
let xSpeed = 2;
let ySpeed = 2;

function startDvdAnimation() {
  const container = document.querySelector(".container");

  if (!isDesktop()) {
    createText("DVD mode is only available on desktop environments.");
    return;
  }

  // Set the initial position to the center of the screen if it hasn't been set yet
  if (xPos === null || yPos === null) {
    xPos = (window.innerWidth - container.offsetWidth) / 2;
    yPos = (window.innerHeight - container.offsetHeight) / 2;
    container.style.position = "absolute";
    container.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }

  // Toggle the animation state and create a message
  animationActive = !animationActive;
  if (animationActive) {
    createText("DVD mode activated! Run the command again to stop it.");

    // Start the animation loop
    function update() {
      const containerRect = container.getBoundingClientRect();

      // Check for container's boundaries
      if (containerRect.right >= window.innerWidth || containerRect.left <= 0) {
        xSpeed = -xSpeed;
      }
      if (containerRect.bottom >= window.innerHeight || containerRect.top <= 0) {
        ySpeed = -ySpeed;
      }

      xPos += xSpeed;
      yPos += ySpeed;

      container.style.transform = `translate(${xPos}px, ${yPos}px)`;
      animationFrame = requestAnimationFrame(update);
    }
    update();
  } else {
    createText("DVD mode deactivated!");

    // Stop the animation and move the container back to the center of the viewport
    cancelAnimationFrame(animationFrame);
    xSpeed = Math.abs(xSpeed); // Reset xSpeed to its original value
    ySpeed = Math.abs(ySpeed); // Reset ySpeed to its original value
    moveToCenter(function() {
      // Reset xPos and yPos after the container has moved back to the center of the viewport
      xPos = (window.innerWidth - container.offsetWidth) / 2;
      yPos = (window.innerHeight - container.offsetHeight) / 2;
    });

    // reload the website
    setTimeout(function() {
      location.reload();
    }, 2000);
  }
}

function isDesktop() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
}

// Move the container back to the center of the viewport when the animation is stopped
function moveToCenter(callback) {
  const container = document.querySelector(".container");
  const containerRect = container.getBoundingClientRect();
  const currentXPos = containerRect.left + window.pageXOffset;
  const currentYPos = containerRect.top + window.pageYOffset;
  const targetXPos = (window.innerWidth - container.offsetWidth) / 2;
  const targetYPos = (window.innerHeight - container.offsetHeight) / 2;
  const computedTransform = window.getComputedStyle(container).getPropertyValue('transform');
  const transformMatrix = new DOMMatrix(computedTransform);
  const currentTranslateX = transformMatrix.m41;
  const currentTranslateY = transformMatrix.m42;
  const xDiff = targetXPos - currentXPos + currentTranslateX;
  const yDiff = targetYPos - currentYPos + currentTranslateY;

  container.style.transition = "transform 2s ease-in-out";
  container.style.transform = `translate(${xDiff}px, ${yDiff}px)`;

  // Reset the xPos and yPos variables to the center of the viewport after the transition is complete
  container.addEventListener("transitionend", function() {
    container.style.transition = "none";
    container.style.transform = "translate(0, 0)";
    xPos = targetXPos;
    yPos = targetYPos;
    if (typeof callback === "function") {
      callback();
    }
  }, { once: true });
}

async function getInputValue(){
  
  const value = document.getElementById("commandInput").value;
  if(value === "help" || value === "Help"){
    trueValue(value);
    createCode("repo", "Add my lukIOs repository to your package manager.");
    createCode("whoami", "Who I am and what I do.");
    createCode("social -a", "All my social networks.");
    createCode("projects", "See my projects.");
    createCode("cd lurlkksss", "Navigate to url.lukksss.es.");
    createCode("clear", "Clean the terminal.");
  }
  else if(value === "dvd" || value === "Dvd"){
    trueValue(value);
    await startDvdAnimation();
  }
  else if(value === "projects" || value === "Projects"){
    trueValue(value);
    //createText("nombreProyecto (<span class='red'>DISCONTINUED</span>) - Descripción proyecto. <span class='blue'> moreInfo </span>");
    createText("lobos-del-chorraero (<span class='green'>MAINTAINED</span>) - WebGame designed and based in the original game \"Los lobos de Castronegro\", perfect to play with friends (4-16). ");
    createText("daypo-extractor (<span class='green'>MAINTAINED</span>) - Python script to extract daypo questions with their respective answer from daypos URLs and directly to local archives. ");
    createText("lukIOs (<span class='blue'>DEVELOPING</span>) - Public repository to manage your sideloaded applications on iOS.");
    createText("lukIOs (<span class='green'>MAINTAINED</span>) - My personal URL shortener.");
  }
  else if(value.toLowerCase() === "repo"){
    trueValue(value);
    createText("<a href='https://raw.githubusercontent.com/lukiiimohhU/lukIOs/refs/heads/main/repo'>CTRL + Click me to add to KravaSign || Feather</a>")
  }
  else if(value.toLowerCase() === "whoami"){
    trueValue(value);
    createText("Hello, I am luk! ;)")
    createText("Student from the University of Jaén, awaiting for an Erasmus in <span class='red'>Bern (Switzerland)</span>, focused on learning <span class='blue'>C++</span>.")
  }
  else if(value.toLowerCase() === "social -a"){
    trueValue(value);
    // Discord
    createText("<a href='https://discord.com/users/279274634346758144' target='_blank'><i class='fab fa-discord white'></i> Discord</a>")
  }
  else if(value.toLowerCase() === "social"){
    trueValue(value);
    createText("Did you mean: <span class='blue'>social -a</span>?")
  }
  else if (value.toLowerCase() === "cd lurlkksss") {
        trueValue(value);
        createText("Navigating to url.lukksss.es...");
        setTimeout(() => {
          window.location.href = "https://url.lukksss.es/ui";
        }, 1000);
  }
  else if(value.toLowerCase() === "clear"){
    document.querySelectorAll("p").forEach(e => e.parentNode.removeChild(e));
    document.querySelectorAll("section").forEach(e => e.parentNode.removeChild(e));
  }
  else{
    falseValue(value);
    createText(`command not found: ${value}`)
  }
}

function trueValue(value){
  
  const div = document.createElement("section");
  div.setAttribute("class", "type2")
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone")
  const mensagem = document.createElement("h2");
  mensagem.setAttribute("class", "sucess")
  mensagem.textContent = `${value}`;
  div.appendChild(i);
  div.appendChild(mensagem);
  app.appendChild(div);
}

function falseValue(value){
  
  const div = document.createElement("section");
  div.setAttribute("class", "type2")
  const i = document.createElement("i");
  i.setAttribute("class", "fas fa-angle-right icone error")
  const mensagem = document.createElement("h2");
  mensagem.setAttribute("class", "error")
  mensagem.textContent = `${value}`;
  div.appendChild(i);
  div.appendChild(mensagem);
  app.appendChild(div);
}

function createText(text, classname){
  const p = document.createElement("p");
  
  p.innerHTML = text;
  app.appendChild(p);
}

function createCode(code, text){
  const p = document.createElement("p");
  p.setAttribute("class", "code");
  p.innerHTML =
 `${code} <br/><span class='text'> ${text} </span>`;
  app.appendChild(p);
}

open_terminal();
