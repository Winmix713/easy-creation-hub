
# Superellipse Generator Pro - Teljes Frissítési Terv

## Áttekintés

Az eredeti projekt fájljait az `/src/update/` mappában töltötted fel. A cél: átemelni ezeket a hiányzó komponenseket, típusokat és segédfüggvényeket a fő `/src/` mappába, és frissíteni a meglévő fájlokat az eredeti tartalmakkal.

---

## Mit csinál ez a frissítés?

A jelenlegi alkalmazás egy alapvető superellipse generátor. Az eredeti projektből hiányzik:
- **Egyedi sarok görbületek** - minden sarok külön állítható
- **Fejlett glow effektek** - többrétegű világítás
- **Zajszűrő effekt** - textúra overlay
- **Backdrop blur** - háttér elmosás
- **Preset rendszer** - mentett beállítások
- **Fejlett export** - SVG, React, CSS, JSON formátumok
- **Több tab** - Shape, Color, Effects, Glow, Transform, CSS, Export, Presets

---

## 1. Hiányzó Fájlok Létrehozása

### 1.1 Típus Definíciók
**`src/types/layers.ts`** - Az eredeti típusrendszer a következő fontos mezőkkel:
- `exponent` - globális görbületi érték
- `cornerExponents` - egyedi sarkok (`topLeft`, `topRight`, `bottomRight`, `bottomLeft`)
- `useIndividualCorners` - sarok módosító kapcsoló
- `glowLayers[]` - többrétegű glow effektek
- `noiseOpacity` - zaj intenzitás
- `backdropBlur` - háttér elmosás

### 1.2 Segédfüggvények
**`src/utils/math.ts`**:
```text
┌──────────────────────────────────────┐
│ getPerCornerSuperellipsePath()       │
│ - Egyedi sarok görbületek támogatása │
│                                      │
│ getSuperellipsePath()                │
│ - Egyszerűsített egységes görbe      │
│                                      │
│ clamp(), lerp()                      │
│ - Matematikai segédfüggvények        │
└──────────────────────────────────────┘
```

**`src/utils/color-conversion.ts`**:
- `hexToOklch()` - HEX → OKLCH konverzió
- `oklchToHex()` - OKLCH → HEX konverzió
- `parseOKLCH()` - OKLCH string elemzés

**`src/utils/colorPalette.ts`**:
- `hexToOKLCH()` - HEX → OKLCH string
- `generateGradientCSS()` - Gradient CSS generálás
- `COLOR_PALETTES` - Előre definiált palettták
- `randomColor()` - Véletlenszerű szín

### 1.3 Stílusok
**`src/styles/`** mappa:
- `fonts.css` - Betűtípus import
- `tailwind.css` - Tailwind konfiguráció
- `theme.css` - Sötét téma CSS változók
- `index.css` - Összesített import

### 1.4 Komponensek

**Hiányzó generátor komponensek:**
| Fájl | Funkció |
|------|---------|
| `LayerRenderer.tsx` | Rétegek SVG renderelése |
| `PreviewArea.tsx` | Fő canvas előnézet |
| `QuickPresets.tsx` | Gyors preset gombok |
| `SceneSettings.tsx` | Jelenet beállítások |

**Hiányzó tab komponensek:**
| Fájl | Funkció |
|------|---------|
| `tabs/ShapeTab.tsx` | Méret, görbület, stroke |
| `tabs/ColorTab.tsx` | Szín és gradient |
| `tabs/EffectsTab.tsx` | Blur, backdrop, noise |
| `tabs/GlowTab.tsx` | Glow rétegek kezelése |
| `tabs/TransformTab.tsx` | Pozíció, forgatás, skálázás |
| `tabs/CssTab.tsx` | Élő CSS kód |
| `tabs/ExportTab.tsx` | Export beállítások |
| `tabs/PresetsTab.tsx` | Preset mentés/betöltés |

---

## 2. Meglévő Fájlok Frissítése

### 2.1 Típusok (`src/types/index.ts`)
Kiegészítés az eredeti `layers.ts` tartalmával:
- `exponent` mező hozzáadása
- `cornerExponents` objektum
- `useIndividualCorners` flag
- `GlowLayer` interface
- Teljes `SuperellipseState` az összes effekttel

### 2.2 Hooks Frissítése
**`useSuperellipse.ts`**:
- `getPerCornerSuperellipsePath` használata
- Egyedi sarok támogatás
- Glow layer kezelés

