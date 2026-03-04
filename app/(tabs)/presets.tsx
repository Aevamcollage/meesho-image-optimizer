import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: {
    resize: number;
    padding: number;
    brightness: number;
    contrast: number;
  };
}

const PRESETS: Preset[] = [
  {
    id: "meesho-standard",
    name: "Meesho Standard",
    description: "1000×1000px with 20% padding",
    icon: "📦",
    settings: {
      resize: 1000,
      padding: 20,
      brightness: 0,
      contrast: 5,
    },
  },
  {
    id: "budget-friendly",
    name: "Budget Friendly",
    description: "750×750px with 15% padding",
    icon: "💰",
    settings: {
      resize: 750,
      padding: 15,
      brightness: 0,
      contrast: 0,
    },
  },
  {
    id: "premium-look",
    name: "Premium Look",
    description: "1000×1000px with 30% padding & enhanced contrast",
    icon: "✨",
    settings: {
      resize: 1000,
      padding: 30,
      brightness: 5,
      contrast: 10,
    },
  },
  {
    id: "minimal-cost",
    name: "Minimal Cost",
    description: "500×500px with 25% padding",
    icon: "🎯",
    settings: {
      resize: 500,
      padding: 25,
      brightness: 0,
      contrast: 0,
    },
  },
];

export default function PresetsScreen() {
  const router = useRouter();

  const handlePresetSelect = (preset: Preset) => {
    // Navigate to editor with preset applied
    router.push({
      pathname: "/editor" as any,
      params: {
        preset: JSON.stringify(preset.settings),
      },
    });
  };

  const renderPreset = ({ item }: { item: Preset }) => (
    <Pressable
      onPress={() => handlePresetSelect(item)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
        <View className="flex-row items-start gap-3">
          <Text style={{ fontSize: 32 }}>{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">{item.name}</Text>
            <Text className="text-sm text-muted mt-1">{item.description}</Text>
            <View className="flex-row gap-2 mt-3">
              <View className="bg-primary/10 rounded-lg px-3 py-1">
                <Text className="text-xs font-semibold text-primary">
                  {item.settings.resize}×{item.settings.resize}px
                </Text>
              </View>
              <View className="bg-primary/10 rounded-lg px-3 py-1">
                <Text className="text-xs font-semibold text-primary">
                  {item.settings.padding}% padding
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">Quick Presets</Text>
            <Text className="text-base text-muted">
              Choose a preset to quickly optimize your images
            </Text>
          </View>

          {/* Tips Card */}
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary mb-4">
            <Text className="text-sm font-semibold text-primary mb-2">💡 Pro Tip</Text>
            <Text className="text-xs text-primary leading-relaxed">
              Each preset is optimized for different cost brackets. Start with "Meesho Standard" for best results.
            </Text>
          </View>

          {/* Presets List */}
          <FlatList
            data={PRESETS}
            renderItem={renderPreset}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          {/* Info Section */}
          <View className="bg-surface rounded-2xl p-4 border border-border mt-4">
            <Text className="text-sm font-semibold text-foreground mb-2">📋 How Presets Work</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Presets combine multiple settings (size, padding, contrast) to create optimized images for Meesho. Each preset is designed to reduce shipping costs while maintaining image quality.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
