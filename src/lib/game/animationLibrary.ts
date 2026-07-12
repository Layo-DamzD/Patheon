'use client';

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

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
  idle: ['Idle_Loop', 'idle', 'Idle', 'idle 02', 'Idle 03', 'Character_Idle', 'mixamo.com'],
  run: ['Sprint_Loop', 'Run', 'Running', 'run', 'Run Forward', 'Sprint Forward', 'Character_Run'],
  walk: ['Walk_Loop', 'Walk', 'Walking', 'walk', 'Walk Forward', 'Walk Back', 'Character_Walk'],
  jog: ['Jog_Fwd_Loop', 'Jog', 'Run Forward', 'Character_Run'],
  jump_start: ['Jump_Start', 'JumpStart', 'Jump', 'Jump Running'],
  jump_loop: ['Jump_Loop', 'JumpLoop'],
  jump_land: ['Jump_Land', 'JumpLand', 'Landing', 'Land To idle', 'Land To Standing Idle', 'Jump Running Landing'],
  punch: ['Punch_Cross', 'Punch', 'Right_Punch', '1H Magic Attack 01', '1H Magic Attack 02'],
  punch_jab: ['Punch_Jab', 'Jab', '1H Magic Attack 02'],
  hit_chest: ['Hit_Chest', 'HitChest', 'React Large From Front', 'React Small From Front'],
  hit_head: ['Hit_Head', 'HitHead'],
  death: ['Death01', 'Death', 'Knockdown', 'Fall', 'React Death Backward', 'React Death Forward'],
  dodge: ['Roll', 'Dodge', 'DodgeRoll'],
  crouch_idle: ['Crouch_Idle_Loop', 'CrouchIdle', 'Crouch Idle'],
  crouch_walk: ['Crouch_Fwd_Loop', 'CrouchWalk', 'Crouch Walk Forward'],
  sword_attack: ['Sword_Attack', 'SwordAttack', '2H Magic Attack 01'],
  sword_idle: ['Sword_Idle', 'SwordIdle'],
  spell_shoot: ['Spell_Simple_Shoot', 'SpellShoot', 'Cast', '1H cast spell 01', '1H Magic Attack 01'],
  spell_enter: ['Spell_Simple_Enter', 'SpellEnter', 'PowerUp', '2H Cast Spell 01'],
  spell_exit: ['Spell_Simple_Exit', 'SpellExit'],
  spell_idle: ['Spell_Simple_Idle_Loop', 'SpellIdle'],
  spell_area: ['2H Magic Area Attack 01', '2H Magic Area Attack 02'],
  swim: ['Swim_Fwd_Loop', 'Swim'],
  swim_idle: ['Swim_Idle_Loop', 'SwimIdle'],
  block_idle: ['Block Idle', 'Standing Block Idle'],
  block_start: ['Block Start', 'Standing Block Start'],
  block_react: ['Block React Large', 'Standing Block React Large'],
  hover: ['WatchOverCity', 'Hover', 'Float', 'Floating'],
  fly: ['SuperHeroFlying', 'Fly', 'Flying', 'Flight'],
  ironman_fly: ['IronMan_Flying', 'Flying'],
  takeoff: ['SuperHeroLanding_Takeoff', 'Takeoff', 'Jump_Start', 'Jump'],
  superhero_landing: ['SuperHeroLanding_Takeoff', 'Landing'],
  archery: ['Hawkeye_Archery', 'Archery', 'SideThrow'],
  hulk_transform: ['HulkTransformation', 'Transform', 'PowerUp'],
  mutant_claws: ['MutantClaws', 'Claws', 'Slash'],
  laser_eyes: ['LaserEyes', 'Laser', 'Beam'],
  telekinesis: ['Telekenisis', 'Telekinesis', 'TK'],
  // Spider-Man specific
  web_swing: ['Swinging', 'Swing', 'Web Swing'],
  web_swing_start: ['Start Swinging', 'Start Swing'],
  web_swing_land: ['Swing To Land', 'Swing Land'],
  wall_run: ['Wall Run', 'WallRun'],
  wall_crawl: ['Low Crawl', 'LowCrawl', 'Crawl'],
  glide: ['Dying', 'Jump Away', 'Swim_Fwd_Loop'],  // horizontal body for glide/flight
  jump_away: ['Jump Away', 'JumpAway'],
};

/**
 * Load animation clips from a GLB file
 */
