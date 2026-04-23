import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import type { ResourceIllustrationId } from '@/features/resources/content';

type IllustrationProps = {
  id: ResourceIllustrationId;
  width: number;
  height: number;
  rounded?: number;
};

function IllusionOfRelief({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1f3d9f" />
          <Stop offset="1" stopColor="#74a5ff" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#bg)" />
      <Path d="M0 122 L55 72 L92 99 L132 44 L178 94 L220 60 L220 140 L0 140 Z" fill="#0f2c75" opacity="0.9" />
      <Path d="M10 140 L75 64 L120 108 L171 52 L220 120 L220 140 Z" fill="#17388d" />
      <Path d="M130 38 L130 56" stroke="#d8e6ff" strokeWidth="4" strokeLinecap="round" />
      <Path d="M130 38 L144 43 L130 47 Z" fill="#d8e6ff" />
      <Circle cx="42" cy="30" r="10" fill="#ffffff" opacity="0.22" />
    </Svg>
  );
}

function InsightsLibrary({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="bookBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0f766e" />
          <Stop offset="1" stopColor="#4f46e5" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#bookBg)" />
      <Path d="M38 96 C65 82 86 82 109 96 L109 122 C84 110 63 110 38 122 Z" fill="#d8fcf3" />
      <Path d="M111 96 C134 82 155 82 182 96 L182 122 C157 110 136 110 111 122 Z" fill="#dbe5ff" />
      <Path d="M110 92 L110 124" stroke="#9cc9ff" strokeWidth="3" />
      <Circle cx="78" cy="58" r="8" fill="#ffffff" opacity="0.8" />
      <Circle cx="110" cy="44" r="6" fill="#c4f7ee" opacity="0.95" />
      <Circle cx="144" cy="56" r="9" fill="#c8d6ff" opacity="0.9" />
      <Path d="M78 58 L110 44 L144 56" stroke="#d9f2ff" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

function MythDissolutions({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="mythBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5b21b6" />
          <Stop offset="1" stopColor="#0ea5e9" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#mythBg)" />
      <Rect x="34" y="33" width="38" height="38" rx="10" fill="#d9c4ff" opacity="0.88" />
      <Rect x="78" y="46" width="34" height="34" rx="9" fill="#cfc7ff" opacity="0.8" />
      <Rect x="119" y="58" width="30" height="30" rx="8" fill="#c8dcff" opacity="0.72" />
      <Rect x="154" y="70" width="26" height="26" rx="7" fill="#cde9ff" opacity="0.65" />
      <Path d="M34 104 H186" stroke="#e1e8ff" strokeWidth="3" opacity="0.55" />
    </Svg>
  );
}

function CravingWaveTimer({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="waveBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0f766e" />
          <Stop offset="1" stopColor="#134e4a" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#waveBg)" />
      <Path d="M0 88 C27 72 53 72 80 88 C108 104 133 104 160 88 C180 76 199 76 220 88 L220 140 L0 140 Z" fill="#2dd4bf" opacity="0.52" />
      <Path d="M0 104 C27 88 53 88 80 104 C108 120 133 120 160 104 C180 92 199 92 220 104 L220 140 L0 140 Z" fill="#99f6e4" opacity="0.48" />
      <Circle cx="172" cy="46" r="18" stroke="#d8fefa" strokeWidth="3" />
      <Path d="M172 36 V47 L179 53" stroke="#d8fefa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Grounding({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="groundBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0b5d54" />
          <Stop offset="1" stopColor="#1d4ed8" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#groundBg)" />
      <Circle cx="110" cy="70" r="27" fill="#dcfce7" opacity="0.95" />
      <Circle cx="59" cy="70" r="10" fill="#bbf7d0" />
      <Circle cx="161" cy="70" r="10" fill="#bfdbfe" />
      <Circle cx="110" cy="29" r="10" fill="#dbeafe" />
      <Circle cx="110" cy="111" r="10" fill="#a7f3d0" />
      <Circle cx="79" cy="40" r="8" fill="#99f6e4" />
      <Circle cx="141" cy="40" r="8" fill="#c7d2fe" />
    </Svg>
  );
}

function PatternBreak({ width, height, rounded = 14 }: Omit<IllustrationProps, 'id'>) {
  return (
    <Svg width={width} height={height} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="breakBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0f4c81" />
          <Stop offset="1" stopColor="#16a34a" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="220" height="140" rx={rounded} fill="url(#breakBg)" />
      <Path
        d="M40 73 C40 49 58 32 82 32 H108 C122 32 132 43 132 56 C132 71 120 82 106 82 H84 C70 82 60 93 60 106 C60 116 68 124 78 124 H116"
        stroke="#dbfbe4"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <Rect x="116" y="58" width="18" height="32" rx="6" fill="#fef08a" />
      <Circle cx="154" cy="95" r="12" fill="#dcfce7" opacity="0.9" />
    </Svg>
  );
}

export function ResourceIllustration({ id, width, height, rounded = 14 }: IllustrationProps) {
  switch (id) {
    case 'illusionOfRelief':
      return <IllusionOfRelief width={width} height={height} rounded={rounded} />;
    case 'insightsLibrary':
      return <InsightsLibrary width={width} height={height} rounded={rounded} />;
    case 'mythDissolutions':
      return <MythDissolutions width={width} height={height} rounded={rounded} />;
    case 'cravingWaveTimer':
      return <CravingWaveTimer width={width} height={height} rounded={rounded} />;
    case 'grounding54321':
      return <Grounding width={width} height={height} rounded={rounded} />;
    case 'patternBreak':
      return <PatternBreak width={width} height={height} rounded={rounded} />;
    default:
      return null;
  }
}
