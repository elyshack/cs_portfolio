import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "jsm/renderers/CSS2DRenderer.js";

// BLURBS
const blurbs = {
    "frontEnd": {
        "blurb": "I'm passionate about dreaming up unique and engaging front end experiences (I also love Rubik's Cubes)."
    },
    "aboutMe": {
        "blurb": "About me: I'm a math enthusiast, musician, and life-long learner. Nothing fires me up like working with and learning from teammates."
    },
    "softwareEngineering": {
        "blurb": "With a Bachelor's in CS and experience working as an AI development contractor for Meta and Amazon, I know the scalability and modularity that is required by today's big projects."
    },
    "dataScience": {
        "blurb": "I'm currently working towards a Master's in Data Analysis at WGU. In my contracted work for Meta and Amazon, I handled data processing for training LLMs on a variety of topics, including programming, data science, math, and physics."
    },
    "research": {
        "blurb": "My IoT research was published by the IEEE at the ICICT 2020."
    },
    "techStack": {
        "blurb": "These are some of the technologies I'm experienced in."
    }
}

// Get window dimensions
const w = window.innerWidth;
const h = window.innerHeight;

// Create renderer, utilizing window dimensions
// Attach renderer to domElement
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Instantiate camera variables and scene
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

// HTML Rendering
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(w, h);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

// Instantiate orbit controls
// Damping makes for smoother controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.maxDistance = 5;
controls.minDistance = 0.3;

// Create main shape geometry and material
const geo = new THREE.BoxGeometry(.8, .8, .8, 3, 3, 3);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});

// Create mesh based on shape geometry and material and attach to the scene
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// Create a material for our wireframe
const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});

// Create wireframe utilizing material wireMat and geometry of original shape
const wireMesh = new THREE.Mesh(geo, wireMat);

// Scale slightly larger than original geo prevents occlusion flicker
wireMesh.scale.setScalar(1.001); 

// Attach wiremesh directly to main object mesh
// This causes animations applied to main object to also apply to wireframe overlay
mesh.add(wireMesh);

// Create directional lights on sides of cube
const directionalLight1 = new THREE.DirectionalLight(0x32a852);
directionalLight1.position.set(0, 1, 0);
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight(0xf54266);
directionalLight2.position.set(0, -1, 0);
scene.add(directionalLight2);
const directionalLight3 = new THREE.DirectionalLight(0x1180a8);
directionalLight3.position.set(0, 0, 1);
scene.add(directionalLight3);
const directionalLight4 = new THREE.DirectionalLight(0xfacc41);
directionalLight4.position.set(0, 0, -1);
scene.add(directionalLight4);
const directionalLight5 = new THREE.DirectionalLight(0x6f2aa1);
directionalLight5.position.set(1, 0, 0);
scene.add(directionalLight5);
const directionalLight6 = new THREE.DirectionalLight(0xe03d3d);
directionalLight6.position.set(-1, 0, 0);
scene.add(directionalLight6);

// Cube direction calculation function
var currentDirection = new THREE.Vector3();
function getDirection(){

    // Fetches camera direction and stores it in currentDirection Vector3 variable
    camera.getWorldDirection(currentDirection);

    // Determine what direction the camera is currently looking
    var x = currentDirection.x;
    var y = currentDirection.y;
    var z = currentDirection.z;
    
  
    // Fetch displayBox element
    var displayBox = document.getElementById("displayBox");

    // Fetch helpTool element
    var helpTool = document.getElementById("temporaryHelpTip");

    // Side view detection
    // If camera is looking towards a specific side of the cube, display info
    if (y >= .8 & y <= 1){
        document.getElementById("infoBox").innerHTML = blurbs.aboutMe.blurb;
        helpTool.innerHTML = "";
        displayBox.style.opacity = 100;
        displayBox.style.color = 0xffffff;
        displayBox.innerHTML = '<a href="https://ieeexplore.ieee.org/document/9092169" class="button"> My Senior Capstone Project </a>';
    }
    if (y <= -.8 & y >= -1){
        document.getElementById("infoBox").innerHTML = blurbs.frontEnd.blurb;
        helpTool.innerHTML = "";
        displayBox.style.opacity = 0;
    }

    if (x >= .8 & x <= 1){
        document.getElementById("infoBox").innerHTML = blurbs.techStack.blurb;
        helpTool.innerHTML = "";
        displayBox.style.color = 0xffffff;
        displayBox.style.opacity = 100;
        displayBox.innerHTML = "JavaScript, ReactNative, React.js, C#/.NET, R, Python, Firebase, SQL, MongoDB, Swift, Java</p>";
    }
    if (x <= -.8 & x >= -1){
        document.getElementById("infoBox").innerHTML = blurbs.dataScience.blurb;
        helpTool.innerHTML = "";
        displayBox.style.opacity = 0;
    }

    if (z >= .8 & z <= 1){
        document.getElementById("infoBox").innerHTML = blurbs.research.blurb;
        helpTool.innerHTML = "";
        displayBox.style.opacity = 100;
        displayBox.style.color = 0xffffff;
        displayBox.innerHTML = '<a href="https://ieeexplore.ieee.org/document/9092169" class="button"> My IoT Research </a>';
    }

    // INITIAL VIEW
    if (z <= -.8 & z >= -1){
        document.getElementById("infoBox").innerHTML = blurbs.softwareEngineering.blurb;
        displayBox.style.opacity = 0;
    }
}

// This function is called every frame and enables animation based on time
function animate(t = 0){
    // console.log("Hello camera, " + camera.getWorldDirection);
    requestAnimationFrame(animate);
    // mesh.rotation.y = t * -0.0001;
    labelRenderer.render(scene, camera);

    renderer.render(scene, camera);
    controls.update(); // Update controls every frame
    getDirection();

}

// Add listeners for window resizing
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
});

// Populate nameplate
document.getElementById("nameplate").innerHTML = "Elyse Shackleton";

// Call animate function first time so it begins animating
animate();