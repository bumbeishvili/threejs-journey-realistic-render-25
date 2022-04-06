import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()





/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.intensity = 1.7;
directionalLight.castShadow = true;
// far
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);

directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)




/* 
Textures
*/

const cubeTextureLoader = new THREE.CubeTextureLoader()
const cubeTexture = cubeTextureLoader.load([
    'textures/environmentMaps/0/px.jpg',
    'textures/environmentMaps/0/nx.jpg',
    'textures/environmentMaps/0/py.jpg',
    'textures/environmentMaps/0/ny.jpg',
    'textures/environmentMaps/0/pz.jpg',
    'textures/environmentMaps/0/nz.jpg',
]);

scene.background = cubeTexture
cubeTexture.encoding = THREE.sRGBEncoding;


/* 
Loaders
*/

const gltfLoader = new GLTFLoader();


const updateAllMaterials = () => {
    scene.environment = cubeTexture;
    scene.traverse(obj => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
            console.log(obj)
            // obj.material.envMap = cubeTexture;
            obj.material.envMapIntensity = debugObj.envMapIntensity;
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    })
}

gltfLoader.load(
    'models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {

        gltf.scene.scale.set(10, 10, 10);
        gltf.scene.position.set(0, -4, 0);
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        updateAllMaterials();

        gui.add(gltf.scene.rotation, 'y', 0, Math.PI * 2).name('Scene Rotation Y')


    }
)



gltfLoader.load(
    'models/hamburger.glb',
    (gltf) => {

        const scale = 0.2
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(3, 0, 0);
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        updateAllMaterials();

        gui.add(gltf.scene.rotation, 'y', 0, Math.PI * 2).name('Scene Rotation Y')


    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#a2497c')
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()





// Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLightHelper)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

// GUI
const debugObj = {
    envMapIntensity: 2.1,
}
gui.add(directionalLight, 'intensity', 0, 10).name('Light Intensity')
gui.add(directionalLight.position, 'x', -10, 10).name('Light X')
gui.add(directionalLight.position, 'y', -10, 10).name('Light Y')
gui.add(directionalLight.position, 'z', -10, 10).name('Light Z')
gui.add(debugObj, 'envMapIntensity', 0, 10).name('EnvMap Intensity').onChange(updateAllMaterials)
gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})

gui.add(renderer, 'toneMappingExposure', 0, 3).name('ToneMappingExposure')