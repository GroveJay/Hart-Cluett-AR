var testing = 0;
var projector, camera;
var objects = [];
var audioElement = document.createElement('audio');

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
        stonesTarget = dataset.targets["Marble_Background_Clear"];
        
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
                dae.rotation.z = 180 * Math.PI / 180.0;
                dae.rotation.x = -90 * Math.PI / 180.0;
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
        camera = ARGON.threeCamera;
        var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        var intersects = raycaster.intersectObjects( objects );
        debugObj(vector);
        debugObj(raycaster);
        debugObj(intersects);
        debugObj(objects);
        if ( intersects.length > 0 ) {
            alert("intersects length is > 0");
            //window.location.href="test.html";
            var particle = new THREE.Sprite( particleMaterial );
            particle.position = intersects[ 0 ].point;
            particle.scale.x = particle.scale.y = 16;
            ARGON.World.add( particle );
        }
    }

    /*switchModels: function ( event ){
        scene = ARGON.World;
    }*/
};

function debugObj(obj){
    $('.debug').append(JSON.stringify(obj, null, 4)+"<br/>");
}

function debug(text){
    //alert("debugging!");
    $('.debug').append(text+"<br/>");
}

function loadAudio(file){
    audioElement.setAttribute('src', 'audio/'+file);
    debug("File picked!");
    audioElement.load;
}

function playAudio(){
    audioElement.play();
    debug("Audio started");
}

function pauseAudio(){
    audioElement.pause();
    debug("Audio paused");
}

// DOM STUFF //
$(".floor").on('touchend', function(){
    $(".floor").removeClass("selected");
    $(this).addClass("selected");
});

$("#play").on('touchend click', function(){
    if($(this).html()=="P"){
        debug("Play pressed");
        playAudio();
        $(this).html("S");       
    }
    else{
        debug("Stop pressed");
        pauseAudio();
        $(this).html("P");          
    }
});

document.addEventListener("AR.DataSetLoadedEvent", myAppController.onDataSetLoaded);
document.addEventListener("AR.ArgonReadyEvent", myAppController.onArgonReady);
document.addEventListener("touchend", myAppController.onDocumentMouseDown, false );
debug("Starting!");
$("#play").html("P");
loadAudio("RichardHart.mp3");