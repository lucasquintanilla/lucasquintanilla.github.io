

const subtitles = [
    { start: 0, end: 3, speaker: "Lucas", text: "Hello! Imagine a world where machines think, learn, and grow smarter every second!" },
    { start: 4, end: 7, speaker: "Ines", text: "Welcome to the AI revolution!" },
    { start: 8, end: 12, speaker: "Lucas", text: "It's transforming EVERYTHING—from how we live, to how we work, to how we play!" },

    { start: 13, end: 16, speaker: "Ines", text: "It all started with one bold idea... Can machines think like us?" },
    { start: 17, end: 20, speaker: "Lucas", text: "Fast forward to NOW—AI is reshaping our world in ways you never imagined!" },

    { start: 21, end: 24, speaker: "Ines", text: "From our pockets to our homes, AI is EVERYWHERE!" },
    { start: 25, end: 28, speaker: "Lucas", text: "Powering smart decisions with data faster than ever before!" },

    { start: 29, end: 32, speaker: "Ines", text: "Machine Learning makes AI smarter with every experience." },
    { start: 33, end: 37, speaker: "Lucas", text: "And Deep Learning? It's revolutionizing what machines can do, inspired by the human brain!" },

    { start: 38, end: 41, speaker: "Ines", text: "Recognizing faces, processing languages, solving impossible problems. 🌍" },
    { start: 42, end: 45, speaker: "Lucas", text: "AI is unlocking new frontiers in science, tech, and innovation! 🚀" },

    { start: 46, end: 49, speaker: "Ines", text: "In healthcare, AI is saving lives by detecting diseases faster! 🏥" },
    { start: 50, end: 53, speaker: "Lucas", text: "In finance, it's stopping fraud in its tracks and revolutionizing investments! 💸" },

    { start: 54, end: 57, speaker: "Ines", text: "But with great power comes great responsibility. ⚖️" },
    { start: 58, end: 61, speaker: "Lucas", text: "We face challenges like data privacy, ethics, and job disruption." },

    { start: 62, end: 65, speaker: "Ines", text: "We must make sure AI is safe, fair, and for EVERYONE. 🌐" },
    { start: 66, end: 69, speaker: "Lucas", text: "Experts around the globe are shaping the future guidelines of AI." },

    { start: 70, end: 73, speaker: "Ines", text: "Imagine a future where AI helps solve humanity's BIGGEST problems! 💥" },
    { start: 74, end: 77, speaker: "Lucas", text: "Where it drives innovation like never before!" },

    { start: 78, end: 81, speaker: "Ines", text: "The future of AI is NOW. 🔮" },
    { start: 82, end: 85, speaker: "Lucas", text: "And it's taking us places beyond imagination." },

    { start: 86, end: 90, speaker: "Ines", text: "Join the revolution. Embrace the power of AI. Your future is HERE! 🚀🔥" }
];

const soundEffects = [
    { start: 0, src: 'sfx/OneShots/FX/IT_FX_Antarta_FRK.wav' },            // Explosive intro to grab attention immediately
    { start: 4, src: 'sfx/OneShots/FX/IT_FX_Shocker_FRK.wav' },            // Quick sound cue to emphasize AI revolution
    { start: 13, src: 'sfx/OneShots/FX/IT_FX_Understanding_FRK.wav' },     // Build-up sound to create excitement about AI's history
    { start: 21, src: 'sfx/OneShots/FX/IT_FX_Sahara_FRK.wav' },            // High-energy effect to highlight AI's impact
    { start: 29, src: 'sfx/OneShots/FX/IT_FX_Magnus_FRK.wav' },            // Sound cue for Machine Learning mention
    { start: 38, src: 'sfx/OneShots/FX/IT_FX_Danger_FRK.wav' },            // Emphasis on AI's abilities and tech impact
    { start: 46, src: 'sfx/OneShots/FX/IT_FX_There They Are_FRK.wav' },    // Dramatic effect for AI's role in healthcare
    { start: 54, src: 'sfx/OneShots/FX/IT_FX_Shocker_FRK.wav' },           // Quick transition sound for the responsibility talk
    { start: 70, src: 'sfx/OneShots/FX/IT_FX_Understanding_FRK.wav' },     // Inspirational tone to set up the future of AI
    { start: 86, src: 'sfx/OneShots/FX/IT_FX_Antarta_FRK.wav' }            // Powerful closing sound for the call-to-action
];


const images = [
    // { start: 0, end: 4, src: 'giphy.webp' }, // Display image from 5s to 8s
    // { start: 4, end: 999999, src: 'lsd.webp' }, // Display image from 5s to 8s
];

const subtitleText = document.getElementById('subtitle-text');
const audio = document.getElementById('background-audio');
const imageContainer = document.getElementById('image-container');
const displayImage = document.getElementById('display-image');

