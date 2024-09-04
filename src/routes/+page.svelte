<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from 'three';

  const emails = ["ns651@exeter.ac.uk"];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let intervals: NodeJS.Timeout[] = [];

  onMount(() => {
    const handleMouseOver = (index: number) => (event: MouseEvent) => {
      const h1 = event.target as HTMLHeadingElement;
      let iteration = 0;

      clearInterval(intervals[index]);

      intervals[index] = setInterval(() => {
        h1.innerText = h1.innerText
          .split("")
          .map((letter, i) => {
            if (i < iteration) {
              return h1.dataset.value![i];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iteration >= h1.dataset.value!.length) {
          clearInterval(intervals[index]);
        }

        iteration += 1 / 2;
      }, 30);
    };

    emails.forEach((email, index) => {
      const h1 = document.querySelector(`h1[data-value="${email}"]`);
      intervals[index] = null;

      if (h1) {
        h1.addEventListener("mouseover", handleMouseOver(index));
      }
    });

    // Three.js Background Setup
    const canvas = document.querySelector('#bg') as HTMLCanvasElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(100);

    // Function to create a snake-like spiral
    function createSnakeCurve(radius, turns, offset) {
      return new THREE.CatmullRomCurve3(
        new Array(200).fill(0).map((_, i) => {
          const angle = i * (Math.PI * 2 * turns) / 200;
          const x = Math.cos(angle + offset) * radius;
          const y = Math.sin(angle + offset) * radius;
          const z = i * 0.5;
          return new THREE.Vector3(x, y, z);
        })
      );
    }

    const snake1Curve = createSnakeCurve(10, 5, 0);
    const snake2Curve = createSnakeCurve(10, 5, Math.PI); // Offset by PI for opposite spiral

    const snake1Geometry = new THREE.TubeGeometry(snake1Curve, 200, 1, 8, false);
    const snake2Geometry = new THREE.TubeGeometry(snake2Curve, 200, 1, 8, false);

    const material1 = new THREE.MeshStandardMaterial({
      color: 0xFF4500, // Orange-Red
      wireframe: true,
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x1E90FF, // DodgerBlue
      wireframe: true,
    });

    const snake1Mesh = new THREE.Mesh(snake1Geometry, material1);
    const snake2Mesh = new THREE.Mesh(snake2Geometry, material2);

    scene.add(snake1Mesh);
    scene.add(snake2Mesh);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the snakes around the center
      snake1Mesh.rotation.z += 0.01;
      snake2Mesh.rotation.z -= 0.01;

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      intervals.forEach((interval, index) => {
        clearInterval(interval);
        const h1 = document.querySelector(`h1[data-value="${emails[index]}"]`);
        if (h1) {
          h1.removeEventListener("mouseover", handleMouseOver(index));
        }
      });
    };
  });
</script>

<svelte:head>
  <title>Bio | Nathanael Sheehan</title>
</svelte:head>

<style>
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    color: #fff;
    background-color: #121212;
    overflow: hidden;
  }

  h1 {
    font-size: 2rem;
    margin: 1rem 0;
    text-align: center;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.5;
    margin: 1rem;
    text-align: justify;
    max-width: 600px;
  }

  .content {
    padding: 20px;
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  img {
    display: block;
    margin: 0 auto 20px;
    border-radius: 5%;
    width: 400px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
  }

  canvas {
    position: fixed;
    top: 0;
    left: 100;
    z-index: 0;
  }
</style>

<canvas id="bg"></canvas>

<div class="content">
  <img src="me.png" alt="Profile Picture">

  <p>I dance through city skylines, tracing the contours of rooftops like a needle on vinyl, leaving behind the echoes of forgotten tunes.</p>
  <p>I invite pigeons to join me in my quest to teach the stories that live between the cracks of the pavement.</p>
  <p>I befriend stray cats with a purr of understanding and can silence a barking dog with a single gaze.</p>
  <p>I survived on daydreams and starlight long before I ever touched a drop of caffeine.</p>
  <p>I climb hills with the enthusiasm of a mountain goat and descend with the reckless abandon of a child on a sled.</p>
  <h3>I am Nathanael Sheehan (he/him) a final year doctoral candidate at the University of Exeter, where my research focuses on the "Diversity and Injustice of Open Research Environments". This research is generously funded by the <a href="https://www.exeter.ac.uk/research/eicdt/">Centre for Doctoral Training in Environmental Intelligence</a> and is a component of the <a href="https://opensciencestudies.eu/">"Philosophy of Open Science for Diverse Research Environments"</a> run by Professor Sabina Leoneli. 
  </h3>
  
  <h2 style="margin-top: 5%;">HMU if you have an open source project, academic paper, or general question</h2>
  <h1 class="p-5 break-words" data-value={emails}>{"*%^%$^*£$%£$*%£$*%"}</h1>
</div>
