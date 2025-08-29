export const RemovePin = () => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <defs>
        <mask id="removePinMask">
          <rect width="24" height="24" fill="white" />
          <line x1="4" y1="2" x2="21" y2="12" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </mask>
      </defs>
      <g mask="url(#removePinMask)">
        {/* Head */}
        <rect x="7" y="2" width="10" height="3" rx="1" />
        {/* Body & wings */}
        <path d="M9 5v5.5L7.2 12.9c-.1.1-.2.3-.2.5V14h10v-2.6c0-.2-.1-.4-.2-.5L15 10.5V5H9z" />
        {/* Needle */}
        <rect x="11.25" y="14" width="1.5" height="5" rx="0.75" />
      </g>
      <line x1="3" y1="4" x2="21" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
