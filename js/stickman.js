// === 棍子人骨骼动画引擎 ===
// Canvas-based stick figure exercise demonstrations
// 20+ exercise animations, ~60fps smooth

const VIOLET = '#a78bfa';
const VIOLET_LIGHT = '#c4b5fd';
const WHITE = '#ededed';
const DIM = '#5c5c5c';
const BG = '#0a0a0a';

// --- Helper: interpolate between two poses ---
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpPt(a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; }

// --- Helper: build a simple pose object ---
// All coordinates in normalized space [-1, 1], origin at center
// The drawing function maps to canvas pixel space
function P(opts) {
  // Returns a pose: object with head, shoulders, elbows, hands, hips, knees, feet
  const s = (v) => v; // scale helper
  return {
    head:       opts.head       || { x: 0, y: -0.75 },
    neck:       opts.neck       || { x: 0, y: -0.55 },
    lShoulder:  opts.lShoulder  || { x: -0.2, y: -0.5 },
    rShoulder:  opts.rShoulder  || { x: 0.2, y: -0.5 },
    lElbow:     opts.lElbow     || { x: -0.35, y: -0.2 },
    rElbow:     opts.rElbow     || { x: 0.35, y: -0.2 },
    lHand:      opts.lHand      || { x: -0.4, y: 0.05 },
    rHand:      opts.rHand      || { x: 0.4, y: 0.05 },
    hip:        opts.hip        || { x: 0, y: 0.15 },
    lHip:       opts.lHip       || { x: -0.12, y: 0.15 },
    rHip:       opts.rHip       || { x: 0.12, y: 0.15 },
    lKnee:      opts.lKnee      || { x: -0.15, y: 0.45 },
    rKnee:      opts.rKnee      || { x: 0.15, y: 0.45 },
    lFoot:      opts.lFoot      || { x: -0.15, y: 0.75 },
    rFoot:      opts.rFoot      || { x: 0.15, y: 0.75 },
    // Optional: barbell/dumbbell indicators
    barLeft:    opts.barLeft    || null,
    barRight:   opts.barRight   || null,
  };
}

// --- Exercise definitions ---
// Each exercise: name, getPose(phase), phase 0→1 = one rep
// phase 0 = start, 0.5 = midpoint, 1 = end (= start for looping)

