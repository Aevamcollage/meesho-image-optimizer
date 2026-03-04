/**
 * useImageEditor Hook
 * Manages image editing state and operations
 */

import { useState, useCallback } from "react";
import { Image as RNImage } from "react-native";
import * as apiClient from "@/services/api-client";

export interface EditState {
  originalUri: string | null;
  currentUri: string | null;
  originalDimensions: { width: number; height: number } | null;
  currentDimensions: { width: number; height: number } | null;
  loading: boolean;
  error: string | null;
}

export interface EditControls {
  resize: number;
  padding: number;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}

export function useImageEditor() {
  const [editState, setEditState] = useState<EditState>({
    originalUri: null,
    currentUri: null,
    originalDimensions: null,
    currentDimensions: null,
    loading: false,
    error: null,
  });

  const [controls, setControls] = useState<EditControls>({
    resize: 1000,
    padding: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
  });

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /**
   * Load initial image
   */
  const loadImage = useCallback((imageUri: string) => {
    setEditState((prev) => ({ ...prev, loading: true, error: null }));

    RNImage.getSize(
      imageUri,
      (width, height) => {
        setEditState((prev) => ({
          ...prev,
          originalUri: imageUri,
          currentUri: imageUri,
          originalDimensions: { width, height },
          currentDimensions: { width, height },
          loading: false,
        }));
        setHistory([imageUri]);
        setHistoryIndex(0);
      },
      (error) => {
        setEditState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to load image",
        }));
      },
    );
  }, []);

  /**
   * Apply resize
   */
  const applyResize = useCallback(
    async (size: number) => {
      if (!editState.currentUri) return;

      setEditState((prev) => ({ ...prev, loading: true, error: null }));
      setControls((prev) => ({ ...prev, resize: size }));

      try {
        const result = await apiClient.resizeImage(
          editState.currentUri,
          size,
          size,
          `resized_${Date.now()}.png`,
        );

        if (result.success && result.url) {
          setEditState((prev) => ({
            ...prev,
            currentUri: result.url,
            currentDimensions: result.dimensions || prev.currentDimensions,
            loading: false,
          }));
          setHistory((prev) => [
            ...prev.slice(0, historyIndex + 1),
            result.url,
          ]);
          setHistoryIndex((prev) => prev + 1);
        } else {
          throw new Error(result.error || "Resize failed");
        }
      } catch (error) {
        setEditState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Resize failed",
        }));
      }
    },
    [editState.currentUri, historyIndex],
  );

  /**
   * Apply padding
   */
  const applyPadding = useCallback(
    async (paddingPercentage: number) => {
      if (!editState.currentUri) return;

      setEditState((prev) => ({ ...prev, loading: true, error: null }));
      setControls((prev) => ({ ...prev, padding: paddingPercentage }));

      try {
        const result = await apiClient.addPadding(
          editState.currentUri,
          paddingPercentage,
          1000,
          `padded_${Date.now()}.png`,
        );

        if (result.success && result.url) {
          setEditState((prev) => ({
            ...prev,
            currentUri: result.url,
            currentDimensions: result.dimensions || prev.currentDimensions,
            loading: false,
          }));
          setHistory((prev) => [
            ...prev.slice(0, historyIndex + 1),
            result.url,
          ]);
          setHistoryIndex((prev) => prev + 1);
        } else {
          throw new Error(result.error || "Padding failed");
        }
      } catch (error) {
        setEditState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Padding failed",
        }));
      }
    },
    [editState.currentUri, historyIndex],
  );

  /**
   * Apply brightness adjustment
   */
  const applyBrightness = useCallback(
    async (brightness: number, contrast: number, saturation: number) => {
      if (!editState.currentUri) return;

      setEditState((prev) => ({ ...prev, loading: true, error: null }));
      setControls((prev) => ({ ...prev, brightness, contrast, saturation }));

      try {
        const result = await apiClient.adjustBrightness(
          editState.currentUri,
          brightness,
          contrast,
          saturation,
          `adjusted_${Date.now()}.png`,
        );

        if (result.success && result.url) {
          setEditState((prev) => ({
            ...prev,
            currentUri: result.url,
            loading: false,
          }));
          setHistory((prev) => [
            ...prev.slice(0, historyIndex + 1),
            result.url,
          ]);
          setHistoryIndex((prev) => prev + 1);
        } else {
          throw new Error(result.error || "Brightness adjustment failed");
        }
      } catch (error) {
        setEditState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Brightness adjustment failed",
        }));
      }
    },
    [editState.currentUri, historyIndex],
  );

  /**
   * Apply rotation
   */
  const applyRotation = useCallback(
    async (angle: number) => {
      if (!editState.currentUri) return;

      setEditState((prev) => ({ ...prev, loading: true, error: null }));
      setControls((prev) => ({ ...prev, rotation: angle }));

      try {
        const result = await apiClient.rotateImage(
          editState.currentUri,
          angle,
          `rotated_${Date.now()}.png`,
        );

        if (result.success && result.url) {
          setEditState((prev) => ({
            ...prev,
            currentUri: result.url,
            loading: false,
          }));
          setHistory((prev) => [
            ...prev.slice(0, historyIndex + 1),
            result.url,
          ]);
          setHistoryIndex((prev) => prev + 1);
        } else {
          throw new Error(result.error || "Rotation failed");
        }
      } catch (error) {
        setEditState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Rotation failed",
        }));
      }
    },
    [editState.currentUri, historyIndex],
  );

  /**
   * Undo last edit
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditState((prev) => ({
        ...prev,
        currentUri: history[newIndex],
      }));
    }
  }, [history, historyIndex]);

  /**
   * Redo last undone edit
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditState((prev) => ({
        ...prev,
        currentUri: history[newIndex],
      }));
    }
  }, [history, historyIndex]);

  /**
   * Reset to original image
   */
  const reset = useCallback(() => {
    if (editState.originalUri) {
      setEditState((prev) => ({
        ...prev,
        currentUri: prev.originalUri,
        currentDimensions: prev.originalDimensions,
      }));
      setControls({
        resize: 1000,
        padding: 0,
        brightness: 0,
        contrast: 0,
        saturation: 0,
        rotation: 0,
      });
      setHistory([editState.originalUri]);
      setHistoryIndex(0);
    }
  }, [editState.originalUri, editState.originalDimensions]);

  /**
   * Get estimated shipping savings
   */
  const getShippingSavings = useCallback(async () => {
    if (!editState.originalDimensions || !editState.currentDimensions)
      return null;

    try {
      const result = await apiClient.estimateShipping(
        editState.originalDimensions.width,
        editState.originalDimensions.height,
        editState.currentDimensions.width,
        editState.currentDimensions.height,
        "general",
      );

      return result;
    } catch (error) {
      console.error("Shipping estimation error:", error);
      return null;
    }
  }, [editState.originalDimensions, editState.currentDimensions]);

  return {
    editState,
    controls,
    history,
    historyIndex,
    loadImage,
    applyResize,
    applyPadding,
    applyBrightness,
    applyRotation,
    undo,
    redo,
    reset,
    getShippingSavings,
  };
}
