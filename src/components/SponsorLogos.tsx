import React from 'react';

// Bed SVG Icon inside a circular frame
export const BedIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <div className={`relative rounded-full border-3 border-brand-blue bg-white flex items-center justify-center overflow-hidden p-1 shadow-sm ${className}`}>
      <img
        src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143415/1744572362Continental-STD-1-Pillow_ado4y9.png"
        alt="Cama Continental Plus"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
};

// Almacenes La Casita logo
export const LaCasitaLogo: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => {
  return (
    <div className={`relative rounded-full border-2 border-brand-yellow bg-white flex items-center justify-center overflow-hidden p-[2px] shadow-sm ${className}`}>
      <img
        src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1761609802/484572438_971815318422480_2820434675311835023_n_1_kl9pyl.jpg"
        alt="Almacenes La Casita Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

// Camas Florida Logo
export const CamasFloridaLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <div className={`relative rounded-full border-3 border-brand-blue bg-white flex items-center justify-center overflow-hidden p-[2px] shadow-sm ${className}`}>
      <img
        src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1772143448/images_mk1pkl.jpg"
        alt="Camas Florida Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

// Procedural high-fidelity SVG QR Code component that displays participant code dynamically
export const DynamicQRCode: React.FC<{ value: string; className?: string }> = ({ value, className = 'w-28 h-28' }) => {
  // Use a neat repeating procedural grid representing a real QR code
  // Generate pseudo-random pixels seeded by the unique ID value
  const getSeededGrid = (seed: string) => {
    const size = 15;
    const grid: boolean[][] = [];
    
    // Hash seed to numbers
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    for (let r = 0; r < size; r++) {
      grid[r] = [];
      for (let c = 0; c < size; c++) {
        // Essential QR corner frames
        const isTopLeft = r < 4 && c < 4;
        const isTopRight = r < 4 && c >= size -  4;
        const isBottomLeft = r >= size - 4 && c < 4;

        if (isTopLeft) {
          // outer border
          grid[r][c] = (r === 0 || r === 3 || c === 0 || c === 3);
          // center dot
          if (r === 1.5 || r === 2 || r === 1) {
            if (c === 1.5 || c === 2 || c === 1) grid[r][c] = true;
          }
        } else if (isTopRight) {
          grid[r][c] = (r === 0 || r === 3 || c === size - 4 || c === size - 1);
          if (r === 1.5 || r === 2 || r === 1) {
            if (c === size - 3 || c === size - 2) grid[r][c] = true;
          }
        } else if (isBottomLeft) {
          grid[r][c] = (r === size - 4 || r === size - 1 || c === 0 || c === 3);
          if (r === size - 3 || r === size - 2) {
            if (c === 1.5 || c === 2 || c === 1) grid[r][c] = true;
          }
        } else {
          // Procedural pseudo-random generation based on seed and position
          const val = Math.abs(Math.sin((r * 12.9898 + c * 78.233 + hash) * 43758.5453));
          grid[r][c] = val > 0.45;
        }
      }
    }
    return grid;
  };

  const grid = getSeededGrid(value);
  const size = grid.length;

  return (
    <div className={`p-2 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        {grid.map((row, r) =>
          row.map((active, c) => (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width="1.05"
              height="1.05"
              fill={active ? '#002D62' : '#FFFFFF'}
            />
          ))
        )}
      </svg>
      <span className="text-[10px] font-mono font-bold text-brand-blue mt-1 select-all">{value}</span>
    </div>
  );
};
