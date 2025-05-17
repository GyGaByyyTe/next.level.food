'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import cl from './ImagePicker.module.css';

export default function ImagePicker({
  label,
  name,
}: {
  label?: string;
  name: string;
}) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };

        reader.readAsDataURL(file);
      } else {
        setImage(null);
      }
    },
    [],
  );

  const handleFileSelect = useCallback(
    () => imageInputRef.current?.click(),
    [],
  );

  return (
    <div className={cl.picker}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={cl.controls}>
        <div className={cl.preview}>
          {!image && <p>No image selected</p>}
          {image && (
            <Image fill src={image} alt="The image selected by the user." />
          )}
        </div>
        <input
          id={name}
          name={name}
          ref={imageInputRef}
          type="file"
          className={cl.input}
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          data-testid="file-input"
        />
        <button type="button" className={cl.button} onClick={handleFileSelect}>
          Pick an image
        </button>
      </div>
    </div>
  );
}
