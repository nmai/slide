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

'use strict';

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.bottom = '0px';


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//now for the real stuff:

	
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// shim layer with setTimeout fallback
window['requestAnimFrame'] = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.cannon = 'cannon.js';

var initScene, render, createShape,
	renderer, stats, scene, light, camera;

initScene = function() {
	TWEEN.start();
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
    document.body.appendChild( renderer.domElement );
	
	scene = new Physijs.Scene;
	scene.setGravity({ x: 0, y: -10, z: 0 });
	
	camera = new THREE.PerspectiveCamera(
		35,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set( 60, 50, 60 );
	camera.lookAt( scene.position );
	scene.add( camera );
	
	// Light
	light = new THREE.DirectionalLight( 0xFFFFFF );
	light.position.set( 40, 60, 25 );
	light.target.position.copy( scene.position );
	light.castShadow = true;
	light.shadowCameraLeft = -40;
	light.shadowCameraTop = -40;
	light.shadowCameraRight = 40;
	light.shadowCameraBottom = 40;
	light.shadowBias = -.0001;
	scene.add( light );
	
	// Ground
	var ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(50, 1, 50),
		new THREE.MeshLambertMaterial({ color: 0xDDDDDD }),
		0 // mass
	);
	ground.rotation.x = Math.PI / 16;
	ground.receiveShadow = true;
	window.ground = ground;
	scene.add( ground );
	
	requestAnimFrame( render );
	
	setInterval( createShape, 250 );
};

render = function() {
	stats.begin();

	scene.simulate();
	renderer.render( scene, camera);
	requestAnimFrame( render );
	
	stats.end();
};

createShape = (function() {
	var shapes = 0,
		box_geometry = new THREE.BoxGeometry( 3, 3, 3 ),
		sphere_geometry = new THREE.SphereGeometry( 1.5, 32, 32 ),
		cylinder_geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 ),
		cone_geometry = new THREE.CylinderGeometry( 0, 2, 4, 32 );
		
	return function() {
		var shape, material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: true });
		
		switch ( Math.floor(Math.random() * 1) ) {
			case 0:
				shape = new Physijs.SphereMesh(
					sphere_geometry,
					material,
					undefined,
					{ restitution: Math.random() * 1.5 }
				);
				break;
			
			case 1:
				shape = new Physijs.BoxMesh(
					box_geometry,
					material
				);
				break;
			
			case 2:
				shape = new Physijs.CylinderMesh(
					cylinder_geometry,
					material
				);
				break;
			
			case 3:
				shape = new Physijs.ConeMesh(
					cone_geometry,
					material
				);
				break;
			
			default:
				// wtf?
				return;
				break;
		}
			
		shape.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
		shape.castShadow = true;
		shape.receiveShadow = true;
		
		shape.position.set(
			Math.random() * 30 - 15,
			20,
			Math.random() * 30 - 15
		);
		
		shape.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);
		
		scene.add( shape );
		
		new TWEEN.Tween(shape.material).to({opacity: 1}, 500).start();
	};
})();
	
function onWindowResize( event ) {

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

window.addEventListener( 'resize', onWindowResize, false );

document.addEventListener("DOMContentLoaded", function(event) { 
  document.body.appendChild( stats.domElement );
  //controls.domElement = document.body;
  initScene();
});