"""
Meesho Image Optimizer Backend API
Flask application with OpenCV and Cloudinary integration
"""

import os
import io
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api
import cv2
import numpy as np
from PIL import Image
import logging
from werkzeug.utils import secure_filename
import uuid

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def is_cloudinary_enabled():
    return all([
        os.getenv('CLOUDINARY_CLOUD_NAME'),
        os.getenv('CLOUDINARY_API_KEY'),
        os.getenv('CLOUDINARY_API_SECRET'),
    ])


# Verify Cloudinary config
if not is_cloudinary_enabled():
    logger.warning("⚠️  Cloudinary credentials not fully configured; using data URLs")
else:
    logger.info("✅ Cloudinary configured successfully")

# Constants
ALLOWED_FORMATS = {'jpeg', 'jpg', 'png'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MEESHO_MIN_SIZE = 500
MEESHO_MAX_SIZE = 1000


def validate_image(file):
    """Validate image file format and size"""
    if file.filename == '':
        return False, "No file selected"
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return False, f"File size exceeds {MAX_FILE_SIZE / (1024*1024):.0f} MB limit"
    
    # Check file format
    file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    if file_ext not in ALLOWED_FORMATS:
        return False, f"File format not supported. Allowed: {', '.join(ALLOWED_FORMATS)}"
    
    return True, "Valid"


def make_data_url(image_data, filename):
    """Build a data URL for image bytes when Cloudinary is disabled"""
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'png'
    if ext in ['jpg', 'jpeg']:
        mime = 'image/jpeg'
    elif ext == 'png':
        mime = 'image/png'
    else:
        mime = 'application/octet-stream'
    encoded = base64.b64encode(image_data).decode('utf-8')
    return f"data:{mime};base64,{encoded}"


def upload_to_cloudinary(image_data, filename, folder="meesho-optimizer"):
    """Upload image to Cloudinary and return URL or data URL fallback"""
    if not is_cloudinary_enabled():
        return make_data_url(image_data, filename), None

    try:
        # Generate unique filename to avoid conflicts
        unique_id = str(uuid.uuid4())[:8]
        base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
        public_id = f"{base_name}_{unique_id}"
        
        logger.info(f"Uploading to Cloudinary: {public_id}")
        
        result = cloudinary.uploader.upload(
            image_data,
            folder=folder,
            public_id=public_id,
            resource_type='image',
            overwrite=False
        )
        
        secure_url = result.get('secure_url')
        logger.info(f"✅ Upload successful: {secure_url}")
        return secure_url, None
    except Exception as e:
        logger.error(f"❌ Cloudinary upload error: {str(e)}")
        return None, str(e)


def image_to_base64(image_array):
    """Convert OpenCV image array to Base64 string"""
    _, buffer = cv2.imencode('.png', image_array)
    return base64.b64encode(buffer).decode('utf-8')


def get_image_dimensions(image_array):
    """Get dimensions of image array"""
    height, width = image_array.shape[:2]
    return width, height


def parse_int(value):
    """Safely parse an int from request data"""
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def processed_filename(original_name, prefix):
    """Return a .png filename for processed images"""
    base = os.path.splitext(original_name)[0] if original_name else prefix
    return f"{prefix}_{base}.png"


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test Cloudinary connection
        cloudinary.api.ping()
        cloudinary_status = "connected"
    except:
        cloudinary_status = "disconnected"
    
    return jsonify({
        'status': 'healthy',
        'service': 'Meesho Image Optimizer Backend',
        'version': '1.0.0',
        'cloudinary': cloudinary_status
    }), 200


@app.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload image to Cloudinary"""
    try:
        logger.info("📤 Upload endpoint called")
        
        if 'image' not in request.files:
            logger.error("❌ No image file in request")
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        logger.info(f"📁 File received: {file.filename}")
        
        # Validate image
        is_valid, message = validate_image(file)
        if not is_valid:
            logger.error(f"❌ Validation failed: {message}")
            return jsonify({'success': False, 'error': message}), 400
        
        # Read file content
        file_content = file.read()
        logger.info(f"📊 File size: {len(file_content)} bytes")
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(file_content, file.filename)
        
        if error:
            logger.error(f"❌ Upload failed: {error}")
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        # Get image dimensions
        try:
            nparr = np.frombuffer(file_content, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is not None:
                width, height = get_image_dimensions(img)
            else:
                width, height = 0, 0
        except Exception as e:
            logger.warning(f"⚠️  Could not get dimensions: {e}")
            width, height = 0, 0
        
        response = {
            'success': True,
            'url': url,
            'dimensions': {'width': width, 'height': height},
            'file_size': len(file_content)
        }
        
        logger.info(f"✅ Upload successful: {response}")
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"❌ Upload error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/resize', methods=['POST'])
def resize_image():
    """Resize image to specified dimensions"""
    try:
        logger.info("🔄 Resize endpoint called")
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        width = request.form.get('width', MEESHO_MAX_SIZE, type=int)
        height = request.form.get('height', MEESHO_MAX_SIZE, type=int)
        
        logger.info(f"📐 Resizing to {width}×{height}")
        
        # Validate inputs
        if width < MEESHO_MIN_SIZE or height < MEESHO_MIN_SIZE:
            return jsonify({'success': False, 'error': f'Minimum size is {MEESHO_MIN_SIZE}×{MEESHO_MIN_SIZE}'}), 400
        
        # Read image
        file_content = file.read()
        nparr = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400
        
        # Resize image
        resized = cv2.resize(img, (width, height), interpolation=cv2.INTER_LANCZOS4)
        
        # Encode to PNG
        _, buffer = cv2.imencode('.png', resized)
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(buffer.tobytes(), processed_filename(file.filename, "resized"))
        
        if error:
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        return jsonify({
            'success': True,
            'url': url,
            'dimensions': {'width': width, 'height': height},
            'file_size': len(buffer)
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Resize error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/rotate', methods=['POST'])
def rotate_image():
    """Rotate image by specified angle"""
    try:
        logger.info("🔁 Rotate endpoint called")
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        angle = request.form.get('angle', 0, type=float)
        
        logger.info(f"🔄 Rotating by {angle}°")
        
        # Read image
        file_content = file.read()
        nparr = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400
        
        # Get image dimensions
        h, w = img.shape[:2]
        center = (w // 2, h // 2)
        
        # Get rotation matrix
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        
        # Rotate image
        rotated = cv2.warpAffine(img, matrix, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 255, 255))
        
        # Encode to PNG
        _, buffer = cv2.imencode('.png', rotated)
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(buffer.tobytes(), processed_filename(file.filename, "rotated"))
        
        if error:
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        return jsonify({
            'success': True,
            'url': url,
            'angle': angle,
            'dimensions': {'width': w, 'height': h}
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Rotate error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/add-padding', methods=['POST'])
def add_padding():
    """Add padding around image"""
    try:
        logger.info("📦 Add padding endpoint called")
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        padding_percentage = request.form.get('padding_percentage', 20, type=int)
        target_size = request.form.get('target_size', MEESHO_MAX_SIZE, type=int)
        
        logger.info(f"📏 Adding {padding_percentage}% padding, target size: {target_size}×{target_size}")
        
        # Validate padding percentage
        if padding_percentage < 0 or padding_percentage > 50:
            return jsonify({'success': False, 'error': 'Padding percentage must be between 0 and 50'}), 400
        
        # Read image
        file_content = file.read()
        nparr = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400
        
        # Calculate padding size
        h, w = img.shape[:2]
        max_dim = max(h, w)
        padding_pixels = int(max_dim * (padding_percentage / 100))
        
        # Add padding with white background
        padded = cv2.copyMakeBorder(
            img,
            padding_pixels, padding_pixels, padding_pixels, padding_pixels,
            cv2.BORDER_CONSTANT,
            value=(255, 255, 255)
        )
        
        # Resize to target size to maintain square aspect ratio
        resized = cv2.resize(padded, (target_size, target_size), interpolation=cv2.INTER_LANCZOS4)
        
        # Encode to PNG
        _, buffer = cv2.imencode('.png', resized)
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(buffer.tobytes(), processed_filename(file.filename, "padded"))
        
        if error:
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        return jsonify({
            'success': True,
            'url': url,
            'padding_percentage': padding_percentage,
            'dimensions': {'width': target_size, 'height': target_size},
            'file_size': len(buffer)
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Padding error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/adjust-brightness', methods=['POST'])
def adjust_brightness():
    """Adjust brightness, contrast, and saturation"""
    try:
        logger.info("☀️  Adjust brightness endpoint called")
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        brightness = request.form.get('brightness', 0, type=float)
        contrast = request.form.get('contrast', 0, type=float)
        saturation = request.form.get('saturation', 0, type=float)
        
        logger.info(f"🎨 Adjusting: brightness={brightness}, contrast={contrast}, saturation={saturation}")
        
        # Read image
        file_content = file.read()
        nparr = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400
        
        # Adjust brightness
        if brightness != 0:
            img = cv2.convertScaleAbs(img, alpha=1, beta=brightness)
        
        # Adjust contrast
        if contrast != 0:
            img = cv2.convertScaleAbs(img, alpha=1 + (contrast / 100), beta=0)
        
        # Adjust saturation
        if saturation != 0:
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
            hsv[:, :, 1] = hsv[:, :, 1] * (1 + (saturation / 100))
            hsv[:, :, 1] = np.clip(hsv[:, :, 1], 0, 255)
            img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        
        # Encode to PNG
        _, buffer = cv2.imencode('.png', img)
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(buffer.tobytes(), processed_filename(file.filename, "adjusted"))
        
        if error:
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        return jsonify({
            'success': True,
            'url': url,
            'adjustments': {
                'brightness': brightness,
                'contrast': contrast,
                'saturation': saturation
            }
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Brightness adjustment error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/crop', methods=['POST'])
def crop_image():
    """Crop image to specified area"""
    try:
        logger.info("✂️  Crop endpoint called")
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        x = request.form.get('x', 0, type=int)
        y = request.form.get('y', 0, type=int)
        width = request.form.get('width', type=int)
        height = request.form.get('height', type=int)
        
        if width is None or height is None:
            return jsonify({'success': False, 'error': 'Crop dimensions required'}), 400

        if width <= 0 or height <= 0:
            return jsonify({'success': False, 'error': 'Crop dimensions must be greater than 0'}), 400
        
        logger.info(f"📐 Cropping: x={x}, y={y}, width={width}, height={height}")
        
        # Read image
        file_content = file.read()
        nparr = np.frombuffer(file_content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400
        
        # Crop image (clamp to bounds)
        img_height, img_width = img.shape[:2]

        if x < 0 or y < 0 or x >= img_width or y >= img_height:
            return jsonify({'success': False, 'error': 'Crop origin out of bounds'}), 400

        x_end = min(x + width, img_width)
        y_end = min(y + height, img_height)

        cropped = img[y:y_end, x:x_end]
        
        # Encode to PNG
        _, buffer = cv2.imencode('.png', cropped)
        
        # Upload to Cloudinary
        url, error = upload_to_cloudinary(buffer.tobytes(), processed_filename(file.filename, "cropped"))
        
        if error:
            return jsonify({'success': False, 'error': f"Upload failed: {error}"}), 500
        
        return jsonify({
            'success': True,
            'url': url,
            'crop_area': {'x': x, 'y': y, 'width': x_end - x, 'height': y_end - y},
            'dimensions': {'width': x_end - x, 'height': y_end - y}
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Crop error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/estimate-shipping', methods=['POST'])
def estimate_shipping():
    """Estimate shipping cost reduction"""
    try:
        logger.info("💰 Estimate shipping endpoint called")
        
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'success': False, 'error': 'No JSON data provided'}), 400
        
        original_width = parse_int(data.get('original_width'))
        original_height = parse_int(data.get('original_height'))
        edited_width = parse_int(data.get('edited_width'))
        edited_height = parse_int(data.get('edited_height'))
        product_category = data.get('product_category', 'general')
        
        if not all([original_width, original_height, edited_width, edited_height]):
            return jsonify({'success': False, 'error': 'All dimensions required'}), 400
        
        # Calculate volumetric weight reduction (simplified)
        original_volume = original_width * original_height
        edited_volume = edited_width * edited_height
        if original_volume <= 0:
            return jsonify({'success': False, 'error': 'Original dimensions must be greater than 0'}), 400

        volume_reduction = ((original_volume - edited_volume) / original_volume) * 100
        volume_reduction = max(0.0, min(100.0, volume_reduction))
        
        # Estimate shipping cost reduction based on category
        shipping_ranges = {
            'clothing': {'original': (80, 120), 'reduction': (15, 40)},
            'electronics': {'original': (100, 150), 'reduction': (20, 50)},
            'accessories': {'original': (50, 90), 'reduction': (10, 30)},
            'general': {'original': (70, 110), 'reduction': (15, 35)}
        }
        
        category_data = shipping_ranges.get(product_category, shipping_ranges['general'])
        estimated_reduction = int(category_data['reduction'][0] + (volume_reduction / 100) * (category_data['reduction'][1] - category_data['reduction'][0]))
        
        return jsonify({
            'success': True,
            'volume_reduction_percentage': round(volume_reduction, 2),
            'estimated_reduction_inr': estimated_reduction,
            'original_range': f"₹{category_data['original'][0]}-{category_data['original'][1]}",
            'estimated_new_range': f"₹{max(0, category_data['original'][0] - estimated_reduction)}-{category_data['original'][1] - estimated_reduction}",
            'note': 'Estimates based on public data. Actual costs may vary based on Meesho\'s algorithm.'
        }), 200
    
    except Exception as e:
        logger.error(f"❌ Shipping estimation error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False') == 'True'
    logger.info(f"🚀 Starting server on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
