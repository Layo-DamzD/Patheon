/**
 * Hero Configuration System
 *
 * Each hero is defined by a config object that specifies:
 * - Model URL (GLB file)
 * - Animation mapping (which aliases to use)
 * - Flight style (hover, horizontal, both, none)
 * - Abilities (which buttons)
 * - Colors (primary, accent for effects)
 * - Scale and rotation offsets
 *
 * Adding a new hero = adding one config entry. No code changes.
 */

export type FlightStyle = 'none' | 'hover_only' | 'horizontal_only' | 'both';
export type LandingStyle = 'vertical' | 'horizontal' | 'both' | 'ironman_crouch';

export interface HeroConfig {
  id: string;
  name: string;
  civilianName: string;
  modelUrl: string;
  civilianModelUrl?: string;
  scale: number;
  rotationOffset: number;       // radians, for models facing wrong direction
  positionOffset: [number, number, number];

  // Colors (for effects, auras, particles)
  primaryColor: string;
  accentColor: string;
  glowColor: string;

  // Flight
  flightStyle: FlightStyle;
  landingStyle: LandingStyle;
  flightAnimationAlias?: string;  // which animation for horizontal flight
  hoverAnimationAlias?: string;   // which animation for hover

  // Abilities — which buttons this hero has
  abilities: {
    sprint?: boolean;
    jump?: boolean;
    punch?: boolean;
    dodge?: boolean;
    throw?: boolean;       // side throw (lightning, hammer, web, repulsor, fireball)
    castSpell?: boolean;   // raise hand / magic
    powerUp?: boolean;     // transformation
    flight?: boolean;
    phase?: boolean;
    freezeTime?: boolean;  // Velora's freeze
    slowTime?: boolean;    // other heroes' slow
    blow?: boolean;        // melee attack
    airDash?: boolean;
  };

  // Button layout (order matters — left to right)
  buttonLayout: string[];

  // Animation overrides (if hero uses different animations than defaults)
  animationOverrides?: Record<string, string>;
}

// ═══════════════════════════════════════════
// HERO ROSTER — 11 heroes
// ═══════════════════════════════════════════

