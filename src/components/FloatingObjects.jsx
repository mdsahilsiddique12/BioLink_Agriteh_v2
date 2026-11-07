import { useMemo } from 'react';
import './FloatingObjects.css';

export default function FloatingObjects({ sector = 'corporate' }) {
  // Generate sector-specific floating 3D glass objects
  const objects = useMemo(() => {
    switch (sector) {
      case 'manure':
        return [
          { id: 1, type: 'orb-green', size: 68, top: '14%', left: '8%', delay: '0s', duration: '9s' },
          { id: 2, type: 'crystal-green', size: 52, top: '28%', right: '10%', delay: '1.5s', duration: '11s' },
          { id: 3, type: 'ring-green', size: 84, top: '62%', left: '5%', delay: '3s', duration: '13s' },
          { id: 4, type: 'pill-green', size: 44, top: '48%', right: '8%', delay: '2s', duration: '10s' },
          { id: 5, type: 'droplet-green', size: 36, top: '78%', right: '18%', delay: '4s', duration: '8s' },
        ];
      case 'feed':
        return [
          { id: 1, type: 'orb-gold', size: 72, top: '15%', left: '7%', delay: '0.5s', duration: '10s' },
          { id: 2, type: 'crystal-amber', size: 58, top: '24%', right: '9%', delay: '2s', duration: '12s' },
          { id: 3, type: 'ring-gold', size: 90, top: '58%', left: '6%', delay: '3.5s', duration: '14s' },
          { id: 4, type: 'grain-gold', size: 48, top: '45%', right: '7%', delay: '1s', duration: '9s' },
          { id: 5, type: 'droplet-amber', size: 40, top: '75%', right: '16%', delay: '2.5s', duration: '11s' },
        ];
      case 'seabuckthorn':
        return [
          { id: 1, type: 'orb-orange', size: 74, top: '16%', left: '8%', delay: '0s', duration: '10s' },
          { id: 2, type: 'crystal-ruby', size: 56, top: '22%', right: '11%', delay: '1.8s', duration: '12s' },
          { id: 3, type: 'ring-orange', size: 86, top: '64%', left: '6%', delay: '3.2s', duration: '13s' },
          { id: 4, type: 'berry-orange', size: 46, top: '44%', right: '8%', delay: '2.2s', duration: '9s' },
          { id: 5, type: 'droplet-ruby', size: 38, top: '76%', right: '19%', delay: '4.5s', duration: '10s' },
        ];
      default: // corporate
        return [
          { id: 1, type: 'orb-blue', size: 70, top: '14%', left: '7%', delay: '0s', duration: '11s' },
          { id: 2, type: 'crystal-blue', size: 54, top: '25%', right: '10%', delay: '1.5s', duration: '13s' },
          { id: 3, type: 'ring-blue', size: 88, top: '60%', left: '5%', delay: '3s', duration: '14s' },
          { id: 4, type: 'prism-blue', size: 46, top: '48%', right: '8%', delay: '2s', duration: '10s' },
          { id: 5, type: 'droplet-blue', size: 36, top: '74%', right: '17%', delay: '4s', duration: '9s' },
        ];
    }
  }, [sector]);

  return (
    <div className="neu-floating-universe" aria-hidden="true">
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`floating-3d-obj ${obj.type}`}
          style={{
            width: `${obj.size}px`,
            height: `${obj.size}px`,
            top: obj.top,
            left: obj.left,
            right: obj.right,
            animationDelay: obj.delay,
            animationDuration: obj.duration,
          }}
        >
          <div className="obj-glass-inner" />
          <div className="obj-specular-highlight" />
        </div>
      ))}
    </div>
  );
}
