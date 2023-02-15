
s ={
    notes: [{ pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, program: 0 },
        { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum:true },
        { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, program: 'drums' },
        { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, program: 'drums' },
        { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, program: 'drums' },
        { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, program: 'drums' },
        { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, program: 'drums' },
        { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, program: 'drums' },
        { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, program: 'drums' },
        { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, program: 'drums' },
        { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, program: 'drums' },
        { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, program: 'drums' },
        { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, program: 'drums' },
        { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, program: 'drums' },
        { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, program: 'drums' },
        { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, program: 'drums' },
        { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, program: 'drums' },
        { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, program: 'drums' },],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
}
player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
player.start(s);