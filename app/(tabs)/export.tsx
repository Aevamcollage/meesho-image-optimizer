import { ScrollView, Text, View, Pressable, Image as RNImage, ActivityIndicator, Share, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { ScreenContainer } from "@/components/screen-container";
import * as apiClient from "@/services/api-client";

export default function ExportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState<any>(null);
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);

  const imageUri = params.imageUri as string;
  const originalWidth = parseInt(params.originalWidth as string) || 0;
  const originalHeight = parseInt(params.originalHeight as string) || 0;
  const editedWidth = parseInt(params.editedWidth as string) || 0;
  const editedHeight = parseInt(params.editedHeight as string) || 0;

  useEffect(() => {
    getShippingEstimate();
    checkMediaPermission();
  }, []);

  const checkMediaPermission = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(permission.granted);
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const getShippingEstimate = async () => {
    try {
      setLoading(true);
      const estimate = await apiClient.estimateShipping(
        originalWidth,
        originalHeight,
        editedWidth,
        editedHeight,
        "general"
      );
      setShippingData(estimate);
    } catch (error) {
      console.error("Shipping estimate error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUri) return;

    setLoading(true);
    try {
      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const filename = `meesho-optimized-${timestamp}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      // Download image from URL
      const downloadResult = await FileSystem.downloadAsync(imageUri, fileUri);

      if (downloadResult.status === 200) {
        // Save to media library if permission granted
        if (mediaPermission) {
          await MediaLibrary.createAssetAsync(fileUri);
          Alert.alert("Success", "Image saved to your gallery!");
        } else {
          Alert.alert("Success", `Image saved to: ${fileUri}`);
        }
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to download image: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const shareImage = async () => {
    if (!imageUri) return;

    try {
      await Share.share({
        url: imageUri,
        title: "Meesho Optimized Image",
        message: "Check out my optimized product image for Meesho!",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share image");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Export & Save</Text>
            <Text className="text-base text-muted">Download your optimized image</Text>
          </View>

          {/* Image Preview */}
          {imageUri && (
            <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
              <RNImage
                source={{ uri: imageUri }}
                style={{ width: "100%", height: 280, borderRadius: 12 }}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Shipping Savings Card */}
          {shippingData && shippingData.success && (
            <View className="bg-success/10 rounded-2xl p-4 border border-success">
              <Text className="text-lg font-bold text-success mb-3">💰 Estimated Shipping Savings</Text>

              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">Volume Reduction</Text>
                  <Text className="text-sm font-semibold text-success">
                    {shippingData.volume_reduction_percentage}%
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">Original Range</Text>
                  <Text className="text-sm font-semibold text-foreground">{shippingData.original_range}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">New Range</Text>
                  <Text className="text-sm font-semibold text-success">{shippingData.estimated_new_range}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">Est. Savings per Order</Text>
                  <Text className="text-sm font-bold text-success">
                    ₹{shippingData.estimated_reduction_inr}
                  </Text>
                </View>

                <Text className="text-xs text-muted mt-2 italic">{shippingData.note}</Text>
              </View>
            </View>
          )}

          {/* Image Dimensions */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-3">Image Details</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Original Size</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {originalWidth}×{originalHeight}px
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Optimized Size</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {editedWidth}×{editedHeight}px
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Format</Text>
                <Text className="text-sm font-semibold text-foreground">PNG (Recommended)</Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">📋 Upload Tips</Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Use this optimized image when uploading to Meesho{"\n"}
              • Keep the white background for best results{"\n"}
              • Upload in 1:1 square format{"\n"}
              • File size should be under 10MB
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={downloadImage}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-primary rounded-2xl p-4 items-center flex-row justify-center gap-2">
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-lg font-bold text-background">⬇️</Text>
                    <Text className="text-lg font-bold text-background">Download Image</Text>
                  </>
                )}
              </View>
            </Pressable>

            <Pressable
              onPress={shareImage}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-surface rounded-2xl p-4 items-center flex-row justify-center gap-2 border border-border">
                <Text className="text-lg font-bold text-foreground">📤</Text>
                <Text className="text-lg font-bold text-foreground">Share Image</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/editor" as any)}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-surface rounded-2xl p-4 items-center flex-row justify-center gap-2 border border-border">
                <Text className="text-lg font-bold text-foreground">✏️</Text>
                <Text className="text-lg font-bold text-foreground">Edit Another Image</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/" as any)}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View className="bg-surface rounded-2xl p-4 items-center border border-border">
                <Text className="text-lg font-bold text-foreground">← Back to Home</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
