// components/SpeechRecognition.tsx
import { useEffect, useRef } from 'react';

interface SpeechRecognitionHookProps {
  onSpeechRecognition: (text: string) => void;
}

// Add a global type declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const useSpeechRecognition = ({ onSpeechRecognition }: SpeechRecognitionHookProps) => {
  const recognitionRef = useRef<Window['SpeechRecognition'] | null>(null);

  useEffect(() => {
    // Check if SpeechRecognition is available
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition()

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en';

      recognitionInstance.onresult = (event: any) => {
        const results: SpeechRecognitionResultList = event.results;
        const speechText = Array.from(results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        onSpeechRecognition(speechText);
      };

      recognitionRef.current = recognitionInstance;

      return () => {
        recognitionInstance.stop();
      };
    } else {
      console.error('SpeechRecognition API is not available in this browser.');
    }
  }, [onSpeechRecognition]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { startListening, stopListening };
};

export default useSpeechRecognition;
