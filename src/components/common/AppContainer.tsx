import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

interface AppContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark';
  noHorizontalPadding?: boolean;
  noVerticalPadding?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export default function AppContainer({
  children,
  backgroundColor = Colors.background,
  statusBarStyle = 'dark',
  noHorizontalPadding = false,
  noVerticalPadding = false,
  paddingHorizontal = 16,
  paddingVertical = 8,
}: AppContainerProps) {
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />

      <SafeAreaView
        style={[styles.safeArea, { backgroundColor }]}
        edges={['top', 'bottom']}
      >
        <View
          style={[
            styles.container,
            {
              paddingHorizontal: noHorizontalPadding ? 0 : paddingHorizontal,
              paddingVertical: noVerticalPadding ? 0 : paddingVertical,
            },
          ]}
        >
          {children}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
});