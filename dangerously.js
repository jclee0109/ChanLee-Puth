const playDrumBTN = document.getElementById('playDrum');
const stopBTN = document.getElementById('stop');

const synth = new Tone.Synth().toDestination();

console.log('Dangerously loaded');
const drum = new Tone.MembraneSynth().toDestination();
const hat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
}).toDestination();

// Drum Loop
let drumLoop;

let scheduledEventID;  // 스케줄된 이벤트의 ID를 저장할 변수

playDrumBTN.addEventListener('click', async () => {
    if (Tone.Transport.state !== 'started') {
        await Tone.start();
    }
    await Tone.Transport.start();

    // 이전에 스케줄된 이벤트가 있다면 취소
    if (scheduledEventID) {
        Tone.Transport.clear(scheduledEventID);
    }

    // 0.5초 간격으로 드럼 히트를 반복 스케줄
    scheduledEventID = Tone.Transport.scheduleRepeat(time => {
        drum.triggerAttackRelease("C2", "8n", time);
        hat.triggerAttackRelease("C1", "8n", time + 0.1);
    }, "0.5n");
});

stopBTN.addEventListener('click', async () => {
    console.log('Dangerously stopped');
    // 모든 스케줄된 이벤트를 취소
    Tone.Transport.cancel(0);
    await Tone.Transport.stop();  // Transport 멈춤
});