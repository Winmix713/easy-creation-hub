import { SuperellipseState } from '@/types/layers';
import { Download } from 'lucide-react';

interface ExportTabProps {
  state?: SuperellipseState;
  pathData: string;
}

export function ExportTab({ state, pathData }: ExportTabProps) {
  if (!state) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        <p>No state available</p>
      </div>
    );
  }

  const generateSVG = () => {
    const gradient =
      state.fillType === 'linear'
        ? `<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${state.gradientAngle} 0.5 0.5)">
      ${state.gradientStops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}" />`).join('\n      ')}
    </linearGradient>`
        : state.fillType === 'radial'
        ? `<radialGradient id="gradient">
      ${state.gradientStops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}" />`).join('\n      ')}
    </radialGradient>`
        : '';

    return `<svg width="${state.width}" height="${state.height}" viewBox="0 0 ${state.width} ${state.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradient}
  </defs>
  <path
    d="${pathData}"
    fill="${state.fillType === 'solid' ? state.solidColor : 'url(#gradient)'}"
    ${state.strokeWidth > 0 ? `stroke="${state.strokeColor}" stroke-width="${state.strokeWidth}"` : ''}
  />
</svg>`;
  };

  const generateReactComponent = () => {
    return `import React from 'react';

interface SuperellipseProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Superellipse: React.FC<SuperellipseProps> = ({
  width = ${state.width},
  height = ${state.height},
  className = ''
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 ${state.width} ${state.height}"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    ${state.fillType !== 'solid' ? `<defs>
      ${state.fillType === 'linear' ? `<linearGradient id="gradient">
        ${state.gradientStops.map((s) => `<stop offset="${s.position}%" stopColor="${s.color}" />`).join('\n        ')}
      </linearGradient>` : ''}
    </defs>` : ''}
    <path
      d="${pathData}"
      fill="${state.fillType === 'solid' ? state.solidColor : 'url(#gradient)'}"
      ${state.strokeWidth > 0 ? `stroke="${state.strokeColor}" strokeWidth="${state.strokeWidth}"` : ''}
    />
  </svg>
);`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSVG = () => {
    downloadFile(generateSVG(), 'superellipse.svg', 'image/svg+xml');
  };

  const exportPNG = async (scale: number = 1) => {
    const svg = generateSVG();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = state.width * scale;
    canvas.height = state.height * scale;

    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `superellipse${scale > 1 ? `@${scale}x` : ''}.png`;
          a.click();
          URL.revokeObjectURL(pngUrl);
        }
      });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const exportReact = () => {
    downloadFile(generateReactComponent(), 'Superellipse.tsx', 'text/typescript');
  };

  const exportJSON = () => {
    const json = JSON.stringify(state, null, 2);
    downloadFile(json, 'superellipse-config.json', 'application/json');
  };

  const exportCSS = () => {
    const css = `.superellipse {
  width: ${state.width}px;
  height: ${state.height}px;
  clip-path: path('${pathData}');
}`;
    downloadFile(css, 'superellipse.css', 'text/css');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Vector Format</h3>
        <button
          onClick={exportSVG}
          className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Export SVG</div>
              <div className="text-xs text-neutral-400">Scalable vector graphics</div>
            </div>
          </div>
          <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.svg</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Raster Formats</h3>
        <div className="space-y-2">
          <button
            onClick={() => exportPNG(1)}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export PNG @1x</div>
                <div className="text-xs text-neutral-400">{state.width} × {state.height}px</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.png</span>
          </button>

          <button
            onClick={() => exportPNG(2)}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export PNG @2x</div>
                <div className="text-xs text-neutral-400">{state.width * 2} × {state.height * 2}px (Retina)</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.png</span>
          </button>

          <button
            onClick={() => exportPNG(4)}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export PNG @4x</div>
                <div className="text-xs text-neutral-400">{state.width * 4} × {state.height * 4}px (High-res)</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.png</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Code Exports</h3>
        <div className="space-y-2">
          <button
            onClick={exportReact}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export React Component</div>
                <div className="text-xs text-neutral-400">TypeScript JSX component</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.tsx</span>
          </button>

          <button
            onClick={exportCSS}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export CSS</div>
                <div className="text-xs text-neutral-400">Stylesheet with clip-path</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.css</span>
          </button>

          <button
            onClick={exportJSON}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export Config JSON</div>
                <div className="text-xs text-neutral-400">Configuration backup</div>
              </div>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-neutral-400">.json</span>
          </button>
        </div>
      </div>
    </div>
  );
}