// Background sound setup
const backgroundAudio = new Audio('background-sound.mp3');
// Configuration for the background audio
backgroundAudio.loop = true;           // Loop the background audio to keep it continuous
backgroundAudio.volume = 0.2;          // Set the volume (0 = silent, 1 = full volume)
backgroundAudio.playbackRate = 1;      // Control the playback speed (1 is normal speed, 0.5 is half speed, 2 is double speed)
backgroundAudio.preload = 'auto';

// Function to play individual sound effects at the correct time
function playSoundEffect(effect) {
    const effectAudio = new Audio(effect.src);
    effectAudio.volume = 0.3;
    effectAudio.play();
}


function playVoiceClip(text) {
    const voices = speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(voice => voice.name === 'Google UK English Male') || voices[0];
    utterance.rate = 1.2;    // Slightly faster rate for higher energy
    utterance.pitch = 1.0;   // Standard pitch for a confident and engaging tone
    utterance.volume = 1;    // Full volume for clarity and emphasis
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}

function playVoiceClipFem(text) {
    const voices = speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Female')) || voices.find(voice => voice.lang === 'en-GB') || voices[0];
    utterance.rate = 1.1;    // Slightly faster rate to keep the pace lively
    utterance.pitch = .9;   // Higher pitch for an energetic and friendly tone
    utterance.volume = 1;    // Full volume to stand out on mobile speakers
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}

// function startAudioPlayback() {
//     // Start playing the continuous background sound
//     backgroundAudio.play();

//     // Track the elapsed time to trigger sound effects and voice-over clips
//     let elapsedTime = 0;
//     setInterval(() => {
//         elapsedTime += 1; // Increment elapsed time by 1 second

//         // Update subtitle text
//         const currentSubtitle = subtitles.find(subtitle =>
//             elapsedTime >= subtitle.start && elapsedTime <= subtitle.end
//         );
//         subtitleText.textContent = currentSubtitle ? currentSubtitle.text : '';

//         // Update image display
//         const currentImage = images.find(image =>
//             elapsedTime >= image.start && elapsedTime <= image.end
//         );
//         if (currentImage) {
//             displayImage.src = currentImage.src;
//             imageContainer.style.display = 'flex'; // Show image container
//         } else {
//             imageContainer.style.display = 'none'; // Hide image container
//         }

//         // Check if a voice-over clip needs to be played at this time
//         subtitles.forEach(clip => {
//             if (Math.floor(elapsedTime) === clip.start) {
//                 if (clip.speaker === 'Lucas') {
//                     playVoiceClip(clip.text);
//                 }

//                 if (clip.speaker === 'Ines') {
//                     playVoiceClipFem(clip.text);
//                 }
//             }
//         });

//         // Check if there is a sound effect that needs to be played at this time
//         soundEffects.forEach(effect => {
//             if (Math.floor(elapsedTime) === effect.start) {
//                 playSoundEffect(effect);
//             }
//         });
//     }, 1000); // Check every second to see if a sound effect or voice clip should be triggered
// }

function startAudioPlayback() {
    backgroundAudio.play(); // Start playing the continuous background sound
    let elapsedTime = 0;
    setInterval(() => {
        elapsedTime += 1; // Increment elapsed time by 1 second

        // Update subtitle text
        const currentSubtitle = subtitles.find(subtitle =>
            elapsedTime >= subtitle.start && elapsedTime <= subtitle.end
        );
        subtitleText.textContent = currentSubtitle ? currentSubtitle.text : '';

        // Adjust mandala intensity dynamically based on the subtitle energy
        if (currentSubtitle) {
            if (currentSubtitle.speaker === 'Lucas') {
                updateMandalaIntensity(3); // Higher intensity for Lucas's dialogue
            } else if (currentSubtitle.speaker === 'Ines') {
                updateMandalaIntensity(2); // Moderate intensity for Ines's dialogue
            }
        } else {
            updateMandalaIntensity(1); // Low intensity when there's no active dialogue
        }

        // Update image display
        const currentImage = images.find(image =>
            elapsedTime >= image.start && elapsedTime <= image.end
        );
        if (currentImage) {
            displayImage.src = currentImage.src;
            imageContainer.style.display = 'flex'; // Show image container
        } else {
            imageContainer.style.display = 'none'; // Hide image container
        }

        // Check if a voice-over clip needs to be played at this time
        subtitles.forEach(clip => {
            if (Math.floor(elapsedTime) === clip.start) {
                if (clip.speaker === 'Lucas') {
                    playVoiceClip(clip.text);
                }

                if (clip.speaker === 'Ines') {
                    playVoiceClipFem(clip.text);
                }
            }
        });

        // Check if there is a sound effect that needs to be played at this time
        soundEffects.forEach(effect => {
            if (Math.floor(elapsedTime) === effect.start) {
                playSoundEffect(effect);
            }
        });
    }, 1000); // Check every second to see if a sound effect or voice clip should be triggered
}



