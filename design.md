# Meesho Image Optimizer - Mobile App Design

## Design Philosophy

The Meesho Image Optimizer follows **Apple Human Interface Guidelines (HIG)** and is designed for **one-handed usage in portrait orientation (9:16)**. The app feels like a first-party iOS app with clean, intuitive interactions and clear visual hierarchy.

---

## Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Brand | Meesho Pink | #E91E63 | Buttons, highlights, CTAs |
| Background | White | #FFFFFF | Main screen background |
| Surface | Light Gray | #F5F5F5 | Cards, input fields |
| Text Primary | Dark Gray | #212121 | Headlines, body text |
| Text Secondary | Medium Gray | #757575 | Captions, hints |
| Success | Green | #4CAF50 | Success states, confirmations |
| Warning | Amber | #FFC107 | Warnings, alerts |
| Error | Red | #F44336 | Errors, destructive actions |
| Border | Light Gray | #E0E0E0 | Dividers, borders |

---

## Screen List

### 1. **Onboarding / Welcome Screen**
- **Purpose**: Introduce app functionality and benefits
- **Content**:
  - App logo and title
  - 3-4 carousel slides explaining:
    * How shipping costs are calculated
    * How image optimization reduces costs
    * Key features (resize, padding, background removal)
  - "Get Started" button
  - "Skip" button (for returning users)
- **Functionality**: Swipeable carousel, skip option

### 2. **Home / Dashboard Screen**
- **Purpose**: Main entry point, show recent edits and quick actions
- **Content**:
  - Welcome message ("Hi [User], ready to reduce shipping costs?")
  - Quick stats (if available):
    * Total images edited
    * Estimated total savings
  - "Start Editing" button (primary CTA)
  - "Recent Edits" section:
    * Thumbnail grid of last 5 edited images
    * Tap to view/re-edit
  - "Quick Tips" section:
    * Rotating tips about optimization
    * Link to full guide
  - Settings icon (top-right)
- **Functionality**: Swipe to refresh, tap thumbnails to open editor

### 3. **Image Import Screen**
- **Purpose**: Select image from camera or gallery
- **Content**:
  - Large "Take Photo" button (camera icon)
  - Large "Choose from Gallery" button (gallery icon)
  - Recent photos section (if available)
  - Instructions: "Select a product photo with white or clean background"
- **Functionality**:
  - Camera: Open device camera, capture photo
  - Gallery: Open photo library, select image
  - Validation: Check format (JPG/PNG) and size (<10MB)
  - Error handling: Show toast if invalid format/size

### 4. **Image Preview Screen** (Pre-Editing)
- **Purpose**: Preview selected image before editing
- **Content**:
  - Full-screen image preview
  - Image metadata:
    * Dimensions (e.g., "1200 × 1200 px")
    * File size (e.g., "2.5 MB")
    * Format (e.g., "JPEG")
  - "Next" button (bottom, primary)
  - "Choose Different Image" button (secondary)
  - Estimated shipping cost (if already calculated)
- **Functionality**: Pinch-to-zoom, tap to dismiss keyboard

### 5. **Image Editing Tools Screen** (Main Editor)
- **Purpose**: Apply various edits to optimize image
- **Content**:
  - **Top Section**:
    * Live preview of edited image (large, centered)
    * Before/After toggle button (top-right)
  - **Bottom Sheet / Tab Navigation**:
    * Tabs for different tools:
      - Resize
      - Rotate
      - Padding
      - Background
      - Brightness
      - Crop
    * Each tab has:
      - Tool-specific controls (sliders, buttons, inputs)
      - Real-time preview updates
      - "Reset" button to undo changes for this tool
  - **Action Buttons**:
    * "Undo" (left)
    * "Redo" (center)
    * "Export" (right, primary)
- **Functionality**:
  - Swipe between tabs
  - Slider interactions for continuous values
  - Real-time preview as user adjusts
  - Undo/Redo stack (up to 10 actions)

#### 5a. **Resize Tool**
- **Controls**:
  - Preset buttons: 500×500, 750×750, 1000×1000
  - Custom input fields (width, height)
  - Lock aspect ratio toggle
- **Preview**: Show dimensions in real-time

#### 5b. **Rotate Tool**
- **Controls**:
  - Preset buttons: 90°, 180°, 270°
  - Slider for custom angle (-180° to +180°)
  - Auto-crop toggle (to remove black borders)
- **Preview**: Show rotated image with angle indicator

#### 5c. **Padding Tool**
- **Controls**:
  - Preset buttons: Small (10%), Medium (20%), Large (30%)
  - Slider for custom percentage (0-50%)
  - Color picker (white, light gray, custom)
- **Preview**: Show padded image with new dimensions

#### 5d. **Background Tool**
- **Controls**:
  - "Remove Background" button (uses rembg/OpenCV)
  - Color options: White, Light Gray, Custom
  - Opacity slider (if applicable)