export function useAnimationLibrary() {
  // Load Quaternius pack (GLB)
  const quaterniusGltf = useGLTF('/models/animations/UAL1_Standard.glb');

  // Load IronMan flying (GLB)
  const ironmanFlyGltf = useGLTF('/models/animations/IronMan_Flying.glb');

  // State for Pro Magic Pack FBX animations (loaded async)
  const [proMagicClips, setProMagicClips] = useState<AnimationClip[]>([]);
  // State for Spider-Man FBX animations (loaded async)
  const [spidermanClips, setSpidermanClips] = useState<AnimationClip[]>([]);

  // Load Pro Magic Pack FBX animations
  useEffect(() => {
    const loader = new FBXLoader();
    const proMagicFiles = [
      'standing idle.fbx',
      'standing idle 02.fbx',
      'Standing Idle 03.fbx',
      'Standing Walk Forward.fbx',
      'Standing Walk Back.fbx',
      'Standing Run Forward.fbx',
      'Standing Sprint Forward.fbx',
      'Standing Jump.fbx',
      'Standing Jump Running.fbx',
      'Standing Jump Running Landing.fbx',
      'Standing Land To Standing Idle.fbx',
      'standing 1H cast spell 01.fbx',
      'Standing 1H Magic Attack 01.fbx',
      'Standing 1H Magic Attack 02.fbx',
      'Standing 2H Cast Spell 01.fbx',
      'Standing 2H Magic Attack 01.fbx',
      'Standing 2H Magic Area Attack 01.fbx',
      'Standing React Large From Front.fbx',
      'Standing React Small From Front.fbx',
      'Standing React Death Backward.fbx',
      'Standing React Death Forward.fbx',
      'Crouch Idle.fbx',
      'Standing Block Idle.fbx',
      'Standing Block Start.fbx',
      'Standing Block React Large.fbx',
    ];

    const loadedClips: AnimationClip[] = [];
    let loadedCount = 0;

    proMagicFiles.forEach((file, idx) => {
      loader.load(
        `/models/animations/promagic/${file}`,
        (object: THREE.Group) => {
          if (object.animations && object.animations.length > 0) {
            const clip = object.animations[0];
            // Clean up the name (remove .fbx, simplify)
            const cleanName = file
              .replace('.fbx', '')
              .replace(/standing/i, '')
              .trim();
            loadedClips.push({
              name: cleanName,
              clip,
              source: 'promagic',
            });
          }
          loadedCount++;
          if (loadedCount === proMagicFiles.length) {
            setProMagicClips(loadedClips);
          }
        },
        undefined,
        (err) => {
          console.warn(`Failed to load ${file}:`, err);
          loadedCount++;
          if (loadedCount === proMagicFiles.length) {
            setProMagicClips(loadedClips);
          }
        }
      );
    });
  }, []);

  // Load Spider-Man FBX animations
  useEffect(() => {
    const loader = new FBXLoader();
    const spidermanFiles = [
      'Swinging.fbx',
      'Start Swinging.fbx',
      'Swing To Land.fbx',
      'Wall Run.fbx',
      'Low Crawl.fbx',
      'Dying.fbx',
      'Jump Away.fbx',
    ];

    const loadedClips: AnimationClip[] = [];
    let loadedCount = 0;

    spidermanFiles.forEach((file) => {
      loader.load(
        `/models/animations/spiderman/${file}`,
        (object: THREE.Group) => {
          if (object.animations && object.animations.length > 0) {
            const clip = object.animations[0];
            const cleanName = file.replace('.fbx', '').trim();
            loadedClips.push({ name: cleanName, clip, source: 'spiderman' });
          }
          loadedCount++;
          if (loadedCount === spidermanFiles.length) {
            setSpidermanClips(loadedClips);
          }
        },
        undefined,
        (err) => {
          console.warn(`Failed to load ${file}:`, err);
          loadedCount++;
          if (loadedCount === spidermanFiles.length) {
            setSpidermanClips(loadedClips);
          }
        }
      );
    });
  }, []);

  // Compute GLB clips from loaded GLTFs (memoized)
  const glbClips = useMemo<AnimationClip[]>(() => {
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

  // Combine all clips
  const clips = useMemo(() => [...glbClips, ...proMagicClips, ...spidermanClips], [glbClips, proMagicClips, spidermanClips]);
  const loaded = clips.length > 0;

  return { clips, loaded };
}

/**
 * Find an animation clip by alias (e.g., "idle" → finds "Idle_Loop")
 */
export function findClip(clips: AnimationClip[], alias: string): THREE.AnimationClip | null {
  const possibleNames = ANIMATION_ALIASES[alias] || [alias];

  // Exact match
  for (const name of possibleNames) {
    const found = clips.find((c) => c.name === name || c.name.toLowerCase() === name.toLowerCase());
    if (found) return found.clip;
  }

  // Partial match
  for (const name of possibleNames) {
    const found = clips.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
    if (found) return found.clip;
  }

  // Fallback for models with numeric animation names (like Soldier: 0, 1, 2, 3)
  // Assume: 0=idle, 1=run, 2=walk, 3=other
  if (clips.length > 0 && /^\d+$/.test(clips[0].name)) {
    const numericMap: Record<string, number> = {
      idle: 0, run: 1, walk: 2, jog: 1,
      jump: 3, punch: 3, hover: 3, fly: 3,
    };
    const idx = numericMap[alias];
    if (idx !== undefined && idx < clips.length) {
      return clips[idx].clip;
    }
    // Default: return first clip
    if (alias === 'idle') return clips[0].clip;
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
