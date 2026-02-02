import React, { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuperellipseState } from '@/types';
import { Copy, Check } from 'lucide-react';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: SuperellipseState;
  pathData: string;
}

/**
 * Export Code Modal Component
 * Shows exportable code in various formats
 */
export const ExportCodeModal: React.FC<ExportCodeModalProps> = memo(({
  isOpen,
  onClose,
  state,
  pathData,
}) => {
  const [copied, setCopied] = useState(false);

  const generateSVG = () => {
    const gradientId = 'superellipse-gradient';
    const gradientStops = state.gradientStops
      .map(s => `<stop offset="${s.position * 100}%" stop-color="${s.color}"/>`)
      .join('\n      ');

    return `<svg width="${state.width}" height="${state.height}" viewBox="0 0 ${state.width} ${state.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" gradientTransform="rotate(${state.gradientAngle})">
      ${gradientStops}
    </linearGradient>
  </defs>
  <path 
    d="${pathData}" 
    fill="${state.useGradient ? `url(#${gradientId})` : state.solidColor}"
    ${state.hasStroke ? `stroke="${state.strokeColor}" stroke-width="${state.strokeWidth}"` : ''}
  />
</svg>`;
  };

  const generateReact = () => {
    return `import React from 'react';

const Superellipse = () => {
  const pathData = "${pathData}";
  
  return (
    <svg width={${state.width}} height={${state.height}} viewBox="0 0 ${state.width} ${state.height}">
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(${state.gradientAngle})">
          ${state.gradientStops.map(s => `<stop offset="${s.position * 100}%" stopColor="${s.color}" />`).join('\n          ')}
        </linearGradient>
      </defs>
      <path 
        d={pathData} 
        fill="${state.useGradient ? 'url(#gradient)' : state.solidColor}"
        ${state.hasStroke ? `stroke="${state.strokeColor}" strokeWidth={${state.strokeWidth}}` : ''}
      />
    </svg>
  );
};

export default Superellipse;`;
  };

  const generateCSS = () => {
    return `.superellipse {
  width: ${state.width}px;
  height: ${state.height}px;
  background: ${state.useGradient 
    ? `linear-gradient(${state.gradientAngle}deg, ${state.gradientStops.map(s => `${s.color} ${s.position * 100}%`).join(', ')})` 
    : state.solidColor};
  clip-path: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><path d="${encodeURIComponent(pathData)}"/></svg>');
  ${state.hasStroke ? `border: ${state.strokeWidth}px solid ${state.strokeColor};` : ''}
}`;
  };

  const generateJSON = () => {
    return JSON.stringify(state, null, 2);
  };

  const codeMap: Record<string, string> = {
    svg: generateSVG(),
    react: generateReact(),
    css: generateCSS(),
    json: generateJSON(),
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Export Code</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="svg" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          {Object.entries(codeMap).map(([format, code]) => (
            <TabsContent key={format} value={format} className="mt-4">
              <div className="relative">
                <pre className="bg-secondary rounded-lg p-4 text-sm overflow-auto max-h-96 font-mono">
                  <code>{code}</code>
                </pre>
                <button
                  onClick={() => handleCopy(code)}
                  className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

ExportCodeModal.displayName = 'ExportCodeModal';
