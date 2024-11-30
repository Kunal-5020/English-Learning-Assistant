const TextToSpeech = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";  // Set the language to English.

  // Define a function to select the female voice
  const setVoice = () => {
    const voices = speechSynthesis.getVoices();  // Get all available voices

    // Try to find a female voice
    const femaleVoice = voices.find((voice) => voice.name.toLowerCase().includes("female"));

    // If a female voice is found, use it, otherwise default to the first voice
    speech.voice = femaleVoice || voices[0]; 

    speech.volume = 1;  // Max volume
    speech.rate = 1;    // Normal speed
    speech.pitch = 1;   // Normal pitch

    speechSynthesis.speak(speech);  // Speak the text
  };

  // Check if voices are already loaded
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    // If voices are already loaded, set the voice immediately
    setVoice();
  } else {
    // If voices are not loaded yet, use the voiceschanged event to set the voice
    speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };
  }
};

export default TextToSpeech;



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
