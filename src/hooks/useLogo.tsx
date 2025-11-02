
const UseLogo = ({ width = 200, height = 60 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      {/* Background rounded rectangle */}
      <rect x="0" y="0" width="200" height="60" rx="8" fill="#2d5016" />
      
      {/* Leaf icon on the left */}
      <g transform="translate(15, 15)">
        {/* Leaf shape */}
        <path
          d="M 15 0 Q 25 10, 15 30 Q 5 10, 15 0 Z"
          fill="#7fb069"
          stroke="#9cc97f"
          strokeWidth="1"
        />
        {/* Leaf vein */}
        <line x1="15" y1="5" x2="15" y2="25" stroke="#558b3a" strokeWidth="1.5" />
      </g>
      
      {/* Calculator grid icon on the right side */}
      <g transform="translate(170, 20)">
        <rect x="0" y="0" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="5" y="0" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="10" y="0" width="3" height="3" rx="0.5" fill="#7fb069" />
        
        <rect x="0" y="5" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="5" y="5" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="10" y="5" width="3" height="3" rx="0.5" fill="#7fb069" />
        
        <rect x="0" y="10" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="5" y="10" width="3" height="3" rx="0.5" fill="#7fb069" />
        <rect x="10" y="10" width="3" height="3" rx="0.5" fill="#7fb069" />
      </g>
      
      {/* Text: Farmculator */}
      <text
        x="50"
        y="38"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="#ffffff"
        letterSpacing="1"
      >
        Farmculator
      </text>
    </svg>
  );
};
export default UseLogo;