**`useLayerManager.ts`**:
- `content.superellipseState` integráció
- Anchor point támogatás a Transform-ban

**`useCanvasNavigation.ts`**:
- Scroll zoom támogatás
- Finomabb pan kezelés

**`usePresets.ts`**:
- Thumbnail generálás
- Import/Export JSON

### 2.3 Komponensek Frissítése
**`CanvasContainer.tsx`**:
- `LayerRenderer` integrálás
- Glow layer renderelés
- Noise overlay

**`ControlPanel.tsx`**:
- 8 tab támogatás (jelenleg 4)
- Tab komponensek importálása

**`LayerPanel.tsx`**:
- Blend mode dropdown
- Opacity slider
- Solo toggle

---

## 3. UI Komponensek Frissítése

**`src/components/ui/slider.tsx`**:
- Egyedi stílus az eredeti design szerint

**`src/components/ui/switch.tsx`**:
- Dark theme kompatibilis színek

**`src/components/ui/collapsible.tsx`**:
- Összecsukható szekciók a panelekhez

---

## 4. App Struktúra

**`src/components/app/AppContent.tsx`** frissítése:
- 3 oszlopos layout: LayerPanel | Canvas | ControlPanel
- TopBar integrálás
- Modal komponensek

---

## Technikai Részletek

### Fájl Struktúra Változások
```text
src/
├── types/
│   ├── index.ts         [FRISSÍTÉS]
│   └── layers.ts        [ÚJ]
├── utils/
│   ├── math.ts          [ÚJ]
│   ├── color-conversion.ts [ÚJ]
│   └── colorPalette.ts  [ÚJ]
├── styles/
│   ├── fonts.css        [ÚJ]
│   ├── tailwind.css     [ÚJ]
│   ├── theme.css        [ÚJ]
│   └── index.css        [ÚJ]
├── hooks/
│   ├── useSuperellipse.ts [FRISSÍTÉS]
│   ├── useLayerManager.ts [FRISSÍTÉS]
│   ├── useCanvasNavigation.ts [FRISSÍTÉS]
│   └── usePresets.ts    [FRISSÍTÉS]
└── components/
    └── generator/
        ├── LayerRenderer.tsx [ÚJ]
        ├── PreviewArea.tsx   [ÚJ]
        ├── QuickPresets.tsx  [ÚJ]
        ├── SceneSettings.tsx [ÚJ]
        ├── LayerTransformControls.tsx [ÚJ]
        ├── CanvasContainer.tsx [FRISSÍTÉS]
        ├── ControlPanel.tsx [FRISSÍTÉS]
        ├── LayerPanel.tsx [FRISSÍTÉS]
        ├── tabs/
        │   ├── ShapeTab.tsx    [ÚJ]
        │   ├── ColorTab.tsx    [ÚJ]
        │   ├── EffectsTab.tsx  [ÚJ]
        │   ├── GlowTab.tsx     [ÚJ]
        │   ├── TransformTab.tsx [ÚJ]
        │   ├── CssTab.tsx      [ÚJ]
        │   ├── ExportTab.tsx   [ÚJ]
        │   └── PresetsTab.tsx  [ÚJ]
        └── modals/
            ├── ExportCodeModal.tsx [FRISSÍTÉS]
            └── KeyboardShortcutsModal.tsx [NINCS VÁLTOZÁS]
```

### Import Útvonalak
Az eredeti `/src/update/` fájlok `@/` alias-t használnak, ami kompatibilis a jelenlegi Vite konfigurációval.

### Függőségek
Nincs új npm csomag szükséges - minden meglévő függőség elegendő.

---

## Végrehajtási Sorrend

1. **Típusok és Utils** - Alapvető függőségek
2. **Stílusok** - Téma és CSS változók
3. **Hooks frissítése** - Logika bővítése
4. **Tab komponensek** - UI elemek
5. **Fő komponensek** - CanvasContainer, ControlPanel, LayerPanel
6. **Integráció** - AppContent és App.tsx

---

## Összefoglalás

| Kategória | Új fájlok | Frissítendő |
|-----------|-----------|-------------|
| Típusok | 1 | 1 |
| Utils | 3 | 0 |
| Stílusok | 4 | 0 |
| Hooks | 0 | 4 |
| Komponensek | 13 | 5 |
| **Összesen** | **21** | **10** |
