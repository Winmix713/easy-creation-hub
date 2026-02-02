import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { SuperellipseState, Layer } from "@/types/layers";
import { cn } from "@/lib/utils";
import { LayerRenderer } from "./LayerRenderer";
import { LayerTransformControls } from "./LayerTransformControls";

interface PreviewAreaProps {
  state: SuperellipseState;
  pathData: string;
  layers: Layer[];
  selectedLayerId: string | null;
  zoom: number;
  panX: number;
  panY: number;
  glowEnabled: boolean;
  maskSize: number;
  glowScale: number;
  positionX: number;
  positionY: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
  onRandomColor: () => void;
  onTransformUpdate?: (layerId: string, transform: Partial<Layer['transform']>) => void;
}

type TabType = "shape" | "button" | "card";

// Konstansok kiemelése
const DEFAULT_TRANSITION = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1],
  duration: 0.8,
};

const TAB_TRANSITION = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

// Glow preset konfigurációk
const GLOW_LAYERS = {
  outer: {
    blur: 180,
    opacity: 0.4,
    sizeMultiplier: 1.8,
  },
  middle: {
    blur: 120,
    opacity: 0.6,
    sizeMultiplier: 1.3,
  },
  inner: {
    blur: 60,
    sizeMultiplier: 1.0,
  },
  highlight: {
    blur: { dark: 80, light: 100 },
    opacity: { dark: 0.4, light: 0.7 },
  },
};

// Tab-specifikus méretek
const TAB_DIMENSIONS = {
  shape: { width: "280px", height: "340px" },
  button: { width: "220px", height: "160px" },
  card: { width: "320px", height: "450px" },
};

const PREVIEW_GLOW_SIZES = {
  shape: {
    outer: { width: "280px", height: "340px" },
    middle: { width: "220px", height: "280px" },
    inner: { width: "180px", height: "220px" },
    highlight: { width: "140px", height: "160px" },
  },
  button: {
    outer: { width: "220px", height: "160px" },
    middle: { width: "180px", height: "120px" },
    inner: { width: "140px", height: "80px" },
    highlight: { width: "100px", height: "60px" },
  },
  card: {
    outer: { width: "320px", height: "450px" },
    middle: { width: "240px", height: "360px" },
    inner: { width: "180px", height: "280px" },
    highlight: { width: "140px", height: "200px" },
  },
};

// Utility funkciók
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getBlendMode = (isDark: boolean) =>
  isDark ? "mix-blend-screen" : "mix-blend-normal";

const getTextColor = (isDark: boolean) =>
  isDark ? "text-white" : "text-black";

// Custom hook a theme kezelésére
const useTheme = (backgroundColor: string) => {
  return useMemo(() => {
    const isDark = backgroundColor === "#1a1a1a";
    return {
      isDark,
      glowBlend: getBlendMode(isDark),
      textColor: getTextColor(isDark),
      subtleTextColor: isDark
        ? "text-white/60"
        : "text-black/60",
      buttonBg: isDark ? "bg-white" : "bg-black",
      buttonText: isDark ? "text-black" : "text-white",
      buttonHover: isDark
        ? "hover:bg-white/90"
        : "hover:bg-black/90",
      skipButtonBg: isDark ? "bg-white/10" : "bg-black/5",
      skipButtonText: isDark
        ? "text-white/80"
        : "text-black/60",
      skipButtonHover: isDark
        ? "hover:bg-white/20"
        : "hover:bg-black/10",
      phoneFrameBg: isDark ? "bg-[#050505]" : "bg-white",
      phoneFrameBorder: isDark
        ? "border-zinc-900"
        : "border-zinc-100",
      iconStroke: isDark ? "white" : "black",
    };
  }, [backgroundColor]);
};

