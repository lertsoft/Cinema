<script>

    import { createEventDispatcher } from 'svelte';
  
    import { onMount } from 'svelte';
    import { raf, body } from '../modules/utils.js';
    import { loadingChannel, LOADING_STATE } from '../modules/tv.js';
    // import '@tensorflow/tfjs-core';
    // import '@tensorflow/tfjs-backend-webgl';
    // import * as facemesh from "@tensorflow-models/face-landmarks-detection";
  
    const dispatch = createEventDispatcher();
  
    let isReady = false;
    let stream;
    let video;
  
    let startTime;
    let elapsedTime;
    let formattedTime;
    let counterRequest;

    // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // const detectorConfig = {
    //   runtime: 'tfjs',
    // };
    // detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
  
    // const runFacemesh = async () => {
    //   const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh)
    //   setInterval(() => {
    //     detect(net)
    //   }, 100 )
    // }

//     async function setupCamera() {
//   // Find the <video> element in the webpage, 
//   // then use the mediaDevices API to request a camera from the user
//   video = document.getElementById('video');
//   const stream = await navigator.mediaDevices.getUserMedia({
//     'audio': false,
//     'video': {
//       facingMode: 'user',
//       width: {ideal:1920},
//       height: {ideal:1080},
//     },
//   });
//   // Assign our camera to the HTML's video element
//   video.srcObject = stream;

//   return new Promise((resolve) => {
//     video.onloadedmetadata = () => {
//       resolve(video);
//     };
//   });
// }

// async function drawVideo(){
//     // Draw the video stream into our screen
//     ctx.drawImage(video, 0, 0);
//     // Call self again
//     requestAnimationFrame(drawVideo);
// }

//     // Set up variables to draw on the canvas
//     var canvas;
//     var ctx;
//     const fmesh = facemesh;
//     async function main() {
//       await fmesh();
//         // Set up front-facing camera
//         await setupCamera();
//         videoWidth = video.videoWidth;
//         videoHeight = video.videoHeight;
//         video.play()

//         // Set up the HTML Canvas to draw the video feed onto
//         canvas = document.getElementById('facecanvas');
//         canvas.width = videoWidth;
//         canvas.height = videoHeight;
//         ctx = canvas.getContext('2d');
      
//         // Start the video->canvas drawing loop
//         drawVideo();

      
//         runFacemesh();
//     }

//     var curFaces = [];
//     async function runFacemesh() {
//         // Call face Mesh on our video stream
//         const facepred = await fmesh.estimateFaces(video);
        
//         // If we find a face, export it to a global variable so we can access it elsewhere
//         if (facepred.length > 0) { 
//           curFaces = facepred;
//         }
//         // Call itself again
//         requestAnimationFrame(runFacemesh);
//     };

    
    async function initStream() {
      stream = await window.navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { exact: 256 },
            height: { exact: 144 },
          },
        })
        .catch(() => null);
  
      if (stream == null || video == null) {
        return;
      }
  
      video.srcObject = stream;
  
      video.addEventListener(
        'playing',
        () => {
          dispatch('ready', true);
  
          isReady = true;
  
          initCounter();
  
          body.setAttribute('camera', '');
        },
        { once: true },
      );
    }
  
    function padNumber(n) {
      return n < 10 ? `0${n}` : n;
    }
  
    function initCounter() {
      counterRequest = raf(function loop(ts) {
        if (startTime == null) {
          startTime = ts;
        }
  
        elapsedTime = ts - startTime;
  
        counterRequest = raf(loop);
      });
    }
    
    // Fake Recorder timer
    $: {
      // @ts-ignore
      const milliseconds = parseInt((elapsedTime % 1000) / 100);
      const seconds = padNumber(Math.floor((elapsedTime / 1000) % 60));
      const minutes = padNumber(Math.floor((elapsedTime / (1000 * 60)) % 60));
      const hours = padNumber(Math.floor((elapsedTime / (1000 * 60 * 60)) % 24));
  
      formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    } 
  
    onMount(() => {
      initStream();
  
      return () => {
        body.removeAttribute('camera');
        cancelAnimationFrame(counterRequest);
  
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    });
    // main();
    // runFacemesh();
  </script>
  
  <style lang="postcss">
    video {
      transform: scaleX(-1);
    }
  
    .rec-wrapper {
      position: absolute;
      z-index: calc(var(--layer-tv-effects) + 1);
      bottom: var(--gui-bottom);
      right: var(--gui-side);
      filter: blur(1px);
  
      @nest :global(body:not([camera])) & {
        display: none;
      }
    }
  
    .rec {
      display: flex;
      align-items: center;
      justify-content: flex-end;
  
      & span {
        content: '';
        display: inline-block;
        width: 0.6em;
        height: 0.6em;
        margin-left: 0.5em;
        border-radius: 50%;
        background-color: #f00;
        box-shadow: 3px 0 0 var(--glitchy-blue), -3px 0 0 var(--glitchy-red);
        animation: blink 1.4s step-end infinite;
      }
    }
  </style>
  
  <!-- svelte-ignore a11y-media-has-caption -->
  <div
    class:visually-hidden={!isReady || $loadingChannel === LOADING_STATE.Loading}>
    <video bind:this={video} class="tv-video" channel="camera" autoplay />
    <canvas id="facecanvas"></canvas>  
    <div class="rec-wrapper big-text glitchy-text">
      <div class="rec">REC <span /></div>
      <div class="counter">{formattedTime}</div>
    </div>
  </div>
  