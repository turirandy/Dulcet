const input = document.getElementById('input');
const color_picker1 = document.getElementById('color1');
const recording_toggle = document.getElementById('record');
const vol_slider = document.getElementById('vol-slider');

var timepernote = 0;
var length = 0;
var interval = null;
let reset = false;

var x = 0;
var freq = 0;
var y = height / 2;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter = 0;
function drawWave() {
  clearInterval(interval);
  if (reset) {
    ctx.clearRect(0, 0, width, height);
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath();
    }
    counter = 0;
    interval = setInterval(line, 20);
    reset = false;
}

 function line() {
  var y = (height/2) + ((vol_slider.value/100)*40* Math.sin((x * 2* Math.PI * freq *(0.5 * length))));
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = color_picker1.value;
  x = x + 1;
  counter++;
  
  if (counter > timepernote / 20) {
    clearInterval(interval);
  }
}



//create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Osillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;


notenames = new Map();
notenames.set(" ", 0)

notenames.set("a", 104.6);
notenames.set("b", 199.7);
notenames.set("c", 201.6);
notenames.set("d", 249.2);
notenames.set("e", 292.0);
notenames.set("f", 301.8);
notenames.set("g", 322.9);
notenames.set("h", 385.6);
notenames.set("i", 421.7);
notenames.set("j", 453.6);
notenames.set("k", 489.2);
notenames.set("l", 539.0);
notenames.set("m", 561);
notenames.set("n", 582.9);
notenames.set("o", 621.6);
notenames.set("p", 630.7);
notenames.set("q", 667.67);
notenames.set("r", 701.2);
notenames.set("s", 751.0);
notenames.set("t", 799);
notenames.set("u", 825.9);
notenames.set("v", 877.8);
notenames.set("w", 894);
notenames.set("x", 910);
notenames.set("y", 967);
notenames.set("z", 987);





function frequency(pitch) {
  freq = pitch / 10000;
  gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
  setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  setTimeout(() => {gainNode.gain.setValueAtTime(0, audioCtx.currentTime);},((timepernote)-10));
  setTimeout(() => {clearInterval(setting);},((timepernote)-30));

  gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);

}

function handle() {
  reset = true;
  audioCtx.resume();

  gainNode.gain.value = 0;
  var usernotes = String(input.value);
  var noteslist = [];
  length = usernotes.length;
  timepernote = (6000 / length);

  
  for (i = 0; i < usernotes.length; i++) {
     noteslist.push(notenames.get(usernotes.charAt(i)));
  }
  
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


var blob, recorder = null;
var chunks = [];

function startRecording(){
  const canvasStream = canvas.captureStream(20);//frame rate canvas
  const audioDestination = audioCtx.createMediaStreamDestination();
  gainNode.connect(audioDestination);
  const combinedStream = new MediaStream();
  canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
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
  const a = document.createElement('a');
  a.href = url;
  a.download = "Musicalworm_recording.webm";
  a.click();
  URL.revokeObjectURL(url);
};
recorder.start();
console.log("Recording started");
}
var is_recording = false
function toggle(){
  is_recording = !is_recording;
  if (is_recording) {
    recording_toggle.innerHTML = "stop recording";
    startRecording();
  } else {
    recording_toggle.innerHTML = "start recording";
    recorder.stop();
  }
}
 


  

