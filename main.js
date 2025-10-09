var x = 0;
var y = 0;
var amplitude = 40;
var interval = null;
const input = document.getElementById('input');
// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();


// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

notenames = new Map();
notenames.set("D", 567);
notenames.set("A", 690);
notenames.set("E", 890);
notenames.set('F', 672);
notenames.set('C', 367);
notenames.set('B', 324);
notenames.set('G', 735);


function frequency(pitch) {
  const oscillator = audioCtx.createOscillator();
  oscillator.type
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch,
        audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime +
            1);
   oscillator.start();
   gainNode.gain.value = 0;     
}
audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
   var usernotes =String(input.value);
   var noteslist=[];


   for(i = 0; i< usernotes.length; i++){
    
    noteslist.push(notenames.get(usernotes.charAt(i)));
   }
   let j = 0;
   repeat = setInterval(() =>{
    if( j < noteslist.length) {
      frequency(parseInt(noteslist[j]));
      drawWave();

      j++
    } else{
      clearInterval(repeat)
    }
  
  }, 1000)
   var pitch = notenames.get(usernotes);
   freq = pitch/ 10000;
   frequency(pitch);

}

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var width =ctx.canvas.width;
var height = ctx.canvas.height;

freq = pitch/ 10000;
var counter = 0;

function drawWave(){
  ctx.clearRect(0, 0, width, height);
  x = 0;
  y = height/2
  ctx.moveTo(x, y);
  ctx.beginPath();
  counter = 0
  interval= setInterval(line, 20);

}
function line(){
  y = height/2 + (amplitude *Math.sin(x*2* Math.PI *freq));
  ctx.lineTo(x, y);
  ctx.stroke();
  x = x + 1;
  if(counter >50){
    clearInterval(interval);
  }
}