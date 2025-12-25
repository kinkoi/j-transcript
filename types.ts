
export interface TranscriptionResult {
  japanese: string;
  chinese: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AudioFile {
  file: File;
  previewUrl: string;
}
