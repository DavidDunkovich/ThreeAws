import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Interaction } from 'three.interaction';
import TWEEN from '@tweenjs/tween.js'

// base color of sphere EFE6DD
const baseColor = 0xEFE6DD;
const baseColorRgb = { r: .937, g: .902, b: .867 };
const hoverColor = 0x357266;
const hoverColorRgb = { r: .61, g: .44, b: .65 };
const objScale = { x: 1.1, y: 1.1, z: 1.1 };

function initSize(renderer) {
  // renderer.setSize( window.innerWidth, window.innerHeight - 10 );
  renderer.setSize(200, 100);
}

function initLighting(scene) {
  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 2);
  scene.add(hemiLight);

  const light = new THREE.SpotLight(0xffa95c,2);
  light.position.set(50,50,50);
  light.castShadow = true;
  scene.add( light );
}

function initilize() {
  var scene = new THREE.Scene();
  initLighting(scene);

  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 2;

  // alpha makes background transparent, anti alias makes smooth
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const container = document.getElementById('container-aws');

  initSize(renderer);
  window.addEventListener( 'resize', () => initSize(renderer), false );

  container.appendChild( renderer.domElement );

  var loader = new GLTFLoader();
  const interaction = new Interaction(renderer, scene, camera);
  
  let awsSphere;
  loader.load( '3d/sphere-aws.glb', gltf => {
    awsSphere = gltf.scene;
    awsSphere.cursor = 'pointer';
    awsSphere.on('click', function(ev) {
      window.location.href = '/test'
    });
    awsSphere.on('mouseover', function(ev) {
      new TWEEN.Tween(awsSphere.children[8].material.color)
          .to(hoverColorRgb, 200)
          .easing(TWEEN.Easing.Quartic.In)
          .start();
      new TWEEN.Tween(awsSphere.scale)
        .to({ x: 1.05, y: 1.05, z: 1.05}, 200)
        .easing(TWEEN.Easing.Quartic.In)
        .start();
    });
    awsSphere.on('mouseout', function(ev) {
      new TWEEN.Tween(awsSphere.children[8].material.color)
          .to(baseColorRgb, 200)
          .easing(TWEEN.Easing.Quartic.In)
          .start();
      new TWEEN.Tween(awsSphere.scale)
        .to({ x: 1, y: 1, z: 1}, 200)
        .easing(TWEEN.Easing.Quartic.In)
        .start();
    });
    scene.add( awsSphere );
  }, undefined, function ( error ) {
    console.error( error );
  });

  var animate = function(time) {
    if (awsSphere) {
      awsSphere.rotation.y += 0.015;
    }
    TWEEN.update(time);
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  };
  animate();
}


class Aws extends Component {
  componentDidMount() {
    initilize();
  }
  render() {
    return (
      <div id="container-aws"></div>
    )
  }
}
export default Aws;

