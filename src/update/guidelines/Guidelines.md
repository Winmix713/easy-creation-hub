# Superellipse Generator - Development Guidelines

This document outlines the coding standards and best practices for the Superellipse Generator project. These guidelines ensure code quality, maintainability, and consistency across the codebase.

---

## General Principles

### 1. Single Source of Truth
- **Constants**: All magic numbers, default values, and configuration should be defined in `src/constants/index.ts`
- **Types**: Use centralized type definitions from `src/types/layers.ts`
- **Defaults**: Use imported default state objects instead of duplicating them

### 2. State Management

#### Application State Layers
```
┌─────────────────────────────────────┐
│ EditorContext (UI-level settings)   │  <- Glow, noise, animation, modals
├─────────────────────────────────────┤
│ Layer Manager (content structure)   │  <- Layers, selection, history
├─────────────────────────────────────┤
│ Superellipse Hook (shape state)     │  <- Shape properties, gradients
└─────────────────────────────────────┘
```

#### Rule: Maximum 10 Props per Component
- If a component needs more than 10 props, consider:
  - Using React Context (like EditorContext)
  - Creating a custom hook
  - Restructuring component hierarchy

**Violation Example (AVOID):**
```tsx
<CanvasContainer
  glowEnabled={glowEnabled}
  maskSize={maskSize}
  glowScale={glowScale}
  positionX={positionX}
  positionY={positionY}
  noiseEnabled={noiseEnabled}
  noiseIntensity={noiseIntensity}
  // ... 23 more props
/>
```

**Correct Example (USE):**
```tsx
const { glowEnabled, maskSize } = useGlowEditor();

<CanvasContainer
  // Only essential props
  state={state}
  layers={layers}
/>
```

### 3. Input Validation

**Every input must be validated and clamped**

#### Use validation functions from `src/utils/validation.ts`:
```tsx
import { validateWidth, validateExponent, validateHexColor } from '@/utils/validation';

// Apply validation immediately on input
<input
  type="number"
  value={state.width}
  onChange={(e) => onUpdate({ width: validateWidth(Number(e.target.value)) })}
  min={SHAPE_BOUNDS.WIDTH.MIN}
  max={SHAPE_BOUNDS.WIDTH.MAX}
/>
```

#### Critical Validation Points:
- All number inputs → use `validateNumber(value, min, max)`
- Color inputs → use `validateHexColor(value)`
- Gradient positions → use `validateGradientPosition(value)` (0-100)
- Shape dimensions → use `validateWidth()` and `validateHeight()`

### 4. Color Handling

#### Use HSL Color Space (Not OKLCH)
- OKLCH was simplified and inaccurate
- HSL is standard, reliable, and well-supported
- Functions available in `src/utils/color-conversion.ts`

```tsx
import { hexToHsl, hslToHex, validateHexColor } from '@/utils/color-conversion';

const hsl = hexToHsl('#667eea');  // { h: 250, s: 80, l: 65 }
const hex = hslToHex(250, 80, 65); // '#667eea'
```

### 5. Type Safety

#### Use Type Guards for Runtime Validation
```tsx
import { isValidSuperellipseState, isValidLayer } from '@/utils/type-guards';

// Validate data from localStorage or imports
const state = JSON.parse(savedState);
if (isValidSuperellipseState(state)) {
  // Safe to use
}
```

#### Never Use `any` Type
```tsx
// AVOID
const data: any = JSON.parse(json);

// CORRECT
const data = JSON.parse(json);
if (isValidPreset(data)) {
  // Now type-safe
}
```

---

## Component Architecture

### 1. Component Size Guidelines
- **Small components**: < 100 lines (pure UI)
- **Medium components**: 100-300 lines (with local logic)
- **Large components**: > 300 lines (consider splitting)

### 2. Props Organization
```tsx
// CORRECT: Destructure and group props
interface TabProps {
  // Display state
  state: SuperellipseState;
  // Actions
  onUpdate: (updates: Partial<SuperellipseState>) => void;
}

export function ShapeTab({ state, onUpdate }: TabProps) {
  // ...
}
```

### 3. Memoization
Use `React.memo` for components that receive large props:

```tsx
export const LayerRenderer = React.memo(function LayerRenderer({ layer, ...props }: Props) {
  // Component code
});
```

Use `useMemo` for expensive calculations:

```tsx
const transform = useMemo(() => {
  // Expensive calculation
  return `translate(${x}px, ${y}px) ...`;
}, [x, y, rotation]); // Include all dependencies
```

---

## State Management Patterns

### 1. History/Undo-Redo
```tsx
// CORRECT: Initialize with base state
const [history, setHistory] = useState<HistoryState[]>([
  { layers: [], selectedLayerId: null }
]);
const [historyIndex, setHistoryIndex] = useState(0);

// INCORRECT: Starting with empty history
const [history, setHistory] = useState<HistoryState[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
```

### 2. Gradient Stop Management
**Always sort gradient stops by position**

```tsx
// Use this helper for ALL gradient modifications
const sortGradientStops = (stops: GradientStop[]): GradientStop[] => {
  return [...stops].sort((a, b) => a.position - b.position);
};

// Apply when updating
setState(prev => ({
  ...prev,
  gradientStops: sortGradientStops(updatedStops)
}));
```