// Wait for the user to click the play button to start the playback
document.getElementById('play-button').addEventListener('click', () => {


    // Check if the Web Speech API is supported by the browser
    if ('speechSynthesis' in window) {
        // Hide the play button after it is clicked
        document.getElementById('play-button').style.display = 'none';
        animationActive = true; // Activate the mandala animation
        // Start the audio and subtitle playback
        startAudioPlayback();
    } else {
        console.error('Speech synthesis not supported by this browser.');
    }

});


// amdnalas
let mandalaIntensity = 1; // Variable to control the intensity of the mandala
let angleOffset = 0; // Variable for animating rotation of the mandala
let animationActive = false; // Control flag to start or stop the animation//global variables
var step = 5;
var pointsArray;
var xDir = 0.1;
var yDir = 0.0;
var noiseOffset = 0.0; 
var lineLength = 100;
var symmetry = 10; 
var angle = 360 / symmetry;
var colorOffset = 0.0;


//MakeMedallion
function setup() {
  createCanvas(windowWidth, windowHeight);
  translate(width/2,height/2); 
  pointsArray = [createVector(0,0)];
  angleMode(DEGREES); 
  colorMode(HSB,250,250,250);
  strokeWeight(2)
}

function draw() {
    if (!animationActive) return; // Stop the animation if it's not active
    translate(width/2,height/2);
    background(10);
    
    if(pointsArray.length >= lineLength){
      pointsArray.shift();
    }
    
    noFill();
    
    stroke(noise(colorOffset) * 255, 255,255);
      
    colorOffset += 0.02;
    for (let i = 0; i < symmetry; i++){
      rotate(angle); 
  
      push();
      beginShape();
      //loops through all verticies in the pointsArray
      for(let j = 0; j < pointsArray.length;j++){ 
      let xDistance;
      let yDistance;
      
      // Calculate previous distance betweeen individual points. 
      if(j > 0){
        xDistance = pointsArray[j].x - pointsArray[j - 1].x; 
        yDistance = pointsArray[j].y - pointsArray[j - 1].y;
        
        // New shape startup 
        if(abs(xDistance) > width/2 || abs(yDistance) > height/2){
          endShape();
          beginShape();
        }
      }
      
      curveVertex(pointsArray[j].x,pointsArray[j].y); 
      
    }
      endShape();
      pop();
  
      push();
      scale(-1,1);
      beginShape();
      for(let j = 0; j < pointsArray.length;j++){ 
      let xDistance;
      let yDistance;
      
      // Calcute points
      if(j > 0){
        xDistance = pointsArray[j].x - pointsArray[j - 1].x; 
        yDistance = pointsArray[j].y - pointsArray[j - 1].y;
        
        // New Shape
        if(abs(xDistance) > width/2 || abs(yDistance) > height/2){
          endShape();
          beginShape(); 
        }
      }
      
      curveVertex(pointsArray[j].x,pointsArray[j].y); 
    }
      endShape(); 
      pop(); 
    }
  
    noiseOffset += 0.01;
   
    //New x position
    var newXPos = pointsArray[pointsArray.length - 1 ].x;
    
    //New y position
    var newYPos = pointsArray[pointsArray.length - 1 ].y; 
    
    //calculate new starting position
    if(random() > 0.75){
      xDir = xDir + noise(noiseOffset);
    }
    else if(random() > 0.7){
      yDir = yDir + noise(noiseOffset) ; 
    }
    else if(random() > 0.5){
      xDir = xDir - noise(noiseOffset) ;
    }
    else{
      yDir = yDir - noise(noiseOffset); 
    }
    
    //Direction control
    if(yDir > 1){
      yDir = 1;
    }
    else if(yDir < -1){
      yDir = -1;
    }
    else if(xDir > 1){
      xDir = 1;
    }
    else if(xDir < -1){
      xDir = -1;
    }
       
    
    if(mouseX < width - 10 && mouseX > 10 && mouseY > 10 && mouseY < height-10 ){
      newXPos = mouseX - width/2;
      newYPos = mouseY - height/2;
      
    }else{
      //Calulate new x position
      newXPos = newXPos + xDir * step;
  
      //Calculate new y position
      newYPos = newYPos + yDir * step;
      
    }
    
    
    //Screen Wrap
    if(newYPos > height/2){ 
      newYPos = -height/2;
    }
    else if(newYPos < -height/2){
      newYPos = height/2;  
    }
    else if(newXPos < -width/2){ // 
      newXPos = width/2;  
    }
    else if(newXPos > width/2){ 
      newXPos = -width/2;  
    }  
    
    // Add calculated points
    pointsArray.push(createVector(newXPos,newYPos));
  
  }
// Function to update mandala intensity based on dialogue
function updateMandalaIntensity(intensity) {
    mandalaIntensity = intensity;
}
