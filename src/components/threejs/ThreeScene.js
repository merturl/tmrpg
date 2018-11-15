import React, { Component } from "react";
import * as THREE from "three";

class ThreeScene extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 4;
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    //ADD CUBE
    const geometry = new THREE.BoxBufferGeometry(7, 1, 3);
    const edges = new THREE.EdgesGeometry( geometry );
    this.cube = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'indianred' } ) );
    this.cube.rotation.x += Math.PI/4;
    this.cube.rotation.y += Math.PI/8;
    this.cube.position.set(1, 1, 1);
    this.scene.add(this.cube)
    this.start()
  }
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }
  stop = () => {
    cancelAnimationFrame(this.frameId);
  }
  animate = () => {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }
  render() {
    return (
      <div
        style={{ width: '1400px', height: '700px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
export default ThreeScene