### 3. Aspect Ratio Locking
When one dimension changes and aspect ratio is locked:

```tsx
if (lockAspectRatio && updates.width && !updates.height) {
  const ratio = prev.height / prev.width;
  newState.height = newState.width * ratio;
}
```

---

## Performance Guidelines

### 1. Avoid Unnecessary Re-renders
```tsx
// AVOID: New object on every render
const transform = `translate(${x}px, ${y}px)`;

// CORRECT: Memoize
const transform = useMemo(() => {
  return `translate(${x}px, ${y}px)`;
}, [x, y]);
```

### 2. Callback Dependencies
Always include all dependencies in useCallback:

```tsx
// CORRECT
const handler = useCallback((value) => {
  setState(prev => ({ ...prev, value }));
}, [someDependent]); // Include all dependencies

// INCORRECT
const handler = useCallback((value) => {
  setState(prev => ({ ...prev, selectedId, value }));
}, []); // Missing selectedId dependency
```

### 3. Event Listener Cleanup
Always clean up event listeners:

```tsx
useEffect(() => {
  const handleEvent = (e) => { /* ... */ };
  
  element.addEventListener('event', handleEvent);
  
  // MUST cleanup
  return () => element.removeEventListener('event', handleEvent);
}, []);
```

---

## Security Guidelines

### 1. Input Sanitization
- Validate all user inputs immediately
- Use validation functions for constraints
- Never trust HTML input's built-in min/max validation

### 2. localStorage Usage
```tsx
// CORRECT: Validate before using
const stored = localStorage.getItem('key');
const data = safeJsonParse(stored, defaultValue);
if (isValidPreset(data)) {
  // Safe to use
}

// AVOID: Direct JSON.parse
const data = JSON.parse(localStorage.getItem('key')); // Can throw!
```

### 3. File Imports
```tsx
// CORRECT: Validate file size and type
const importPresets = (file: File) => {
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
  if (!file.type === 'application/json') throw new Error('Invalid type');
  // ... parse and validate
};
```

---

## Code Organization

### File Structure
```
src/
├── app/                    # Main application
├── components/             # React components
│   ├── generator/         # Feature components
│   └── ui/                # Reusable UI components
├── context/               # React Context providers
├── hooks/                 # Custom hooks
├── utils/                 # Utility functions
│   ├── math.ts           # Mathematical operations
│   ├── validation.ts     # Input validation
│   ├── color-conversion.ts
│   └── type-guards.ts    # Runtime type checking
├── constants/            # Constants and defaults
├── types/                # Type definitions
└── styles/               # Global styles
```

### Constants Organization
All magic numbers in `src/constants/index.ts`:

```tsx
export const ZOOM = {
  STEP: 25,
  MIN: 25,
  MAX: 400,
  DEFAULT: 100,
} as const;
```

Then use:
```tsx
import { ZOOM } from '@/constants/index';

setZoom((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX));
```

---

## Git Commit Guidelines

### Commit Message Format
```
<type>: <description>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `docs`: Documentation
- `style`: Code style changes
- `test`: Test additions/changes

### Examples
```
fix: sort gradient stops after update to fix rendering order

Previously, updateGradientStop didn't sort stops, causing incorrect 
gradient rendering when position was changed. Now all gradient 
modifications ensure sorted order.

Fixes #123
```

---

## Testing Guidelines

### Unit Tests
- Test utility functions in isolation
- Test validation functions with edge cases
- Test type guards with invalid data

### Component Tests
- Test component rendering
- Test user interactions
- Test prop changes

### Integration Tests
- Test layer operations (add, remove, update)
- Test undo/redo functionality
- Test state synchronization

---

## Documentation Requirements

### Function Documentation
```tsx
/**
 * Brief description of what the function does
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * 
 * @example
 * const result = myFunction(arg);
 * // result is...
 */
export function myFunction(param: Type): ReturnType {
  // implementation
}
```

### Component Documentation
```tsx
/**
 * Brief description
 * 
 * Usage:
 * ```tsx
 * <MyComponent prop={value} />
 * ```
 */
export function MyComponent({ prop }: Props) {
  // implementation
}
```

---

## Checklist Before Committing

- [ ] All inputs are validated with appropriate constraints
- [ ] No magic numbers (all in constants)
- [ ] No prop drilling > 10 props (use context if needed)
- [ ] Type guards used for runtime validation
- [ ] Event listeners are properly cleaned up
- [ ] Gradient stops are sorted where modified
- [ ] History includes initial state
- [ ] Color operations use HSL (not OKLCH)
- [ ] Components are memoized if needed
- [ ] All dependencies in useCallback/useMemo
- [ ] No console errors or warnings
- [ ] Code follows naming conventions

---

## References

- Constants: `src/constants/index.ts`
- Validation: `src/utils/validation.ts`
- Type Guards: `src/utils/type-guards.ts`
- Color Conversion: `src/utils/color-conversion.ts`
- EditorContext: `src/context/EditorContext.tsx`
- Types: `src/types/layers.ts`
