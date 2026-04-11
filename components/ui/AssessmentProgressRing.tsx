import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const GOLD_RING = '#b5935b';

type Props = {
  /** 0–1 */
  progress: number;
  /** Muted track color (e.g. theme border) */
  trackColor: string;
  textColor: string;
  fontFamily: string;
  size?: number;
  strokeWidth?: number;
};

export function AssessmentProgressRing({
  progress,
  trackColor,
  textColor,
  fontFamily,
  size = 56,
  strokeWidth = 4,
}: Props) {
  const p = Math.min(1, Math.max(0, progress));
  const center = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - p);
  const pct = Math.round(p * 100);
  const labelSize = size <= 44 ? 11 : 13;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G transform={`rotate(-90 ${center} ${center})`}>
          <Circle
            cx={center}
            cy={center}
            r={r}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={r}
            stroke={GOLD_RING}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.labelOverlay]} pointerEvents="none">
        <Text style={[styles.pct, { color: textColor, fontFamily, fontSize: labelSize }]}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pct: {
    fontVariant: ['tabular-nums'],
  },
});
