// GLOBAL VARIABLES
const WIDTH = 640;
const HEIGHT = 360;
//Atributos Camara.
const VIEW_ANGLE = 50;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

var renderer, scene, camera, pointLight;

// Set up the sphere vars
const RADIUS = 5;
const SEGMENTS = 6;
const RINGS = 6;
// Atributos del plano
const PLANE_WIDTH = 400;
const PLANE_HEIGTH = 200;
const PLANE_QUALITY = 10;

const PLANE_WIDTH2 = 700;
const PLANE_HEIGTH2 = 400;
const PLANE_QUALITY2 = 10;
//Atributos de las palas
const PADDLE_WITH = 10;
const PADDLE_HEIGTH = 30;
const PADDLE_DEPTH = 10;
const PADDLE_QUALITY = 1;
//Atributos Columnas
const COLUMN_WITH = 10;
const COLUMN_HEIGTH = 10;
const COLUMN_DEPTH = 40;
const COLUMN_QUALITY = 1;

var playerPaddleDir = 0;
var cpuPaddleDirY = 0;
var paddleSpeed = 3;

var playerPaddle;
var cpuPaddle;
//Variables de la pelota.
var ballDirX = 1;
var ballDirY = 1;
var ballSpeed = 2;
//CPU dificultad entre 0 y 1
var difficulty = 0.05
//Puntuacion
var playerScore = 0;
var cpuScore = 0;
var maxScore = 3;
//Variables texturas
var texture;
// GAME FUNCTIONS

function setup()
{
    createScene();
    //addTexture();
    addMesh();
    addLight();
    requestAnimationFrame(draw);
}

function draw()
{
    camera.position.z = playerPaddle.position.z + 80;
    camera.position.x = playerPaddle.position.x + 180;
    //camera.position.y = playerPaddle.position.x - 50;
    //camera.rotation.x = -250;
    camera.rotation.y = Math.PI/2;
    camera.rotation.x = 1/2*Math.PI;

    //camera.rotation.z = 100;
    paddleMovement();
    ballMove();
    cpuFollow();
    checkPoint();
    sphere.rotation.x += Math.sin(1);
    sphere.rotation.y += Math.sin(-1);
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
    //console.log(ballSpeed);
    if(maxScore == cpuScore || maxScore == playerScore){
      finishGame();
    }
    //console.log(container);
}

function createScene()
{
  // Get the DOM element to attach to
    container = document.getElementById("gameCanvas");
    renderer = new THREE.WebGLRenderer();

    camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    scene = new THREE.Scene();

    // Add the camera to the scene
    scene.add(camera);
    renderer.setClearColor( 0x248bcb, 1 );
    // Start the renderer
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Attach the renderer-supplied DOM element.
    container.appendChild(renderer.domElement);
}

function addMesh()
{
  //MATERIALES
  var material = new THREE.MeshLambertMaterial(
      {
        color: 0xf77575,
      });
  var texture  = new THREE.TextureLoader().load( 'http://localhost:8000/Textures/campo.jpg' );
  var material2 = new THREE.MeshBasicMaterial(
      {
        map: texture,
      });
  var texture2  = new THREE.TextureLoader().load( 'http://localhost:8000/Textures/pelota.jpg' );
  var material3 = new THREE.MeshBasicMaterial(
      {
        map: texture2,
      });

  var material4 = new THREE.MeshLambertMaterial(
      {
        color: 0xFF0000,
      });
  var material5 = new THREE.MeshLambertMaterial(
      {
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
      });
//GEOMETRIAS
var geometry = new THREE.SphereGeometry(
      RADIUS,
      SEGMENTS,
      RINGS);

var geometry2 = new THREE.PlaneGeometry(
    PLANE_WIDTH,
    PLANE_HEIGTH,
    PLANE_QUALITY
  );

var geometry3 = new THREE.CubeGeometry(
    PADDLE_WITH,
    PADDLE_HEIGTH,
    PADDLE_DEPTH,
    PADDLE_QUALITY
  );

var geometry4 = new THREE.CubeGeometry(
    COLUMN_WITH,
    COLUMN_HEIGTH,
    COLUMN_DEPTH,
    COLUMN_QUALITY
  );

var geometry5 = new THREE.PlaneGeometry(
    PLANE_WIDTH2,
    PLANE_HEIGTH2,
    PLANE_QUALITY2
  );

  sphere = new THREE.Mesh(geometry, material3);
  plane  = new THREE.Mesh(geometry2, material2);
  plane2  = new THREE.Mesh(geometry5, material5);
  playerPaddle  = new THREE.Mesh(geometry3, material);
  cpuPaddle  = new THREE.Mesh(geometry3, material);
  columna =  new THREE.Mesh(geometry4, material4);
  columna2 =  new THREE.Mesh(geometry4, material4);
  columna3 =  new THREE.Mesh(geometry4, material4);
  columna4 =  new THREE.Mesh(geometry4, material4);
  columna5 =  new THREE.Mesh(geometry4, material4);
  columna6 =  new THREE.Mesh(geometry4, material4);
  //POSICION DE LA CAMARA
  sphere.position.z = -295;
  playerPaddle.position.z = -300;
  playerPaddle.position.x = 180;
  cpuPaddle.position.x = -180;
  cpuPaddle.position.z = -300;
  plane.position.z = -300;
  plane2.position.z = -298;
  //Columna 1 Derecha
  columna.position.z = -280;
  columna.position.y = 100;
  columna.position.x = 150;
  //Columna 2 Derecha
  columna2.position.z = -280;
  columna2.position.y = 100;
  columna2.position.x = 0;
  //Columna 3 Derecha
  columna3.position.z = -280;
  columna3.position.y = 100;
  columna3.position.x = -150;
  //Columna 1 Izquierda
  columna4.position.z = -280;
  columna4.position.y = -100;
  columna4.position.x = 150;
  //Columna 2 Izquierda
  columna5.position.z = -280;
  columna5.position.y = -100;
  columna5.position.x = 0;
  //Columna 3 Izquierda
  columna6.position.z = -280;
  columna6.position.y = -100;
  columna6.position.x = -150;
  //Shadows
  playerPaddle.castShadow = true;
  cpuPaddle.castShadow = true;
  plane2.receiveShadow = true;
  columna.castShadow = true;
  columna2.castShadow = true;
  columna3.castShadow = true;
  columna4.castShadow = true;
  columna5.castShadow = true;
  columna6.castShadow = true;

  ////////////////////////
  //AÑADIMOS LOS OBJETOS//
  ////////////////////////
  scene.add(sphere);
  scene.add(plane);
  scene.add(plane2);
  scene.add(playerPaddle);
  scene.add(cpuPaddle);
  scene.add(columna);
  scene.add(columna2);
  scene.add(columna3);
  scene.add(columna4);
  scene.add(columna5);
  scene.add(columna6);
}

