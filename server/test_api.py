#!/usr/bin/env python3
"""
Test script to verify Meesho Image Optimizer Backend API
"""

import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# API Base URL
port = os.getenv('PORT', '3000')
API_URL = os.getenv('API_URL', f'http://localhost:{port}')

print("=" * 80)
print("🧪 MEESHO IMAGE OPTIMIZER - API TEST SUITE")
print("=" * 80)
print(f"\n📍 Testing API at: {API_URL}\n")

# Test 1: Health Check
print("1️⃣  Testing Health Check...")
try:
    response = requests.get(f"{API_URL}/api/health")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Health Check: {data['status']}")
        print(f"   Service: {data['service']}")
        print(f"   Cloudinary: {data.get('cloudinary', 'unknown')}")
    else:
        print(f"❌ Health Check failed: {response.status_code}")
except Exception as e:
    print(f"❌ Health Check error: {e}")

print("\n" + "=" * 80)

# Test 2: Create a test image
print("\n2️⃣  Creating test image...")
try:
    from PIL import Image
    import io
    
    # Create a simple test image (500x500 red square)
    img = Image.new('RGB', (500, 500), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    print("✅ Test image created (500×500 red square)")
    
    # Test 3: Upload Image
    print("\n3️⃣  Testing Image Upload...")
    files = {'image': ('test.png', img_bytes, 'image/png')}
    response = requests.post(f"{API_URL}/api/upload", files=files)
    
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            print(f"✅ Upload successful!")
            print(f"   URL: {data.get('url', 'N/A')[:60]}...")
            print(f"   Dimensions: {data.get('dimensions')}")
            uploaded_url = data.get('url')
        else:
            print(f"❌ Upload failed: {data.get('error')}")
            uploaded_url = None
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        uploaded_url = None
    
    print("\n" + "=" * 80)
    
    # Test 4: Resize Image
    if uploaded_url:
        print("\n4️⃣  Testing Image Resize...")
        img_bytes.seek(0)
        files = {'image': ('test.png', img_bytes, 'image/png')}
        data = {'width': '1000', 'height': '1000'}
        response = requests.post(f"{API_URL}/api/resize", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ Resize successful!")
                print(f"   URL: {result.get('url', 'N/A')[:60]}...")
                print(f"   Dimensions: {result.get('dimensions')}")
            else:
                print(f"❌ Resize failed: {result.get('error')}")
        else:
            print(f"❌ Resize failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    
    print("\n" + "=" * 80)
    
    # Test 5: Add Padding
    if uploaded_url:
        print("\n5️⃣  Testing Add Padding...")
        img_bytes.seek(0)
        files = {'image': ('test.png', img_bytes, 'image/png')}
        data = {'padding_percentage': '20', 'target_size': '1000'}
        response = requests.post(f"{API_URL}/api/add-padding", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print(f"✅ Padding successful!")
                print(f"   URL: {result.get('url', 'N/A')[:60]}...")
                print(f"   Dimensions: {result.get('dimensions')}")
            else:
                print(f"❌ Padding failed: {result.get('error')}")
        else:
            print(f"❌ Padding failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    
    print("\n" + "=" * 80)
    
    # Test 6: Estimate Shipping
    print("\n6️⃣  Testing Shipping Estimation...")
    payload = {
        'original_width': 2000,
        'original_height': 2000,
        'edited_width': 1000,
        'edited_height': 1000,
        'product_category': 'general'
    }
    response = requests.post(
        f"{API_URL}/api/estimate-shipping",
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            print(f"✅ Shipping estimation successful!")
            print(f"   Volume reduction: {result.get('volume_reduction_percentage')}%")
            print(f"   Estimated savings: ₹{result.get('estimated_reduction_inr')}")
            print(f"   Original range: {result.get('original_range')}")
            print(f"   New range: {result.get('estimated_new_range')}")
        else:
            print(f"❌ Estimation failed: {result.get('error')}")
    else:
        print(f"❌ Estimation failed: {response.status_code}")
        print(f"   Response: {response.text[:200]}")

except ImportError:
    print("❌ PIL not installed. Install with: pip install Pillow")
except Exception as e:
    print(f"❌ Test error: {e}")

print("\n" + "=" * 80)
print("✅ API Test Suite Complete!")
print("=" * 80)
