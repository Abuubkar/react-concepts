import React from 'react';

export default function Button({ variant = 'primary', className = '', ...props }) {
  const baseClass = variant === 'secondary' ? 'example-button example-button-secondary' : 'example-button';
  return (
    <button
      className={`${baseClass} ${className}`.trim()}
      {...props}
    />
  );
}
