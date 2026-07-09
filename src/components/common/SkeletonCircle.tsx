import React from "react";
import Skeleton from "./Skeleton";

interface SkeletonCircleProps {
  size?: number;
}

export default function SkeletonCircle({ size = 50 }: SkeletonCircleProps) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}
