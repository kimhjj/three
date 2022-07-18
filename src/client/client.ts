import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Group } from 'three'

const scene = new THREE.Scene()
const axeshelper = new THREE.AxesHelper(5)  // rbg축
scene.add(axeshelper)

const light = new THREE.PointLight()    // 포인트 조명
light.position.set(0.8, 1.4, 1.0)
scene.add(light)

const ambientLight = new THREE.AmbientLight()   // 전체
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
    75, // field of view (FOV): 수직 시야 각도
    window.innerWidth / window.innerHeight, // aspect: 관점
    1,  // near
    100 // far
)
camera.position.set(5, 2, 8)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

interface Gym {
  '3': Group;
  '2': Group;
  '1': Group;
  '0': Group;
  '-1': Group;
  [propsName:string]:any;
}
const gym:Gym = {
    '3': new THREE.Group(),
    '2': new THREE.Group(),
    '1': new THREE.Group(),
    '0': new THREE.Group(),
    '-1': new THREE.Group()
}

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/gym/UJIG_F01.FBX',   // 주차장
    (object) => {
        gym['0'] = object
        scene.add(object)
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
    (error) => console.log(error)
)
fbxLoader.load(
    'models/gym/UJIG_F02.FBX',  // 1층
    (object) => {
        gym['1'] = object
        scene.add(object)
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
    (error) => console.log(error)
)
fbxLoader.load(
    'models/gym/UJIG_F03.FBX',  // 2층
    (object) => {
        gym['2'] = object
        scene.add(object)
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
    (error) => console.log(error)
)
fbxLoader.load(
    'models/gym/UJIG_F04.FBX',  // 지붕
    (object) => {
        gym['3'] = object
        scene.add(object)
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
    (error) => console.log(error)
)

const buttons = document.querySelectorAll(".contents > button")
buttons.forEach((b) => {
    b.addEventListener('click', onclickChangeView)
})
function onclickChangeView(b: any) {
    const selectedFloor = Number(b.target.value)

    Object.keys(gym).forEach((floor) => {
        const group = gym[floor]
        const s = scene.children.filter((c) => (c === group))
        if(Number(floor) <= selectedFloor) {
            if(s.length===0) {
                scene.add(gym[floor])
            }
        } else {
            if(s.length>0) {
                scene.remove(gym[floor])
            }
        }
    })
}

/*
let isShiftDown = false;
let objects: (THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>)[] = [];
const rollOverGeo = new THREE.BoxGeometry( 1, 1, 1 )
let rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } )
let rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial )
scene.add( rollOverMesh );
// cubes
let cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
let cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );
// grid
const gridSize = 100
const gridDivision = 1000
const gridHelper = new THREE.GridHelper(gridSize, gridDivision);
scene.add( gridHelper );
*/
//
//let raycaster = new THREE.Raycaster();
//let pointer = new THREE.Vector2();
//const geometry = new THREE.PlaneGeometry( 1000, 1000 );
//geometry.rotateX( - Math.PI / 2 );
//let plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
//scene.add( plane );
//objects.push( plane );
/*
document.addEventListener( 'pointermove', onPointerMove );
function onPointerMove( event: { clientX: number; clientY: number } ) {
    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objects, false );
    if ( intersects.length > 0 ) {
        const intersect = intersects[0];
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        render();
    }
}
document.addEventListener( 'pointerdown', onPointerDown );
function onPointerDown( event: { clientX: number; clientY: number } ) {
    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objects, false );
    if ( intersects.length > 0 ) {
        const intersect = intersects[0];
        // delete cube
        if ( isShiftDown ) {
            if ( intersect.object !== plane ) {
                scene.remove( intersect.object );
                objects.splice( objects.indexOf( intersect.object ), 1 );
            }
            // create cube
        } else {
            const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
            scene.add( voxel );
            objects.push( voxel );
        }
        render();
    }
}
document.addEventListener( 'keydown', onDocumentKeyDown );
function onDocumentKeyDown( event: { keyCode: any } ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = true; break;
    }
}
document.addEventListener( 'keyup', onDocumentKeyUp );
function onDocumentKeyUp( event: { keyCode: any } ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; break;
    }
}
*/

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()