export function PreviewArea({
  state,
  layers,
  selectedLayerId,
  zoom,
  panX,
  panY,
  glowEnabled,
  maskSize,
  glowScale,
  positionX,
  positionY,
  noiseEnabled,
  noiseIntensity,
  onRandomColor,
  onTransformUpdate,
}: PreviewAreaProps) {
  const [activeTab, setActiveTab] = useState<TabType>("shape");

  const theme = useTheme(state.backgroundColor);
  const color = state.solidColor;

  // Noise SVG memoizálása
  const noiseSvg = useMemo(
    () =>
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>",
    [],
  );

  // Biztonsági értékek
  const safeMaskSize = clamp(maskSize, 0.1, 1);
  const safeNoiseIntensity = clamp(noiseIntensity, 0, 1);
  const safeGlowScale = clamp(glowScale, 0.5, 2);

  // Tab váltás handler
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // Sort layers by zIndex
  const sortedLayers = useMemo(() => {
    return [...layers].sort((a, b) => a.zIndex - b.zIndex);
  }, [layers]);

  return (
    <section className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 49px, #888 49px, #888 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #888 49px, #888 50px)",
          backgroundSize: "50px 50px",
        }}
        aria-hidden="true"
      />

      {/* Canvas Container */}
      <div
        className="relative"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
          transformOrigin: "center",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Render Layers */}
        {sortedLayers.length > 0 ? (
          <div className="relative flex items-center justify-center" style={{ minWidth: 400, minHeight: 400 }}>
            {sortedLayers.map((layer) => (
              <LayerRenderer
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                onTransformUpdate={onTransformUpdate}
              />
            ))}
          </div>
        ) : (
          /* Fallback to phone frame if no layers */
          <article
            className={cn(
              "relative w-[290px] h-[350px] rounded-[40px] overflow-hidden shadow-2xl border-4 transition-colors duration-500",
              theme.phoneFrameBg,
              theme.phoneFrameBorder,
            )}
          >
            {/* Glow Container */}
            <GlowContainer
              glowEnabled={glowEnabled}
              glowScale={safeGlowScale}
              positionX={positionX}
              positionY={positionY}
              color={color}
              maskSize={safeMaskSize}
              isDark={theme.isDark}
            />

            {/* Noise Overlay */}
            <motion.div
              className="absolute inset-0 w-full h-full pointer-events-none z-[5] mix-blend-overlay"
              style={{
                backgroundImage: `url("${noiseSvg}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "200px 200px",
              }}
              animate={{
                opacity:
                  noiseEnabled && glowEnabled
                    ? safeNoiseIntensity
                    : 0,
              }}
              transition={DEFAULT_TRANSITION}
              aria-hidden="true"
            />

            {/* UI Overlay */}
            <div className="absolute bottom-0 w-full p-8 pb-12 flex flex-col gap-6 z-10">
              {/* Tab Toolbar */}
              <TabToolbar
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />

              {/* Preview Content */}
              <PreviewContent
                activeTab={activeTab}
                glowEnabled={glowEnabled}
                color={color}
                isDark={theme.isDark}
              />

              {/* Workspace Icon */}
              <button
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={onRandomColor}
                aria-label="Randomize color"
                title="Randomize color"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.iconStroke}
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path d="M15.295 19.562 16 22" />
                  <path d="m17 16 3.758 2.098" />
                  <path d="m19 12.5 3.026-.598" />
                  <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
                  <path d="M8 9V2" />
                </svg>
              </button>

              {/* Text Content */}
              <TextContent theme={theme} />

              {/* Buttons */}
              <ActionButtons theme={theme} />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

// === CHILD KOMPONENSEK ===

interface GlowContainerProps {
  glowEnabled: boolean;
  glowScale: number;
  positionX: number;
  positionY: number;
  color: string;
  maskSize: number;
  isDark: boolean;
}

function GlowContainer({
  glowEnabled,
  glowScale,
  positionX,
  positionY,
  color,
  maskSize,
  isDark,
}: GlowContainerProps) {
  const blendMode = getBlendMode(isDark);

  return (
    <motion.div
      className="absolute w-[1700px] h-[2400px] pointer-events-none"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 30%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 30%, transparent 100%)",
      }}
      animate={{
        opacity: glowEnabled ? 1 : 0,
        scale: glowScale,
        left: positionX,
        top: positionY,
      }}
      transition={DEFAULT_TRANSITION}
      aria-hidden="true"
    >
      {/* Layer 1: Large background glow */}
      <motion.div
        className={cn(
          "absolute top-[400px] left-[300px] w-[1800px] rounded-full",
          blendMode,
        )}
        style={{
          backgroundColor: color,
          height: `${1800 * maskSize + 600}px`,
          filter: `blur(${GLOW_LAYERS.outer.blur}px)`,
          opacity: GLOW_LAYERS.outer.opacity,
        }}
        animate={{
          height: `${1800 * maskSize + 600}px`,
        }}
        transition={DEFAULT_TRANSITION}
      />

      {/* Layer 2: Medium glow */}
      <motion.div
        className={cn(
          "absolute top-[600px] left-[460px] w-[1300px] h-[1300px] rounded-full",
          blendMode,
        )}
        style={{
          backgroundColor: color,
          filter: `blur(${GLOW_LAYERS.middle.blur}px)`,
          opacity: GLOW_LAYERS.middle.opacity,
        }}
        transition={DEFAULT_TRANSITION}
      />

      {/* Layer 3: Core color */}
      <motion.div
        className={cn(
          "absolute top-[700px] left-[560px] w-[1000px] h-[800px] rounded-full",
          blendMode,
        )}
        style={{
          backgroundColor: color,
          filter: `blur(${GLOW_LAYERS.inner.blur}px)`,
          opacity: isDark ? 1 : 0.6,
        }}
        transition={DEFAULT_TRANSITION}
      />

      {/* Layer 4: White highlight */}
      <motion.div
        className="absolute top-[800px] left-[700px] w-[600px] h-[440px] rounded-full mix-blend-normal"
        style={{
          backgroundColor: "#FFFFFF",
          filter: isDark
            ? `blur(${GLOW_LAYERS.highlight.blur.dark}px)`
            : `blur(${GLOW_LAYERS.highlight.blur.light}px)`,
        }}
        animate={{
          opacity: isDark
            ? GLOW_LAYERS.highlight.opacity.dark
            : GLOW_LAYERS.highlight.opacity.light,
        }}
        transition={DEFAULT_TRANSITION}
      />
    </motion.div>
  );
}

interface TabToolbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

function TabToolbar({
  activeTab,
  onTabChange,
}: TabToolbarProps) {
  const tabs = [
    { id: "shape" as TabType, label: "Shape", icon: ShapeIcon },
    {
      id: "button" as TabType,
      label: "Button",
      icon: ButtonIcon,
    },
    { id: "card" as TabType, label: "Card", icon: CardIcon },
  ];

  return (
    <nav
      className="absolute top-4 left-1/2 -translate-x-1/2 md:top-auto md:bottom-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 p-1 rounded-full shadow-xl shadow-zinc-200/20 dark:shadow-black/40 flex items-center gap-1 transition-all z-20"
      role="tablist"
      aria-label="Preview tabs"
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            activeTab === id
              ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
          )}
          role="tab"
          aria-selected={activeTab === id}
          aria-label={label}
        >
          <Icon />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}

// Tab ikonok
function ShapeIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M3 3h18v18H3z" />
    </svg>
  );
}

function ButtonIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h2v6h-2V3z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2H3V4zm0 3h18v12a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
    </svg>
  );
}

interface PreviewContentProps {
  activeTab: TabType;
  glowEnabled: boolean;
  color: string;
  isDark: boolean;
}

function PreviewContent({
  activeTab,
  glowEnabled,
  color,
  isDark,
}: PreviewContentProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={TAB_TRANSITION}
        className="relative"
      >
        {glowEnabled && (
          <PreviewGlow
            activeTab={activeTab}
            color={color}
            isDark={isDark}
          />
        )}

        {activeTab === "shape" && <ShapePreview />}
        {activeTab === "button" && (
          <ButtonPreview color={color} />
        )}
        {activeTab === "card" && <CardPreview color={color} />}
      </motion.div>
    </div>
  );
}

interface PreviewGlowProps {
  activeTab: TabType;
  color: string;
  isDark: boolean;
}

function PreviewGlow({
  activeTab,
  color,
  isDark,
}: PreviewGlowProps) {
  const blendMode = getBlendMode(isDark);
  const sizes = PREVIEW_GLOW_SIZES[activeTab];

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={DEFAULT_TRANSITION}
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      {/* Outer glow */}
      <div
        className={cn("absolute rounded-full", blendMode)}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: sizes.outer.width,
          height: sizes.outer.height,
          backgroundColor: color,
          filter: `blur(${GLOW_LAYERS.outer.blur}px)`,
          opacity: GLOW_LAYERS.outer.opacity,
        }}
      />

      {/* Middle glow */}
      <div
        className={cn("absolute rounded-full", blendMode)}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: sizes.middle.width,
          height: sizes.middle.height,
          backgroundColor: color,
          filter: `blur(${GLOW_LAYERS.middle.blur}px)`,
          opacity: GLOW_LAYERS.middle.opacity,
        }}
      />

      {/* Inner glow */}
      <div
        className={cn("absolute rounded-full", blendMode)}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: sizes.inner.width,
          height: sizes.inner.height,
          backgroundColor: color,
          filter: `blur(${GLOW_LAYERS.inner.blur}px)`,
          opacity: isDark ? 1 : 0.6,
        }}
      />

      {/* Highlight */}
      <div
        className="absolute rounded-full mix-blend-normal"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: sizes.highlight.width,
          height: sizes.highlight.height,
          backgroundColor: "#FFFFFF",
          filter: isDark
            ? `blur(${GLOW_LAYERS.highlight.blur.dark}px)`
            : `blur(${GLOW_LAYERS.highlight.blur.light}px)`,
          opacity: isDark
            ? GLOW_LAYERS.highlight.opacity.dark
            : GLOW_LAYERS.highlight.opacity.light,
        }}
      />
    </motion.div>
  );
}

function ShapePreview() {
  return (
    <div
      className="w-[200px] h-[200px]"
      aria-label="Shape preview"
    />
  );
}

interface ButtonPreviewProps {
  color: string;
}

function ButtonPreview({ color }: ButtonPreviewProps) {
  return (
    <button
      className="flex items-center justify-center gap-2 font-medium text-white shadow-sm hover:opacity-90 active:scale-95 transition-transform cursor-pointer relative z-10"
      style={{
        width: "160px",
        height: "48px",
        borderRadius: "12px",
        background: color,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        transition: "0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      aria-label="Button preview"
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
        role="presentation"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span>Click Me</span>
    </button>
  );
}

interface CardPreviewProps {
  color: string;
}

function CardPreview({ color }: CardPreviewProps) {
  return (
    <article
      className="flex flex-col overflow-hidden relative group z-10"
      style={{
        width: "240px",
        height: "320px",
        borderRadius: "24px",
        background: color,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        transition: "0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      aria-label="Card preview"
    >
      <div className="h-1/2 w-full bg-black/10 mix-blend-overlay" />
      <div className="flex-1 p-6 flex flex-col justify-end bg-white/10">
        <div className="w-8 h-8 rounded-full bg-white/20 mb-3 backdrop-blur-sm" />
        <div className="h-3 w-2/3 bg-white/40 rounded-full mb-2" />
        <div className="h-3 w-1/3 bg-white/20 rounded-full" />
      </div>
    </article>
  );
}

interface TextContentProps {
  theme: ReturnType<typeof useTheme>;
}

function TextContent({ theme }: TextContentProps) {
  return (
    <div>
      <div
        className={cn(
          "text-xs font-medium tracking-widest uppercase mb-2 transition-colors",
          theme.subtleTextColor,
        )}
      >
        Collaboration Hub
      </div>
      <h1
        className={cn(
          "text-3xl font-bold leading-tight mb-4 transition-colors",
          theme.textColor,
        )}
      >
        Get More Done
        <br />
        Together
      </h1>
      <p
        className={cn(
          "text-sm leading-relaxed transition-colors",
          theme.subtleTextColor,
        )}
      >
        Stay aligned, share ideas, and keep every project moving
        smoothly.
      </p>
    </div>
  );
}

interface ActionButtonsProps {
  theme: ReturnType<typeof useTheme>;
}

function ActionButtons({ theme }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        className={cn(
          "w-full h-12 rounded-full flex items-center justify-center gap-3 font-medium transition-colors",
          theme.buttonBg,
          theme.buttonText,
          theme.buttonHover,
        )}
        aria-label="Continue with Google"
      >
        <GoogleIcon />
        Continue With Google
      </button>
      <button
        className={cn(
          "w-full h-12 rounded-full flex items-center justify-center font-medium transition-colors",
          theme.skipButtonBg,
          theme.skipButtonText,
          theme.skipButtonHover,
        )}
        aria-label="Skip sign in"
      >
        Skip
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M16.92 9.1875C16.92 8.6025 16.8675 8.04 16.77 7.5H9V10.695H13.44C13.245 11.7225 12.66 12.5925 11.7825 13.1775V15.255H14.46C16.02 13.815 16.92 11.7 16.92 9.1875Z"
        fill="#4285F4"
      />
      <path
        d="M9 17.25C11.2275 17.25 13.095 16.515 14.46 15.255L11.7825 13.1775C11.0475 13.6725 10.11 13.9725 9 13.9725C6.855 13.9725 5.0325 12.525 4.38 10.575H1.635V12.705C2.9925 15.3975 5.775 17.25 9 17.25Z"
        fill="#34A853"
      />
      <path
        d="M4.38 10.5675C4.215 10.0725 4.1175 9.5475 4.1175 9C4.1175 8.4525 4.215 7.9275 4.38 7.4325V5.3025H1.635C1.0725 6.4125 0.75 7.665 0.75 9C0.75 10.335 1.0725 11.5875 1.635 12.6975L3.7725 11.0325L4.38 10.5675Z"
        fill="#FBBC05"
      />
      <path
        d="M9 4.035C10.215 4.035 11.295 4.455 12.1575 5.265L14.52 2.9025C13.0875 1.5675 11.2275 0.75 9 0.75C5.775 0.75 2.9925 2.6025 1.635 5.3025L4.38 7.4325C5.0325 5.4825 6.855 4.035 9 4.035Z"
        fill="#EA4335"
      />
    </svg>
  );
}