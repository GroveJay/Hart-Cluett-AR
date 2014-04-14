var container, stats;

var camera, controls, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 600;

	// scene
	scene = new THREE.Scene();
	var ambient = new THREE.AmbientLight( 0xff0000 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );
	controls = new THREE.TrackballControls( camera );
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.25 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );

		var dae, skin;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( 'obj/marble.dae', function ( collada ) {

			dae = collada.scene;
			skin = collada.skins[ 0 ];
			
			dae.position.x = -150;
            dae.position.z = 0;
            dae.position.y = -60;
            dae.rotation.z = 180 * Math.PI / 180.0;
            dae.rotation.x = 180 * Math.PI / 180.0;
			dae.scale.x = dae.scale.y = dae.scale.z = 1;
			dae.updateMatrix();

			scene.add( dae );
		} );	
	
	// haaalp
	var helper = new THREE.GridHelper( 1000, 10 );
	helper.setColors( 0x0000ff, 0x808080 );
	scene.add( helper );

	var helper2 = new THREE.GridHelper( 1000, 10 );
	helper2.setColors( 0x808080, 0x00ff00 );
	helper2.rotation.x = 90 * Math.PI / 180.0;
	scene.add( helper2 );

	var helper3 = new THREE.GridHelper( 1000, 10 );
	helper3.setColors( 0x808080, 0xff0000 );
	helper3.rotation.z = 90 * Math.PI / 180.0;
	scene.add( helper3 );
	
	// renderer
	renderer = new THREE.WebGLRenderer( { alpha: true});
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	controls.update();
	renderer.render( scene, camera );
}