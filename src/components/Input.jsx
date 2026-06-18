import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`example-input ${className}`.trim()}
      {...props}
    />
  );
}