const Exercises = {

  '杠铃卧推': {
    name: '杠铃卧推',
    muscle: '胸',
    getPose(phase) {
      // Lying on bench (rotated to show side-ish view)
      // Bar goes from chest (top) to extended arms
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2; // 0→1→0
      const barY = lerp(-0.1, -0.65, t); // bar moves up/down
      return P({
        head: { x: 0.3, y: -0.7 },
        neck: { x: 0.25, y: -0.55 },
        lShoulder: { x: 0.05, y: -0.5 },
        rShoulder: { x: 0.35, y: -0.5 },
        lElbow: { x: -0.2, y: lerp(-0.15, -0.5, t) },
        rElbow: { x: 0.2, y: lerp(-0.15, -0.5, t) },
        lHand: { x: -0.3, y: barY },
        rHand: { x: 0.1, y: barY },
        hip: { x: 0.25, y: 0.1 },
        lHip: { x: 0.15, y: 0.1 },
        rHip: { x: 0.35, y: 0.1 },
        lKnee: { x: 0.15, y: 0.45 },
        rKnee: { x: 0.35, y: 0.45 },
        lFoot: { x: 0.1, y: 0.75 },
        rFoot: { x: 0.3, y: 0.75 },
        barLeft: { x: -0.3, y: barY },
        barRight: { x: 0.1, y: barY },
      });
    }
  },

  '哑铃飞鸟': {
    name: '哑铃飞鸟',
    muscle: '胸',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const angle = lerp(0.3, 0.9, t); // arms open/close
      return P({
        head: { x: 0, y: -0.7 },
        neck: { x: 0, y: -0.55 },
        lShoulder: { x: -0.2, y: -0.5 },
        rShoulder: { x: 0.2, y: -0.5 },
        lElbow: { x: -angle, y: lerp(-0.45, -0.3, t) },
        rElbow: { x: angle, y: lerp(-0.45, -0.3, t) },
        lHand: { x: -angle, y: lerp(-0.25, -0.2, t) },
        rHand: { x: angle, y: lerp(-0.25, -0.2, t) },
        hip: { x: 0, y: 0.1 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.2, y: 0.75 },
        rFoot: { x: 0.2, y: 0.75 },
      });
    }
  },

  '俯卧撑': {
    name: '俯卧撑',
    muscle: '胸',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const bodyY = lerp(0.1, 0.25, t); // body goes down
      const elbowX = lerp(0.35, 0.5, t); // elbows flare
      return P({
        head: { x: 0, y: -0.55 },
        neck: { x: 0, y: -0.4 },
        lShoulder: { x: -0.25, y: bodyY - 0.3 },
        rShoulder: { x: 0.25, y: bodyY - 0.3 },
        lElbow: { x: -elbowX, y: bodyY - 0.1 },
        rElbow: { x: elbowX, y: bodyY - 0.1 },
        lHand: { x: -0.45, y: bodyY + 0.05 },
        rHand: { x: 0.45, y: bodyY + 0.05 },
        hip: { x: 0, y: bodyY + 0.2 },
        lKnee: { x: -0.15, y: bodyY + 0.5 },
        rKnee: { x: 0.15, y: bodyY + 0.5 },
        lFoot: { x: -0.15, y: bodyY + 0.75 },
        rFoot: { x: 0.15, y: bodyY + 0.75 },
      });
    }
  },

  '引体向上': {
    name: '引体向上',
    muscle: '背',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const pullY = lerp(0.1, -0.35, t); // body moves up
      const elbowY = lerp(0.3, -0.5, t);
      return P({
        head: { x: 0, y: pullY - 0.3 },
        neck: { x: 0, y: pullY - 0.15 },
        lShoulder: { x: -0.2, y: pullY },
        rShoulder: { x: 0.2, y: pullY },
        lElbow: { x: -0.45, y: elbowY },
        rElbow: { x: 0.45, y: elbowY },
        lHand: { x: -0.5, y: -0.9 },
        rHand: { x: 0.5, y: -0.9 },
        hip: { x: 0, y: pullY + 0.35 },
        lKnee: { x: -0.12, y: pullY + 0.6 },
        rKnee: { x: 0.12, y: pullY + 0.6 },
        lFoot: { x: -0.12, y: pullY + 0.8 },
        rFoot: { x: 0.12, y: pullY + 0.8 },
        // Bar
        barLeft: { x: -0.55, y: -0.9 },
        barRight: { x: 0.55, y: -0.9 },
      });
    }
  },

  '杠铃划船': {
    name: '杠铃划船',
    muscle: '背',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const barY = lerp(0.35, -0.05, t); // bar from low to belly
      const elbowY = lerp(0.2, -0.25, t);
      return P({
        head: { x: 0, y: -0.55 },
        neck: { x: 0, y: -0.4 },
        lShoulder: { x: -0.25, y: -0.35 },
        rShoulder: { x: 0.25, y: -0.35 },
        lElbow: { x: -0.4, y: elbowY },
        rElbow: { x: 0.4, y: elbowY },
        lHand: { x: -0.3, y: barY },
        rHand: { x: 0.3, y: barY },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
        barLeft: { x: -0.3, y: barY },
        barRight: { x: 0.3, y: barY },
      });
    }
  },

  '高位下拉': {
    name: '高位下拉',
    muscle: '背',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const barY = lerp(-0.8, -0.2, t);
      const elbowY = lerp(-0.6, -0.1, t);
      return P({
        head: { x: 0, y: -0.4 },
        neck: { x: 0, y: -0.25 },
        lShoulder: { x: -0.2, y: -0.2 },
        rShoulder: { x: 0.2, y: -0.2 },
        lElbow: { x: -0.45, y: elbowY },
        rElbow: { x: 0.45, y: elbowY },
        lHand: { x: -0.4, y: barY },
        rHand: { x: 0.4, y: barY },
        hip: { x: 0, y: 0.25 },
        lKnee: { x: -0.2, y: 0.6 },
        rKnee: { x: 0.2, y: 0.6 },
        lFoot: { x: -0.25, y: 0.8 },
        rFoot: { x: 0.25, y: 0.8 },
        barLeft: { x: -0.5, y: barY },
        barRight: { x: 0.5, y: barY },
      });
    }
  },

  '杠铃深蹲': {
    name: '杠铃深蹲',
    muscle: '腿',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const hipY = lerp(0.15, 0.5, t);
      const kneeY = lerp(0.45, 0.7, t);
      return P({
        head: { x: 0, y: lerp(-0.75, -0.4, t) },
        neck: { x: 0, y: lerp(-0.55, -0.25, t) },
        lShoulder: { x: -0.22, y: lerp(-0.5, -0.2, t) },
        rShoulder: { x: 0.22, y: lerp(-0.5, -0.2, t) },
        lElbow: { x: -0.35, y: lerp(-0.3, -0.05, t) },
        rElbow: { x: 0.35, y: lerp(-0.3, -0.05, t) },
        lHand: { x: -0.3, y: lerp(-0.55, -0.25, t) },
        rHand: { x: 0.3, y: lerp(-0.55, -0.25, t) },
        hip: { x: 0, y: hipY },
        lHip: { x: -0.12, y: hipY },
        rHip: { x: 0.12, y: hipY },
        lKnee: { x: -0.2, y: kneeY },
        rKnee: { x: 0.2, y: kneeY },
        lFoot: { x: -0.22, y: 0.85 },
        rFoot: { x: 0.22, y: 0.85 },
        barLeft: { x: -0.3, y: lerp(-0.55, -0.25, t) },
        barRight: { x: 0.3, y: lerp(-0.55, -0.25, t) },
      });
    }
  },

  '腿举': {
    name: '腿举',
    muscle: '腿',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const kneeAngle = lerp(0.7, 0.15, t); // legs extend
      return P({
        head: { x: 0, y: -0.5 },
        neck: { x: 0, y: -0.35 },
        lShoulder: { x: -0.2, y: -0.3 },
        rShoulder: { x: 0.2, y: -0.3 },
        lElbow: { x: -0.35, y: -0.05 },
        rElbow: { x: 0.35, y: -0.05 },
        lHand: { x: -0.3, y: 0.15 },
        rHand: { x: 0.3, y: 0.15 },
        hip: { x: 0, y: 0.2 },
        lHip: { x: -0.1, y: 0.2 },
        rHip: { x: 0.1, y: 0.2 },
        lKnee: { x: -0.12, y: kneeAngle },
        rKnee: { x: 0.12, y: kneeAngle },
        lFoot: { x: -0.12, y: 0.85 },
        rFoot: { x: 0.12, y: 0.85 },
      });
    }
  },

  '哑铃弯举': {
    name: '哑铃弯举',
    muscle: '手臂',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      // Right arm curls
      const rHandY = lerp(0.1, -0.3, t);
      const rElbowX = lerp(0.35, 0.25, t);
      return P({
        head: { x: 0, y: -0.75 },
        neck: { x: 0, y: -0.55 },
        lShoulder: { x: -0.2, y: -0.5 },
        rShoulder: { x: 0.2, y: -0.5 },
        lElbow: { x: -0.3, y: -0.2 },
        rElbow: { x: rElbowX, y: -0.25 },
        lHand: { x: -0.35, y: 0.05 },
        rHand: { x: 0.25, y: rHandY },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
      });
    }
  },

  '三头臂屈伸': {
    name: '三头臂屈伸',
    muscle: '手臂',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const bodyY = lerp(0.15, 0.4, t);
      const elbowBend = lerp(0.4, 0.2, t);
      return P({
        head: { x: 0, y: bodyY - 0.65 },
        neck: { x: 0, y: bodyY - 0.5 },
        lShoulder: { x: -0.25, y: bodyY - 0.45 },
        rShoulder: { x: 0.25, y: bodyY - 0.45 },
        lElbow: { x: -0.35, y: bodyY - 0.2 },
        rElbow: { x: 0.35, y: bodyY - 0.2 },
        lHand: { x: -0.4, y: bodyY + elbowBend },
        rHand: { x: 0.4, y: bodyY + elbowBend },
        hip: { x: 0, y: bodyY },
        lKnee: { x: -0.15, y: bodyY + 0.4 },
        rKnee: { x: 0.15, y: bodyY + 0.4 },
        lFoot: { x: -0.2, y: bodyY + 0.7 },
        rFoot: { x: 0.2, y: bodyY + 0.7 },
      });
    }
  },

  '杠铃推举': {
    name: '杠铃推举',
    muscle: '肩',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const barY = lerp(-0.45, -0.95, t);
      const elbowY = lerp(-0.3, -0.7, t);
      return P({
        head: { x: 0, y: -0.55 },
        neck: { x: 0, y: -0.4 },
        lShoulder: { x: -0.25, y: -0.35 },
        rShoulder: { x: 0.25, y: -0.35 },
        lElbow: { x: -0.35, y: elbowY },
        rElbow: { x: 0.35, y: elbowY },
        lHand: { x: -0.3, y: barY },
        rHand: { x: 0.3, y: barY },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
        barLeft: { x: -0.3, y: barY },
        barRight: { x: 0.3, y: barY },
      });
    }
  },

  '哑铃侧平举': {
    name: '哑铃侧平举',
    muscle: '肩',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const handY = lerp(0.05, -0.55, t);
      const elbowX = lerp(0.35, 0.5, t);
      return P({
        head: { x: 0, y: -0.75 },
        neck: { x: 0, y: -0.55 },
        lShoulder: { x: -0.2, y: -0.5 },
        rShoulder: { x: 0.2, y: -0.5 },
        lElbow: { x: lerp(-0.35, -0.5, t), y: lerp(-0.3, -0.5, t) },
        rElbow: { x: elbowX, y: lerp(-0.3, -0.5, t) },
        lHand: { x: lerp(-0.4, -0.55, t), y: lerp(0.05, -0.55, t) },
        rHand: { x: lerp(0.4, 0.55, t), y: handY },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
      });
    }
  },

  '平板支撑': {
    name: '平板支撑',
    muscle: '核心',
    getPose(phase) {
      // Static hold with subtle shake
      const shake = Math.sin(phase * Math.PI * 8) * 0.01;
      return P({
        head: { x: 0, y: -0.35 + shake },
        neck: { x: 0, y: -0.2 },
        lShoulder: { x: -0.25, y: -0.15 },
        rShoulder: { x: 0.25, y: -0.15 },
        lElbow: { x: -0.35, y: 0.05 },
        rElbow: { x: 0.35, y: 0.05 },
        lHand: { x: -0.4, y: 0.15 },
        rHand: { x: 0.4, y: 0.15 },
        hip: { x: 0, y: 0.25 },
        lKnee: { x: -0.12, y: 0.5 },
        rKnee: { x: 0.12, y: 0.5 },
        lFoot: { x: -0.15, y: 0.75 },
        rFoot: { x: 0.15, y: 0.75 },
      });
    }
  },

  '卷腹': {
    name: '卷腹',
    muscle: '核心',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const crunch = lerp(0, 0.25, t); // upper body curls up
      return P({
        head: { x: 0, y: -0.65 + crunch * 0.4 },
        neck: { x: 0, y: -0.5 + crunch * 0.3 },
        lShoulder: { x: -0.2, y: -0.45 + crunch * 0.3 },
        rShoulder: { x: 0.2, y: -0.45 + crunch * 0.3 },
        lElbow: { x: -0.3, y: -0.15 + crunch * 0.2 },
        rElbow: { x: 0.3, y: -0.15 + crunch * 0.2 },
        lHand: { x: -0.25, y: 0.05 },
        rHand: { x: 0.25, y: 0.05 },
        hip: { x: 0, y: 0.2 },
        lKnee: { x: -0.2, y: 0.5 },
        rKnee: { x: 0.2, y: 0.5 },
        lFoot: { x: -0.2, y: 0.7 },
        rFoot: { x: 0.2, y: 0.7 },
      });
    }
  },

  '罗马尼亚硬拉': {
    name: '罗马尼亚硬拉',
    muscle: '腿',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const lean = lerp(0, 0.5, t); // hip hinge
      return P({
        head: { x: lean * 0.3, y: lerp(-0.75, -0.2, t) },
        neck: { x: lean * 0.2, y: lerp(-0.55, -0.1, t) },
        lShoulder: { x: -0.2 + lean * 0.15, y: lerp(-0.5, -0.05, t) },
        rShoulder: { x: 0.2 + lean * 0.15, y: lerp(-0.5, -0.05, t) },
        lElbow: { x: -0.3, y: lerp(-0.2, 0.2, t) },
        rElbow: { x: 0.3, y: lerp(-0.2, 0.2, t) },
        lHand: { x: -0.25, y: lerp(-0.05, 0.4, t) },
        rHand: { x: 0.25, y: lerp(-0.05, 0.4, t) },
        hip: { x: lean * 0.1, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.8 },
        rFoot: { x: 0.18, y: 0.8 },
        barLeft: { x: -0.25, y: lerp(-0.05, 0.4, t) },
        barRight: { x: 0.25, y: lerp(-0.05, 0.4, t) },
      });
    }
  },

  '哑铃耸肩': {
    name: '哑铃耸肩',
    muscle: '肩',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const shrug = lerp(0, 0.1, t);
      return P({
        head: { x: 0, y: -0.8 + shrug },
        neck: { x: 0, y: -0.6 + shrug },
        lShoulder: { x: -0.22, y: -0.55 + shrug },
        rShoulder: { x: 0.22, y: -0.55 + shrug },
        lElbow: { x: -0.3, y: -0.25 + shrug },
        rElbow: { x: 0.3, y: -0.25 + shrug },
        lHand: { x: -0.35, y: 0.05 + shrug },
        rHand: { x: 0.35, y: 0.05 + shrug },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
      });
    }
  },

  '坐姿划船': {
    name: '坐姿划船',
    muscle: '背',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const pullY = lerp(0.2, -0.1, t);
      const elbowY = lerp(0.1, -0.2, t);
      return P({
        head: { x: 0, y: -0.55 },
        neck: { x: 0, y: -0.4 },
        lShoulder: { x: -0.2, y: -0.35 },
        rShoulder: { x: 0.2, y: -0.35 },
        lElbow: { x: -0.45, y: elbowY },
        rElbow: { x: 0.45, y: elbowY },
        lHand: { x: -0.35, y: pullY },
        rHand: { x: 0.35, y: pullY },
        hip: { x: 0, y: 0.2 },
        lKnee: { x: -0.25, y: 0.5 },
        rKnee: { x: 0.25, y: 0.5 },
        lFoot: { x: -0.3, y: 0.7 },
        rFoot: { x: 0.3, y: 0.7 },
      });
    }
  },

  '腿弯举': {
    name: '腿弯举',
    muscle: '腿',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const footY = lerp(0.85, 0.4, t); // legs curl up
      const kneeAngle = lerp(0.45, 0.35, t);
      return P({
        head: { x: 0, y: -0.6 },
        neck: { x: 0, y: -0.45 },
        lShoulder: { x: -0.2, y: -0.4 },
        rShoulder: { x: 0.2, y: -0.4 },
        lElbow: { x: -0.35, y: -0.15 },
        rElbow: { x: 0.35, y: -0.15 },
        lHand: { x: -0.35, y: 0.05 },
        rHand: { x: 0.35, y: 0.05 },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.12, y: kneeAngle },
        rKnee: { x: 0.12, y: kneeAngle },
        lFoot: { x: -0.12, y: footY },
        rFoot: { x: 0.12, y: footY },
      });
    }
  },

  '杠铃弯举': {
    name: '杠铃弯举',
    muscle: '手臂',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const handY = lerp(0.1, -0.3, t);
      return P({
        head: { x: 0, y: -0.75 },
        neck: { x: 0, y: -0.55 },
        lShoulder: { x: -0.22, y: -0.5 },
        rShoulder: { x: 0.22, y: -0.5 },
        lElbow: { x: -0.3, y: -0.25 },
        rElbow: { x: 0.3, y: -0.25 },
        lHand: { x: -0.22, y: handY },
        rHand: { x: 0.22, y: handY },
        hip: { x: 0, y: 0.15 },
        lKnee: { x: -0.15, y: 0.45 },
        rKnee: { x: 0.15, y: 0.45 },
        lFoot: { x: -0.18, y: 0.75 },
        rFoot: { x: 0.18, y: 0.75 },
        barLeft: { x: -0.22, y: handY },
        barRight: { x: 0.22, y: handY },
      });
    }
  },

  '悬垂举腿': {
    name: '悬垂举腿',
    muscle: '核心',
    getPose(phase) {
      const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      const legY = lerp(0.7, 0.1, t); // legs raise
      return P({
        head: { x: 0, y: -0.65 },
        neck: { x: 0, y: -0.5 },
        lShoulder: { x: -0.2, y: -0.45 },
        rShoulder: { x: 0.2, y: -0.45 },
        lElbow: { x: -0.4, y: -0.55 },
        rElbow: { x: 0.4, y: -0.55 },
        lHand: { x: -0.5, y: -0.85 },
        rHand: { x: 0.5, y: -0.85 },
        hip: { x: 0, y: 0.1 },
        lKnee: { x: -0.12, y: legY * 0.5 + 0.1 },
        rKnee: { x: 0.12, y: legY * 0.5 + 0.1 },
        lFoot: { x: -0.12, y: legY },
        rFoot: { x: 0.12, y: legY },
        barLeft: { x: -0.55, y: -0.85 },
        barRight: { x: 0.55, y: -0.85 },
      });
    }
  },
};

