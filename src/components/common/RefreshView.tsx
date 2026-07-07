// components/common/RefreshView.tsx

import React from "react";
import { ScrollView, RefreshControl, ScrollViewProps } from "react-native";

interface Props extends ScrollViewProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export default function RefreshView({
  refreshing,
  onRefresh,
  children,
  ...rest
}: Props) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
