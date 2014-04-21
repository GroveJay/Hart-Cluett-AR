var touchX;
var touchY;
var phi = 0;
var theta = 0;
var lat = 0;
var lon = 0;
var changed = false;
var icount = 0;
var sc = new THREE.Object3D();

//This code to allow the user to scroll with finger does not yet work. User can look around the panorama by moving the iPad
var target = new THREE.Vector3();

	var app = {
	onRender: function (time) {
		icount += 1;
 	// check for position if threshold surpassed
 	if (changed) {
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );
		
		target.x = Math.sin( phi ) * Math.cos( theta );
		target.y = Math.cos( phi );
		target.z = Math.sin( phi ) * Math.sin( theta );

		sc.rotation.copy(target);
		icount = 0;
		changed = false;
		} //THRESHOLD
	}  //onRender		    	 	
};

var myAppController =
{   
   geoSpot : null,

   onArgonReady : function()
   {
   	var element;
   	var side;
   	var object1;

   	
	var sides1 = [
		{
			url: 'img/PANO_20140323_183205.0001.png',
			position: new THREE.Vector3( -512, 0, 0 ),
			rotation: new THREE.Euler( 0, Math.PI / 2, 0 )
		},
		{
			url: 'img/PANO_20140323_183205.0003.png',
			position: new THREE.Vector3 ( 512, 0, 0 ),
			rotation: new THREE.Euler ( 0, -Math.PI / 2, 0 )
		},
		{
			url: 'img/PANO_20140323_183205.0005.png',
			position: new THREE.Vector3 ( 0,  -512, 0 ),
			rotation: new THREE.Euler ( -Math.PI/2, 0, Math.PI )
		},
		{
			url: 'img/PANO_20140323_183205.0004.png',
			position: new THREE.Vector3 ( 0, 512, 0 ),
			rotation: new THREE.Euler ( Math.PI/2 , 0, Math.PI)
		},
		{
			url: 'img/PANO_20140323_183205.0000.png',
			position: new THREE.Vector3 ( 0, 0,  512 ),
			rotation: new THREE.Euler ( 0, Math.PI, 0 )
		},
		{
			url: 'img/PANO_20140323_183205.0002.png',
			position: new THREE.Vector3 ( 0, 0, -512 ),
			rotation: new THREE.Euler ( 0, 0, 0 )
		}
	];
	
	sc.scale.set(10.0, 10.0, 10.0);

	for ( var i = 0; i < sides1.length; i ++ ) {

		var side = sides1[ i ];

		var element = document.createElement( 'img' );
		element.width = 1026; // 2 pixels extra to close the gap.
		element.src = side.url;  //this loads the image

		object1 = new THREE.CSS3DObject( element );
		object1.position = side.position;
		object1.rotation.copy(side.rotation);
		sc.add(object1);
	}

				/*var mesh;
               	var geometry = new THREE.SphereGeometry( 500, 64, 64 );
               	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
				var material = new THREE.MeshBasicMaterial( {
					map: THREE.ImageUtils.loadTexture( 'img/test2.jpg' )
				} );
				mesh = new THREE.Mesh( geometry, material );
				mesh.scale.x = -1;

				//sc.add(sphere);
				ARGON.World.add( mesh );
 				ARGON.threeCamera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, 1, 1000 );*/

			ARGON.World.add( sc );
			ARGON.threeCamera.fov = 75;
			ARGON.onRender = app.onRender; 
      }

};

document.addEventListener("AR.ArgonReadyEvent", myAppController.onArgonReady);
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

var audioElement = document.createElement('audio');

function loadAudio(file){
    audioElement.setAttribute('src', 'audio/'+file);
    //debug("File picked!");
    audioElement.load;
}

function playAudio(){
    audioElement.play();
    //debug("Audio started");
}

function pauseAudio(){
    audioElement.pause();
    //debug("Audio paused");
}

$("#play").on('touchend click', function(){
    if($(this).hasClass("play")){
        //debug("Play pressed");
        playAudio();
		$(this).removeClass("play").addClass("pause");		               
    }
    else{
        //debug("Stop pressed");
        pauseAudio();
        $(this).removeClass("pause").addClass("play");		               
    }
});
loadAudio("RichardHart.mp3");

$("#back").on('touchend click', function(){

});