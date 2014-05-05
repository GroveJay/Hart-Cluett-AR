var touchX;
var touchY;
var phi = 0;
var theta = 0;
var lat = 0;
var lon = 0;
var changed = false;
var icount = 0;
var floor = window.location.hash.substring(1);
var text = [""
        ,
        "<h1>Caroline Ide Cluett’s Falling off her Chair Story:</h1><p>In 1904, Albert E. Cluett married my Grandmother, Caroline R. Ide of Troy. They had four sons: John, Edmund, Albert and Richard. The family moved into 59 Second Street in September of 1910 after being transferred the house from Albert’s Aunt and Uncle, Amanda and George Cluett, after the  tragic passing of their son, Alfonzo, to typhoid fever.</p><p>Grandmother Caroline was a very well-respected lady and was actively involved in the Troy community. She was one of the founders of the Women’s Exchange, was closely connected to the Samaritan hospital, and was a lifelong member of St. Paul’s Episcopal Church where she was an active member of its women’s organizations. That’s why it’s such a pleasure to remember her more humorous moments.</p><p>One night, we were having supper in the dining room. The whole family was around the table eating their second course.</p><p>Grandmother had been using her buzzer under the table to alert the cooks to bring in each new course.</p><p>However, this time, she had scooted her chair back a bit too far. Grandmother Caroline was a petite woman and as much as she stretched her leg, she still struggled to touch the buzzer with her foot. As she reached for the buzzer she began to sink lower and lower on her seat until...she slid right out from her chair and onto the floor.</p><p>Everyone in the room started laughing as she set off the buzzer with her bottom. The cooks came in not because of the buzzer sound but because of the raucous laughter emanating from the room.</p><p>*This is based on a true story but specific details are not guaranteed to be accurate.</p>"
        ,
        "<h1>Richard Hart\'s Death Story:</h1><h3>*In the voice of Elizabeth Shields Eddy*</h3><p>“My Grandfather, Richard Hart was a good man. He was one of the founders of the Troy Orphan Asylum and served as the Mayor of Troy from 1836 to 1838. Early in the winter of 1843 he came down with a severe cold which greatly reduced his health. In order to try and recover, he decided to take a vapor bath.</p><p><b>*Sounds of steam*</b></p><p>“Sometime after he began the vapor bath, the curtains around his chair caught fire.”</p><p><b>*Start sound of flames*</b></p><p>“Before the curtains could be torn away, he was badly burned. A servant rushing to his assistance picked up a bucket that was mistakenly thought to be filled with water and threw it on the flames.”</p><p>“Except it wasn’t water, it was alcohol and the blaze intensified.”</p><p><b>*More intense sounding flames.*</b></p><p>“Grandfather Hart passed away a couple days later at the age of 63.”</p><p>“Following his death, resolutions of a complementary nature respecting his life and career were adopted by the government of the city, the directors of the Troy City Bank and the Troy and Schenectady Railroad Company. His funeral was attended not only by his immediate family, but by representatives of the various institutions in whose management he had been concerned and by other citizens of Troy.”</p><p>“Grandmother began her widowhood at the young age of 45. Grandfather left his entire fortune to her, making her one of the wealthiest women in the country with an estimated estate of over 3 million dollars.”</p>"
	];
var audio = ["","","RichardHart"]
$(".scriptContainer").html(text[floor]);

var audioElement = document.createElement('audio');
loadAudio(audio[floor]+".mp3");

$("#play").on('touchend', function(){
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

$("#back").on('touchend click', function(){
	window.location = "index.html";
});

$("#script").on('touchend click', function(){
	
	if ($(".scriptContainer").hasClass("hidden")) {
		$(".scriptContainer").removeClass("hidden");
	}
	else{
		$(".scriptContainer").addClass("hidden");
	}
});

$(".link").on('touchend click', function(){
	window.location = "http://www.rchsonline.org/";
});


function onDocumentTouchStart( event ) {

	event.preventDefault();
	var touch = event.touches[ 0 ];

	touchX = touch.screenX;
	touchY = touch.screenY;
}

function onDocumentTouchMove( event ) {

	event.preventDefault();

	var touch = event.touches[ 0 ];

	lon -= ( touch.screenX - touchX ) * 0.1;
	lat += ( touch.screenY - touchY ) * 0.1;

	touchX = touch.screenX;
	touchY = touch.screenY;
	changed = true;
}

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
				url: 'img/'+floor+'/1.png',
				position: new THREE.Vector3( -512, 0, 0 ),
				rotation: new THREE.Euler( 0, Math.PI / 2, 0 )
			},
			{
				url: 'img/'+floor+'/3.png',
				position: new THREE.Vector3 ( 512, 0, 0 ),
				rotation: new THREE.Euler ( 0, -Math.PI / 2, 0 )
			},
			{
				url: 'img/'+floor+'/5.png',
				position: new THREE.Vector3 ( 0,  -512, 0 ),
				rotation: new THREE.Euler ( -Math.PI/2, 0, Math.PI )
			},
			{
				url: 'img/'+floor+'/4.png',
				position: new THREE.Vector3 ( 0, 512, 0 ),
				rotation: new THREE.Euler ( Math.PI/2 , 0, Math.PI)
			},
			{
				url: 'img/'+floor+'/0.png',
				position: new THREE.Vector3 ( 0, 0,  512 ),
				rotation: new THREE.Euler ( 0, Math.PI, 0 )
			},
			{
				url: 'img/'+floor+'/2.png',
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

					// var mesh;
	    //            	var geometry = new THREE.SphereGeometry( 500, 64, 64 );
	    //            	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
					// var material = new THREE.MeshBasicMaterial( {
					// 	map: THREE.ImageUtils.loadTexture( 'img/test2.jpg' )
					// } );
					// mesh = new THREE.Mesh( geometry, material );
					// mesh.scale.x = -1;

					// //sc.add(sphere);
					// ARGON.World.add( mesh );
	 			// 	ARGON.threeCamera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, 1, 1000 );

		ARGON.World.add( sc );
		ARGON.threeCamera.fov = 75;
		ARGON.onRender = app.onRender; 
	}

};

var sc = new THREE.Object3D();
document.addEventListener("AR.ArgonReadyEvent", myAppController.onArgonReady);
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

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


