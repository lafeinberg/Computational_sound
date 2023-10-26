const playBB = document.getElementById('babbling_brook');
var audioCtx;

playBB.addEventListener('click', function () {
  if (!audioCtx) {
    brook();
    return;
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (audioCtx.state === 'running') {
    audioCtx.suspend();
  }

}, false);

const playFire = document.getElementById('fire');
var audioCtx2;

playFire.addEventListener('click', function () {
  if (!audioCtx2) {
    fire();
    return;
  }
  if (audioCtx2.state === 'suspended') {
    audioCtx2.resume();
  }
  if (audioCtx2.state === 'running') {
    audioCtx2.suspend();
  }
}, false);


// Collaborated with Elifia Muthia, Elvina Wibisono, and Pru Yontrarak
function fire(){ 

  // HISSING
  audioCtx2 = new AudioContext()

  // white noise
  var bufferSize = 10 * audioCtx2.sampleRate,
  noiseBuffer = audioCtx2.createBuffer(1, bufferSize, audioCtx2.sampleRate),
  output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * 0.5;
  }
  whiteNoise = audioCtx2.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  whiteNoise.start(0);

  //white noise 2
  var noiseBuffer2 = audioCtx2.createBuffer(1, bufferSize, audioCtx2.sampleRate),
  output2 = noiseBuffer2.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output2[i] = (Math.random() * 2 - 1) * 0.5;
  }
  whiteNoise2 = audioCtx2.createBufferSource();
  whiteNoise2.buffer = noiseBuffer2;
  whiteNoise2.loop = true;
  whiteNoise2.start(0);

  const gainNode = audioCtx2.createGain();
  const gainForHiss = audioCtx2.createGain();
  const masterHissGain = audioCtx2.createGain();
  masterHissGain.gain.value = 0.0025

  const sinOsc = audioCtx2.createOscillator();
  sinOsc.type = "sine"; 
  sinOsc.frequency.value = 0.2;
  const sawOsc = audioCtx2.createOscillator()
  sawOsc.type = "sawtooth"
  sawOsc.frequency.value = 0.7
  sawOsc.start()
  sinOsc.start()
  sawOsc.connect(gainNode.gain);
  sinOsc.connect(gainNode)

  var lop = audioCtx2.createBiquadFilter();
  lop.type = 'lowpass';
  lop.frequency.value = 1;

  var hip = audioCtx2.createBiquadFilter();
  hip.type = 'highpass';
  hip.frequency.value = 1000;

  whiteNoise.connect(hip).connect(gainForHiss);
  whiteNoise2.connect(lop).connect(gainForHiss);
  gainNode.connect(gainForHiss.gain)
  gainForHiss.connect(masterHissGain).connect(audioCtx2.destination)



  //Lapping
  const bpFLAME = audioCtx2.createBiquadFilter()
  bpFLAME.type = "bandpass"
  const hpFLAME = audioCtx2.createBiquadFilter()
  hpFLAME.type = 'highpass';
  const hp2FLAME = audioCtx2.createBiquadFilter()
  hp2FLAME.type = 'highpass';
  bpFLAME.frequency.value = 50
  bpFLAME.Q.value = 15
  hpFLAME.frequency.value = 40

  const curveFLAME = audioCtx2.createWaveShaper();
  var distortion = new Float32Array(2);
  distortion[0] = -0.5;
  distortion[1] = 0.0;
  curveFLAME.curve = distortion;
  hp2FLAME.frequency.value = 10
  const gainFLAME = audioCtx2.createGain();
  gainFLAME.gain.value = 100;

  whiteNoise.connect(bpFLAME).connect(hpFLAME).connect(curveFLAME).connect(hp2FLAME).connect(gainFLAME).connect(audioCtx2.destination)





  //Crackling
  let interval = 100; // Initial interval set to 2 seconds (2000 milliseconds)
  let intervalId;


  intervalId = setInterval(createCrack, interval);
  setTimeout(() => {
    clearInterval(intervalId);

    interval = interval + 1000; // Set new interval to 5 seconds (5000 milliseconds)
    console.log(interval)
    intervalId = setInterval(createCrack, interval)

  }, 100)

  let intervalId2;
  var interval2 = 1000
  intervalId2 = setInterval(createCrack, interval2);
  setTimeout(() => {
    clearInterval(intervalId2);
    interval2 = interval2 + 1000; // Set new interval to 5 seconds (5000 milliseconds)
    console.log(interval2)
    intervalId2 = setInterval(createCrack, interval2)
  }, 1000)

  let intervalId4;
  var interval1 = 500
  intervalId4 = setInterval(createSmallCrack, interval1);
  setTimeout(() => {
    clearInterval(intervalId4);
    //interval = interval + 1000; // Set new interval to 5 seconds (5000 milliseconds)
    console.log(interval1)
    intervalId4 = setInterval(createSmallCrack, interval1)
  }, 1000)

  let intervalId5;
  var interval6 = 350
  intervalId5 = setInterval(createSmallCrack, interval6);
  setTimeout(() => {
    clearInterval(intervalId5);
    //interval = interval + 1000; // Set new interval to 5 seconds (5000 milliseconds)
    intervalId5 = setInterval(createSmallCrack, interval6)
  }, 1000)

  let intervalId6;
  var interval7 = 250
  intervalId6 = setInterval(createSmallCrack, interval7);
  setTimeout(() => {
    clearInterval(intervalId6);
    //interval = interval + 1000; // Set new interval to 5 seconds (5000 milliseconds)
    intervalId5 = setInterval(createSmallCrack, interval7)
  }, 1000)
}

