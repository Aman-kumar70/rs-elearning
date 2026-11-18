import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * The home-page globe from the original inline Three.js module.
 * The CDN import map is gone: Three.js is now an npm dependency and this
 * component owns the WebGL lifecycle, including cleanup on route unmount.
 */
export default function ThreeGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let scene;
    let camera;
    let renderer;
    let earth;
    let atmosphere;
    let satellite;
    let stars;
    let controls;
    let animationId = null;
    let disposed = false;
    let satAngle = 0;

    function sizeCanvas() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      return { w, h };
    }

    try {
      scene = new THREE.Scene();

      const { w, h } = sizeCanvas();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
      camera.position.set(0, 1, 6.5);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const earthGeo = new THREE.SphereGeometry(2, 64, 64);
      const textureLoader = new THREE.TextureLoader();
      const earthTexture = textureLoader.load(
        "/assets/images/earth-blue-marble.jpg",
      );
      const earthMat = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 8,
        specular: new THREE.Color(0x222244),
      });
      earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      const atmGeo = new THREE.SphereGeometry(2.12, 64, 64);
      const atmMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 2.5);
            gl_FragColor = vec4(0.5, 0.35, 0.9, 1.0) * intensity;
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      atmosphere = new THREE.Mesh(atmGeo, atmMat);
      scene.add(atmosphere);

      satellite = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.14, 0.1, 0.1);
      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0xddddee,
        shininess: 60,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      const panelGeo = new THREE.BoxGeometry(0.32, 0.005, 0.12);
      const panelMat = new THREE.MeshPhongMaterial({
        color: 0x1a1a3a,
        shininess: 80,
        specular: 0x4488ff,
      });
      const panel1 = new THREE.Mesh(panelGeo, panelMat);
      panel1.position.x = -0.27;
      const panel2 = new THREE.Mesh(panelGeo, panelMat);
      panel2.position.x = 0.27;
      const antGeo = new THREE.ConeGeometry(0.03, 0.12, 8);
      const antMat = new THREE.MeshPhongMaterial({ color: 0xffaa44 });
      const antenna = new THREE.Mesh(antGeo, antMat);
      antenna.position.y = 0.1;
      satellite.add(body, panel1, panel2, antenna);
      satellite.scale.set(0.7, 0.7, 0.7);
      scene.add(satellite);

      const starGeo = new THREE.BufferGeometry();
      const starCount = 2000;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        const r = 80 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);
        const brightness = 0.4 + Math.random() * 0.6;
        starColors[i * 3] = brightness;
        starColors[i * 3 + 1] = brightness * (0.85 + Math.random() * 0.15);
        starColors[i * 3 + 2] = brightness;
      }
      starGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3),
      );
      starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
      stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          size: 0.6,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
        }),
      );
      scene.add(stars);

      const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
      sunLight.position.set(8, 3, 5);
      scene.add(sunLight);
      const ambient = new THREE.AmbientLight(0x223366, 0.6);
      scene.add(ambient);

      controls = new OrbitControls(camera, canvas);
      controls.enableDamping = !reduceMotion;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 4;
      controls.maxDistance = 12;
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.4;
      controls.rotateSpeed = 0.5;
    } catch (error) {
      console.warn(
        "The home-page 3D globe could not start in this browser.",
        error,
      );
      renderer?.dispose();
      return undefined;
    }

    function tick() {
      if (disposed) return;
      animationId = window.requestAnimationFrame(tick);

      if (!reduceMotion) {
        earth.rotation.y += 0.0008;
        stars.rotation.y += 0.00005;
        satAngle += 0.006;
        const orbitR = 3.3;
        satellite.position.x = Math.cos(satAngle) * orbitR;
        satellite.position.z = Math.sin(satAngle) * orbitR;
        satellite.position.y = Math.sin(satAngle * 0.3) * 0.8;
        satellite.lookAt(0, 0, 0);
        satellite.rotation.z += 0.01;
      }

      controls.update();
      renderer.render(scene, camera);
    }

    function start() {
      if (disposed || animationId !== null) return;
      animationId = window.requestAnimationFrame(tick);
    }

    function stop() {
      if (animationId !== null) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function onResize() {
      if (!camera || !renderer) return;
      const { w, h } = sizeCanvas();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    start();
    window.addEventListener("resize", onResize);

    let heroObserver;
    if ("IntersectionObserver" in window) {
      heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) start();
            else stop();
          });
        },
        { threshold: 0 },
      );
      heroObserver.observe(canvas.parentElement);
    }

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("resize", onResize);
      heroObserver?.disconnect();
      controls?.dispose();

      scene?.traverse((object) => {
        object.geometry?.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => {
          if (!material) return;
          Object.values(material).forEach((value) => {
            if (value && value.isTexture) value.dispose();
          });
          material.dispose();
        });
      });

      renderer?.dispose();
      renderer?.forceContextLoss?.();
    };
  }, []);

  return <canvas id="earth-canvas" ref={canvasRef} aria-hidden="true" />;
}
