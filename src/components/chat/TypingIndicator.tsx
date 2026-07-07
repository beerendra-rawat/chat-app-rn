import React, { memo, useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";

interface TypingIndicatorProps {
  visible?: boolean;
}

const AnimatedDot = ({ delay }: { delay: number }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 250,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            delay,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

function TypingIndicator({ visible = true }: TypingIndicatorProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <AnimatedDot delay={0} />
      <AnimatedDot delay={150} />
      <AnimatedDot delay={300} />
    </View>
  );
}

export default memo(TypingIndicator);

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 8,
    marginLeft: 16,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    backgroundColor: "#F2F3F5",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: Colors.primary,
  },
});
