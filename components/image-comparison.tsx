import { View, Image as RNImage, Text } from 'react-native';
import { useState, useRef } from 'react';

interface ImageComparisonProps {
  beforeUri: string;
  afterUri: string;
  height?: number;
}

export function ImageComparison({
  beforeUri,
  afterUri,
  height = 300,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const containerRef = useRef<View>(null);

  const handleSliderMove = (event: any) => {
    const { locationX } = event.nativeEvent;
    containerRef.current?.measure((x, y, width) => {
      const position = Math.max(0, Math.min(1, locationX / width));
      setSliderPosition(position);
    });
  };

  return (
    <View
      ref={containerRef}
      style={{ height, width: '100%', overflow: 'hidden' }}
      className="rounded-xl bg-surface border border-border"
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleSliderMove}
    >
      {/* Before Image */}
      <RNImage
        source={{ uri: beforeUri }}
        style={{
          position: 'absolute',
          width: '100%',
          height,
        }}
        resizeMode="contain"
      />

      {/* After Image (Clipped) */}
      <View
        style={{
          position: 'absolute',
          width: `${sliderPosition * 100}%`,
          height,
          overflow: 'hidden',
        }}
      >
        <RNImage
          source={{ uri: afterUri }}
          style={{
            width: '100%',
            height,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Slider Handle */}
      <View
        style={{
          position: 'absolute',
          left: `${sliderPosition * 100}%`,
          top: 0,
          height,
          width: 2,
          backgroundColor: '#E91E63',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: -12,
            top: '50%',
            marginTop: -12,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#E91E63',
            borderWidth: 2,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        />
      </View>

      {/* Before Label */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Before</Text>
      </View>

      {/* After Label */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>After</Text>
      </View>
    </View>
  );
}