function createCrack(){ 
  
  const duration = 0.05; 
  const sampleRate = audioCtx2.sampleRate;
  const numFrames = duration * sampleRate;
  const buffer = audioCtx2.createBuffer(1, numFrames, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numFrames; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / numFrames * 10);
  }
  const gainNode = audioCtx2.createGain();
  gainNode.gain.setValueAtTime(Math.random() * 0.5, audioCtx2.currentTime);

  const bufferSource = audioCtx2.createBufferSource();
  bufferSource.buffer = buffer;

  //CONNECTIONS
  bufferSource.connect(gainNode);
  gainNode.connect(audioCtx2.destination);

  bufferSource.start();
  bufferSource.stop(audioCtx2.currentTime+ 1);
}

function createSmallCrack(){

  const duration = 0.05;
  const sampleRate = audioCtx2.sampleRate;
  const numFrames = duration * sampleRate;
  const buffer = audioCtx2.createBuffer(1, numFrames, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < numFrames; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / numFrames * 10);
  }

  const gainNode = audioCtx2.createGain();
  gainNode.gain.setValueAtTime(Math.random() * 0.025, audioCtx2.currentTime);
  const bufferSource = audioCtx2.createBufferSource();
  bufferSource.buffer = buffer;

  bufferSource.connect(gainNode);
  gainNode.connect(audioCtx2.destination);

  bufferSource.start();
  bufferSource.stop(audioCtx2.currentTime+ 1);
}




function brook(){ // Collaborated with Elifia Muthia, Elvina Wibisono, and Pru Yontrarak
    //this first part I worked with Gabrielle D'Agostino and Chang Su Nam
    audioCtx = new AudioContext()

    //brown noise
    var bufferSize = 10 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    // Brown noise creates the whooshing soiunds
    

    const globalGain = audioCtx.createGain();
    globalGain.gain.value = 0.1;

    const freqGain = audioCtx.createGain();
    freqGain.gain.value = 1200; //adds bubblings

    const lp1 = audioCtx.createBiquadFilter()
    lp1.type = 'lowpass'
    lp1.frequency.setValueAtTime(500, audioCtx.currentTime);
    lp1.gain.setValueAtTime(0, audioCtx.currentTime);

    const lp2 = audioCtx.createBiquadFilter()
    lp2.type = 'lowpass'
    lp2.frequency.value = 14;

    const hp = audioCtx.createBiquadFilter()
    hp.type = 'highpass'
    hp.Q.value = 1/0.025; // This is the fluctuating sound


    const constantSourceNode = new ConstantSourceNode(audioCtx, {offset: .120})
    constantSourceNode.connect(lp2)
    constantSourceNode.connect(lp1.frequency)
    constantSourceNode.connect(hp.frequency)
    constantSourceNode.start()
  
    brownNoise.connect(lp1).connect(hp)
    brownNoise.connect(lp2).connect(freqGain)
    freqGain.connect(hp.frequency)
    hp.connect(globalGain).connect(audioCtx.destination);
}