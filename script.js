const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const replayButton = document.getElementById("replay");

let width;
let height;
let DPR;

let startTime = performance.now();

const BLOOM_DURATION = 7500;


/* ==========================================================
   RANDOM
========================================================== */

function random(min, max) {

  return Math.random() * (max - min) + min;

}


/* ==========================================================
   RESIZE
========================================================== */

function resizeCanvas() {

  DPR = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * DPR;
  canvas.height = height * DPR;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(
    DPR,
    0,
    0,
    DPR,
    0,
    0
  );

}

window.addEventListener(
  "resize",
  resizeCanvas
);

resizeCanvas();


/* ==========================================================
   HELPER
========================================================== */

function clamp(
  value,
  min = 0,
  max = 1
) {

  return Math.min(
    max,
    Math.max(min, value)
  );

}


function smoothstep(t) {

  t = clamp(t);

  return (
    t * t *
    (3 - 2 * t)
  );

}


function easeOutCubic(t) {

  return (
    1 -
    Math.pow(
      1 - t,
      3
    )
  );

}


function easeOutBack(t) {

  const c1 = 1.70158;
  const c3 = c1 + 1;

  return (
    1 +
    c3 *
    Math.pow(
      t - 1,
      3
    ) +

    c1 *
    Math.pow(
      t - 1,
      2
    )
  );

}


/* ==========================================================
   PARTICLES
========================================================== */

const particles = [];

function createParticles() {

  particles.length = 0;

  const amount = 70;

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    particles.push({

      x: Math.random(),

      y: Math.random(),

      size:
        random(
          0.6,
          2.4
        ),

      speed:
        random(
          0.05,
          0.18
        ),

      opacity:
        random(
          0.05,
          0.35
        ),

      phase:
        random(
          0,
          Math.PI * 2
        )

    });

  }

}

createParticles();


