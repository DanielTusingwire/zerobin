# Design Document

## Overview

The interactive request modal feature transforms the current fixed-height bottom sheet in the customer request flow into a fully interactive, draggable modal. Users will be able to drag the modal up and down to control its height, providing a more intuitive and flexible user experience when navigating through the request steps.

## Architecture

### Current Implementation Analysis
The existing request flow uses a fixed bottom sheet positioned at `height * 0.7` (70% of screen height) with a static handle. The modal contains step-based content (location, waste type, quantity, date/time) rendered through a ScrollView.

### New Interactive Architecture
The enhanced modal will use React Native's gesture handling system with smooth animations and physics-based interactions:

```
┌─────────────────────────────────────┐
│           Map View (Fixed)          │
├─────────────────────────────────────┤
│  Interactive Modal (Draggable)     │
│  ┌─────────────────────────────────┐│
│  │     Drag Handle (Enhanced)      ││
│  ├─────────────────────────────────┤│
│  │                                 ││
│  │      Step Content               ││
│  │    (Scrollable/Adaptive)        ││
│  │                                 ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Components and Interfaces

### 1. InteractiveBottomSheet Component
A new reusable component that wraps the existing bottom sheet functionality:

```typescript
interface InteractiveBottomSheetProps {
  children: React.ReactNode;
  minHeight: number;
  maxHeight: number;
  initialHeight: number;
  onHeightChange?: (height: number) => void;
  snapPoints?: number[];
}
```

### 2. Enhanced Drag Handle
The current static handle will be enhanced with:
- Visual feedback on touch (scale, opacity, color changes)
- Haptic feedback for better user experience
- Clear visual indication of draggable state

### 3. Gesture Recognition System
Using React Native Gesture Handler for smooth interactions:
- PanGestureHandler for drag detection
- Physics-based animations with spring configurations
- Snap-to-position logic for natural feel

### 4. Content Adaptation System
Dynamic content layout based on modal height:
- Compact mode (minimum height): Essential information only
- Standard mode (default height): Full step content
- Expanded mode (maximum height): Additional details and larger touch targets

## Data Models

### Modal State Interface
```typescript
interface ModalState {
  currentHeight: number;
  targetHeight: number;
  isAnimating: boolean;
  isDragging: boolean;
  velocity: number;
}
```

### Snap Point Configuration
```typescript
interface SnapPoint {
  height: number;
  label: string;
  contentMode: 'compact' | 'standard' | 'expanded';
}
```

### Animation Configuration
```typescript
interface AnimationConfig {
  springConfig: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  snapThreshold: number;
  velocityThreshold: number;
}
```

## Error Handling

### Gesture Conflicts
- Prevent conflicts between modal drag and content scroll
- Implement gesture priority system
- Handle edge cases when content is scrolled

### Animation Interruption
- Allow new gestures to interrupt ongoing animations
- Maintain smooth transitions between interrupted states
- Prevent animation glitches during rapid interactions

### Performance Optimization
- Use native driver for animations where possible
- Implement gesture debouncing for performance
- Optimize re-renders during drag operations

## Testing Strategy

### Unit Tests
- Modal state management logic
- Snap point calculations
- Animation configuration validation
- Gesture event handling

### Integration Tests
- Modal interaction with step content
- Scroll view behavior within modal
- Navigation between request steps
- Success modal interaction

### User Experience Tests
- Gesture responsiveness across different devices
- Animation smoothness at 60fps
- Accessibility with screen readers
- Performance with complex step content

### Visual Regression Tests
- Modal appearance at different heights
- Handle visual feedback states
- Content adaptation layouts
- Dark mode compatibility

## Implementation Details

### Snap Points Configuration
The modal will have three main snap points:
1. **Minimum (30% screen height)**: Shows step header and key actions
2. **Standard (70% screen height)**: Current default, shows full step content
3. **Maximum (90% screen height)**: Expanded view with larger touch targets

### Animation Physics
- **Spring Animation**: Natural feel with configurable damping
- **Velocity Consideration**: Faster drags snap to further positions
- **Rubber Band Effect**: Resistance when dragging beyond limits

### Content Adaptation Rules
- **Compact Mode**: Hide secondary information, smaller fonts
- **Standard Mode**: Current layout preserved
- **Expanded Mode**: Larger buttons, more spacing, additional help text

### Accessibility Considerations
- Maintain keyboard navigation support
- Provide alternative interaction methods for users with motor impairments
- Ensure screen reader compatibility with dynamic height changes
- Add voice-over announcements for height state changes