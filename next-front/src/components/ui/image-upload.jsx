// components/ui/image-upload.jsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';

export function ImageUpload({ value = [], onChange, disabled, maxFiles = 5 }) {
  const [files, setFiles] = useState(value);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  }, [files, onChange, maxFiles]);

  const removeFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    onChange(updatedFiles);
    
    // Revoke the data uris to avoid memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    maxFiles: maxFiles - files.length // Dynamic max based on current files
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
          hover:border-primary transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the images here...</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop images here or click to browse
            </p>
            <Button variant="outline" type="button" disabled={disabled}>
              Select Images
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          JPEG, PNG, JPG, GIF up to 2MB each. Max {maxFiles} images total.
        </p>
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {files.length} image{files.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={file.preview || (typeof file === 'string' ? file : URL.createObjectURL(file))}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
                type="button"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}