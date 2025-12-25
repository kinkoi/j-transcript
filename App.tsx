
import React, { useState, useCallback } from 'react';
import AudioUploader from './components/AudioUploader';
import ResultDisplay from './components/ResultDisplay';
import { processAudio } from './services/geminiService';
import { AppState, TranscriptionResult, AudioFile } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (file: File) => {
    setState(AppState.PROCESSING);
    setError(null);
    
    // Create preview URL for audio playback
    const previewUrl = URL.createObjectURL(file);
    setAudioFile({ file, previewUrl });

    try {
      const base64Audio = await fileToBase64(file);
      const data = await processAudio(base64Audio);
      setResult(data);
      setState(AppState.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Failed to process audio. Please try again with a clear Japanese audio file.");
      setState(AppState.ERROR);
    }
  };

  const reset = useCallback(() => {
    if (audioFile?.previewUrl) {
      URL.revokeObjectURL(audioFile.previewUrl);
    }
    setResult(null);
    setAudioFile(null);
    setState(AppState.IDLE);
    setError(null);
  }, [audioFile]);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">J-Translate Audio Master</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            High-precision Japanese-to-Chinese transcription & translation for your audio recordings.
          </p>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0114.14 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Interface Area */}
        <main className="relative">
          {(state === AppState.IDLE || state === AppState.PROCESSING || state === AppState.ERROR) ? (
            <AudioUploader onFileSelect={handleFileSelect} isLoading={state === AppState.PROCESSING} />
          ) : (
            result && audioFile && (
              <ResultDisplay 
                result={result} 
                audioUrl={audioFile.previewUrl} 
                onReset={reset} 
              />
            )
          )}
        </main>

        {/* Features / Help */}
        {state === AppState.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { 
                title: "WAV Support", 
                desc: "Optimized for high-fidelity .wav audio files.", 
                icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              },
              { 
                title: "Direct Translation", 
                desc: "Instant Chinese translation from Japanese source.", 
                icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              },
              { 
                title: "AI Precision", 
                desc: "Powered by Gemini for contextual understanding.", 
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}

        <footer className="pt-12 pb-8 text-center border-t border-slate-100">
          <p className="text-slate-400 text-sm">© 2024 J-Translate Audio Master • Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
