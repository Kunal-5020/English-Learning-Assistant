import { useEffect } from 'react';

const TextToSpeech = (textData) => {
  useEffect(() => {
    if (!textData || !textData.trim()) return; // Check if textData is not empty

    const speech = new SpeechSynthesisUtterance(textData);

    // Select a female voice if available, otherwise default to first available voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[0];
    speech.voice = femaleVoice;

    // Speak the text
    window.speechSynthesis.speak(speech);
  }, [textData]); // This will run when textData changes

};

export default TextToSpeech;
