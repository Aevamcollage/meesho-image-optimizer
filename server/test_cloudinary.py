#!/usr/bin/env python3
"""Test Cloudinary connection"""
import os
import cloudinary
import cloudinary.api

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

try:
    result = cloudinary.api.ping()
    print("Cloudinary connection successful!")
    print(f"Response: {result}")
except Exception as e:
    print(f"Cloudinary connection failed: {str(e)}")
    exit(1)
