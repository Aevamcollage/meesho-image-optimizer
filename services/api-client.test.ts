import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as apiClient from './api-client';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should estimate shipping costs', async () => {
    const mockResponse = {
      success: true,
      volume_reduction_percentage: 75,
      estimated_reduction_inr: 25,
      original_range: '₹80-₹120',
      estimated_new_range: '₹55-₹95',
      note: 'Estimated savings based on Meesho algorithm',
    };

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const result = await apiClient.estimateShipping(2000, 2000, 1000, 1000, 'general');

    expect(result.success).toBe(true);
    expect(result.volume_reduction_percentage).toBe(75);
    expect(result.estimated_reduction_inr).toBe(25);
  });

  it('should handle shipping estimation errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await apiClient.estimateShipping(2000, 2000, 1000, 1000, 'general');

    expect(result.success).toBe(false);
    expect(result.volume_reduction_percentage).toBe(0);
  });

  it('should check health status', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ status: 'healthy' }),
    });

    const result = await apiClient.healthCheck();

    expect(result).toBe(true);
  });

  it('should handle health check failures', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Connection failed'));

    const result = await apiClient.healthCheck();

    expect(result).toBe(false);
  });

  it('should validate API response structure', async () => {
    const mockResponse = {
      success: true,
      volume_reduction_percentage: 50,
      estimated_reduction_inr: 15,
      original_range: '₹100-₹150',
      estimated_new_range: '₹85-₹135',
      note: 'Test note',
    };

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    const result = await apiClient.estimateShipping(1500, 1500, 1000, 1000, 'general');

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('volume_reduction_percentage');
    expect(result).toHaveProperty('estimated_reduction_inr');
    expect(result).toHaveProperty('original_range');
    expect(result).toHaveProperty('estimated_new_range');
  });
});
