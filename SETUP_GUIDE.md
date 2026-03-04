# Meesho Image Optimizer - Complete Setup & Deployment Guide

## 📱 Project Overview

**Meesho Image Optimizer** is a mobile app that helps Meesho sellers reduce shipping costs by optimizing product images. The app uses OpenCV and Cloudinary to resize, add padding, adjust brightness, and apply other transformations to make products appear smaller in images, thereby reducing volumetric weight estimates and shipping charges.

**Tech Stack:**
- **Frontend:** Expo (React Native) + TypeScript + NativeWind (Tailwind CSS)
- **Backend:** Python Flask + OpenCV + Cloudinary
- **Database:** Optional PostgreSQL (for future features)
- **Deployment:** Expo Go (testing), EAS Build (production APK/IPA)

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js 18+** (with pnpm or npm)
- **Python 3.8+** with pip
- **Cloudinary Account** (free tier available at https://cloudinary.com)
- **Expo Account** (optional, for EAS Build)

### Step 1: Clone/Setup Project

```bash
cd /home/ubuntu/meesho-image-optimizer
```

### Step 2: Install Frontend Dependencies

```bash
pnpm install
# or
npm install
```

### Step 3: Setup Backend

```bash
cd server

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Configure Cloudinary Credentials

Create a `.env` file in the `server/` directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
DEBUG=False
```

**Get Cloudinary Credentials:**
1. Sign up at https://cloudinary.com (free account)
2. Go to Dashboard → Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret

### Step 5: Start Backend Server

```bash
cd server
source venv/bin/activate
python3 app.py
```

Expected output:
```
✅ Cloudinary configured successfully
🚀 Starting server on port 3000 (debug=False)
Running on http://127.0.0.1:3000
```

### Step 6: Start Frontend (in new terminal)

```bash
cd /home/ubuntu/meesho-image-optimizer
pnpm dev
```

This starts:
- Metro Bundler on http://localhost:8081
- Backend API on http://127.0.0.1:3000

### Step 7: Test on Device

**Option A: Expo Go (Easiest)**
1. Install Expo Go app on your phone (iOS App Store or Google Play)
2. Scan the QR code shown in terminal
3. App opens in Expo Go

**Option B: Web Browser**
- Open http://localhost:8081 in your browser
- Note: Some native features won't work on web

---

## 🔧 API Endpoints

All endpoints are at `http://127.0.0.1:3000/api/`

### Health Check
```bash
GET /api/health
```
Response:
```json
{
  "status": "healthy",
  "service": "Meesho Image Optimizer Backend",
  "cloudinary": "connected"
}
```

### Upload Image
```bash
POST /api/upload
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file, max 10MB>

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "dimensions": {"width": 1000, "height": 1000},
  "file_size": 245000
}
```

### Resize Image
```bash
POST /api/resize
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file>
- width: 1000
- height: 1000

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "dimensions": {"width": 1000, "height": 1000}
}
```

### Add Padding
```bash
POST /api/add-padding
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file>
- padding_percentage: 20 (0-50)
- target_size: 1000

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "dimensions": {"width": 1000, "height": 1000}
}
```

### Adjust Brightness/Contrast/Saturation
```bash
POST /api/adjust-brightness
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file>
- brightness: 0 (-100 to 100)
- contrast: 0 (-100 to 100)
- saturation: 0 (-100 to 100)

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/..."
}
```

### Rotate Image
```bash
POST /api/rotate
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file>
- angle: 90 (0-360)

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/..."
}
```

### Crop Image
```bash
POST /api/crop
Content-Type: multipart/form-data

Body:
- image: <PNG/JPG file>
- x: 0
- y: 0
- width: 500
- height: 500

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/..."
}
```

### Estimate Shipping Savings
```bash
POST /api/estimate-shipping
Content-Type: application/json

Body:
{
  "original_width": 2000,
  "original_height": 2000,
  "edited_width": 1000,
  "edited_height": 1000,
  "product_category": "general"
}

Response:
{
  "success": true,
  "volume_reduction_percentage": 75.0,
  "estimated_reduction_inr": 25,
  "original_range": "₹70-110",
  "estimated_new_range": "₹45-85",
  "note": "Estimates based on public data..."
}
```

---

## 📦 Build for Production

### Option 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### Option 2: Local Build (Android)

```bash
# Install Android SDK and NDK first

# Build APK
eas build --platform android --local

# APK will be in: ./dist/
```

### Option 3: Expo Go (Development)

```bash
pnpm dev
# Scan QR code with Expo Go app
```

---

## 🧪 Testing

### Run Unit Tests

```bash
pnpm test
```

### Test API Endpoints

```bash
cd server
source venv/bin/activate
python3 test_api.py
```

### Manual Testing Checklist

- [ ] Upload image from camera
- [ ] Upload image from gallery
- [ ] Resize image (500, 750, 1000 px)
- [ ] Add padding (10%, 20%, 30%)
- [ ] Adjust brightness/contrast/saturation
- [ ] Rotate image
- [ ] Crop image
- [ ] View before/after comparison
- [ ] Download optimized image
- [ ] Share image
- [ ] Check shipping savings estimate
- [ ] Test undo/redo
- [ ] Test presets (Meesho Standard, Budget, Premium)

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `ModuleNotFoundError: No module named 'cv2'`

**Solution:**
```bash
cd server
source venv/bin/activate
pip install opencv-python pillow numpy cloudinary flask flask-cors python-dotenv
```

### API connection fails

**Error:** `HTTPConnectionError: Failed to connect to http://127.0.0.1:3000`

**Solution:**
1. Ensure backend is running: `python3 app.py`
2. Check port 3000 is not in use: `lsof -i :3000`
3. Verify API URL in `services/api-client.ts` is correct

### Cloudinary upload fails

**Error:** `Cloudinary upload error: Invalid credentials`

**Solution:**
1. Check `.env` file has correct credentials
2. Verify credentials at https://cloudinary.com/console
3. Ensure API Secret is not exposed in frontend code

### Image not displaying in export screen

**Error:** Image URI shows but image doesn't render

**Solution:**
1. Check Cloudinary URL is accessible
2. Verify CORS is enabled in backend (`CORS(app)`)
3. Check browser console for 403 Forbidden errors

### Metro bundler crashes

**Error:** `Metro bundler error: Cannot find module`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
pnpm install
pnpm dev
```

---

## 📱 App Features

### Home Screen
- Dashboard with stats
- Quick tips for image optimization
- "How It Works" guide
- Navigation to editor

### Editor Screen
- Import image from camera/gallery
- Real-time preview
- Editing tools:
  - **Resize:** 500, 750, 1000 px presets
  - **Padding:** 10%, 20%, 30% presets
  - **Brightness/Contrast/Saturation:** Sliders
  - **Rotate:** 90°, 180°, 270° + custom angle
  - **Crop:** With grid overlay
- Undo/Redo (up to 10 actions)
- Reset to original

### Export Screen
- Before/After comparison
- Shipping savings estimate
- Image details (dimensions, format)
- Download to gallery
- Share image
- Upload tips

### Presets Screen
- Meesho Standard (1000×1000, 20% padding)
- Budget (750×750, 30% padding)
- Premium (1000×1000, 10% padding)

### Help Screen
- FAQ
- Setup guide
- Meesho requirements
- Shipping cost info

---

## 🔐 Security Notes

- **Never commit `.env` file** with real credentials
- **Use environment variables** for sensitive data
- **Cloudinary API Secret** should only be on backend
- **Frontend uses API Key** (public) for uploads
- **Enable CORS** only for trusted domains in production

---

## 📊 Performance Tips

1. **Image Optimization:**
   - Use PNG format for transparency, JPG for photos
   - Keep file size under 10MB
   - Use 1:1 square aspect ratio

2. **Backend Performance:**
   - Use production WSGI server (Gunicorn, uWSGI)
   - Enable caching for repeated operations
   - Use CDN (Cloudinary handles this)

3. **Frontend Performance:**
   - Use FlatList for lists (not ScrollView + map)
   - Memoize components to prevent re-renders
   - Lazy load images

---

## 📝 Environment Variables

### Frontend (`.env` or `.env.local`)
```env
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:3000
```

### Backend (`server/.env`)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
DEBUG=False
```

---

## 🚢 Deployment Checklist

- [ ] Backend running on production server
- [ ] Cloudinary credentials configured
- [ ] CORS enabled for production domain
- [ ] API URL updated in frontend
- [ ] All tests passing
- [ ] App icon and splash screen configured
- [ ] App name and version updated
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Build APK/IPA with EAS Build
- [ ] Test on real devices
- [ ] Submit to Google Play / App Store

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs: `server/server.log`
3. Check frontend console: `pnpm dev` output
4. Test API endpoints manually with curl or Postman

---

## 📄 License

This project is provided as-is for Meesho sellers to optimize their product images.

---

**Last Updated:** March 1, 2026
**Version:** 1.0.0
