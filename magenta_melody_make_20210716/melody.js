


soundFonts = ["acoustic_grand_piano", "bright_acoustic_piano", "electric_grand_piano", "honkytonk_piano", "electric_piano_1", "electric_piano_2", "harpsichord", "clavichord", "celesta",
    "glockenspiel", "music_box", "vibraphone", "marimba", "xylophone", "tubular_bells", "dulcimer", "drawbar_organ", "percussive_organ", "rock_organ", "church_organ", "reed_organ", "accordion",
    "harmonica", "tango_accordion", "acoustic_guitar_nylon", "acoustic_guitar_steel", "electric_guitar_jazz", "electric_guitar_clean", "electric_guitar_muted", "overdriven_guitar",
    "distortion_guitar", "guitar_harmonics", "acoustic_bass", "electric_bass_finger", "electric_bass_pick", "fretless_bass", "slap_bass_1", "slap_bass_2", "synth_bass_1", "synth_bass_2",
    "violin", "viola", "cello", "contrabass", "tremolo_strings", "pizzicato_strings", "orchestral_harp", "timpani", "string_ensemble_1", "string_ensemble_2", "synthstrings_1", "synthstrings_2",
    "choir_aahs", "voice_oohs", "synth_voice", "orchestra_hit", "trumpet", "trombone", "tuba", "muted_trumpet", "french_horn", "brass_section", "synthbrass_1", "synthbrass_2", "soprano_sax",
    "alto_sax", "tenor_sax", "baritone_sax", "oboe", "english_horn", "bassoon", "clarinet", "piccolo", "flute", "recorder", "pan_flute", "blown_bottle", "shakuhachi", "whistle", "ocarina",
    "lead_1_square", "lead_2_sawtooth", "lead_3_calliope", "lead_4_chiff", "lead_5_charang", "lead_6_voice", "lead_7_fifths", "lead_8_bass_lead", "pad_1_new_age", "pad_2_warm", "pad_3_polysynth",
    "pad_4_choir", "pad_5_bowed", "pad_6_metallic", "pad_7_halo", "pad_8_sweep", "fx_1_rain", "fx_2_soundtrack", "fx_3_crystal", "fx_4_atmosphere", "fx_5_brightness", "fx_6_goblins",
    "fx_7_echoes", "fx_8_scifi", "sitar", "banjo", "shamisen", "koto", "kalimba", "bag_pipe", "fiddle", "shanai", "tinkle_bell", "agogo", "steel_drums", "woodblock", "taiko_drum", "melodic_tom",
    "synth_drum", "reverse_cymbal", "guitar_fret_noise", "breath_noise", "seashore", "bird_tweet", "telephone_ring", "helicopter", "applause", "gunshot"]

/*
pitch range:
acoustic_grand_piano 21-108
bright_acoustic_piano 21-108
electric_grand_piano 21-108

*/
var optionStr = ""
for (i = 0; i < soundFonts.length; i++) {
    optionStr += "<option value='" + i + "'>" + soundFonts[i] + "</option>"
}
$('#fontSelector').html(optionStr)
var currentInstrument = 0
var isDrumFlag = false
// let setQpm 
unquantizedSeq = {
    notes: [],
    totalTime: 8

}
testset = {
    ontrolChanges: [],
    keySignatures: [],
    notes: [
    ],
    partInfos: [],
    pitchBends: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    sectionAnnotations: [],
    sectionGroups: [],
    tempos: [{ time: 0, qpm: 90 }],
    textAnnotations: [],
    timeSignatures: [],
    totalQuantizedSteps: 32
};
var trainedSet = {
    ontrolChanges: [],
    keySignatures: [],
    notes: [
    ],
    partInfos: [],
    pitchBends: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    sectionAnnotations: [],
    sectionGroups: [],
    tempos: [{ time: 0, qpm: 90 }],
    textAnnotations: [],
    timeSignatures: [],
    totalQuantizedSteps: 32
};

var player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
var fileName = ""
init();
function init() {

    $('.soundBtn').on("click", noteOn);
    $('#play').on("click", getPlay);
    $('#qpmVal').on("change", qpmChange);
    $('#fontSelector').on("change", setIns)
    $('#fileBtn').on("change", uploadFile)
    $('#savebtn').on("click", () => saveAs(new File([mm.sequenceProtoToMidi(testset)], $('#saveNameAs').val() + '.mid')));
    $('#saveTrainedbtn').on("click", () => saveAs(new File([mm.sequenceProtoToMidi(trainedSet)], 'rnn_' + $('#saveNameAs').val() + '.mid')));
    // $("#rnnSelect").on("change",rnnSelect)
    // $('#musicRnn').on("click", musicRnn);
}
function setIns() {
    currentInstrument = $('#fontSelector').val()
    console.log(currentInstrument)
}
function qpmChange() {
    var n = parseInt($('#qpmVal').val())
    testset.tempos[0].qpm = n
    trainedSet.tempos[0].qpm = n
}