function addLight()
{

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );

// Set its position
    directionalLight.position.x = 0;
    directionalLight.position.y = 400;
    directionalLight.position.z = 100;
    directionalLight.castShadow = true;

// Add to the scene
    scene.add(directionalLight);
    // Create a point light
    pointLight = new THREE.SpotLight(0xFFFFFF);

    // Set its position
    pointLight.position.x = -100;
    pointLight.position.y = -600;
    pointLight.position.z = -200;
    pointLight.castShadow = true;
    // Add to the scene
    scene.add(pointLight);
}

function ballMove(){
  var Alturaplayer = sphere.position.y >= playerPaddle.position.y-15 && sphere.position.y <= playerPaddle.position.y+15;
  var Anchoplayer = sphere.position.x >= playerPaddle.position.x-6 && sphere.position.x <= playerPaddle.position.x-3;
  var Alturacpu = sphere.position.y >= cpuPaddle.position.y-15 && sphere.position.y <= cpuPaddle.position.y+15;
  var Anchocpu = sphere.position.x <= cpuPaddle.position.x+6 && sphere.position.x >= cpuPaddle.position.x+3
  //Golpea paredes.
    if(sphere.position.y >= 100){
      ballDirY += -0.5;
    }else if(sphere.position.y <= -100){
      ballDirY += 0.5;
    }
  //Golpea paletas.
    if(Alturaplayer && Anchoplayer){
      ballDirX = -(ballDirX);
  } else if(Alturacpu && Anchocpu) {
      ballDirX = -(ballDirX);
  }
  sphere.position.y += ballSpeed*ballDirY;
  sphere.position.x += ballSpeed*ballDirX;
  //console.log(ballDirX, ballDirY);
}

function paddleMovement(){
    if (Key.isDown(Key.D) && playerPaddle.position.y + 15 <= 100){
      playerPaddle.position.y += paddleSpeed;
    }else if(Key.isDown(Key.A) && playerPaddle.position.y - 15 >= -100){
      playerPaddle.position.y -= paddleSpeed;
    }
}

function checkPoint(){

    if (sphere.position.x >= 200){
      cpuScore += 1;
      document.getElementById("scores").innerHTML = (cpuScore + "-" + playerScore);
      sphere.position.x = 0;
      ballDirX = -1;
    }else if (sphere.position.x <= -200) {
      playerScore += 1;
      document.getElementById("scores").innerHTML = (cpuScore + "-" + playerScore);
      sphere.position.x = 0;
      ballDirX = 1;
    }
}

function cpuFollow() {
    cpuPaddleDirY = (sphere.position.y - cpuPaddle.position.y)*difficulty;
    cpuPaddle.position.y += cpuPaddleDirY * paddleSpeed;

}
 function finishGame(){
   sphere.position.x = 0;
   sphere.position.y = 0;
   sphere.rotation.y = 0;
   sphere.rotation.x = 0;
   playerPaddle.position.y = 0;
   if(playerScore == maxScore){
     document.getElementById("scores").innerHTML = ("You Win!");
   }else if(cpuScore == maxScore) {
     document.getElementById("scores").innerHTML = ("You Lost");
   }
   if(Key.isDown(Key.SPACE)){
     restartGame();
   }
 }

function restartGame(){
    location.reload();
}
