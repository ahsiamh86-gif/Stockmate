import React from 'react';
import Svg, { Rect, Path, Polyline, Line, Circle } from 'react-native-svg';

// Converted from the original inline-SVG Icon component. Each entry returns
// the same path data, just rendered through react-native-svg elements.
export default function Icon({ name, size = 20, color = '#000' }) {
  const common = { stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

  switch (name) {
    case 'dashboard':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="3" width="7" height="7" {...common} />
          <Rect x="14" y="3" width="7" height="7" {...common} />
          <Rect x="14" y="14" width="7" height="7" {...common} />
          <Rect x="3" y="14" width="7" height="7" {...common} />
        </Svg>
      );
    case 'inventory':
    case 'box':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...common} />
          {name === 'inventory' && (
            <>
              <Polyline points="3.27 6.96 12 12.01 20.73 6.96" {...common} />
              <Line x1="12" y1="22.08" x2="12" y2="12" {...common} />
            </>
          )}
        </Svg>
      );
    case 'sales':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="12" y1="1" x2="12" y2="23" {...common} />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...common} />
        </Svg>
      );
    case 'purchases':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="9" cy="21" r="1" {...common} />
          <Circle cx="20" cy="21" r="1" {...common} />
          <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" {...common} />
        </Svg>
      );
    case 'analytics':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="18" y1="20" x2="18" y2="10" {...common} />
          <Line x1="12" y1="20" x2="12" y2="4" {...common} />
          <Line x1="6" y1="20" x2="6" y2="14" {...common} />
        </Svg>
      );
    case 'backup':
    case 'cloudUpload':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points={name === 'backup' ? '8 17 12 21 16 17' : '16 16 12 12 8 16'} {...common} />
          <Line x1="12" y1="12" x2="12" y2="21" {...common} />
          <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" {...common} />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="3" {...common} />
          <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14M12 2a10 10 0 0 1 0 20M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" {...common} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="10" {...common} />
          <Line x1="12" y1="8" x2="12" y2="16" {...common} />
          <Line x1="8" y1="12" x2="16" y2="12" {...common} />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="11" cy="11" r="8" {...common} />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" {...common} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="20 6 9 17 4 12" {...common} strokeWidth={2.5} />
        </Svg>
      );
    case 'edit':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...common} />
          <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...common} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="3 6 5 6 21 6" {...common} />
          <Path d="M19 6l-1 14H6L5 6" {...common} />
          <Path d="M10 11v6M14 11v6" {...common} />
          <Path d="M9 6V4h6v2" {...common} />
        </Svg>
      );
    case 'cloud':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" {...common} />
        </Svg>
      );
    case 'driveIcon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 2L2 19h20L12 2z" {...common} />
          <Path d="M12 2L6 19" {...common} />
          <Path d="M12 2L18 19" {...common} />
          <Line x1="4" y1="14" x2="20" y2="14" {...common} />
        </Svg>
      );
    case 'restore':
    case 'history':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="1 4 1 10 7 10" {...common} />
          <Path d="M3.51 15a9 9 0 1 0 .49-3.51" {...common} />
          {name === 'history' && <Polyline points="12 7 12 12 15 15" {...common} />}
        </Svg>
      );
    case 'shieldCheck':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />
          <Polyline points="9 12 11 14 15 10" {...common} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...common} />
          <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...common} />
        </Svg>
      );
    case 'warning':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...common} />
          <Line x1="12" y1="9" x2="12" y2="13" {...common} />
          <Line x1="12" y1="17" x2="12.01" y2="17" {...common} />
        </Svg>
      );
    case 'download':
    case 'upload':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...common} />
          <Polyline points={name === 'download' ? '7 10 12 15 17 10' : '17 8 12 3 7 8'} {...common} />
          <Line x1="12" y1={name === 'download' ? '15' : '3'} x2="12" y2={name === 'download' ? '3' : '15'} {...common} />
        </Svg>
      );
    case 'palette':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="13.5" cy="6.5" r="0.5" fill={color} />
          <Circle cx="17.5" cy="10.5" r="0.5" fill={color} />
          <Circle cx="8.5" cy="7.5" r="0.5" fill={color} />
          <Circle cx="6.5" cy="12.5" r="0.5" fill={color} />
          <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-1c0-.55-.22-1.05-.59-1.41-.36-.36-.59-.86-.59-1.41 0-1.1.9-2 2-2h2c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" {...common} />
        </Svg>
      );
    case 'trend':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...common} />
          <Polyline points="17 6 23 6 23 12" {...common} />
        </Svg>
      );
    case 'receipt':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...common} />
          <Polyline points="14 2 14 8 20 8" {...common} />
          <Line x1="16" y1="13" x2="8" y2="13" {...common} />
          <Line x1="16" y1="17" x2="8" y2="17" {...common} />
        </Svg>
      );
    default:
      return null;
  }
}
