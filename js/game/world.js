define(['jquery',
    "three",
    "game/constants",
    "jsface",
    "game/materials",
    'stats'
], function ($, THREE, constants, jsface, materials, Stats) {

    return Class({
        constructor: function () {
            this.setupRenderer();
            this.setupScene();
            this.attachToDOM();
        },
        setupRenderer: function () {
            // Create the renderer and make it look pretty.
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(constants.WIDTH, constants.HEIGHT);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapSoft = true;
            this.stats = new Stats();
            this.stats.setMode(0); // 0: fps, 1: ms
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';

            document.body.appendChild( this.stats.domElement );
            //this.renderer._microcache = new MicroCache();
        },

        setupScene: function () {
            // Things we need to add to the world before doing anything else.
            this.scene = new THREE.Scene();

            // Two cameras; one top-down, one that follows the ball.
            this.camera = new THREE.OrthographicCamera(constants.WIDTH / -2, constants.WIDTH / 2, constants.HEIGHT / 2, constants.HEIGHT / -2, -100, 500);
            this.perspectiveCamera = new THREE.PerspectiveCamera(80, constants.WIDTH / constants.HEIGHT, 40, -40);

            this.activeCamera = this.camera;

            // Create a light and all the shadow effects we need. Individual lights can be added later.
            this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
            this.light.position.set(200, 200, 800);
            this.light.castShadow = true;
            this.light.shadowMapWidth = 1024;
            this.light.shadowMapHeight = 1024;

            // Setup the skybox. Doesn't deserve it's own module, so it goes here.
            var skyGeometry = new THREE.SphereGeometry(3000, 60, 40); // One time use, no need to add it to game/geometry.
            var skyBox = new THREE.Mesh(skyGeometry, materials.skyMaterial);
            skyBox.scale.set(-5, 5, 5);
            skyBox.eulerOrder = 'XZY';
            skyBox.renderDepth = 1000.0;

            // Finally, add all the fixtures to the scene.
            this.scene.add(this.activeCamera);
            this.scene.add(this.light);
            this.scene.add(skyBox);
        },

        attachToDOM: function () {
            // Attach the renderer to the appropriate DOM element.
            var $container = $('#container');
            $container.append(this.renderer.domElement);
        },
        drawLoop: function () {
            this.stats.begin();
            requestAnimationFrame(this.drawLoop.bind(this));
            this.renderer.render(this.scene, this.activeCamera);
            this.stats.end();
        }
    });
});