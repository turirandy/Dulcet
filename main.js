const input = document.getElementById('input');
const colorPicker = document.getElementById('color');
const recordingToggle = document.getElementById('record');
const vol_slider = document.getElementById('vol-slider');
var timepernote = 0;
var length = 0;

//define canvas variables
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d"); 
  var blob = null;
  var chunks = [];
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var is_recording = false;
  
  var freq;
  var x = 0;
  var y = height / 2;
  var counter = 0;
  var interval = null;
  let reset = false;

  // create web audio api elements
const audioCtx = new AudioContext();

const notenames = new Map
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);


  function drawWave() {
    
    clearInterval(interval);
     counter = 0;
     if (reset) {
     ctx.clearRect(0, 0, width, height);
     x = 0;
     y = height/2;
     ctx.beginPath();
     ctx.moveTo(x, y);
    }
    interval = setInterval(line, 20);
    reset = false;
  }


 function line() {
  const waveColor = color_picker.value;
  ctx.srokeStyle = waveColor;
  ctx.shadowColor = waveColor
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;
  ctx.begin();
  ctx.moveTo(x, y);  
  y = height / 2 + ((vol_slider.value/100)*40) * Math.sin(x * 2 * Math.PI * freq * (0.5 * length));
  ctx.lineTo(x, y);
  ctx.stroke();
  x = x + 1;
  counter++;
  ctx.srokeStyle = color_picker.value;


    if (counter > timepernote / 20) {
    clearInterval(interval);
  }
 }


function startRecording(){
  const canvasStrem = canvas.captureStream(20);//frame rate canvas
  const audioDestination = audioCtx.createMediaStreamDestination();
  gainNode.connect(audioDestination);
  const combinedStream = new MediaStream();
  CanvasCaptureMediaStreamTrack.getVidieoTracks().forEach(track => combinedStream.addTrack(track));
  audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
  
  recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
  recorder.ondataavailable = e => {
 if (e.data.size > 0) {
   chunks.push(e.data);
 }
};
recorder.onstop = () => {
   blob = new Blob(chunks, { type: "video/webm" });
   const url = URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = "Musicalworm_recording.webm";
   a.click();
   URL.revokeObjectURL(url);
};
recorder.start();
console.log("Recording started");
}

function Toggle(){
  is_recording = !is_recording;
  if (is_recording) {
    recording_toggle.innerHTML = "Stop Recording";
    startRecording();
  } else {
    recording_toggle.innerHTML = "Start Recording";
    recorder.stop();
  }
}
const recording_toggle = document.getElementById("click , toggle");

const color_picker = document.getElementById("color");

// create Oscillator node
oscillator.start();
gainNode.gain.value = 0;


function frequency(pitch) {

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
  setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  setTimeout(() => {clearInterval(setting);
    gainNode.gain.value = 0}, ((timepernote)- 10));
    setTimeout(() => gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timepernote/1000 - 0.1)));

oscillator.start();
oscillator.stop(audioCtx.currentTime + 1); 
  freq = pitch / 10000;
}

function handle() {
  reset = true;
  audioCtx.resume();

  gainNode.gain.value = 0;
  var usernotes = String(input.value);
  var noteslist = [];
  
  for (i =0; i < usernotes.length; i++) {
     noteslist.push(notenames.get(usernotes.charAt(i)));
  }
   length = usernotes.length;
   timepernote = (6000 / length);

  let j = 0;
  repeat = setInterval(() => {
  if (j < noteslist.length) {
    frequency(parseInt(noteslist[j]));
    drawWave();
  j++
  } else {
    clearInterval(repeat)
  }


      }, timepernote);
    
  };
 
  