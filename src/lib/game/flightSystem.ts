'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeroConfig, LandingStyle } from '@/config/heroes';
import { cameraInput } from './cameraInput';

/**
 * Flight System
 *
 * Handles all flight mechanics for flying heroes:
 * - Takeoff (ground → hover)
 * - Hover (stationary in air)
 * - Horizontal flight (fast forward movement)
 * - Air dash (quick burst in any direction)
 * - Landing (hover/flight → ground)
 *
 * Landing styles (player-selectable via joystick direction):
 * - Vertical: hold no direction → crouch landing (Jump_Land anim)
 * - Horizontal: hold forward → run-on landing (blend to walk)
 * - Iron Man: always crouch (code-driven pose)
 *
 * Flight state machine:
 * grounded → takeoff → hover → horizontal_flight → landing → grounded
 */

export type FlightState = 'grounded' | 'taking_off' | 'hovering' | 'flying_horizontal' | 'landing';

interface FlightSystemProps {
  heroConfig: HeroConfig;
  positionRef: React.MutableRefObject<THREE.Vector3>;
  velocityRef: React.MutableRefObject<THREE.Vector3>;
  isFlyingRef: React.MutableRefObject<boolean>;
  isHoveringRef: React.MutableRefObject<boolean>;
  flightStateRef: React.MutableRefObject<FlightState>;
  cameraYawRef: React.MutableRefObject<number>;
  inputRef: React.MutableRefObject<{
    moveX: number;
    moveY: number;
    flight: boolean;
    ascend: boolean;
    descend: boolean;
  }>;
}

const FLIGHT_HOVER_SPEED = 8;
const FLIGHT_HORIZONTAL_SPEED = 40;
const FLIGHT_TAKEOFF_DURATION = 0.8;  // seconds
const FLIGHT_LANDING_DURATION = 0.6;
const GROUND_Y = 0;
const MAX_FLIGHT_HEIGHT = 80;
const AIR_DASH_COOLDOWN = 1.5;
const AIR_DASH_FORCE = 30;

