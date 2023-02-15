music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
music_rnn.initialize();

// Create a player to play the sequence we'll get from the model.
rnnPlayer = new mm.Player();

function play() {
    if (rnnPlayer.isPlaying()) {
        rnnPlayer.stop();
        return;
    }

    // The model expects a quantized sequence, and ours was unquantized:
    const qns = mm.sequences.quantizeNoteSequence(ORIGINAL_TWINKLE_TWINKLE, 4);
    music_rnn
        .continueSequence(qns, rnn_steps, rnn_temperature)
        .then((sample) => rnnPlayer.start(sample));
} 

rnn_steps = 20;
rnn_temperature = 1.5;