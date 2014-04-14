var testing = 0;
var projector, camera;
var objects = [];

var myAppController =
{
    geoObject : null,
    cube : null,
    
    onArgonReady : function()
    {
        //myAppController.createContent();
        //myAppController.createFrameMarkerContent();
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
            
            /*var loader = new THREE.OBJMTLLoader();
            loader.load( 'obj/marbleNew.obj', 'obj/marbleNew.mtl', function ( object ) {
                object.position.x = -40;
                object.position.z = 0;
                object.position.y = -95;
                object.rotation.y = 180 * Math.PI / 180.0;
                object.rotation.x = 90 * Math.PI / 180.0;
                object.scale.x = .17;
                object.scale.y = .17;
                object.scale.z = .17;
                trackedObject.add( object );
                objects.push( object );
            } );*/

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
        debug(vector.length);
        projector.unprojectVector( vector, camera );
        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        var intersects = raycaster.intersectObjects( objects );
        if ( intersects.length > 0 ) {
            alert("intersects length is > 0");
            window.location.href="test.html";
            //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

            //var particle = new THREE.Sprite( particleMaterial );
            //particle.position = intersects[ 0 ].point;
            //particle.scale.x = particle.scale.y = 16;
            //scene.add( particle );
        }
    }
};

$(".floor").on('touchend', function(){
    $(".floor").removeClass("selected");
    $(this).addClass("selected");
    window.location.href="test.html";
});

document.addEventListener( 'touchend', myAppController.onDocumentMouseDown, false );
document.addEventListener("AR.DataSetLoadedEvent", myAppController.onDataSetLoaded);
document.addEventListener("AR.ArgonReadyEvent", myAppController.onArgonReady);

function debug(text){
    //alert("debugging!");
    $('.debug').html(text);
}