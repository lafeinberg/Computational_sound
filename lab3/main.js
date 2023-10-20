const playBB = document.getElementById('babbling_brook');
var audioCtx;

playBB.addEventListener('click', function () {
  if (!audioCtx) {
    console.log("HERE")
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

function brook(){
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


function wind(){
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
  
  const biquadFilter = audioCtx.createBiquadFilter()
  const freq = audioCtx.createBiquadFilter()
  const brook = audioCtx.createBiquadFilter()

  const globalGain = audioCtx.createGain();
  globalGain.gain.value = 0.1;

  const freqGain = audioCtx.createGain();
  freqGain.gain.value = 900; //adds bubblings


  biquadFilter.type = 'lowpass'
  biquadFilter.frequency.setValueAtTime(500, audioCtx.currentTime);
  biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);


  // lpfB.frequency.setValueAtTime(14, audioCtx.currentTime);
  // lpfB.gain.value = 400;
  // const constantSource = audioCtx.createConstantSource();
  // constantSource.offset.value = 500
  // constantSource.connect(lpfB)
  // constantSource.start();
  // brownNoise.connect(lpfB)


  
  freq.type = 'lowpass'
  freq.frequency.value = 14;
  const helper = new ConstantSourceNode(audioCtx, {offset: 1})
  helper.connect(freq)
  helper.start()
  
  brook.type = 'highpass'
  brook.Q.value = 1/0.025; // This is the fluctuating sound
  
  // globalGain.gain.setValueAtTime(0,audioCtx.currentTime)
  
  // helper.connect(brook.gain)
  // helper.connect(freqGain)
  // helper.connect(globalGain)

  helper.connect(globalGain.gain)
  
  //helper.start()

  //brownNoise.connect(globalGain).connect(audioCtx.destination);
  brownNoise.connect(biquadFilter).connect(brook)
  brownNoise.connect(freq).connect(freqGain)
  freqGain.connect(brook.frequency)
  //helper.connect(brook.frequency)
  brook.connect(globalGain).connect(audioCtx.destination);

}



function popcorn(){
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
  
  const biquadFilter = audioCtx.createBiquadFilter()
  const freq = audioCtx.createBiquadFilter()
  const brook = audioCtx.createBiquadFilter()

  const globalGain = audioCtx.createGain();
  globalGain.gain.value = 0.1;

  const freqGain = audioCtx.createGain();
  freqGain.gain.value = 900; //adds bubblings


  biquadFilter.type = 'lowpass'
  biquadFilter.frequency.setValueAtTime(500, audioCtx.currentTime);
  biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
  
  freq.type = 'lowpass'
  freq.frequency.value = 500;
  const helper = new ConstantSourceNode(audioCtx, {offset: 500})
  
  brook.type = 'highpass'
  brook.Q.value = 1/0.025; // This is the fluctuating sound
  
  
  brownNoise.connect(biquadFilter).connect(brook)
  brownNoise.connect(freq).connect(freqGain)
  freqGain.connect(brook.frequency)
  helper.connect(brook.frequency)
  brook.connect(globalGain).connect(audioCtx.destination);

}













 
function waterfall(){
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
  
  const biquadFilter = audioCtx.createBiquadFilter()
  const freq = audioCtx.createBiquadFilter()
  const brook = audioCtx.createBiquadFilter()

  const globalGain = audioCtx.createGain();
  globalGain.gain.value = 0.1;

  const freqGain = audioCtx.createGain();
  freqGain.gain.value = 450;

  biquadFilter.type = 'lowpass'
  biquadFilter.frequency.setValueAtTime(700, audioCtx.currentTime);
  biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
  
  freq.type = 'lowpass'
  freq.frequency.value = 14;
  const helper = new ConstantSourceNode(audioCtx, {offset: 500})
  
  brook.type = 'highpass'
  brook.Q.value = 1/0.025; // This is the fluctuating sound

  
  brownNoise.connect(biquadFilter).connect(brook)
  brownNoise.connect(freq).connect(freqGain)
  freqGain.connect(brook.frequency)
  helper.connect(brook.frequency)
  brook.connect(globalGain).connect(audioCtx.destination);
}