- **Preview**: Show background removal result

#### 5e. **Brightness Tool**
- **Controls**:
  - Brightness slider (-50 to +50)
  - Contrast slider (-50 to +50)
  - Saturation slider (-50 to +50)
  - "Auto-Enhance" button (applies recommended values)
- **Preview**: Show adjusted image in real-time

#### 5f. **Crop Tool**
- **Controls**:
  - Preset ratios: 1:1 (square), 4:3, 16:9
  - Freeform crop (user draws crop area)
  - "Auto-Center" button (centers product in frame)
- **Preview**: Show crop area with handles

### 6. **Before/After Comparison Screen**
- **Purpose**: Compare original vs. edited image side-by-side
- **Content**:
  - Split-screen view:
    * Left: Original image
    * Right: Edited image
  - Draggable slider between images (for smooth comparison)
  - Metadata comparison:
    * Original dimensions vs. Edited dimensions
    * Original file size vs. Edited file size
    * Estimated shipping cost reduction
- **Functionality**: Swipe slider, tap to toggle sides

### 7. **Shipping Cost Estimation Screen**
- **Purpose**: Show estimated shipping cost savings
- **Content**:
  - Large display of estimated savings (e.g., "₹25 Savings")
  - Breakdown:
    * Original estimated cost: ₹80–₹120
    * Edited estimated cost: ₹50–₹80
    * Savings range: ₹20–₹40
  - Percentage improvement (e.g., "30% reduction")
  - Disclaimer: "Estimates based on public data. Actual costs may vary."
  - "View Details" button (expands explanation)
- **Functionality**: Tap to expand/collapse details

### 8. **Export & Download Screen**
- **Purpose**: Preview final image and download
- **Content**:
  - Full-screen preview of edited image
  - File information:
    * Dimensions (e.g., "1000 × 1000 px")
    * File size (e.g., "1.8 MB")
    * Format (JPEG or PNG)
  - Quality slider (if applicable)
  - Action buttons:
    * "Download to Gallery" (primary)
    * "Share" (secondary)
    * "Edit Again" (tertiary)
  - Success message after download (toast notification)
- **Functionality**:
  - Download saves to device gallery
  - Share opens system share sheet
  - Edit Again returns to editor with same image

### 9. **Batch Processing Screen** (Advanced)
- **Purpose**: Apply same edits to multiple images
- **Content**:
  - "Select Images" button
  - Grid of selected images (with count badge)
  - "Apply Preset" dropdown:
    * Clothing
    * Electronics
    * Accessories
    * Custom
  - "Process All" button (primary)
  - Progress indicator (during processing)
  - Download all as ZIP button (after completion)
- **Functionality**: Multi-select gallery, progress tracking

### 10. **Settings Screen**
- **Purpose**: Configure app preferences
- **Content**:
  - **General Settings**:
    * Default image size (500, 750, 1000)
    * Default padding percentage (10, 20, 30)
    * Default background color (white, gray)
  - **Storage**:
    * Clear editing history
    * Clear cache
  - **About**:
    * App version
    * Privacy policy link
    * Terms of service link
    * Contact support link
  - **Cloudinary Integration** (if using cloud):
    * Connected account info
    * Disconnect button
- **Functionality**: Toggle switches, dropdown selects, destructive actions with confirmation

### 11. **Preset Templates Screen** (Advanced)
- **Purpose**: Show pre-configured editing profiles
- **Content**:
  - Card grid with preset templates:
    * **Clothing**: 20% padding, white background, brightness +10
    * **Electronics**: 15% padding, white background, contrast +15
    * **Accessories**: 25% padding, white background, saturation +10
    * **Custom**: User-defined settings
  - Each card shows:
    * Template name
    * Preview thumbnail
    * "Apply" button
- **Functionality**: Tap to apply template to current image

### 12. **Editing History Screen** (Advanced)
- **Purpose**: View and manage past edits
- **Content**:
  - Timeline view of edited images:
    * Thumbnail
    * Date/time
    * Original filename
    * Tap to view full details
  - Search/filter options
  - Delete option (with confirmation)
- **Functionality**: Tap to re-open in editor, swipe to delete

---

## Primary User Flows

### Flow 1: Basic Image Editing
1. User opens app → Home screen
2. Taps "Start Editing" → Image Import screen
3. Selects image from gallery → Image Preview screen
4. Taps "Next" → Editing Tools screen
5. Applies edits (resize, padding, background) → Real-time preview
6. Taps "Export" → Export & Download screen
7. Taps "Download to Gallery" → Image saved
8. Toast confirmation "Image saved successfully"

### Flow 2: Before/After Comparison
1. During editing, user taps "Before/After" toggle
2. Split-screen comparison appears
3. User drags slider to compare
4. Returns to editor by tapping image

### Flow 3: Shipping Cost Estimation
1. After applying edits, user taps "View Savings"
2. Shipping Cost Estimation screen shows
3. User sees estimated reduction (e.g., "₹25 savings")
4. Taps "View Details" to see breakdown
5. Returns to export screen