export const HEROES: Record<string, HeroConfig> = {
  velora: {
    id: 'velora',
    name: 'Velora',
    civilianName: 'Makkari',
    modelUrl: '/models/Velora.glb',
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#1e90ff',
    accentColor: '#debf63',
    glowColor: '#1e90ff',

    flightStyle: 'none',
    landingStyle: 'vertical',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // lightning bolt
      freezeTime: true,
      phase: true,
      blow: true,
    },

    buttonLayout: ['run', 'jump', 'freeze', 'dodge', 'phase', 'bolt', 'punch'],
  },

  stormborn: {
    id: 'stormborn',
    name: 'Stormborn',
    civilianName: 'Thor',
    modelUrl: '/models/Stormborn.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#4169e1',
    accentColor: '#c0c0c0',
    glowColor: '#ffffff',

    flightStyle: 'horizontal_only',
    landingStyle: 'both',
    flightAnimationAlias: 'fly',  // arms forward (on hammer)
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,        // hammer swing
      dodge: true,
      throw: true,        // hammer throw
      castSpell: true,    // storm call (raise hand)
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'throw', 'summon', 'flight', 'dodge'],
  },

  ironclad: {
    id: 'ironclad',
    name: 'Ironclad',
    civilianName: 'Tony Stark',
    modelUrl: '/models/Ironclad.glb',
    civilianModelUrl: '/models/TonyStark.glb',
    scale: 1.2,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#b22222',
    accentColor: '#ffd700',
    glowColor: '#00aaff',

    flightStyle: 'both',
    landingStyle: 'ironman_crouch',
    flightAnimationAlias: 'ironman_fly',
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // repulsor blast
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'repulsor', 'flight', 'dodge'],
  },

  aegis_wing: {
    id: 'aegis_wing',
    name: 'Aegis Wing',
    civilianName: 'Sam Wilson',
    modelUrl: '/models/AegisWing.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#3a3a3a',
    accentColor: '#dc143c',
    glowColor: '#ffffff',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'fly',
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // shield throw
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'shield_throw', 'flight', 'dodge'],
  },

  arachne: {
    id: 'arachne',
    name: 'Arachne',
    civilianName: 'Peter Parker',
    modelUrl: '/models/Arachne.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#dc143c',
    accentColor: '#1a1a2e',
    glowColor: '#dc143c',

    flightStyle: 'none',
    landingStyle: 'both',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // web shoot
      blow: true,
    },

    buttonLayout: ['run', 'jump', 'web_shoot', 'dodge', 'punch'],
  },

  glitch: {
    id: 'glitch',
    name: 'Glitch',
    civilianName: 'Hacker Girl',
    modelUrl: '/models/Glitch.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#00ffff',
    accentColor: '#00ff00',
    glowColor: '#00ffff',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'hover',  // on hoverboard
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      castSpell: true,    // hack
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'hack', 'flight', 'dodge'],
  },

  pulsar: {
    id: 'pulsar',
    name: 'Pulsar',
    civilianName: 'Carol Danvers',
    modelUrl: '/models/Pulsar.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#cd5c5c',
    accentColor: '#ffd700',
    glowColor: '#ffaa00',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'fly',  // arms forward (Superman)
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // photon blast
      powerUp: true,      // binary mode
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'photon', 'binary', 'flight', 'dodge'],
  },

  veil: {
    id: 'veil',
    name: 'Veil',
    civilianName: 'Sue Storm',
    modelUrl: '/models/Veil.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#ffffff',
    accentColor: '#87ceeb',
    glowColor: '#87ceeb',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'hover',  // force field levitation
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      castSpell: true,    // force fields + TK
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'force_field', 'invisibility', 'flight', 'dodge'],
  },

  mystic: {
    id: 'mystic',
    name: 'Mystic',
    civilianName: 'Stephen Strange',
    modelUrl: '/models/Mystic.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#8b0000',
    accentColor: '#ffa500',
    glowColor: '#ffa500',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'hover',  // cloak levitation
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      castSpell: true,    // portals, spells
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'portal', 'spell', 'flight', 'dodge'],
  },

  blaze: {
    id: 'blaze',
    name: 'Blaze',
    civilianName: 'Johnny Storm',
    modelUrl: '/models/Blaze.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#ff4500',
    accentColor: '#ffd700',
    glowColor: '#ff6600',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'hover',  // flame propulsion
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // fireball
      powerUp: true,      // flame on
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'fireball', 'flame_on', 'flight', 'dodge'],
  },

  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    civilianName: 'Bob Reynolds',
    modelUrl: '/models/Sentinel.glb',  // TODO: upload
    scale: 1.5,
    rotationOffset: Math.PI,
    positionOffset: [0, 0, 0],

    primaryColor: '#ffd700',
    accentColor: '#ffffff',
    glowColor: '#ffd700',

    flightStyle: 'both',
    landingStyle: 'both',
    flightAnimationAlias: 'hover',  // god levitation
    hoverAnimationAlias: 'hover',

    abilities: {
      sprint: true,
      jump: true,
      punch: true,
      dodge: true,
      throw: true,        // light blast
      powerUp: true,      // hollow toggle
      flight: true,
      blow: true,
    },

    buttonLayout: ['run', 'punch', 'light_blast', 'hollow_toggle', 'flight', 'dodge'],
  },
};

/**
 * Get hero config by ID
 */
export function getHero(id: string): HeroConfig | undefined {
  return HEROES[id];
}

/**
 * Get all heroes
 */
export function getAllHeroes(): HeroConfig[] {
  return Object.values(HEROES);
}

/**
 * Get all flying heroes
 */
export function getFlyingHeroes(): HeroConfig[] {
  return Object.values(HEROES).filter((h) => h.flightStyle !== 'none');
}
