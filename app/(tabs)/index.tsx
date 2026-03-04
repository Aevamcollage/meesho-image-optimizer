import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2 mt-4">
            <Text className="text-4xl font-bold text-foreground">Meesho Image Optimizer</Text>
            <Text className="text-base text-muted">
              Reduce shipping costs by optimizing product images
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Images Edited</Text>
              <Text className="text-2xl font-bold text-foreground">0</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Est. Savings</Text>
              <Text className="text-2xl font-bold text-success">₹0</Text>
            </View>
          </View>

          {/* Primary CTA */}
          <Pressable
            onPress={() => router.push('/(tabs)/editor')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <View className="bg-primary rounded-2xl p-6 items-center">
              <Text className="text-xl font-bold text-background">Start Editing</Text>
              <Text className="text-sm text-background mt-1 opacity-90">Optimize your first image</Text>
            </View>
          </Pressable>

          {/* Quick Tips */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Quick Tips</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-2">💡 Tip: Add Padding</Text>
              <Text className="text-xs text-muted leading-relaxed">
                Adding 20-30% padding around your product makes it appear smaller, reducing estimated shipping costs.
              </Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-2">📖 Tip: Use 1000×1000px</Text>
              <Text className="text-xs text-muted leading-relaxed">
                Meesho recommends 1000×1000 pixel square images for best results and lowest shipping estimates.
              </Text>
            </View>
          </View>

          {/* Info Cards */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">How It Works</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-foreground font-semibold mb-2">1. Upload Image</Text>
              <Text className="text-xs text-muted">Select a product photo from your gallery or camera</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-foreground font-semibold mb-2">2. Edit & Optimize</Text>
              <Text className="text-xs text-muted">Resize, add padding, adjust background and more</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-foreground font-semibold mb-2">3. Download & Save</Text>
              <Text className="text-xs text-muted">Export optimized image and upload to Meesho</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
