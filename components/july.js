import React from 'react';
import Image from 'next/image'; // Assuming you're using Next.js

const July = () => {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Image
        src="/july.svg" // Path to the image in the public folder
        alt="July Landscape"
        layout="responsive"
        width={1920} // Standard landscape width
        height={1080} // Standard landscape height
        priority // Ensures the image loads quickly
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default July;