// --- Drawing ---
function drawStickman(ctx, pose, cx, cy, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha || 1;

  const pt = (p) => [cx + p.x * scale, cy + p.y * scale];

  // Background glow
  const hx = cx + pose.head.x * scale;
  const hy = cy + pose.head.y * scale;
  const glow = ctx.createRadialGradient(hx, hy, scale * 0.05, cx, cy, scale * 1.1);
  glow.addColorStop(0, 'rgba(167,139,250,0.06)');
  glow.addColorStop(1, 'rgba(10,10,10,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - scale, cy - scale, scale * 2, scale * 2);

  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  function line(a, b, color) {
    if (!a || !b) return;
    ctx.strokeStyle = color || WHITE;
    ctx.beginPath();
    ctx.moveTo(...pt(a));
    ctx.lineTo(...pt(b));
    ctx.stroke();
  }

  function circle(p, r, fill) {
    if (!p) return;
    ctx.fillStyle = fill || WHITE;
    ctx.beginPath();
    ctx.arc(...pt(p), r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Body
  line(pose.neck, pose.hip, VIOLET_LIGHT);
  // Shoulder bar
  line(pose.lShoulder, pose.rShoulder, VIOLET_DIM);
  // Arms
  line(pose.lShoulder, pose.lElbow);
  line(pose.lElbow, pose.lHand);
  line(pose.rShoulder, pose.rElbow);
  line(pose.rElbow, pose.rHand);
  // Legs
  line(pose.hip || pose.lHip, pose.lKnee);
  line(pose.lKnee, pose.lFoot);
  line(pose.hip || pose.rHip, pose.rKnee);
  line(pose.rKnee, pose.rFoot);

  // Barbell
  if (pose.barLeft && pose.barRight) {
    ctx.strokeStyle = VIOLET;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(...pt(pose.barLeft));
    ctx.lineTo(...pt(pose.barRight));
    ctx.stroke();
    ctx.lineWidth = 2.5;
  }

  // Joints
  const joints = ['lShoulder','rShoulder','lElbow','rElbow','lHand','rHand',
                  'lHip','rHip','lKnee','rKnee','lFoot','rFoot'];
  joints.forEach(j => {
    if (pose[j]) circle(pose[j], 3, WHITE);
  });
  // Hip center
  if (pose.hip) circle(pose.hip, 3.5, VIOLET_LIGHT);
  // Head
  circle(pose.head, 12, 'transparent');
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(...pt(pose.head), 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.5;

  ctx.restore();
}

// --- Animator class ---
export class StickmanAnimator {
  constructor(canvas, exerciseName) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.exercise = Exercises[exerciseName];
    this.phase = 0;
    this.speed = 0.016; // ~60 frames per cycle
    this.running = false;
    this.animId = null;
    this.trailFrames = 4; // ghost trail count
    this.phaseHistory = [];
  }

  setExercise(name) {
    this.exercise = Exercises[name];
    this.phase = 0;
    this.phaseHistory = [];
    if (this.exercise && !this.running) this.draw();
  }

  start() {
    if (!this.exercise || this.running) return;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  }

  loop() {
    if (!this.running) return;
    this.phase += this.speed;
    if (this.phase > 1) this.phase -= 1;
    // Record phase history for ghost trail
    this.phaseHistory.push(this.phase);
    if (this.phaseHistory.length > this.trailFrames) this.phaseHistory.shift();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  draw() {
    if (!this.exercise) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.38;

    ctx.clearRect(0, 0, w, h);

    // Ghost trail
    const trail = this.phaseHistory;
    for (let i = 0; i < trail.length - 1; i++) {
      const alpha = (i + 1) / trail.length * 0.2;
      const pose = this.exercise.getPose(trail[i]);
      if (pose) drawStickman(ctx, pose, cx, cy, scale, alpha);
    }

    // Current frame
    const pose = this.exercise.getPose(this.phase);
    if (pose) drawStickman(ctx, pose, cx, cy, scale, 1);
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    if (!this.running) this.draw();
  }
}

// Static list of all exercise names
export const exerciseNames = Object.keys(Exercises);
export { Exercises };
