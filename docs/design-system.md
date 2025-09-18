# EcoTrack Design System

## Overview

The EcoTrack design system provides a comprehensive set of reusable UI components, consistent theming, and design patterns for building the waste collection and recycling management mobile app.

## Theme

### Colors

#### Brand Colors
- **Primary**: `#00796B` (Deep teal) - Main brand color
- **Primary Dark**: `#004D40` - Darker variant for pressed states
- **Primary Light**: `#26A69A` - Lighter variant for backgrounds
- **Secondary**: `#D2F801` (Bright lime green) - Accent color
- **Secondary Dark**: `#9BC53D` - Darker variant
- **Secondary Light**: `#E6FF4D` - Lighter variant

#### Status Colors
- **Success**: `#4CAF50` - Completed actions, positive feedback
- **Warning**: `#FF9800` - Caution, pending states
- **Error**: `#F44336` - Errors, failed actions
- **Info**: `#2196F3` - Information, neutral feedback

#### Neutral Colors
- **Background**: `#FFFFFF` - Main background
- **Surface**: `#F5F5F5` - Card backgrounds, elevated surfaces
- **Text**: `#212121` - Primary text
- **Text Secondary**: `#757575` - Secondary text
- **Text Light**: `#BDBDBD` - Disabled text, placeholders
- **Border**: `#E0E0E0` - Component borders
- **Divider**: `#EEEEEE` - Separators

#### Waste Type Colors
- **General Waste**: `#9E9E9E` - Gray for general waste
- **Recyclable**: `#00796B` - Teal (brand color) for recyclables
- **Organic**: `#D2F801` - Lime (brand color) for organic waste
- **Hazardous**: `#F44336` - Red for hazardous materials

### Typography

- **H1**: 32px, Bold, 40px line height
- **H2**: 28px, Bold, 36px line height
- **H3**: 24px, SemiBold, 32px line height
- **H4**: 20px, SemiBold, 28px line height
- **Body1**: 16px, Normal, 24px line height
- **Body2**: 14px, Normal, 20px line height
- **Caption**: 12px, Normal, 16px line height
- **Button**: 16px, SemiBold, 20px line height

### Spacing

- **XS**: 4px - Minimal spacing
- **SM**: 8px - Small spacing
- **MD**: 16px - Medium spacing (default)
- **LG**: 24px - Large spacing
- **XL**: 32px - Extra large spacing
- **XXL**: 48px - Maximum spacing

### Border Radius

- **SM**: 4px - Small radius
- **MD**: 8px - Medium radius (default)
- **LG**: 12px - Large radius
- **XL**: 16px - Extra large radius
- **Round**: 50px - Fully rounded

### Shadows

- **SM**: Light shadow for subtle elevation
- **MD**: Medium shadow for cards and modals
- **LG**: Heavy shadow for floating elements

## Components

### UI Components

#### Button
Versatile button component with multiple variants and states.

**Variants**: `primary`, `secondary`, `outline`, `ghost`
**Sizes**: `small`, `medium`, `large`
**States**: `disabled`, `loading`

```tsx
<Button 
  title="Submit" 
  onPress={handleSubmit} 
  variant="primary" 
  size="medium" 
  loading={isLoading}
/>
```

#### Card
Container component with elevation and optional press handling.

```tsx
<Card elevation="md" onPress={handlePress}>
  <Text>Card content</Text>
</Card>
```

#### Input
Text input with validation, icons, and helper text.

```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  leftIcon="mail"
  error={emailError}
  required
/>
```

#### List
Optimized list component with empty states and refresh control.

```tsx
<List
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  emptyMessage="No items found"
  onRefresh={handleRefresh}
/>
```

#### Badge
Status indicator with color variants.

**Variants**: `default`, `success`, `warning`, `error`, `info`

```tsx
<Badge text="Completed" variant="success" />
```

#### Toast
Temporary notification component.

```tsx
<Toast
  message="Action completed successfully"
  type="success"
  visible={showToast}
  onHide={hideToast}
/>
```

#### FloatingActionButton
Floating action button for primary actions.

```tsx
<FloatingActionButton
  icon="add"
  onPress={handleAdd}
  position="bottom-right"
/>
```

#### Separator
Visual divider component.

```tsx
<Separator />
```

### Shared Components

#### Header
Navigation header with title, subtitle, and action buttons.

```tsx
<Header
  title="Driver Jobs"
  subtitle="Today's Schedule"
  rightIcon="refresh"
  onRightPress={handleRefresh}
/>
```

#### EmptyState
User-friendly empty state with icon and optional action.

```tsx
<EmptyState
  icon="clipboard-outline"
  title="No Jobs Today"
  message="Check back later for new assignments"
  actionTitle="Refresh"
  onActionPress={handleRefresh}
/>
```

#### LoadingSpinner
Loading indicator with optional overlay and message.

```tsx
<LoadingSpinner
  message="Loading jobs..."
  overlay={true}
/>
```

## Usage Guidelines

### Color Usage
- Use primary colors for main actions and navigation
- Use secondary colors for accents and highlights
- Use status colors consistently for feedback
- Use waste type colors for categorization

### Typography Hierarchy
- Use H1-H4 for headings and section titles
- Use Body1 for main content, Body2 for secondary content
- Use Caption for metadata and helper text

### Spacing Consistency
- Use theme spacing values consistently
- Maintain consistent margins and padding
- Use larger spacing for better touch targets on mobile

### Component Composition
- Combine components to create complex interfaces
- Use consistent patterns across similar screens
- Leverage shared components for common UI patterns

## Accessibility

- All components support proper contrast ratios
- Interactive elements have minimum 44px touch targets
- Components support screen readers and accessibility labels
- Focus states are clearly visible

## Performance

- Components are optimized for React Native performance
- Lists use FlatList for efficient rendering
- Images and assets are properly optimized
- Animations use native driver when possible