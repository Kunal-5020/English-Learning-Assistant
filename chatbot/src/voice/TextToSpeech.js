// TextToSpeech.js
export const textToSpeech = (text) => {
  const speechSynthesis = window.speechSynthesis;

  // Check if speech synthesis is already speaking
  if (window.isSpeaking) {
    return; // Prevent speaking if already speaking
  }

  // Set global isSpeaking flag to true
  window.isSpeaking = true;

  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set properties for the speech
  utterance.pitch = 2; // Set higher pitch (e.g., 2 for higher pitch)
  utterance.rate = 1;  // Default rate (can adjust for faster/slower)

  // Set the voice to a female voice (if available)
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => voice.name.includes("Female")) || voices[0]; // Default to first voice if no female voice
  utterance.voice = femaleVoice;

  // Speak the text
  speechSynthesis.speak(utterance);

  // When speech ends, reset isSpeaking to false
  utterance.onend = () => {
    window.isSpeaking = false;
  };
};
