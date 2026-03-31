'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 160, height: 40 },
    md: { width: 200, height: 50 },
    lg: { width: 280, height: 70 }
  };

  const { width, height } = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src="/logo-wide.png"
        alt="Bestemail"
        width={width}
        height={height}
        style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
        priority
      />
    </div>
  );
}