function uploadFile() {
    var upFile = mm.blobToNoteSequence($('#fileinput')[0].files[0])
    upFile.then((sample) => loadSample(sample))
    // console.log(upFile)
    // console.log($('#fileinput')[0].files.length)
}
function loadSample(s) {
    var sets = s.notes
    // console.log(sets.length)
    Array.prototype.forEach.call(sets, i => { uploadTransfer(i) })
    // sets.foreach(i => console.log(i));
    // console.log(trainedSet)
    unquantizedSeq.totalTime = s.totalTime
    rnnPlayer.start(unquantizedSeq)
    var qSet = mm.sequences.quantizeNoteSequence(unquantizedSeq, 4)
    // console.log()
}
function uploadTransfer(x) {
    unquantizedSeq.notes.push({ pitch: x.pitch, startTime: x.startTime, endTime: x.endTime, instrument: x.instrument, program: x.program, velocity: 100 })

}

function noteOn() {
    // console.log("note")
    var noteFlag = false;
    if (testset.notes.length != 0) {
        var timeIndex = $(this).parent().index();
        // console.log(timeIndex)
        var pitchIndex =$(this).index();
        // console.log(pitchIndex)
        for (note of testset.notes) {
            // console.log(note)
            if (note.quantizedStartStep == timeIndex && note.pitch == pitchIndex) {
                $(this).css("background-color", "#333333");
                noteFlag = true;
                testset.notes.pop()
            }
        }
    }
    $(this).css("background-color", "#ff593f")
    // pitch90沒聲音
    testset.notes.push({ pitch: 82 - ($(this).index() * 2), quantizedStartStep: $(this).parent().index() * 1, quantizedEndStep: $(this).parent().index() + 1, velocity: 100 })
        
        // console.log(testset)
    
    // console.log($(this).parent().index())
    // console.log($(this).index())
}
player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
function getPlay() {
    
    for(note of testset.notes){
        note.program =parseInt(currentInstrument)
    }
    if(player.isPlaying()){
        player.stop()
        $("#play").html("Play")
    }else{
        player.start(testset);
        $("#play").html("Stop")
    }
    // console.log(testset)
    // console.log(v)
}

//RNN model choose
// rnnModel = [
//     "basic_rnn",
//     "melody_rnn"]

// var modelOptions = ""
// for (i = 0; i < rnnModel.length; i++) {
//     modelOptions += "<option value='" + rnnModel[i] + "'>" + rnnModel[i] + "</option>"
// }
// $('#rnnSelect').html(modelOptions)

// var currentModel = ""
// function rnnSelect() {
//     currentModel = $("#rnnSelect").val()
//     // console.log(currentModel)
// }



// // Create a player to play the sequence we'll get from the model.
// rnnPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');


// function musicRnn() {
//     // Initialize the model.
//     music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/' + currentModel);
//     music_rnn.initialize();
//     rnn_steps = 32;
//     rnn_temperature = 1.5;
//     if (rnnPlayer.isPlaying()) {
//         rnnPlayer.stop();
//         return;
//     }

//     // The model expects a quantized sequence, and ours was unquantized:
//     // const qns = mm.sequences.quantizeNoteSequence(testset, 4);
//     music_rnn
//         .continueSequence(testset, rnn_steps, rnn_temperature)
//         .then((sample) => makeSample(sample));
// }

// function makeSample(s) {
//     var sets = s.notes
//     // console.log(sets.length)
//     Array.prototype.forEach.call(sets, i => { transferNotes(i) })
//     // sets.foreach(i => console.log(i));
//     // console.log(trainedSet)
//     trainedSet.quantizationInfo = s.quantizationInfo
//     trainedSet.tempos = s.tempos
//     trainedSet.totalQuantizedSteps = s.totalQuantizedSteps
//     rnnPlayer.start(trainedSet)
// }

// function transferNotes(x) {
//     trainedSet.notes.push({ pitch: x.pitch, quantizedStartStep: x.quantizedStartStep, quantizedEndStep: x.quantizedEndStep, program: x.program, velocity: 100 })


// }