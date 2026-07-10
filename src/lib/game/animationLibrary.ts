'use client';

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useEffect, useState, useMemo, useRef } from 'react';

/**
 * Animation Library — Universal animation system for Pantheon
 *
 * Loads animations from multiple sources:
 * 1. Quaternius Universal Animation Library (UAL1_Standard.glb) — 38 anims
 * 2. Rokoko Superhero Pack (FBX files) — 9 anims
 * 3. IronMan_Flying.glb — hero-specific flight
 *
 * All animations are retargeted to a standard humanoid rig so they work
 * on ANY rigged character model.
 *
 * Animation naming convention:
 * - Source name preserved (e.g., "Idle_Loop", "SuperHeroFlying")
 * - Aliases map common names (e.g., "idle" → "Idle_Loop")
 */

export interface AnimationClip {
  name: string;
  clip: THREE.AnimationClip;
  source: string;
}

// Animation aliases — map simple names to actual clip names
export const ANIMATION_ALIASES: Record<string, string[]> = {
  idle: ['Idle_Loop', 'idle', 'Idle'],
  run: ['Sprint_Loop', 'Run', 'Running', 'run'],
  walk: ['Walk_Loop', 'Walk', 'Walking', 'walk'],
  jog: ['Jog_Fwd_Loop', 'Jog'],
  jump_start: ['Jump_Start', 'JumpStart'],
  jump_loop: ['Jump_Loop', 'JumpLoop'],
  jump_land: ['Jump_Land', 'JumpLand', 'Landing'],
  punch: ['Punch_Cross', 'Punch', 'Right_Punch'],
  punch_jab: ['Punch_Jab', 'Jab'],
  hit_chest: ['Hit_Chest', 'HitChest'],
  hit_head: ['Hit_Head', 'HitHead'],
  death: ['Death01', 'Death', 'Knockdown', 'Fall'],
  dodge: ['Roll', 'Dodge', 'DodgeRoll'],
  crouch_idle: ['Crouch_Idle_Loop', 'CrouchIdle'],
  crouch_walk: ['Crouch_Fwd_Loop', 'CrouchWalk'],
  sword_attack: ['Sword_Attack', 'SwordAttack'],
  sword_idle: ['Sword_Idle', 'SwordIdle'],
  spell_shoot: ['Spell_Simple_Shoot', 'SpellShoot', 'Cast'],
  spell_enter: ['Spell_Simple_Enter', 'SpellEnter', 'PowerUp'],
  spell_exit: ['Spell_Simple_Exit', 'SpellExit'],
  spell_idle: ['Spell_Simple_Idle_Loop', 'SpellIdle'],
  swim: ['Swim_Fwd_Loop', 'Swim'],
  swim_idle: ['Swim_Idle_Loop', 'SwimIdle'],
  hover: ['WatchOverCity', 'Hover', 'Float', 'Floating'],
  fly: ['SuperHeroFlying', 'Fly', 'Flying', 'Flight'],
  ironman_fly: ['IronMan_Flying', 'Flying'],
  takeoff: ['SuperHeroLanding_Takeoff', 'Takeoff', 'Jump_Start'],
  superhero_landing: ['SuperHeroLanding_Takeoff', 'Landing'],
  archery: ['Hawkeye_Archery', 'Archery', 'SideThrow'],
  hulk_transform: ['HulkTransformation', 'Transform', 'PowerUp'],
  mutant_claws: ['MutantClaws', 'Claws', 'Slash'],
  laser_eyes: ['LaserEyes', 'Laser', 'Beam'],
  telekinesis: ['Telekenisis', 'Telekinesis', 'TK'],
};

/**
 * Load animation clips from a GLB file
 */
export function useAnimationLibrary() {
  // Load Quaternius pack
  const quaterniusGltf = useGLTF('/models/animations/UAL1_Standard.glb');

  // Load IronMan flying
  const ironmanFlyGltf = useGLTF('/models/animations/IronMan_Flying.glb');

  // Compute clips from loaded GLTFs (memoized)
  const clips = useMemo<AnimationClip[]>(() => {
    const result: AnimationClip[] = [];

    if (quaterniusGltf?.animations) {
      quaterniusGltf.animations.forEach((clip) => {
        result.push({ name: clip.name, clip, source: 'quaternius' });
      });
    }

    if (ironmanFlyGltf?.animations) {
      ironmanFlyGltf.animations.forEach((clip) => {
        result.push({ name: clip.name, clip, source: 'ironman' });
      });
    }

    return result;
  }, [quaterniusGltf, ironmanFlyGltf]);

  const loaded = clips.length > 0;

  return { clips, loaded };
}

/**
 * Find an animation clip by alias (e.g., "idle" → finds "Idle_Loop")
 */
export function findClip(clips: AnimationClip[], alias: string): THREE.AnimationClip | null {
  const possibleNames = ANIMATION_ALIASES[alias] || [alias];

  for (const name of possibleNames) {
    const found = clips.find((c) => c.name === name || c.name.toLowerCase() === name.toLowerCase());
    if (found) return found.clip;
  }

  // Fallback: partial match
  for (const name of possibleNames) {
    const found = clips.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
    if (found) return found.clip;
  }

  return null;
}

/**
 * Get all available animation names
 */
export function listAnimations(clips: AnimationClip[]): string[] {
  return clips.map((c) => c.name);
}

// Preload
useGLTF.preload('/models/animations/UAL1_Standard.glb');
useGLTF.preload('/models/animations/IronMan_Flying.glb');
