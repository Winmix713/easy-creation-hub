# Superellipse Generator Pro - Development Guidelines

## Overview

This document outlines the coding standards, architectural patterns, and best practices for the Superellipse Generator Pro project.

---

## 1. Architecture Principles

### 1.1 State Management

- **Use Context for global state**: All shared state should be managed through `AppContext`
- **Avoid prop drilling**: Maximum 3 levels of prop passing; use context beyond that
- **Single source of truth**: Each piece of state should exist in exactly one place

### 1.2 Component Structure

- **Max 200 lines per component**: Split larger components into smaller, focused ones
- **Max 10 props per component**: Use context or composition for more complex data needs
- **Co-locate related code**: Keep hooks, types, and utilities near their consumers

---

## 2. Code Quality Standards

### 2.1 Type Safety

```typescript
// ✅ Good: Explicit types with validation
function updateWidth(value: number): void {
  const validated = validateWidth(value);
  setState({ width: validated });
}

// ❌ Bad: Implicit any or unvalidated input
function updateWidth(value) {
  setState({ width: value });
}
```

### 2.2 Constants

All magic numbers must be defined in `src/constants/index.ts`:

```typescript
// ✅ Good: Use constants
import { ZOOM } from '@/constants';
setZoom((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX));

// ❌ Bad: Magic numbers
setZoom((prev) => Math.min(prev + 25, 400));
```

### 2.3 Validation

All user inputs must be validated using `src/utils/validation.ts`:

```typescript
// ✅ Good: Validate before state update
const validated = validateWidth(Number(e.target.value));
onUpdate({ width: validated });

// ❌ Bad: Direct assignment
onUpdate({ width: Number(e.target.value) });
```

---

## 3. Performance Guidelines

### 3.1 Memoization

- Use `React.memo` for components that receive complex props
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed to child components

```typescript
// ✅ Good: Memoized component
export const LayerRenderer = memo(function LayerRenderer(props) {
  // ...
}, customCompare);

// ✅ Good: Memoized calculation
const pathData = useMemo(() => calculatePath(state), [state.width, state.height]);
```

### 3.2 Avoid Unnecessary Re-renders

- Don't create new objects/arrays in render
- Use stable references for callbacks
- Split context into smaller, focused contexts if needed

---

## 4. Error Handling

### 4.1 Input Validation

```typescript
// Always validate external data
const { valid, error } = validateImportFile(file);
if (!valid) {
  console.error('Import failed:', error);
  return;
}
```

### 4.2 Safe Parsing

```typescript
// Use safe parsing utilities
const value = safeParseNumber(input, defaultValue);
const color = validateHexColor(input, '#000000');
```

---

## 5. File Organization

```
src/
├── components/       # React components
│   ├── app/         # App-level components
│   ├── generator/   # Generator-specific components
│   │   ├── tabs/    # Control panel tabs
│   │   └── modals/  # Modal dialogs
│   └── ui/          # Reusable UI components
├── constants/       # Application constants
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
    ├── validation.ts     # Input validation
    ├── type-guards.ts    # Runtime type checking
    ├── color-conversion.ts # Color utilities
    └── math.ts           # Mathematical functions
```

---

## 6. Naming Conventions

### 6.1 Files

- Components: `PascalCase.tsx` (e.g., `LayerPanel.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useLayerManager.ts`)
- Utilities: `kebab-case.ts` (e.g., `color-conversion.ts`)
- Constants: `index.ts` in constants folder

### 6.2 Variables

- Components: `PascalCase`
- Hooks: `camelCase` starting with `use`
- Constants: `SCREAMING_SNAKE_CASE`
- Functions: `camelCase`

---

## 7. Security Requirements

### 7.1 File Imports

- Always validate file size (max 5MB)
- Always validate file type (.json only for presets)
- Always validate JSON structure before parsing

### 7.2 Color/SVG Output

- Use textContent instead of innerHTML
- Escape special characters in generated code
- Validate all user-provided colors

---

## 8. Testing Checklist

Before committing:

- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Undo/redo works correctly
- [ ] Gradient stops sort properly
- [ ] Input validation prevents invalid values
- [ ] Performance is acceptable (no jank)

---

## 9. Dependencies

### Approved

- React 18+
- Tailwind CSS
- Framer Motion
- Radix UI
- Lucide React

### Unused (Consider Removing)

- @emotion/react (if not used)
- @mui/material (if not used)

---

## 10. Git Commit Guidelines

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `docs:` Documentation
- `style:` Code style (formatting)
- `test:` Tests

Example: `feat: add gradient stop sorting`
