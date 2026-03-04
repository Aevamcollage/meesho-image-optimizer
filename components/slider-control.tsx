import { View, Text, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  unit?: string;
  disabled?: boolean;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  unit = '',
  disabled = false,
}: SliderControlProps) {
  const [isChanging, setIsChanging] = useState(false);

  return (
    <View className="gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
        <Text className="text-sm font-semibold text-primary">
          {Math.round(value)}{unit}
        </Text>
      </View>
      <Slider
        style={{ height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        onSlidingStart={() => setIsChanging(true)}
        onSlidingComplete={() => setIsChanging(false)}
        disabled={disabled}
        minimumTrackTintColor="#E91E63"
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor="#E91E63"
      />
      <View className="flex-row justify-between">
        <Text className="text-xs text-muted">{Math.round(min)}{unit}</Text>
        <Text className="text-xs text-muted">{Math.round(max)}{unit}</Text>
      </View>
    </View>
  );
}

interface PresetButtonsProps {
  options: { label: string; value: number }[];
  selectedValue: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export function PresetButtons({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: PresetButtonsProps) {
  return (
    <View className="flex-row gap-2 flex-wrap">
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          disabled={disabled}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <View
            className={`px-4 py-2 rounded-full border-2 ${
              selectedValue === option.value
                ? 'bg-primary border-primary'
                : 'bg-surface border-border'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedValue === option.value ? 'text-background' : 'text-foreground'
              }`}
            >
              {option.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
