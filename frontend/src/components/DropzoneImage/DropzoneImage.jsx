import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import './DropzoneImage.css';

const DropzoneImage = ({ onFileSelect, preview, onClear }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const rejectionMessage = fileRejections.length > 0
    ? fileRejections[0].errors[0].code === 'file-too-large'
      ? 'El archivo es demasiado grande (máx. 5MB)'
      : 'Tipo de archivo no soportado (usa JPG, PNG o WebP)'
    : null;

  return (
    <div className="dropzone-wrapper">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${preview ? 'dropzone--has-preview' : ''}`}
        id="dropzone-area"
      >
        <input {...getInputProps()} id="dropzone-input" />

        {preview ? (
          <div className="dropzone-preview">
            <img
              src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)}
              alt="Preview"
              className="dropzone-preview-image"
            />
            <div className="dropzone-preview-overlay">
              <HiOutlinePhotograph />
              <span>Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="dropzone-placeholder">
            <HiOutlineUpload className="dropzone-icon" />
            {isDragActive ? (
              <p className="dropzone-text">Suelta la imagen aquí...</p>
            ) : (
              <>
                <p className="dropzone-text">
                  Arrastra una imagen aquí o <span className="dropzone-browse">busca en tu equipo</span>
                </p>
                <p className="dropzone-hint">JPG, PNG o WebP • Máx. 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {preview && (
        <button
          type="button"
          className="dropzone-clear-btn"
          id="dropzone-clear"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <HiOutlineX /> Quitar imagen
        </button>
      )}

      {rejectionMessage && (
        <p className="dropzone-error">{rejectionMessage}</p>
      )}
    </div>
  );
};

export default DropzoneImage;
