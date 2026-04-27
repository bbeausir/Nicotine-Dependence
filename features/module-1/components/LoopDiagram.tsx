import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type LoopDiagramProps = {
  onContinue: () => void;
};

type Node = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  angleDeg: number;
};

// Four nodes evenly spaced (90° apart), starting at top
const NODES: Node[] = [
  { id: 'trigger', label: 'Trigger', icon: 'flash-outline', angleDeg: -90 },
  { id: 'urge', label: 'Urge', icon: 'pulse-outline', angleDeg: 0 },
  { id: 'use', label: 'Use', icon: 'leaf-outline', angleDeg: 90 },
  { id: 'relief', label: 'Temporary Relief', icon: 'time-outline', angleDeg: 180 },
];

const NODE_RADIUS = 26;
const ARROW_HEAD_SIZE = 6;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function LoopDiagram({ onContinue }: LoopDiagramProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { width } = useWindowDimensions();

  const size = Math.min(width - 48, 320);
  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = size / 2 - NODE_RADIUS - 28; // space for labels

  // Compute node positions on the ring
  const nodePositions = NODES.map((node) => ({
    ...node,
    ...polar(cx, cy, ringRadius, node.angleDeg),
  }));

  // Build arc path between two nodes along the ring (clockwise, outer side)
  const buildArc = (fromIdx: number, toIdx: number) => {
    const from = nodePositions[fromIdx];
    const to = nodePositions[toIdx];

    // Direction from each node toward the other along the ring
    // For a clockwise arc, each arrow ends just before the next node's edge
    const fromAngleRad = (from.angleDeg * Math.PI) / 180;
    const toAngleRad = (to.angleDeg * Math.PI) / 180;

    // Offset along the ring (small gap from each node's edge)
    const angularPadding = (NODE_RADIUS + 4) / ringRadius;

    const startAngle = fromAngleRad + angularPadding;
    const endAngle = toAngleRad - angularPadding;

    const startX = cx + ringRadius * Math.cos(startAngle);
    const startY = cy + ringRadius * Math.sin(startAngle);
    const endX = cx + ringRadius * Math.cos(endAngle);
    const endY = cy + ringRadius * Math.sin(endAngle);

    // Use SVG arc: A rx ry x-axis-rotation large-arc sweep x y
    return {
      path: `M ${startX} ${startY} A ${ringRadius} ${ringRadius} 0 0 1 ${endX} ${endY}`,
      endX,
      endY,
      endAngle,
    };
  };

  // Arrowhead at end of arc, pointing tangent to circle (clockwise direction)
  const arrowHead = (endX: number, endY: number, endAngle: number) => {
    // Tangent direction at end (clockwise = +90° from radial)
    const tangentAngle = endAngle + Math.PI / 2;
    const tipX = endX + ARROW_HEAD_SIZE * 0.4 * Math.cos(tangentAngle);
    const tipY = endY + ARROW_HEAD_SIZE * 0.4 * Math.sin(tangentAngle);
    const baseLeftX = endX + ARROW_HEAD_SIZE * Math.cos(tangentAngle - 2.4);
    const baseLeftY = endY + ARROW_HEAD_SIZE * Math.sin(tangentAngle - 2.4);
    const baseRightX = endX + ARROW_HEAD_SIZE * Math.cos(tangentAngle + 2.4);
    const baseRightY = endY + ARROW_HEAD_SIZE * Math.sin(tangentAngle + 2.4);
    return `M ${tipX} ${tipY} L ${baseLeftX} ${baseLeftY} L ${baseRightX} ${baseRightY} Z`;
  };

  // Edges: trigger→urge, urge→use, use→relief, relief→trigger (dashed)
  const edges = [
    { from: 0, to: 1, dashed: false },
    { from: 1, to: 2, dashed: false },
    { from: 2, to: 3, dashed: false },
    { from: 3, to: 0, dashed: true },
  ];

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          This is a loop, not a flaw
        </Text>

        <Text style={[styles.description, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          A moment happens. An urge shows up. Nicotine creates a temporary sense of relief by easing the tension left behind by the last cycle. Then later, the urge tends to return.
        </Text>

        <View style={[styles.diagramContainer, { width: size, height: size }]}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Edges (arcs) */}
            {edges.map((edge, i) => {
              const arc = buildArc(edge.from, edge.to);
              const stroke = edge.dashed ? t.color.textMuted : t.color.textSecondary;
              return (
                <G key={`edge-${i}`}>
                  <Path
                    d={arc.path}
                    stroke={stroke}
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray={edge.dashed ? '5,5' : undefined}
                    strokeLinecap="round"
                  />
                  <Path d={arrowHead(arc.endX, arc.endY, arc.endAngle)} fill={stroke} />
                </G>
              );
            })}

            {/* Node circles */}
            {nodePositions.map((node) => (
              <Circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={t.color.surface}
                stroke={t.color.accent}
                strokeWidth={1.5}
              />
            ))}
          </Svg>

          {/* Icons (RN overlay so vector icons render crisply) */}
          {nodePositions.map((node) => (
            <View
              key={`icon-${node.id}`}
              pointerEvents="none"
              style={[
                styles.iconWrap,
                {
                  left: node.x - NODE_RADIUS,
                  top: node.y - NODE_RADIUS,
                  width: NODE_RADIUS * 2,
                  height: NODE_RADIUS * 2,
                },
              ]}>
              <Ionicons name={node.icon} size={22} color={t.color.accent} />
            </View>
          ))}

          {/* Labels positioned outside ring */}
          {nodePositions.map((node) => {
            const isTop = node.angleDeg === -90;
            const isBottom = node.angleDeg === 90;
            const isRight = node.angleDeg === 0;

            const positioning = isTop
              ? { top: node.y - NODE_RADIUS - 22, left: node.x - 60, width: 120, textAlign: 'center' as const }
              : isBottom
                ? { top: node.y + NODE_RADIUS + 6, left: node.x - 60, width: 120, textAlign: 'center' as const }
                : isRight
                  ? { top: node.y - 10, left: node.x + NODE_RADIUS + 6, width: 80, textAlign: 'left' as const }
                  : { top: node.y - 10, right: size - (node.x - NODE_RADIUS - 6), width: 80, textAlign: 'right' as const };

            return (
              <Text
                key={`label-${node.id}`}
                pointerEvents="none"
                style={[
                  styles.label,
                  { color: t.color.textPrimary, fontFamily: t.typeface.uiMedium },
                  positioning,
                ]}
                numberOfLines={2}>
                {node.label}
              </Text>
            );
          })}
        </View>
      </View>

      <PrimaryButton onPress={onContinue}>Next</PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 24,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  body: {
    gap: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    fontSize: 12,
    lineHeight: 16,
  },
});
