var audioCtx;
var osc;
var timings;
var liveCodeState = [];
const playButton = document.querySelector('button');

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    osc = audioCtx.createOscillator();
    timings = audioCtx.createGain();
    timings.gain.value = 0;
    osc.connect(timings).connect(audioCtx.destination);
    osc.start();
    scheduleAudio()
}

function scheduleAudio() {
    let timeElapsedSecs = 0;
    liveCodeState.forEach(noteData => {
        timings.gain.setTargetAtTime(1, audioCtx.currentTime + timeElapsedSecs, 0.01)
        osc.frequency.setTargetAtTime(noteData["pitch"], audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += noteData["length"]/10.0;
        timings.gain.setTargetAtTime(0, audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += 0.2; //rest between notes
    });
    setTimeout(scheduleAudio, timeElapsedSecs * 1000);
}

function parseCode(code) {
    //how could we allow for a repeat operation 
    //(e.g. "3@340 2[1@220 2@330]"" plays as "3@340 1@220 2@330 1@220 2@330")
    //how could we allow for two lines that play at the same time?
    //what if we want variables?
    //how does this parsing technique limit us?


    // 3@340, 2[1@220 2@330]
    // notes:  [3@340, 2[1@220 2@330]]
    let notes = code.split(", ");

    //notice this will fail if the input is not correct
    //how could you handle this? allow some flexibility in the grammar? fail gracefully?
    //ideally (probably), the music does not stop

    // notes:  [3@340, 2[1@220 2@330]]

    // reparse notes:


    let revised_notes = []
    for(let i = 0; i < notes.length; i++){
        repeatNum = 1;

        let bracketParse = notes[i].split("[");

        console.log("brakerParse: ", bracketParse);

        if(bracketParse.length >= 2){
            repeatNum = bracketParse[0];
            newNotes = bracketParse[1].slice(0,-1);
            repeatNum = bracketParse[0];
            
            spaceSplit = newNotes.split(" ");
            for(let r = 0; r < repeatNum; r++){
                for(let j = 0; j < spaceSplit.length; j++){
                    revised_notes.push(spaceSplit[j]);
                }
            }
        }
        else{
            revised_notes.push(bracketParse[0])

        }
    }

    notes = revised_notes
    console.log("notes: ", notes);
    
    notes = notes.map(note => {
        noteData = note.split("@");
        return   {"length" : eval(noteData[0]), //the 'eval' function allows us to write js code in our live coding language
                "pitch" : eval(noteData[1])};
                //what other things should be controlled? osc type? synthesis technique?

        // Wen are going to add syntax feature that splits by a comma, each new feature

        // // Now, for each
        // console.log("Start here: ");
        // let repeatNum = 1;
        // console.log(note, typeof note);

        // //PROBLEM, what is it is a nested bracket???

        // // 

        // // notes:  [3@340, 2[1@220 2@330]]
        // //1 . note = 3@340
        // //2 . note = 2[1@220 2@330]
        // let bracketParse = note.split("[");

        // // 1. bracketParse = [3@340]
        // // 2. bracketParse = [2, 1@220 2@330]]
        // let innerNotes = note;

        // console.log("brakerParse: ", bracketParse);

        // if(bracketParse.length >= 2){
        //     repeatNum = bracketParse[0];
        //     innerNotes = bracketParse[1].slice(0,-1);
        // }
        // else{
        //     innerNotes = bracketParse[0]
        // }

        // //innerNotes = 
        // // 1. 3@340
        // // 2. 1@220 2@330

        // for(let i = 0; i < repeatNum; i++){

        //     console.log("innerNotes: ", innerNotes);

        //     if(typeof innerNotes == )
        //     innerNotes = innerNotes.split(" ");

        //     if(innerNotes.length>=2){
        //         innerNotes = 
        //     }
        //     console.log("innerNotes: ", innerNotes);

        //     listOfInner = innerNotes.map(currNote => {
        //         noteData = currNote.split("@");
    
        //         print("noteData: ", noteData);

        //         return   {"length" : eval(noteData[0]), //the 'eval' function allows us to write js code in our live coding language
        //                   "pitch" : eval(noteData[1])};
        //                 //what other things should be controlled? osc type? synthesis technique?
        //     });

        //     console.log("list of inner:  ", listOfInner);
        // }
        // console.log(" endhere");
    });
    return notes;
}

function genAudio(data) {
    liveCodeState = data;
}

function reevaluate() {
    var code = document.getElementById('code').value;
    var data = parseCode(code);
    genAudio(data);
}

playButton.addEventListener('click', function () {

    if (!audioCtx) {
        initAudio();
    }

    reevaluate();


});
