import { useSpeechSynthesis } from 'react-speech-kit';

// TextToSpeech.js
export const textToSpeech = (text) => {
  const speechSynthesis = window.speechSynthesis;

  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set properties for the speech
  utterance.pitch = 1; // Default pitch
  utterance.rate = 1;  // Default rate

  // Set the voice to a female voice (if available)
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => voice.name.includes("Female")) || voices[0]; // Default to first voice if no female voice
  utterance.voice = femaleVoice;

  // Speak the text
  speechSynthesis.speak(utterance);
};



// import { useEffect } from 'react';

// const TextToSpeech = (textData) => {
//   useEffect(() => {
//     if (!textData || !textData.trim()) return; // Check if textData is not empty

//     const speech = new SpeechSynthesisUtterance(textData);

//     // Select a female voice if available, otherwise default to first available voice
//     const voices = window.speechSynthesis.getVoices();
//     const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[0];
//     speech.voice = femaleVoice;

//     // Speak the text
//     window.speechSynthesis.speak(speech);
//   }, [textData]); // This will run when textData changes

// };

// export default TextToSpeech;
