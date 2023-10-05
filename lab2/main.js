// Keep track of all of the current/active
//ALL
var activeOsc = {} //for carrier freq or 'fundamental' freq in additive synthesis

//ADD/FM
var activeGains = {}


var modFreqVal = 100;
var indexVal = 100;
var mode = "add";
var lfo = false;
var lfoButton;
var currentNumPartials = 0;
var lfoFreq = 0;

document.addEventListener("DOMContentLoaded", function (event) {

    var synthType = document.getElementById("synth_mode").synth
    //Specific to synth type
    var additiveContent = document.getElementById("additiveContent")
    var FMContent = document.getElementById("FMContent")
    var AMFMContent = document.getElementById("AMFMContent")
    //lfo specifc
    lfoButton = document.getElementById("lfo")
    lfoSlider = document.getElementById("lfoSlider")


    for (var i = 0; i < synthType.length; i++) {
        synthType[i].onclick = function () {
            mode = this.value;
            if (mode === 'add') { 
                additiveContent.style.display = 'block';
                FMContent.style.display = 'none';
                AMFMContent.style.display = 'none';
            }
            else if (mode === 'am') {
                additiveContent.style.display = 'none';
                FMContent.style.display = 'none';
                AMFMContent.style.display = 'block';
            }
            else {
                additiveContent.style.display = 'none';
                FMContent.style.display = 'block';
                AMFMContent.style.display = 'block';

            }
        }
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //COPY AND PASTE MINE INTO HERE
    //LUCI
    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);
    var compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOsc[key]) {
            if (mode === 'add') {
                initiateAdditive(key);
            }
            else if (mode === 'am') {
                initiateAM(key);
            }

            else if (mode === 'fm') {
                initiateFM(key);
            }
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOsc[key]) {
            releaseStep(key);

        }
    }

    function releaseStep(key) {
        //const releaseTime = audioCtx.currentTime + 0.1;

        activeGains[key].forEach(function (currGain) {
            currGain.gain.cancelScheduledValues(audioCtx.currentTime);
            currGain.gain.setValueAtTime(currGain.gain.value, audioCtx.currentTime);
            currGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.025);
        });
        setTimeout(function () {

            //STOP ALL THE GAINS
            for (let i = 0; i < activeGains[key].length; i++) {
                activeGains[key][i].gain.value = 0;
            }

            //STOP ALL THE OSCILLARTORS
            for (let i = 0; i < activeOsc[key].length; i++) {
                activeOsc[key][i].stop();
            }
            delete activeGains[key];
            delete activeOsc[key];
        }, 50);
    }


    function initiateAdditive(key) {
        currOscs = []

        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)

        //here is the main gain 
        const globalGain = audioCtx.createGain();
        //Do we need this?
        //osc.connect(globalGain).connect(compressor).connect(audioCtx.destination);
        globalGain.gain.setValueAtTime(0, audioCtx.currentTime)

        globalGain.connect(audioCtx.destination);
        globalGain.gain.setTargetAtTime(0.3, audioCtx.currentTime, 0.015);

        var currFrequency = keyboardFrequencyMap[key];

        osc.frequency.value = currFrequency
        osc.start()
        osc.connect(globalGain)

        currOscs.push(osc);


        for (i = 0; i < currentNumPartials; i += 1) {
            if (i % 2  === 0) {
                currFrequency = (currFrequency * (i + 1)) + Math.random() * 15
            }
            else {
                currFrequency = (currFrequency * (i + 1)) - Math.random() * 15
            }
            //LUCI
            //freq = freq * 2.01
            var newOsc = audioCtx.createOscillator()
            newOsc.frequency.value = currFrequency;

            newOsc.connect(globalGain)
            newOsc.start()
            currOscs.push(newOsc)
        }

        activeOsc[key] = currOscs
        activeGains[key] = [globalGain]

        if (lfo === true) {
            console.log("Inside lfo");
            var lfoOsc = audioCtx.createOscillator();
            lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
            lfoOsc.connect(globalGain).connect(osc.frequency);
            activeOsc[key].push(lfoOsc);
            lfoOsc.start()
        }

        var currGainLength = activeGains[key].length 
        Object.keys(activeGains).forEach((key) => {
            for (var i = 0; i < currGainLength; i++) {
                activeGains[key][i].gain.setTargetAtTime(0.5 / (Object.keys(activeGains).length + (currOscs.length * Object.keys(activeGains).length)), audioCtx.currentTime, 0.2)
            }
        })

    }



    function initiateAM(key) {
        var carrier = audioCtx.createOscillator();
        carrier.frequency.value = keyboardFrequencyMap[key];

        var modFrequency = audioCtx.createOscillator();
        modFrequency.frequency.value = modFreqVal;


        const modulated = audioCtx.createGain();
        const depth = audioCtx.createGain();

        depth.gain.value = 0.5 //scale modulator output to [-0.5, 0.5]
        modulated.gain.value = 1.0 - depth.gain.value; //modulated signal now has output gain at [0,1]

        modFrequency.connect(depth).connect(modulated.gain);
        carrier.connect(modulated);
        modulated.connect(compressor).connect(audioCtx.destination);

        modulated.gain.value = 0;

        carrier.start()
        modFrequency.start()

        activeOsc[key] = [carrier, modFrequency]
        activeGains[key] = [modulated, depth]

        if (lfo === true) {
            var lfoOsc = audioCtx.createOscillator();
            lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
            lfoOsc.connect(modulated).connect(modFrequency.frequency);
            activeOsc[key].push(lfoOsc);
            lfoOsc.start()
        }

        Object.keys(activeGains).forEach((key) => {
            for (var i = 0; i < activeGains[key].length; i++) {
                activeGains[key][i].gain.setTargetAtTime(0.5 / (Object.keys(activeGains).length + (activeOsc[key].length * Object.keys(activeGains).length)), audioCtx.currentTime, 0.2)
            }
        })

    }



    function initiateFM(key) {

        var carrier = audioCtx.createOscillator();
        carrier.frequency.value = keyboardFrequencyMap[key];

        var modFrequency = audioCtx.createOscillator();

        const modulationIndex = audioCtx.createGain();
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)

        modulationIndex.gain.value = indexVal;
        modFrequency.frequency.value = modFreqVal;

        modFrequency.connect(modulationIndex);
        modulationIndex.connect(carrier.frequency)

        carrier.connect(gainNode).connect(compressor).connect(audioCtx.destination);

        carrier.start()
        modFrequency.start()

        //setLFO(gainNode);

        activeOsc[key] = [carrier, modFrequency]
        activeGains[key] = [modulationIndex, gainNode]

        if (lfo === true) {
            var lfoOsc = audioCtx.createOscillator();
            var lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 8;
            lfoOsc.frequency.setValueAtTime(lfoFreq, audioCtx.currentTime)
            lfoOsc.connect(lfoGain).connect(modFrequency.frequency);
            activeOsc[key].push(lfoOsc);
            activeGains[key].push(lfoGain);
            lfoOsc.start();
        }

    }

});



function updateModFreq(val) {
    modFreqVal = val
};

function updateIndex(val) {
    indexVal = val
};

function changeLFO() {
    lfoContent = document.getElementById("lfoContent")
    if (lfo === true) {
        lfo = false;
        lfoButton.style.backgroundColor = "#FF0000";
        lfoButton.textContent = "OFF";
        lfoContent.style.display = 'none';
    }
    else {
        lfo = true;
        lfoButton.style.backgroundColor = "#b4e0b4"
        lfoButton.textContent = "ON";
        lfoContent.style.display = 'block';
    }
}
function updateLFO(val) {
    lfoFreq = val;
}

function changePartials() {
    currentNumPartials = document.getElementById("partials").value
}