### Flow 4: Batch Processing (Advanced)
1. User taps "Batch Process" from home
2. Selects multiple images from gallery
3. Chooses preset template (e.g., "Clothing")
4. Taps "Process All"
5. Progress indicator shows processing status
6. Downloads all edited images as ZIP

---

## Key Design Principles

### 1. **One-Handed Usage**
- All interactive elements (buttons, sliders) are positioned within thumb reach
- Primary CTA buttons are at bottom of screen
- Avoid top-right corner for frequent actions
- Use large touch targets (minimum 44×44 pt)

### 2. **Clear Visual Hierarchy**
- Primary actions: Bold, pink (#E91E63), larger text
- Secondary actions: Gray, smaller text
- Tertiary actions: Subtle, gray, minimal styling
- Use spacing and color to guide user attention

### 3. **Real-Time Feedback**
- Live preview updates as user adjusts sliders
- Haptic feedback on button taps (light impact)
- Toast notifications for success/error messages
- Loading spinners during processing

### 4. **Intuitive Controls**
- Sliders for continuous values (brightness, rotation, padding)
- Preset buttons for quick selections
- Toggle switches for on/off states
- Tap targets are clearly defined

### 5. **Minimal Cognitive Load**
- One task per screen (focus principle)
- Clear labels and hints for all controls
- Undo/Redo for mistake recovery
- Confirmation dialogs for destructive actions

### 6. **Accessibility**
- High contrast text (WCAG AA compliant)
- Large font sizes (minimum 16pt for body text)
- VoiceOver support (iOS accessibility)
- Color not used as only indicator (use icons + text)

---

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Headline 1 | SF Pro Display | 32pt | Bold (700) | 40pt |
| Headline 2 | SF Pro Display | 28pt | Semibold (600) | 34pt |
| Headline 3 | SF Pro Display | 22pt | Semibold (600) | 28pt |
| Body | SF Pro Text | 16pt | Regular (400) | 24pt |
| Body Small | SF Pro Text | 14pt | Regular (400) | 20pt |
| Caption | SF Pro Text | 12pt | Regular (400) | 16pt |
| Button | SF Pro Text | 16pt | Semibold (600) | 20pt |

---

## Spacing & Layout

| Element | Value |
|---------|-------|
| Screen padding | 16pt |
| Component spacing | 12pt |
| Section spacing | 24pt |
| Button height | 48pt |
| Input field height | 44pt |
| Card border radius | 12pt |
| Button border radius | 8pt |

---

## Interactions & Animations

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Button tap | Scale 0.97 + opacity 0.9 | 80ms |
| Slider drag | Smooth follow | Real-time |
| Tab swipe | Slide transition | 300ms |
| Modal open | Fade in + slide up | 250ms |
| Modal close | Slide down + fade out | 250ms |
| Success toast | Fade in + slide down | 200ms |
| Loading spinner | Continuous rotation | - |

---

## Haptic Feedback

| Action | Feedback Type | Intensity |
|--------|---------------|-----------|
| Button tap | Light impact | Light |
| Toggle switch | Medium impact | Medium |
| Success confirmation | Success notification | - |
| Error alert | Error notification | - |
| Slider release | Light impact | Light |

---

## Image Specifications

### App Icon
- **Size**: 1024×1024 px (square)
- **Style**: Flat, iconic design representing image optimization
- **Colors**: Meesho pink (#E91E63) with white background
- **No rounded corners**: Icon fills entire square

### Splash Screen
- **Size**: 1000×1000 px
- **Content**: App logo centered on white background
- **Duration**: 2 seconds

### Navigation Icons
- **Size**: 24×24 pt (rendered at 3x for @3x devices)
- **Style**: SF Symbols (iOS native)
- **Color**: Tinted with primary color when active

---

## Accessibility Considerations

1. **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
2. **Touch Targets**: Minimum 44×44 pt for all interactive elements
3. **Font Sizes**: Minimum 16pt for body text, 12pt for captions
4. **VoiceOver Support**: All elements have descriptive labels
5. **Haptic Feedback**: Provides non-visual feedback for actions
6. **Dark Mode**: App supports light/dark mode with appropriate colors

---

## Performance Considerations

1. **Image Loading**: Use progressive loading for large images
2. **Preview Updates**: Debounce slider events to avoid excessive re-renders
3. **Memory Management**: Release image resources when not in use
4. **Network**: Show loading indicators during cloud uploads/downloads
5. **Battery**: Optimize processing to minimize CPU usage

---

## Notes for Implementation

- Use NativeWind (Tailwind CSS) for consistent styling
- Implement gesture handlers for smooth interactions
- Use React Context for state management
- Leverage Expo's built-in components for native feel
- Test on both iOS and Android devices
- Follow Apple's Human Interface Guidelines throughout
