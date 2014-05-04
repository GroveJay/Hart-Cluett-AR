var testing = 1;
var scene, raycaster, renderer;
var projector, camera;
var objects = [];
var audioElement = document.createElement('audio');
var mouse = new THREE.Vector2(), INTERSECTED;

var myAppController =
{
    geoObject : null,
    cube : null,
    
    onArgonReady : function()
    {
        ARGON.loadDataset("textures/Team_Exterior_Device.xml");
    },
    
    onDataSetLoaded : function(event)
    {
        var dataset, stonesTarget, trackedObject;
        var redCube, redMaterial, redGeometry;
        
        dataset      = event.dataset;
        stonesTarget = dataset.targets["testReal"];
        
        if (stonesTarget)
        {
            trackedObject        = new ARGON.TrackedObject();
            trackedObject.name   = "AttachedToStonesTarget"; 
            
            trackedObject.autoHideAfterFrames = 1;
            trackedObject.setTarget( stonesTarget );

            var dae, skin;
            var loader = new THREE.ColladaLoader();
            loader.options.convertUpAxis = true;
            loader.load( 'obj/marble.dae', function ( collada ) {
                dae = collada.scene;
                skin = collada.skins[ 0 ];
                dae.position.x = -40;
                dae.position.z = 0;
                dae.position.y = -95;
                //dae.rotation.z = 180 * Math.PI / 180.0;
                //dae.rotation.x = -90 * Math.PI / 180.0;
                dae.rotation.y = -90 * Math.PI / 180.0;
                dae.scale.x = dae.scale.y = dae.scale.z = .17;
                dae.updateMatrix();
                trackedObject.add( dae );
                objects.push( dae );
            } );

            hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            hemiLight.position.set( 0, 500, 0 );
            trackedObject.add( hemiLight );

            if(testing){
                var helper = new THREE.GridHelper( 100, 10 );
                helper.setColors( 0x808080, 0x0000ff);
                trackedObject.add( helper );

                var helper2 = new THREE.GridHelper( 100, 10 );
                helper2.setColors( 0x808080, 0x00ff00 );
                helper2.rotation.x = 90 * Math.PI / 180.0;
                trackedObject.add( helper2 );

                var helper3 = new THREE.GridHelper( 100, 10 );
                helper3.setColors( 0x808080, 0xff0000 );
                helper3.rotation.z = 90 * Math.PI / 180.0;
                trackedObject.add( helper3 );
            }
        }
    },

    onDocumentMouseDown: function ( event ) {
        event.preventDefault();
        projector = new THREE.Projector();
        raycaster = new THREE.Raycaster();
        camera = ARGON.threeCamera;
        // I Bet these are very wrong!
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );
        raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
        // "objects" is wrong here i think:
        // scene.children ==>  scene.add( object );
        // maybe trackedObject.children
        var intersects = raycaster.intersectObjects( objects );
        /*debugObj(vector);
        debugObj(raycaster);
        debugObj(intersects);
        debugObj(objects);*/
        if ( intersects.length > 0 ) {
            // if ( INTERSECTED != intersects[ 0 ].object ) {
            //  if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            //  INTERSECTED = intersects[ 0 ].object;
            //  INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //  INTERSECTED.material.emissive.setHex( 0xff0000 );
            // }
            alert("intersects length is > 0");
            //window.location.href="test.html";
            var particle = new THREE.Sprite( particleMaterial );
            particle.position = intersects[ 0 ].point;
            particle.scale.x = particle.scale.y = 16;
            ARGON.World.add( particle );
        }
        else{
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            // INTERSECTED = null;
        }
    },

    switchModels: function ( floor, event ){
        scene = ARGON.World;
        debug("trying to switch Models");
        //alert("switching floors: "+ floor);
    }
};

// Functions //
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function debugObj(obj){
    $('.testing').append(JSON.stringify(obj, null, 4)+"<br/>");
}

function debug(text){
    //alert("debugging!");
    $('.testing').append(text+"<br/>");
}

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

function switchBlueprint(floor){
    var image = "url('img/fl_"+floor+".png')";
    $(".blueprint").css("background-image", image);
    $(".blueprint").attr("floor", floor);
    $(".blueprint").removeClass("hidden");
}

// DOM STUFF //
$(".floorSelector > .button").on('touchend click', function(){
    $(".floorSelector > .button").removeClass("selected");
    $(this).addClass("selected");
    var floor = $(this).attr("floor");
    if($(this).hasClass("floor")){
        switchBlueprint(floor);
    }
    else{
        $('.blueprint').addClass("hidden");
    }
    $(".scriptContainer").addClass("hidden");
    //myAppController.switchModels(floor);
});

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

$("#script").on('touchend click', function(){
    if ($(".scriptContainer").hasClass("hidden")) {
        $(".scriptContainer").removeClass("hidden");
    }
    else{
        $(".scriptContainer").addClass("hidden");
    }
});

$(".blueprint").on('touchend click', function(){
    var floor = $(this).attr("floor");
    window.location = "pano.html#"+floor;
});

$(".testing").hide();

document.addEventListener("AR.DataSetLoadedEvent", myAppController.onDataSetLoaded);
document.addEventListener("AR.ArgonReadyEvent", myAppController.onArgonReady);
document.addEventListener("touchend", myAppController.onDocumentMouseDown, false );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

debug("Starting!");
loadAudio("RichardHart.mp3");
//debugObj(ARGON.threeCamera);