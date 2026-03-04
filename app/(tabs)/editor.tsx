import { ScrollView, Text, View, Pressable, Image as RNImage, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useImageEditor } from "@/hooks/use-image-editor";
import { SliderControl, PresetButtons } from "@/components/slider-control";

type EditTab = "resize" | "padding" | "brightness" | "rotation" | "crop";

export default function EditorScreen() {
  const router = useRouter();
  const imageEditor = useImageEditor();
  const [activeTab, setActiveTab] = useState<EditTab>("resize");
  const [showComparison, setShowComparison] = useState(false);
  const [shippingData, setShippingData] = useState<any>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        imageEditor.loadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        imageEditor.loadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleExport = async () => {
    if (!imageEditor.editState.currentUri) return;

    // Get shipping savings
    const savings = await imageEditor.getShippingSavings();
    setShippingData(savings);

    // Navigate to export screen with image data
    router.push({
      pathname: "/export" as any,
      params: {
        imageUri: imageEditor.editState.currentUri,
        originalWidth: imageEditor.editState.originalDimensions?.width || 0,
        originalHeight: imageEditor.editState.originalDimensions?.height || 0,
        editedWidth: imageEditor.editState.currentDimensions?.width || 0,
        editedHeight: imageEditor.editState.currentDimensions?.height || 0,
      },
    });
  };

  if (!imageEditor.editState.currentUri) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 gap-6">
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">Edit Image</Text>
              <Text className="text-base text-muted">Upload or capture a product image to optimize</Text>
            </View>

            <View className="bg-surface rounded-2xl p-8 border-2 border-dashed border-border items-center justify-center min-h-80">
              <Text className="text-lg font-semibold text-muted">No image selected</Text>
              <Text className="text-sm text-muted mt-2">Upload an image to get started</Text>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={takePhoto}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <View className="bg-primary rounded-2xl p-4 items-center flex-row justify-center gap-2">
                  <Text className="text-lg font-bold text-background">📷</Text>
                  <Text className="text-lg font-bold text-background">Take Photo</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={pickImage}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <View className="bg-surface rounded-2xl p-4 items-center flex-row justify-center gap-2 border border-border">
                  <Text className="text-lg font-bold text-foreground">🖼️</Text>
                  <Text className="text-lg font-bold text-foreground">Choose from Gallery</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Image Preview */}
          <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
            {imageEditor.editState.loading ? (
              <View className="h-64 items-center justify-center">
                <ActivityIndicator size="large" color="#E91E63" />
              </View>
            ) : (
              <>
                <RNImage
                  source={{ uri: imageEditor.editState.currentUri }}
                  style={{ width: "100%", height: 250, borderRadius: 12 }}
                  resizeMode="contain"
                />
                <View className="flex-row justify-between mt-3 pt-3 border-t border-border">
                  <Text className="text-xs text-muted">
                    {imageEditor.editState.currentDimensions?.width}×{imageEditor.editState.currentDimensions?.height}px
                  </Text>
                  <Pressable onPress={() => setShowComparison(!showComparison)}>
                    <Text className="text-xs text-primary font-semibold">
                      {showComparison ? "Hide" : "Compare"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {/* Error Display */}
          {imageEditor.editState.error && (
            <View className="bg-error/10 rounded-lg p-3 border border-error">
              <Text className="text-sm text-error">{imageEditor.editState.error}</Text>
            </View>
          )}

          {/* Tab Navigation */}
          <View className="flex-row gap-2 bg-surface rounded-xl p-1">
            {(["resize", "padding", "brightness", "rotation", "crop"] as EditTab[]).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View
                  className={`flex-1 py-2 px-3 rounded-lg items-center ${
                    activeTab === tab ? "bg-primary" : ""
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      activeTab === tab ? "text-background" : "text-muted"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Editing Controls */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            {activeTab === "resize" && (
              <View className="gap-4">
                <Text className="text-sm font-semibold text-foreground">Resize to Meesho Standard</Text>
                <PresetButtons
                  options={[
                    { label: "500×500", value: 500 },
                    { label: "750×750", value: 750 },
                    { label: "1000×1000", value: 1000 },
                  ]}
                  selectedValue={imageEditor.controls.resize}
                  onSelect={imageEditor.applyResize}
                  disabled={imageEditor.editState.loading}
                />
              </View>
            )}

            {activeTab === "padding" && (
              <View className="gap-4">
                <Text className="text-sm font-semibold text-foreground">Add Padding</Text>
                <SliderControl
                  label="Padding"
                  value={imageEditor.controls.padding}
                  min={0}
                  max={50}
                  step={5}
                  unit="%"
                  onValueChange={imageEditor.applyPadding}
                  disabled={imageEditor.editState.loading}
                />
                <PresetButtons
                  options={[
                    { label: "Small (10%)", value: 10 },
                    { label: "Medium (20%)", value: 20 },
                    { label: "Large (30%)", value: 30 },
                  ]}
                  selectedValue={imageEditor.controls.padding}
                  onSelect={imageEditor.applyPadding}
                  disabled={imageEditor.editState.loading}
                />
              </View>
            )}

            {activeTab === "brightness" && (
              <View className="gap-4">
                <Text className="text-sm font-semibold text-foreground">Adjust Image</Text>
                <SliderControl
                  label="Brightness"
                  value={imageEditor.controls.brightness}
                  min={-50}
                  max={50}
                  step={5}
                  onValueChange={(val) =>
                    imageEditor.applyBrightness(val, imageEditor.controls.contrast, imageEditor.controls.saturation)
                  }
                  disabled={imageEditor.editState.loading}
                />
                <SliderControl
                  label="Contrast"
                  value={imageEditor.controls.contrast}
                  min={-50}
                  max={50}
                  step={5}
                  onValueChange={(val) =>
                    imageEditor.applyBrightness(imageEditor.controls.brightness, val, imageEditor.controls.saturation)
                  }
                  disabled={imageEditor.editState.loading}
                />
                <SliderControl
                  label="Saturation"
                  value={imageEditor.controls.saturation}
                  min={-50}
                  max={50}
                  step={5}
                  onValueChange={(val) =>
                    imageEditor.applyBrightness(imageEditor.controls.brightness, imageEditor.controls.contrast, val)
                  }
                  disabled={imageEditor.editState.loading}
                />
              </View>
            )}

            {activeTab === "rotation" && (
              <View className="gap-4">
                <Text className="text-sm font-semibold text-foreground">Rotate Image</Text>
                <PresetButtons
                  options={[
                    { label: "90°", value: 90 },
                    { label: "180°", value: 180 },
                    { label: "270°", value: 270 },
                  ]}
                  selectedValue={imageEditor.controls.rotation}
                  onSelect={imageEditor.applyRotation}
                  disabled={imageEditor.editState.loading}
                />
                <SliderControl
                  label="Custom Angle"
                  value={imageEditor.controls.rotation}
                  min={-180}
                  max={180}
                  step={5}
                  unit="°"
                  onValueChange={imageEditor.applyRotation}
                  disabled={imageEditor.editState.loading}
                />
              </View>
            )}

            {activeTab === "crop" && (
              <View className="gap-4">
                <Text className="text-sm font-semibold text-foreground">Crop Image</Text>
                <Text className="text-xs text-muted">Crop functionality coming soon</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={imageEditor.undo}
              disabled={imageEditor.historyIndex <= 0 || imageEditor.editState.loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                flex: 1,
              })}
            >
              <View className="bg-surface rounded-lg p-3 items-center border border-border">
                <Text className="text-sm font-semibold text-foreground">↶ Undo</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={imageEditor.redo}
              disabled={imageEditor.historyIndex >= imageEditor.history.length - 1 || imageEditor.editState.loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                flex: 1,
              })}
            >
              <View className="bg-surface rounded-lg p-3 items-center border border-border">
                <Text className="text-sm font-semibold text-foreground">↷ Redo</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={imageEditor.reset}
              disabled={imageEditor.editState.loading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                flex: 1,
              })}
            >
              <View className="bg-surface rounded-lg p-3 items-center border border-border">
                <Text className="text-sm font-semibold text-foreground">↻ Reset</Text>
              </View>
            </Pressable>
          </View>

          {/* Export Button */}
          <Pressable
            onPress={handleExport}
            disabled={imageEditor.editState.loading}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <View className="bg-primary rounded-2xl p-4 items-center">
              <Text className="text-lg font-bold text-background">
                {imageEditor.editState.loading ? "Processing..." : "Export & Download"}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