export function useFlightSystem({
  heroConfig,
  positionRef,
  velocityRef,
  isFlyingRef,
  isHoveringRef,
  flightStateRef,
  cameraYawRef,
  inputRef,
}: FlightSystemProps) {
  const takeoffTimerRef = useRef(0);
  const landingTimerRef = useRef(0);
  const airDashCooldownRef = useRef(0);
  const landingStyleRef = useRef<LandingStyle>('vertical');
  const previousFlightInputRef = useRef(false);

  useFrame((_, delta) => {
    if (heroConfig.flightStyle === 'none') return;

    const flightState = flightStateRef.current;
    const flightInput = inputRef.current.flight;
    const pos = positionRef.current;
    const vel = velocityRef.current;

    // ─── Toggle flight on/off (edge-triggered) ───
    if (flightInput && !previousFlightInputRef.current) {
      if (flightState === 'grounded') {
        // Start takeoff
        flightStateRef.current = 'taking_off';
        takeoffTimerRef.current = 0;
        isFlyingRef.current = true;
      } else if (flightState === 'hovering' || flightState === 'flying_horizontal') {
        // Start landing
        flightStateRef.current = 'landing';

        // Determine landing style based on input
        if (heroConfig.landingStyle === 'ironman_crouch') {
          landingStyleRef.current = 'ironman_crouch';
        } else if (heroConfig.landingStyle === 'both') {
          // Player chooses: hold forward = horizontal land, otherwise vertical
          if (inputRef.current.moveY < -0.3) {
            landingStyleRef.current = 'horizontal';
          } else {
            landingStyleRef.current = 'vertical';
          }
        } else {
          landingStyleRef.current = heroConfig.landingStyle;
        }
        landingTimerRef.current = 0;
      }
    }
    previousFlightInputRef.current = flightInput;

    // ─── Handle each flight state ───
    switch (flightState) {
      case 'taking_off': {
        takeoffTimerRef.current += delta;
        // Rise up during takeoff
        vel.y = 8;
        vel.x *= 0.5;
        vel.z *= 0.5;

        if (takeoffTimerRef.current >= FLIGHT_TAKEOFF_DURATION) {
          flightStateRef.current = 'hovering';
          isHoveringRef.current = true;
          vel.y = 0;
        }
        break;
      }

      case 'hovering': {
        // Slow movement in hover
        const moveX = inputRef.current.moveX;
        const moveY = inputRef.current.moveY;
        const moveDir = new THREE.Vector3(-moveX, 0, -moveY);
        moveDir.applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));

        vel.x = moveDir.x * FLIGHT_HOVER_SPEED;
        vel.z = moveDir.z * FLIGHT_HOVER_SPEED;

        // Ascend/descend
        if (inputRef.current.ascend) {
          vel.y = FLIGHT_HOVER_SPEED;
        } else if (inputRef.current.descend) {
          vel.y = -FLIGHT_HOVER_SPEED;
        } else {
          vel.y = 0;
        }

        // Transition to horizontal flight if pushing forward + sprinting
        if (inputRef.current.moveY < -0.5 && Math.abs(inputRef.current.moveX) < 0.3) {
          // Push forward hard → go horizontal
          flightStateRef.current = 'flying_horizontal';
          isHoveringRef.current = false;
        }
        break;
      }

      case 'flying_horizontal': {
        // Fast horizontal flight
        const moveX = inputRef.current.moveX;
        const moveY = inputRef.current.moveY;
        const moveDir = new THREE.Vector3(-moveX, 0, -moveY);
        moveDir.applyEuler(new THREE.Euler(0, cameraYawRef.current, 0));

        vel.x = moveDir.x * FLIGHT_HORIZONTAL_SPEED;
        vel.z = moveDir.z * FLIGHT_HORIZONTAL_SPEED;

        // Slight vertical control
        if (inputRef.current.ascend) vel.y = FLIGHT_HOVER_SPEED;
        else if (inputRef.current.descend) vel.y = -FLIGHT_HOVER_SPEED;
        else vel.y = 0;

        // Slow down → back to hover
        if (Math.abs(inputRef.current.moveY) < 0.3 && Math.abs(inputRef.current.moveX) < 0.3) {
          flightStateRef.current = 'hovering';
          isHoveringRef.current = true;
        }
        break;
      }

      case 'landing': {
        landingTimerRef.current += delta;

        // Descend to ground
        vel.y = -10;
        vel.x *= 0.7;
        vel.z *= 0.7;

        // Check if landed
        if (pos.y <= GROUND_Y + 0.1) {
          pos.y = GROUND_Y;
          vel.y = 0;
          vel.x = 0;
          vel.z = 0;
          flightStateRef.current = 'grounded';
          isFlyingRef.current = false;
          isHoveringRef.current = false;
        }
        break;
      }

      case 'grounded':
      default:
        // Not flying — flight system inactive
        break;
    }

    // ─── Clamp flight height ───
    if (isFlyingRef.current && pos.y > MAX_FLIGHT_HEIGHT) {
      pos.y = MAX_FLIGHT_HEIGHT;
      vel.y = 0;
    }

    // ─── Air dash cooldown ───
    if (airDashCooldownRef.current > 0) {
      airDashCooldownRef.current -= delta;
    }
  });

  /**
   * Trigger an air dash (called by combat/dodge system)
   */
  const triggerAirDash = (direction: THREE.Vector3) => {
    if (flightStateRef.current !== 'hovering' && flightStateRef.current !== 'flying_horizontal') return;
    if (airDashCooldownRef.current > 0) return;

    vel = velocityRef.current;
    vel.x += direction.x * AIR_DASH_FORCE;
    vel.y += direction.y * AIR_DASH_FORCE;
    vel.z += direction.z * AIR_DASH_FORCE;

    airDashCooldownRef.current = AIR_DASH_COOLDOWN;
  };

  return {
    triggerAirDash,
    getLandingStyle: () => landingStyleRef.current,
  };
}
