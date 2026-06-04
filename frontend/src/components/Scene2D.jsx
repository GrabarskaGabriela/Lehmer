import { useEffect, useRef } from 'react';

export function Scene2D({ vals, width = 400, height = 400 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const p = 45;
    const innerW = width - 2 * p;
    const innerH = height - 2 * p;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();

    for (let i = 0; i <= 10; i++) {
      const ratio = i / 10;
      const x = p + ratio * innerW;
      const y = p + ratio * innerH;

      ctx.moveTo(x, p);
      ctx.lineTo(x, height - p);

      ctx.moveTo(p, y);
      ctx.lineTo(width - p, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p, height - p);
    ctx.lineTo(width - p + 10, height - p);
    ctx.moveTo(p, height - p);
    ctx.lineTo(p, p - 10);
    ctx.stroke();

    ctx.fillStyle = '#2563eb';
    for (let i = 0; i < vals.length - 1; i++) {
      const x = p + vals[i] * innerW;
      const y = p + (1 - vals[i + 1]) * innerH;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('r_i', width - p + 15, height - p + 5);
    ctx.fillText('r_i+1', p - 15, p - 20);

    ctx.font = '10px sans-serif';
    ctx.fillText('0', p - 15, height - p + 15);
    ctx.fillText('1.0', width - p - 5, height - p + 15);
    ctx.fillText('1.0', p - 25, p + 5);
  }, [vals, width, height]);

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 10px -2px rgb(0 0 0 / 0.1)',
          background: 'white',
        }}
      />
      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', fontWeight: '600' }}>
        Korelacja par: (r<sub>i</sub>, r<sub>i+1</sub>)
      </p>
    </div>
  );
}
