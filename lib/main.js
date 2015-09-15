/* TODO:
1. migrate to physi.js for scene handling over three.js, should be simple
2. create Ground, gravity
3. create physics step listener OUTSIDE of render loop, this will update positions and stuff
4. create handler for RaycastVehicle in Physijs.
	Important- avoid copying/pasting from cannon.js to physijs_worker.js- there's no need
	Instead, just proxy the setter/constructor funcs and provide access to the vehicle object.
	Every step, update the positions of the wheels based off the vehicle's wheelInfos array property
	NO NEED TO MAKE A PHYSICS BODY FOR THE WHEELS LIKE IN THE EXAMPLE. Just make a THREE.CylinderGeometry.
	Render custom geometry within the scene object (it is a Physijs.Scene but it inherits from Three).

	Is wheel and ground contact material important? Perhaps ground, because it gives a friction baseline but wheel?

*/



var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.bottom = '0px';


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//now for the real stuff:

var clock = new THREE.Clock();

var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 3500, 15000 );
	scene.fog.color.setHSL(0.57, 0.77, 0.71);

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, precision:"highp"});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

var controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 2500;
	controls.rollSpeed = Math.PI / 6;
	controls.autoForward = false;
	controls.dragToLook = false

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var pLight = new THREE.PointLight( 0xffffff, 1, 100 );
pLight.position.set( 10, 10, 10 );
scene.add( pLight );

// White directional light at half intensity shining from the top.
//var dLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
//dLight.position.set( 0, 1, 0 );
//scene.add( dLight );

var aLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( aLight );

// lens flares
addLight( scene, 0.55, 0.9, 0.5, 5000, 0, -1000 );
addLight( scene, 0.08, 0.8, 0.5,    100, 0, -500 );
addLight( scene, 0.995, 0.5, 0.9, 5000, 5000, -1000 );


function render() {
	stats.begin();

	var delta = clock.getDelta();
	controls.update( delta );

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render( scene, camera );

	stats.end();

	requestAnimationFrame( render );
}

render();

function onWindowResize( event ) {

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

window.addEventListener( 'resize', onWindowResize, false );

document.addEventListener("DOMContentLoaded", function(event) { 
  document.body.appendChild( stats.domElement );
  document.body.appendChild( renderer.domElement );
  controls.domElement = document.body;
});