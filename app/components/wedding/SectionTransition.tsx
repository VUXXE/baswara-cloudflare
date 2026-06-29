import React from 'react';

interface SectionTransitionProps {
  /** Color at the TOP edge — should match the section ABOVE */
  topColor?: string;
  /** Color at the BOTTOM edge — should match the section BELOW */
  bottomColor?: string;
  /** Height of each gradient strip (default: h-20) */
  height?: string;
}

/**
 * Adds subtle gradient fade-in/out strips at the top and bottom of a section,
 * making snap-scroll transitions look softer and more intentional.
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  topColor,
  bottomColor,
  height = 'h-20',
}) => (
  <>
    {topColor && (
      <div
        className={`absolute inset-x-0 top-0 ${height} pointer-events-none z-10`}
        style={{
          background: `linear-gradient(to bottom, ${topColor}, transparent)`,
        }}
      />
    )}
    {bottomColor && (
      <div
        className={`absolute inset-x-0 bottom-0 ${height} pointer-events-none z-10`}
        style={{
          background: `linear-gradient(to top, ${bottomColor}, transparent)`,
        }}
      />
    )}
  </>
);
