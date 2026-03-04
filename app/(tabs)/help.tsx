import { ScrollView, Text, View, Pressable, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: FAQItem[] = [
  {
    question: "How does image optimization reduce shipping costs?",
    answer:
      "Meesho calculates shipping costs based on estimated product size. By adding padding and positioning the product smaller in the frame, the algorithm estimates a lower size/weight, resulting in lower shipping charges.",
  },
  {
    question: "What's the ideal image size for Meesho?",
    answer:
      "Meesho recommends 1000×1000px minimum. Our app optimizes to this standard. Larger images (up to 10MB) are acceptable but ensure the product appears smaller with white padding.",
  },
  {
    question: "Can I use any background color?",
    answer:
      "White backgrounds work best and are recommended by Meesho. Light-colored backgrounds also work, but white provides the clearest contrast and best results for cost reduction.",
  },
  {
    question: "How much can I save on shipping?",
    answer:
      "Savings vary based on product category and current weight slab. Typically, sellers report ₹10-₹40 savings per order. For bulk listings, this adds up significantly.",
  },
  {
    question: "Is this app safe to use?",
    answer:
      "Yes! The app only edits images locally and uploads to Cloudinary for processing. No personal data is stored. Images are processed securely and can be deleted anytime.",
  },
  {
    question: "Can I undo edits?",
    answer:
      "Yes! The app maintains a full edit history. Use the Undo button to revert changes. You can also reset to the original image at any time.",
  },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="gap-2 mb-2">
            <Text className="text-3xl font-bold text-foreground">Help & FAQ</Text>
            <Text className="text-base text-muted">Learn how to optimize your images</Text>
          </View>

          {/* Quick Tips */}
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary">
            <Text className="text-sm font-bold text-primary mb-2">🚀 Quick Tips</Text>
            <View className="gap-2">
              <Text className="text-xs text-primary">✓ Use 1000×1000px for best results</Text>
              <Text className="text-xs text-primary">✓ Add 20-30% padding around product</Text>
              <Text className="text-xs text-primary">✓ Keep white background</Text>
              <Text className="text-xs text-primary">✓ Avoid text and watermarks</Text>
            </View>
          </View>

          {/* FAQ Section */}
          <View className="gap-2">
            <Text className="text-lg font-bold text-foreground">Frequently Asked Questions</Text>

            {FAQ.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View className="bg-surface rounded-xl border border-border overflow-hidden">
                  <View className="p-4 flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-foreground flex-1">
                      {item.question}
                    </Text>
                    <Text className="text-lg text-primary ml-2">
                      {expandedIndex === index ? "−" : "+"}
                    </Text>
                  </View>

                  {expandedIndex === index && (
                    <View className="px-4 pb-4 border-t border-border">
                      <Text className="text-sm text-muted leading-relaxed mt-3">
                        {item.answer}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Resources */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-bold text-foreground mb-3">📚 Resources</Text>
            <View className="gap-2">
              <Pressable
                onPress={() =>
                  Linking.openURL("https://seller.meesho.com/guidelines")
                }
              >
                <Text className="text-sm text-primary font-semibold">
                  → Meesho Seller Guidelines
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://support.meesho.com/")
                }
              >
                <Text className="text-sm text-primary font-semibold">
                  → Meesho Support
                </Text>
              </Pressable>
            </View>
          </View>

          {/* About */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-bold text-foreground mb-2">ℹ️ About</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Meesho Image Optimizer v1.0.0{"\n"}
              Built to help sellers reduce shipping costs through intelligent image optimization.{"\n\n"}
              © 2026 Meesho Image Optimizer
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import React from "react";
