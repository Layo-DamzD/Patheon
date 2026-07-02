/**
 * Pantheon — Tuning Config
 * ====================================
 * This is the SINGLE file where all gameplay "feel" constants live.
 * When the owner says "running too floaty" or "lightning doesn't go far enough",
 * the AI edits ONLY this file. No other file needs to change for feel tuning.
 *
 * Every constant is documented so the owner knows what it does.
 */

export const TUNING = {
  // ============================================================
  // VELORA — Speedster
  // ============================================================
  velora: {
    // Movement speeds (units per second)
    jogSpeed: 8,           // Walking speed — for precise indoor movement
    sprintSpeed: 60,       // Super speed — feels like 200mph at this scale
    acceleration: 200,     // How fast Velora reaches max speed (higher = snappier)
    deceleration: 300,     // How fast Velora stops when input released (higher = less slide)

    // Camera
    cameraDistance: 8,     // Distance behind Velora
    cameraHeight: 4,       // Height above Velora
    cameraLerp: 0.15,      // How smoothly camera follows (lower = smoother, higher = snappier)

    // Wall-Run
    wallRunMaxDuration: 3,     // Seconds before auto-disengage
    wallRunStickiness: 1.2,    // How strongly she sticks to wall
    wallRunUpSpeed: 25,        // Vertical speed while wall-running up

    // Water-Run
    waterRunSpeedRequired: 30, // Must be sprinting at least this fast to water-run
    floatationRiseSpeed: 4,    // How fast she rises when floating (after stopping on water)

    // Slow Time
    slowTimeScale: 0.2,        // Time slows to 20% of normal
    slowTimeDuration: 8,       // Seconds of slow time per use
    slowTimeCooldown: 12,      // Seconds between uses

    // Lightning Throw
    lightningRange: 50,        // How far lightning bolt travels
    lightningSpeed: 100,       // Travel speed of bolt
    lightningDamage: 50,       // Damage on hit
    lightningStunDuration: 2,  // Stun duration on hit
    lightningCooldown: 6,      // Seconds between throws
    lightningChainCount: 3,    // Number of enemies lightning chains to

    // Phase (Walk through walls)
    phaseDuration: 2,          // Seconds of intangibility
    phaseCooldown: 15,         // Seconds between phases

    // Tornado
    tornadoBuildupTime: 1.5,   // Seconds of arm-swinging before tornado forms
    tornadoRadius: 15,         // Effective radius
    tornadoForce: 50,          // Knockback force on enemies
    tornadoCooldown: 8,        // Seconds between uses
    tornadoFireExtinguishRange: 20, // Range to extinguish fires

    // Visual feedback
    motionBlurIntensity: 0.6,  // How much world blurs during sprint (0 = none, 1 = max)
    fovSprintBoost: 15,        // FOV widens by this much during sprint (degrees)
    sparksTrailLength: 8,      // Length of sparks trail behind her
  },

  // ============================================================
  // ENEMIES — Street Thug
  // ============================================================
  streetThug: {
    health: 100,
    moveSpeed: 4,
    chaseRange: 25,        // Distance at which thug starts chasing
    attackRange: 2,        // Distance at which thug attacks
    attackDamage: 10,
    attackCooldown: 1.5,   // Seconds between attacks
    attackWindup: 0.5,     // Seconds of windup before damage applies
    knockbackResistance: 0.5, // 0 = no resistance, 1 = immune
  },

  // ============================================================
  // CITY — Midtown block
  // ============================================================
  midtown: {
    blockSize: 200,        // Size of the city block (units)
    buildingCount: 10,     // Number of buildings
    buildingMinHeight: 20,
    buildingMaxHeight: 60,
    streetWidth: 30,       // Width of streets between buildings
    waterFeatureSize: 40,  // Size of the water feature for water-run testing
  },

  // ============================================================
  // CRIME — Bank Robbery
  // ============================================================
  bankRobbery: {
    spawnInterval: 120,        // Seconds between spawns (2 min)
    enemyCount: 4,             // Thugs per robbery
    completionRadius: 5,       // Distance to bank to "complete" mission
    missionTimerSeconds: 180,  // 3 minutes to complete
  },

  // ============================================================
  // PHYSICS — Global
  // ============================================================
  physics: {
    gravity: -30,              // Stronger than earth (-9.8) for snappier game feel
    fixedTimeStep: 1 / 60,
    velocityIterations: 8,
    positionIterations: 3,
  },

  // ============================================================
  // TOUCH CONTROLS
  // ============================================================
  controls: {
    joystickSize: 120,         // Pixel diameter of joystick
    joystickDeadzone: 0.15,    // Below this = no input
    buttonSize: 64,            // Pixel size of action buttons
    buttonSpacing: 8,          // Gap between buttons
    inputPollRate: 60,         // Input sampling rate (Hz)
  },

  // ============================================================
  // RENDERING
  // ============================================================
  render: {
    targetFps: 60,
    pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2),
    shadowMapSize: 2048,
    fogColor: '#0c0b0a',
    fogNear: 100,
    fogFar: 500,
  },
} as const;

export type TuningConfig = typeof TUNING;
