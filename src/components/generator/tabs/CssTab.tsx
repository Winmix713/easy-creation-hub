import { SuperellipseState } from '@/types/layers';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CssTabProps {
  state?: SuperellipseState;
  pathData: string;
}

export function CssTab({ state, pathData }: CssTabProps) {
  const [format, setFormat] = useState<'css' | 'scss' | 'tailwind' | 'js'>('css');
  const [copied, setCopied] = useState(false);

  if (!state) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        <p>No state available</p>
      </div>
    );
  }

  const generateCSS = () => {
    const gradient =
      state.fillType === 'solid'
        ? state.solidColor
        : state.fillType === 'linear'
        ? `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(', ')})`
        : state.fillType === 'radial'
        ? `radial-gradient(circle, ${state.gradientStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(', ')})`
        : `conic-gradient(from ${state.gradientAngle}deg, ${state.gradientStops
            .map((s) => `${s.color} ${s.position}%`)
            .join(', ')})`;

    const glowFilter = state.glowEnabled
      ? state.glowLayers
          .filter((l) => l.enabled)
          .map((l) => `drop-shadow(0 0 ${l.blur}px ${state.glowColor})`)
          .join(' ')
      : '';

    if (format === 'css') {
      return `.superellipse {
  /* Dimensions */
  --se-width: ${state.width}px;
  --se-height: ${state.height}px;
  
  /* Colors */
  --se-bg: ${gradient};
  --se-stroke-color: ${state.strokeColor};
  --se-glow-color: ${state.glowColor};
  
  /* Effects */
  --se-blur: ${state.blur}px;
  --se-stroke-width: ${state.strokeWidth}px;
  
  width: var(--se-width);
  height: var(--se-height);
  background: var(--se-bg);
  ${state.blur > 0 ? `filter: blur(var(--se-blur));` : ''}
  ${glowFilter ? `filter: ${glowFilter};` : ''}
  ${state.strokeWidth > 0 ? `border: var(--se-stroke-width) solid var(--se-stroke-color);` : ''}
  clip-path: path('${pathData}');
}`;
    } else if (format === 'scss') {
      return `$se-width: ${state.width}px;
$se-height: ${state.height}px;
$se-bg: ${gradient};
$se-stroke-color: ${state.strokeColor};

.superellipse {
  width: $se-width;
  height: $se-height;
  background: $se-bg;
  ${state.blur > 0 ? `filter: blur(${state.blur}px);` : ''}
  ${glowFilter ? `filter: ${glowFilter};` : ''}
  ${state.strokeWidth > 0 ? `border: ${state.strokeWidth}px solid $se-stroke-color;` : ''}
  clip-path: path('${pathData}');
}`;
    } else if (format === 'tailwind') {
      return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      width: {
        'superellipse': '${state.width}px',
      },
      height: {
        'superellipse': '${state.height}px',
      },
    },
  },
}

// Component
<div className="w-superellipse h-superellipse" style={{
  background: '${gradient}',
  clipPath: "path('${pathData}')",
  ${state.blur > 0 ? `filter: 'blur(${state.blur}px)',` : ''}
}} />`;
    } else {
      return `// CSS-in-JS (styled-components / emotion)
const Superellipse = styled.div\`
  width: ${state.width}px;
  height: ${state.height}px;
  background: ${gradient};
  ${state.blur > 0 ? `filter: blur(${state.blur}px);` : ''}
  ${glowFilter ? `filter: ${glowFilter};` : ''}
  ${state.strokeWidth > 0 ? `border: ${state.strokeWidth}px solid ${state.strokeColor};` : ''}
  clip-path: path('${pathData}');
\`;`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div>
        <label className="text-xs text-neutral-400 mb-2 block">Code Format</label>
        <div className="grid grid-cols-4 gap-2">
          {(['css', 'scss', 'tailwind', 'js'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                format === fmt
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-xs text-neutral-300 overflow-x-auto font-mono max-h-96 overflow-y-auto">
          {generateCSS()}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-white"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Browser Support */}
      <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
        <h4 className="text-xs font-semibold text-white mb-2">Browser Support</h4>
        <p className="text-xs text-neutral-400">
          The <code className="bg-neutral-900 px-1 rounded">clip-path</code> property is supported
          in all modern browsers (Chrome 55+, Firefox 54+, Safari 9.1+, Edge 79+).
        </p>
      </div>
    </div>
  );
}
