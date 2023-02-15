var axisX;
var mflag=true;
var player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

var varialTrackSet=[] //  還會變動的sample集
var totalTrack = { // 最後要播放的Set
    notes: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 1700
};
var currentSet = [{ pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
    { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
    { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
    { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
    { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
    { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
    { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
    { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
    { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
    { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
    { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
    { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
    { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
    { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
    { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
    { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
    { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
    { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },] // 目前正在修改的sample



document.addEventListener('mousemove', (event) => {
    axisX=event.clientX
    // console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
});
init()
function init(){
$('#qpmRange').on('change',qpmRangeChange)
$('#qpmInput').on('change',qpmInputChange)
$('#playBtn').on('click',playAll)
$('#generateBtn').on('click',generateFlag)
$('#playVAE').on('click', playVAE)
}




// qpm diplay
function qpmRangeChange(){
    $('#qpmInput').val($(this).val())
    totalTrack.tempos[0].qpm = $(this).val()
}
function qpmInputChange() {
    $('#qpmRange').val($(this).val())
    totalTrack.tempos[0].qpm = $(this).val()
}


// generate a sample on a track--------------------
var sampleNum = []
var gFlag = false
function generateFlag(){
    if(gFlag==false){
        gFlag = true
        $('#generateBtn').css('background-color', '#ff593f')
        $('.channelTrack').css('pointer-events','visible')
        $('.channelTrack').on('click', generateSample)

    }else{
        gFlag=false 
        $('#generateBtn').css('background-color','#FFFFFF')
        $('.channelTrack').css('pointer-events', 'none')
        $('rect').css('pointer-events', 'visible')
        $('rect').on('mousedown', setMove).on('mouseup', moveflag).on("mouseout", () => mflag = false)
    }
}

function generateSample(){
    var s= $(this).html()
    var num= sampleNum.length
    var startAtX = axisX - 200 - currentSet.length / 2
    if(gFlag==true){
        s += "<rect  x='" + startAtX  + "'value='" + num + "' width='" + currentSet[currentSet.length - 1].quantizedEndStep+ "'></rect>"
        $(this).html(s)
        sampleNum.push(sampleNum.length)
        for (note of currentSet) {
            var notePoint = Math.round(startAtX/4) + note.quantizedStartStep
            var nPointEnd = Math.round(startAtX/4) + note.quantizedEndStep
            note.quantizedStartStep = notePoint
            note.quantizedEndStep = nPointEnd
        }
        varialTrackSet.push(currentSet)
        currentSet = [
            { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
            { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
            { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
            { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
            { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
            { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
            { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
            { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
            { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
            { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
            { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
            { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
            { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
            { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
            { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
            { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
            { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
            { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        ]
        console.log(varialTrackSet)
        console.log(currentSet)
        // console.log(sampleNum)
    }
    // console.log($(this).attr("class"))
    // console.log($(this).css("z-index"))
    
}

// move sample--------------------------------------
var xPoint 
function setMove(){
    console.log('hi')
    mflag=true
    $(this).on('mousemove',setIsMoving)
}
function moveflag(){
    console.log(currentSet)
    xPoint = parseInt($(this).attr("x"))
    for (note of currentSet) {
        var notePoint =Math.round(xPoint/4) + note.quantizedStartStep
        var nPointEnd = Math.round(xPoint / 4) +note.quantizedEndStep
        note.quantizedStartStep = notePoint
        note.quantizedEndStep = nPointEnd
    }

    varialTrackSet[$(this).attr("value")] = currentSet
    console.log(varialTrackSet)
    console.log(currentSet)
    currentSet = [
        { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
        { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
        { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
        { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
        { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
    ]
    console.log(currentSet)
    mflag=false
    
    
}
function SampleInitial() {
    currentUserSample = []
    for(i=0;i<userSample[0].notes.length;i++){
        currentUserSample.push(userSample[0][i])
    }
}
function setIsMoving(){
    if(mflag==true){
    var setWidth = parseInt($(this).css('width'))
        $(this).attr("x", axisX - 200 - setWidth/2)
        
        
    }
    // console.log($(this).attr('x'))
    // console.log($('.channel').css('width'))
}




//play music-----------------------------------------
function playAll(){
    for(note of varialTrackSet){
        for(i=0;i<note.length;i++){
        totalTrack.notes.push(note[i])
        }
    }
    console.log(totalTrack)
    if (player.isPlaying()){
        player.stop()
        $('#playBtn').html('Play')
    }else{
        player.start(totalTrack)
        $('#playBtn').html('Stop')
    }
}


// use vae generate new sample--------------------------
var getVAESequence = {
    notes: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 0 }],
    totalQuantizedSteps: 0
}
var modelSet = ["drums_2bar_lokl_small", "drums_2bar_hikl_small", "drums_2bar_nade_9_q2", "drums_4bar_med_q2", "drums_4bar_med_lokl_q2", "mel_2bar_small", "mel_4bar_med_q2", 
    "mel_4bar_med_lokl_q2", "mel_4bar_small_q2", "mel_chords", "mel_16bar_small_q2", "trio_4bar_lokl_small_q1", "trio_16bar_xl", "groovae_2bar_humanize", "tap2drum_1bar",
    "tap2drum_2bar", "tap2drum_3bar", "tap2drum_4bar", "groovae_4bar"]
var opt=""
for(model of modelSet){
    opt += "<option value='"+model+"'>"+model+"</option>"
}
$('#vaeSelect').html(opt)
// function vaeModelSelector() {
//     console.log()
// }
music_vae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/' + $('#vaeSelect').val());
music_vae.initialize();
vae_temperature = parseInt($('#tempeofVAE').val());
vaePlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
function playVAE() {
    if (vaePlayer.isPlaying()) {
        vaePlayer.stop();
        return;
    }
    music_vae
        .sample(1, vae_temperature)
        .then((sample) => testVAE(sample[0]));
}
function testVAE(s){
    console.log($('#vaeSelect').val())
    vaePlayer.start(s)
    console.log(s)
}
function makeSample(s) {
    var sets = s.notes
    // console.log(sets.length)
    Array.prototype.forEach.call(sets, i => { transferNotes(i) })
    // sets.foreach(i => console.log(i));
    // console.log(trainedSet)
    getVAESequence.quantizationInfo = s.quantizationInfo
    getVAESequence.tempos = s.tempos
    getVAESequence.totalQuantizedSteps = s.totalQuantizedSteps
    console.log(getVAESequence)
    vaePlayer.start(getVAESequence)
}

function transferNotes(x) {
    getVAESequence.notes.push({ pitch: x.pitch, quantizedStartStep: x.quantizedStartStep, quantizedEndStep: x.quantizedEndStep, program: x.program, velocity: 100 })


}