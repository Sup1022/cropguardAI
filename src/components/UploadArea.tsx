import { useRef, useState, useCallback } from 'react';
import { Upload, Camera, ImageIcon, X, AlertCircle, RefreshCw } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface UploadAreaProps {
  lang: Language;
  imageUrl: string | null;
  onImage: (dataUrl: string) => void;
  onClear: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadArea({ lang, imageUrl, onImage, onClear }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError(t(lang, 'error_image'));
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File too large. Max 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string);
    reader.onerror = () => setError(t(lang, 'error_image'));
    reader.readAsDataURL(file);
  }, [lang, onImage]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
          {t(lang, 'upload_title')}
        </h2>
        <p className="text-sm text-neutral-500">{t(lang, 'upload_subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {imageUrl ? (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 group">
            <img src={imageUrl} alt="Uploaded leaf" className="w-full max-h-80 object-contain" />
            <button
              onClick={onClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => inputRef.current?.click()} className="btn-secondary w-full">
            <RefreshCw className="w-4 h-4" />
            {t(lang, 'upload_retake')}
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all p-8 sm:p-12 text-center
            ${dragging
              ? 'border-primary-500 bg-primary-50 scale-[1.01]'
              : 'border-neutral-300 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/50'}`}
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-md animate-bounce-subtle">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <p className="font-semibold text-neutral-700 mb-1">{t(lang, 'upload_drop')}</p>
          <p className="text-xs text-neutral-400 mb-4">{t(lang, 'upload_hint')}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="btn-secondary text-sm px-4 py-2"
            >
              <ImageIcon className="w-4 h-4" />
              {t(lang, 'upload_browse')}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
              className="btn-primary text-sm px-4 py-2"
            >
              <Camera className="w-4 h-4" />
              {t(lang, 'upload_camera')}
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
