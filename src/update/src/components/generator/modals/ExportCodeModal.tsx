import { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { SuperellipseState } from '@/types/layers';
import { cn } from '@/lib/utils';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SuperellipseState;
  pathData: string;
}

type CodeFormat = 'svg' | 'css' | 'react' | 'vue';

export function ExportCodeModal({ isOpen, onClose, state, pathData }: ExportCodeModalProps) {
  const [activeFormat, setActiveFormat] = useState<CodeFormat>('svg');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateSVGCode = () => {
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
  ${gradient ? `<defs>\n    ${gradient}\n  </defs>` : ''}
  <path
    d="${pathData}"
    fill="${state.fillType === 'solid' ? state.solidColor : 'url(#gradient)'}"
    ${state.strokeWidth > 0 ? `stroke="${state.strokeColor}" stroke-width="${state.strokeWidth}"` : ''}
  />
</svg>`;
  };

  const generateCSSCode = () => {
    const getFill = () => {
      if (state.fillType === 'solid') return state.solidColor;
      if (state.fillType === 'linear') {
        return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(', ')})`;
      }
      if (state.fillType === 'radial') {
        return `radial-gradient(circle, ${state.gradientStops
          .map((s) => `${s.color} ${s.position}%`)
          .join(', ')})`;
      }
      return state.solidColor;
    };

    return `.superellipse {
  width: ${state.width}px;
  height: ${state.height}px;
  background: ${getFill()};
  ${state.blur > 0 ? `filter: blur(${state.blur}px);` : ''}
  ${state.strokeWidth > 0 ? `border: ${state.strokeWidth}px solid ${state.strokeColor};` : ''}
  clip-path: path('${pathData}');
  
  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glow Effect */
${
  state.glowEnabled
    ? `.superellipse::before {
  content: '';
  position: absolute;
  inset: -${state.glowLayers[0]?.blur || 10}px;
  background: ${state.glowColor};
  filter: blur(${state.glowLayers[0]?.blur || 10}px);
  opacity: ${(state.glowIntensity * (state.glowLayers[0]?.opacity || 80)) / 10000};
  z-index: -1;
}`
    : ''
}`;
  };

  const generateReactCode = () => {
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
    ${
      state.fillType !== 'solid'
        ? `<defs>
      <linearGradient id="gradient">
        ${state.gradientStops.map((s) => `<stop offset="${s.position}%" stopColor="${s.color}" />`).join('\n        ')}
      </linearGradient>
    </defs>`
        : ''
    }
    <path
      d="${pathData}"
      fill="${state.fillType === 'solid' ? state.solidColor : 'url(#gradient)'}"
      ${state.strokeWidth > 0 ? `stroke="${state.strokeColor}" strokeWidth="${state.strokeWidth}"` : ''}
    />
  </svg>
);

export default Superellipse;`;
  };

  const generateVueCode = () => {
    return `<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 ${state.width} ${state.height}"
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${
      state.fillType !== 'solid'
        ? `<defs>
      <linearGradient id="gradient">
        ${state.gradientStops.map((s) => `<stop offset="${s.position}%" stop-color="${s.color}" />`).join('\n        ')}
      </linearGradient>
    </defs>`
        : ''
    }
    <path
      d="${pathData}"
      :fill="fill"
      ${state.strokeWidth > 0 ? `:stroke="stroke" :stroke-width="strokeWidth"` : ''}
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  width?: number;
  height?: number;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: ${state.width},
  height: ${state.height},
  className: ''
});

const fill = '${state.fillType === 'solid' ? state.solidColor : 'url(#gradient)'}';
${state.strokeWidth > 0 ? `const stroke = '${state.strokeColor}';\nconst strokeWidth = ${state.strokeWidth};` : ''}
</script>`;
  };

  const getCode = () => {
    switch (activeFormat) {
      case 'svg':
        return generateSVGCode();
      case 'css':
        return generateCSSCode();
      case 'react':
        return generateReactCode();
      case 'vue':
        return generateVueCode();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getCode();
    const extensions = { svg: 'svg', css: 'css', react: 'tsx', vue: 'vue' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superellipse.${extensions[activeFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formats = [
    { id: 'svg' as CodeFormat, label: 'SVG', desc: 'Scalable Vector' },
    { id: 'css' as CodeFormat, label: 'CSS', desc: 'Stylesheet' },
    { id: 'react' as CodeFormat, label: 'React', desc: 'TSX Component' },
    { id: 'vue' as CodeFormat, label: 'Vue', desc: 'SFC Component' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Export Code</h2>
            <p className="text-sm text-neutral-400 mt-1">Copy or download your superellipse code</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Tabs */}
        <div className="flex gap-2 px-6 pt-6 border-b border-neutral-800">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setActiveFormat(format.id)}
              className={cn(
                'px-4 py-3 rounded-t-lg transition-colors border-b-2',
                activeFormat === format.id
                  ? 'bg-neutral-800 text-white border-blue-500'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 border-transparent'
              )}
            >
              <div className="font-medium">{format.label}</div>
              <div className="text-xs opacity-60">{format.desc}</div>
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="relative">
            <pre className="bg-neutral-950 rounded-lg p-6 overflow-x-auto border border-neutral-800">
              <code className="text-sm text-neutral-300 font-mono">{getCode()}</code>
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-800 bg-neutral-900/50">
          <div className="text-xs text-neutral-500">
            {activeFormat.toUpperCase()} • {getCode().split('\n').length} lines
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
