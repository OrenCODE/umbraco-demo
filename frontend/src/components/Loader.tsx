import React from 'react';

interface LoaderProps {
  count?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ count = 1, color = 'bg-current' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full ${color} align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]`}
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ))}
    </div>
  );
};

export default Loader;
