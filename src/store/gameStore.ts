/**
 * Pantheon — Game State Store
 * Tracks everything that isn't physics: hero stats, mission state, input.
 */
import { create } from 'zustand';

export interface InputState {
  moveX: number;      // -1 to 1
  moveY: number;      // -1 to 1
  cameraX: number;    // -1 to 1
  cameraY: number;    // -1 to 1
  sprint: boolean;
  jog: boolean;
  slowTime: boolean;
  lightning: boolean;
  tornado: boolean;
  phase: boolean;
  blow: boolean;      // Melee attack (punch/BLOW)
  flight: boolean;    // Toggle flight on/off
  jump: boolean;
}

export interface HeroState {
  health: number;
  maxHealth: number;
  position: [number, number, number];
  isSprinting: boolean;
  isWallRunning: boolean;
  isWaterRunning: boolean;
  isPhasing: boolean;
  isSlowTimeActive: boolean;
  isFlying: boolean;
  isHovering: boolean;
  slowTimeCooldown: number;
  lightningCooldown: number;
  tornadoCooldown: number;
  phaseCooldown: number;
}

export interface EnemyState {
  id: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  state: 'idle' | 'chase' | 'attack' | 'stunned' | 'dead';
  lastAttackTime: number;
}

export interface MissionState {
  id: string;
  type: 'bank_robbery' | 'patrol';
  active: boolean;
  timeLeft: number;
  enemiesRemaining: number;
  bankPosition: [number, number, number];
  completed: boolean;
}

interface GameStore {
  // Hero
  hero: HeroState;
  setHero: (partial: Partial<HeroState>) => void;
  damageHero: (amount: number) => void;

  // Active hero ID (which hero is currently playable)
  activeHeroId: string;
  setActiveHero: (id: string) => void;

  // Suit-up state (civilian vs hero mode)
  isCivilian: boolean;
  setCivilian: (civilian: boolean) => void;
  isSuitingUp: boolean;
  setSuitingUp: (suiting: boolean) => void;

  // Input
  input: InputState;
  setInput: (partial: Partial<InputState>) => void;

  // Enemies
  enemies: EnemyState[];
  setEnemies: (enemies: EnemyState[]) => void;
  updateEnemy: (id: string, partial: Partial<EnemyState>) => void;
  damageEnemy: (id: string, amount: number) => void;
  removeEnemy: (id: string) => void;

  // Mission
  mission: MissionState | null;
  setMission: (mission: MissionState | null) => void;
  updateMission: (partial: Partial<MissionState>) => void;

  // Game flow
  isPaused: boolean;
  setPaused: (paused: boolean) => void;

  // Slow time (global time scale)
  timeScale: number;
  setTimeScale: (scale: number) => void;
}

const defaultInput: InputState = {
  moveX: 0,
  moveY: 0,
  cameraX: 0,
  cameraY: 0,
  sprint: false,
  jog: false,
  slowTime: false,
  lightning: false,
  tornado: false,
  phase: false,
  blow: false,
  flight: false,
  jump: false,
};

const defaultHero: HeroState = {
  health: 100,
  maxHealth: 100,
  position: [0, 5, 0],
  isSprinting: false,
  isWallRunning: false,
  isWaterRunning: false,
  isPhasing: false,
  isSlowTimeActive: false,
  isFlying: false,
  isHovering: false,
  slowTimeCooldown: 0,
  lightningCooldown: 0,
  tornadoCooldown: 0,
  phaseCooldown: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  hero: defaultHero,
  setHero: (partial) => set((s) => ({ hero: { ...s.hero, ...partial } })),
  damageHero: (amount) =>
    set((s) => ({
      hero: { ...s.hero, health: Math.max(0, s.hero.health - amount) },
    })),

  activeHeroId: 'velora',
  setActiveHero: (id) => set({ activeHeroId: id }),

  isCivilian: false,
  setCivilian: (civilian) => set({ isCivilian: civilian }),
  isSuitingUp: false,
  setSuitingUp: (suiting) => set({ isSuitingUp: suiting }),

  input: defaultInput,
  setInput: (partial) => set((s) => ({ input: { ...s.input, ...partial } })),

  enemies: [],
  setEnemies: (enemies) => set({ enemies }),
  updateEnemy: (id, partial) =>
    set((s) => ({
      enemies: s.enemies.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    })),
  damageEnemy: (id, amount) =>
    set((s) => ({
      enemies: s.enemies.map((e) =>
        e.id === id ? { ...e, health: Math.max(0, e.health - amount) } : e
      ),
    })),
  removeEnemy: (id) =>
    set((s) => ({
      enemies: s.enemies.filter((e) => e.id !== id),
    })),

  mission: null,
  setMission: (mission) => set({ mission }),
  updateMission: (partial) =>
    set((s) => (s.mission ? { mission: { ...s.mission, ...partial } } : {})),

  isPaused: false,
  setPaused: (paused) => set({ isPaused: paused }),

  timeScale: 1,
  setTimeScale: (scale) => set({ timeScale: scale }),
}));