function drawParticles(time) {

  ctx.save();

  for (
    let i = 0;
    i < particles.length;
    i++
  ) {

    const p = particles[i];

    let y =
      (
        p.y -
        time * 0.00001 * p.speed
      ) % 1;

    if (y < 0) {
      y += 1;
    }

    const x =
      p.x * width +
      Math.sin(
        time * 0.0004 +
        p.phase
      ) * 12;

    const alpha =
      p.opacity *
      (
        0.55 +
        Math.sin(
          time * 0.001 +
          p.phase
        ) * 0.3
      );

    ctx.beginPath();

    ctx.arc(
      x,
      y * height,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(125,170,255,${alpha})`;

    ctx.shadowColor =
      "rgba(65,120,255,0.8)";

    ctx.shadowBlur = 8;

    ctx.fill();

  }

  ctx.restore();

}


/* ==========================================================
   BACKGROUND
========================================================== */

function drawBackground(time) {

  const background =
    ctx.createRadialGradient(

      width / 2,
      height * 0.47,
      0,

      width / 2,
      height * 0.47,
      Math.max(
        width,
        height
      ) * 0.8

    );


  background.addColorStop(
    0,
    "#071a31"
  );

  background.addColorStop(
    0.25,
    "#04101f"
  );

  background.addColorStop(
    0.6,
    "#01060d"
  );

  background.addColorStop(
    1,
    "#000102"
  );


  ctx.fillStyle =
    background;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  /* BLUE HALO */

  const pulse =
    0.92 +
    Math.sin(
      time * 0.0008
    ) * 0.08;


  const halo =
    ctx.createRadialGradient(

      width / 2,
      height * 0.48,

      0,

      width / 2,
      height * 0.48,

      Math.min(
        width,
        height
      ) * 0.42 * pulse

    );


  halo.addColorStop(
    0,
    "rgba(40,95,255,0.14)"
  );

  halo.addColorStop(
    0.4,
    "rgba(20,55,150,0.06)"
  );

  halo.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );


  ctx.fillStyle = halo;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  drawParticles(time);


  /* VIGNETTE */

  const vignette =
    ctx.createRadialGradient(

      width / 2,
      height / 2,

      height * 0.15,

      width / 2,
      height / 2,

      Math.max(
        width,
        height
      ) * 0.75

    );


  vignette.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );

  vignette.addColorStop(
    0.65,
    "rgba(0,0,0,0.1)"
  );

  vignette.addColorStop(
    1,
    "rgba(0,0,0,0.75)"
  );


  ctx.fillStyle =
    vignette;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

}


/* ==========================================================
   STEM
========================================================== */

function drawStem(
  x,
  flowerY,
  size,
  time
) {

  ctx.save();


  const sway =
    Math.sin(
      time * 0.0007
    ) * size * 0.015;


  const gradient =
    ctx.createLinearGradient(

      x - size * 0.04,
      0,

      x + size * 0.04,
      0

    );


  gradient.addColorStop(
    0,
    "#07170f"
  );

  gradient.addColorStop(
    0.32,
    "#16452d"
  );

  gradient.addColorStop(
    0.53,
    "#357858"
  );

  gradient.addColorStop(
    0.75,
    "#0e3221"
  );

  gradient.addColorStop(
    1,
    "#04100b"
  );


  ctx.lineCap = "round";

  ctx.lineWidth =
    Math.max(
      7,
      size * 0.035
    );


  ctx.strokeStyle =
    gradient;


  ctx.beginPath();

  ctx.moveTo(
    x + sway,
    flowerY + size * 0.19
  );


  ctx.bezierCurveTo(

    x - size * 0.035,

    flowerY +
    size * 0.85,

    x +
    size * 0.035,

    height * 0.78,

    x -
    size * 0.02,

    height + 50

  );


  ctx.stroke();

  ctx.restore();


  drawLeaf(

    x - size * 0.005,

    flowerY +
    size * 0.92,

    -2.65,

    size * 0.42,

    time

  );


  drawLeaf(

    x + size * 0.005,

    flowerY +
    size * 1.20,

    -0.48,

    size * 0.36,

    time

  );

}


/* ==========================================================
   LEAF
========================================================== */

function drawLeaf(
  x,
  y,
  angle,
  size,
  time
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  angle +=
    Math.sin(
      time * 0.0008 +
      y
    ) * 0.015;

  ctx.rotate(angle);


  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      size,
      0
    );


  gradient.addColorStop(
    0,
    "#06180f"
  );

  gradient.addColorStop(
    0.4,
    "#184b30"
  );

  gradient.addColorStop(
    0.75,
    "#296444"
  );

  gradient.addColorStop(
    1,
    "#071b11"
  );


  ctx.fillStyle =
    gradient;


  ctx.beginPath();


  ctx.moveTo(
    0,
    0
  );


  ctx.bezierCurveTo(

    size * 0.28,
    -size * 0.26,

    size * 0.72,
    -size * 0.25,

    size,
    0

  );


  ctx.bezierCurveTo(

    size * 0.70,
    size * 0.23,

    size * 0.30,
    size * 0.24,

    0,
    0

  );


  ctx.closePath();

  ctx.fill();


  /* LEAF EDGE */

  ctx.strokeStyle =
    "rgba(125,190,150,0.16)";

  ctx.lineWidth = 1;

  ctx.stroke();


  /* CENTER VEIN */

  ctx.beginPath();

  ctx.moveTo(
    0,
    0
  );

  ctx.quadraticCurveTo(

    size * 0.55,
    -size * 0.01,

    size * 0.92,
    0

  );

  ctx.strokeStyle =
    "rgba(145,210,170,0.2)";

  ctx.stroke();


  /* SMALL VEINS */

  for (
    let i = 0.2;
    i < 0.85;
    i += 0.16
  ) {

    ctx.beginPath();

    ctx.moveTo(
      size * i,
      0
    );


    ctx.lineTo(
      size * (i + 0.12),
      -size * 0.09 *
      (1 - i)
    );


    ctx.strokeStyle =
      "rgba(120,185,145,0.10)";

    ctx.stroke();

  }


  ctx.restore();

}


/* ==========================================================
   SEPAL
========================================================== */

function drawSepals(
  x,
  y,
  size,
  bloom
) {

  const count = 5;


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      i / count *
      Math.PI * 2;


    ctx.save();


    ctx.translate(
      x,
      y + size * 0.13
    );


    ctx.rotate(
      angle +
      Math.PI / 2
    );


    const opening =
      0.35 +
      bloom * 0.65;


    const gradient =
      ctx.createLinearGradient(

        0,
        0,

        0,
        -size * 0.32

      );


    gradient.addColorStop(
      0,
      "#0d2518"
    );

    gradient.addColorStop(
      1,
      "#39714b"
    );


    ctx.fillStyle =
      gradient;


    ctx.beginPath();


    ctx.moveTo(
      -size * 0.055,
      size * 0.04
    );


    ctx.quadraticCurveTo(

      -size * 0.045,

      -size *
      0.19 *
      opening,

      0,

      -size *
      0.35 *
      opening

    );


    ctx.quadraticCurveTo(

      size * 0.045,

      -size *
      0.18 *
      opening,

      size * 0.055,

      size * 0.04

    );


    ctx.closePath();

    ctx.fill();


    ctx.restore();

  }

}


/* ==========================================================
   ROSE PETAL
========================================================== */

function drawRosePetal(
  x,
  y,
  rotation,
  widthPetal,
  heightPetal,
  open,
  depth,
  wave
) {

  ctx.save();


  ctx.translate(
    x,
    y
  );


  ctx.rotate(
    rotation +
    wave
  );


  /*
     Kelopak dibuat sedikit miring.
     Ini penting agar bunga tidak terlihat
     terlalu geometris.
  */

  ctx.scale(
    0.78 + open * 0.22,
    1
  );


  /* SHADOW */

  ctx.shadowColor =
    "rgba(0,15,65,0.65)";

  ctx.shadowBlur =
    8 + depth * 4;


  const gradient =
    ctx.createLinearGradient(

      -widthPetal * 0.4,
      heightPetal * 0.3,

      widthPetal * 0.25,
      -heightPetal

    );


  /*
     Setiap kelopak mempunyai beberapa
     gradasi sehingga terlihat berdimensi.
  */

  gradient.addColorStop(
    0,
    "#020a21"
  );

  gradient.addColorStop(
    0.18,
    "#071849"
  );

  gradient.addColorStop(
    0.43,
    "#0a3192"
  );

  gradient.addColorStop(
    0.70,
    "#1555d3"
  );

  gradient.addColorStop(
    0.9,
    "#377eff"
  );

  gradient.addColorStop(
    1,
    "#82aeff"
  );


  ctx.fillStyle =
    gradient;


  /* ROSE PETAL SHAPE */

  ctx.beginPath();


  ctx.moveTo(
    0,
    heightPetal * 0.30
  );


  /*
     sisi kiri kelopak
  */

  ctx.bezierCurveTo(

    -widthPetal * 0.60,
    heightPetal * 0.13,

    -widthPetal * 0.66,
    -heightPetal * 0.45,

    -widthPetal * 0.11,
    -heightPetal * 0.96

  );


  /*
     ujung kelopak dibuat sedikit
     tidak simetris
  */

  ctx.quadraticCurveTo(

    widthPetal * 0.03,
    -heightPetal * 1.10,

    widthPetal * 0.16,
    -heightPetal * 0.95

  );


  /*
     sisi kanan
  */

  ctx.bezierCurveTo(

    widthPetal * 0.70,
    -heightPetal * 0.46,

    widthPetal * 0.57,
    heightPetal * 0.15,

    0,
    heightPetal * 0.30

  );


  ctx.closePath();

  ctx.fill();


  ctx.shadowBlur = 0;


  /* PETAL EDGE */

  ctx.strokeStyle =
    `rgba(
            155,
            196,
            255,
            ${0.12 + open * 0.24}
        )`;


  ctx.lineWidth =
    0.6;


  ctx.stroke();


  /* PETAL HIGHLIGHT */

  ctx.beginPath();


  ctx.moveTo(

    -widthPetal * 0.05,

    heightPetal * 0.08

  );


  ctx.bezierCurveTo(

    -widthPetal * 0.20,

    -heightPetal * 0.25,

    -widthPetal * 0.14,

    -heightPetal * 0.56,

    -widthPetal * 0.06,

    -heightPetal * 0.79

  );


  ctx.strokeStyle =
    `rgba(
            190,
            218,
            255,
            ${0.05 + open * 0.10}
        )`;


  ctx.lineWidth =
    0.8;


  ctx.stroke();


  ctx.restore();

}


/* ==========================================================
   ROSE
========================================================== */

function drawRose(
  cx,
  cy,
  size,
  progress,
  time
) {

  const bloom =
    smoothstep(progress);


  const sway =
    Math.sin(
      time * 0.00065
    ) *
    size *
    0.012;


  cx += sway;


  drawSepals(
    cx,
    cy,
    size,
    bloom
  );


  /*
     Kelopak dibuat dari luar menuju tengah.

     Perhatikan jumlah kelopak tidak sama
     setiap layer agar tidak terlihat
     seperti bunga geometris.
  */

  const layers = [

    {
      count: 9,
      radius: 0.40,
      width: 0.38,
      height: 0.39,
      start: 0.08,
      random: 0.08
    },

    {
      count: 8,
      radius: 0.31,
      width: 0.32,
      height: 0.39,
      start: 0.17,
      random: 0.12
    },

    {
      count: 7,
      radius: 0.235,
      width: 0.28,
      height: 0.37,
      start: 0.28,
      random: 0.13
    },

    {
      count: 6,
      radius: 0.17,
      width: 0.23,
      height: 0.33,
      start: 0.39,
      random: 0.15
    },

    {
      count: 5,
      radius: 0.105,
      width: 0.19,
      height: 0.28,
      start: 0.48,
      random: 0.16
    }

  ];


  /*
     Golden angle membantu menghasilkan
     susunan seperti spiral alami.
  */

  const goldenAngle =
    Math.PI *
    (
      3 -
      Math.sqrt(5)
    );


  layers.forEach(

    (
      layer,
      layerIndex
    ) => {

      let localProgress =
        clamp(
          (
            progress -
            layer.start
          ) /
          (
            1 -
            layer.start
          )
        );


      localProgress =
        easeOutCubic(
          localProgress
        );


      for (
        let i = 0;
        i < layer.count;
        i++
      ) {


        /*
           Jangan pakai pembagian sudut
           sempurna.

           Golden angle menghasilkan
           tampilan mawar lebih alami.
        */

        const angle =
          i *
          goldenAngle +

          layerIndex *
          0.65;


        /*
           sedikit perbedaan antar kelopak
        */

        const variation =
          Math.sin(
            i * 12.9898 +
            layerIndex * 78.233
          );


        const open =
          clamp(
            localProgress +
            variation * 0.035
          );


        /*
           Saat kuncup radius hampir 0.
           Ketika mekar radius melebar.
        */

        const closedRadius =
          size * 0.018;


        const openedRadius =
          size *
          layer.radius;


        const radius =
          closedRadius +
          (
            openedRadius -
            closedRadius
          ) *
          open;


        /*
           Horizontal spread

           dibuat sedikit berbeda dari
           vertikal agar bunga terlihat
           dalam perspektif.
        */

        const px =
          cx +
          Math.cos(angle) *
          radius;


        const py =
          cy +
          Math.sin(angle) *
          radius *
          0.66;


        let petalW =
          size *
          (
            0.075 +
            layer.width *
            open
          );


        let petalH =
          size *
          layer.height *
          (
            1.08 -
            open * 0.13
          );


        /*
           Kelopak bawah sedikit lebih
           besar.
        */

        if (
          Math.sin(angle) >
          0.25
        ) {

          petalW *= 1.08;

          petalH *= 1.04;

        }


        const wave =
          Math.sin(

            time *
            0.001 +

            i *
            1.7 +

            layerIndex

          ) *
          0.009;


        drawRosePetal(

          px,
          py,

          angle +
          Math.PI / 2,

          petalW,
          petalH,

          open,

          layerIndex,

          wave

        );

      }

    }

  );


  drawRoseCenter(
    cx,
    cy,
    size,
    progress,
    time
  );


  drawDew(
    cx,
    cy,
    size,
    progress
  );

}


/* ==========================================================
   ROSE CENTER
========================================================== */

function drawRoseCenter(
  cx,
  cy,
  size,
  progress,
  time
) {

  let centerProgress =
    clamp(
      (
        progress -
        0.34
      ) /
      0.66
    );


  centerProgress =
    smoothstep(
      centerProgress
    );


  const goldenAngle =
    Math.PI *
    (
      3 -
      Math.sqrt(5)
    );


  /*
     Bagian tengah mawar harus padat,
     bukan lubang seperti bunga matahari.
  */

  for (
    let i = 28;
    i >= 0;
    i--
  ) {

    const normal =
      i / 28;


    const angle =
      i *
      goldenAngle +
      0.8;


    const radius =
      size *
      (
        0.012 +
        normal *
        0.11 *
        centerProgress
      );


    const x =
      cx +
      Math.cos(angle) *
      radius;


    const y =
      cy +
      Math.sin(angle) *
      radius *
      0.58;


    const widthPetal =
      size *
      (
        0.065 +
        normal * 0.055
      );


    const heightPetal =
      size *
      (
        0.12 +
        normal * 0.09
      );


    const wave =
      Math.sin(
        time *
        0.001 +
        i
      ) *
      0.004;


    drawRosePetal(

      x,
      y,

      angle +
      Math.PI / 2,

      widthPetal,

      heightPetal,

      0.48 +
      centerProgress * 0.52,

      5,

      wave

    );

  }

}


/* ==========================================================
   DEW
========================================================== */

function drawDew(
  cx,
  cy,
  size,
  progress
) {

  if (
    progress <
    0.78
  ) {
    return;
  }


  const alpha =
    clamp(
      (
        progress -
        0.78
      ) /
      0.22
    );


  const drops = [

    [
      -0.35,
      -0.11,
      0.018
    ],

    [
      0.32,
      -0.12,
      0.014
    ],

    [
      -0.15,
      -0.39,
      0.012
    ],

    [
      0.20,
      -0.29,
      0.010
    ],

    [
      0.41,
      0.02,
      0.011
    ]

  ];


  for (
    const drop of drops
  ) {

    const x =
      cx +
      drop[0] * size;


    const y =
      cy +
      drop[1] * size;


    const radius =
      drop[2] * size;


    const gradient =
      ctx.createRadialGradient(

        x -
        radius * 0.3,

        y -
        radius * 0.4,

        radius * 0.05,

        x,
        y,

        radius

      );


    gradient.addColorStop(

      0,

      `rgba(
                255,
                255,
                255,
                ${0.95 * alpha}
            )`

    );


    gradient.addColorStop(

      0.24,

      `rgba(
                170,
                215,
                255,
                ${0.58 * alpha}
            )`

    );


    gradient.addColorStop(

      0.65,

      `rgba(
                65,
                130,
                220,
                ${0.20 * alpha}
            )`

    );


    gradient.addColorStop(

      1,

      "rgba(0,0,0,0)"

    );


    ctx.beginPath();


    ctx.arc(

      x,
      y,
      radius,

      0,
      Math.PI * 2

    );


    ctx.fillStyle =
      gradient;


    ctx.fill();

  }

}


/* ==========================================================
   FLOWER GLOW
========================================================== */

function flowerGlow(
  x,
  y,
  size,
  progress
) {

  const alpha =
    0.06 +
    progress *
    0.09;


  const gradient =
    ctx.createRadialGradient(

      x,
      y,

      size * 0.10,

      x,
      y,

      size * 0.9

    );


  gradient.addColorStop(

    0,

    `rgba(
            65,
            120,
            255,
            ${alpha}
        )`

  );


  gradient.addColorStop(

    0.45,

    `rgba(
            25,
            75,
            200,
            ${alpha * 0.4}
        )`

  );


  gradient.addColorStop(

    1,

    "rgba(0,0,0,0)"

  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(

    x - size,

    y - size,

    size * 2,

    size * 2

  );

}


/* ==========================================================
   ANIMATION
========================================================== */

function animate(time) {

  /*
     Clear
  */

  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  drawBackground(time);


  const elapsed =
    time -
    startTime;


  const progress =
    clamp(
      elapsed /
      BLOOM_DURATION
    );


  /*
     Dibuat lebih besar daripada versi lama.
  */

  const size =
    Math.min(
      width,
      height
    ) * 0.34;


  /*
     posisi bunga
  */

  const centerX =
    width / 2;


  const centerY =
    height * 0.49;


  flowerGlow(

    centerX,
    centerY,

    size,

    progress

  );


  drawStem(

    centerX,
    centerY,

    size,
    time

  );


  drawRose(

    centerX,
    centerY,

    size,

    progress,

    time

  );


  requestAnimationFrame(
    animate
  );

}


requestAnimationFrame(
  animate
);


/* ==========================================================
   REPLAY BUTTON
========================================================== */

replayButton.addEventListener(
  "click",
  () => {

    startTime =
      performance.now();

  }
);