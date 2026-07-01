"""GDD Part 2 — Hero Roster (10 heroes)."""
from gdd_part1 import (
    h1, h2, h3, p, pl, callout, bullets, hr, table,
    PageBreak, CONTENT_W, Spacer, Paragraph, style_body_left
)

def build_hero_roster_intro():
    story = []
    story.append(h1('5. Hero Roster'))
    story.append(hr())
    story.append(p(
        'Pantheon features ten playable heroes. Each is an original archetype inspired by '
        'a recognizable superhero archetype but legally distinct from any existing comic '
        'property. Every hero has a unique movement kit, combat identity, hero-specific '
        'button layout (4-5 buttons, no shared scheme), and a personal story arc woven into '
        'the main campaign. Heroes are unlocked through story progression; once unlocked, '
        'they remain available for free-roam, side missions, and replayability modes.'
    ))
    story.append(p(
        'A critical design rule: <b>no two heroes feel the same</b>. Movement is the primary '
        'differentiator — Velora runs at super speed, Arachne swings on webs, Ironclad flies '
        'horizontally, Mystic levitates vertically, Stormborn throws his hammer and rides it. '
        'If a player closes their eyes and a friend plays, the player should be able to '
        'identify the hero from movement alone within five seconds.'
    ))

    roster = [
        ['#', 'Hero', 'Archetype', 'Movement', 'Buttons'],
        ['1', 'Velora', 'Speedster (female, Makkari-inspired)', 'Super speed, wall-run, water-run, air-run', '5'],
        ['2', 'Stormborn', 'Thunder God', 'Hammer-throw + ride, lightning strike', '4'],
        ['3', 'Aegis Wing', 'Flying Shield-Fighter', 'Flight, dive-bomb, shield ricochet', '4'],
        ['4', 'Arachne', 'Web-Slinger', 'Web-swing, web-wing glide, wall-crawl', '4'],
        ['5', 'Ironclad', 'Tech Armor', 'Horizontal flight, repulsor hover', '5'],
        ['6', 'Glitch', 'Hacker', 'Hover-glider flight, drone swarm', '5'],
        ['7', 'Pulsar', 'Energy Blaster', 'Vertical flight, photon beams', '4'],
        ['8', 'Elasto', 'Elastic', 'Stretch-punch, flatten-glide, slingshot', '4'],
        ['9', 'Sentinel / Hollow', 'Duality (god-tier)', 'Flight, light/dark blast', '4'],
        ['10', 'Mystic', 'Sorcerer', 'Levitate, portals, telekinesis', '4'],
    ]
    story.append(table(roster, [CONTENT_W*0.05, CONTENT_W*0.15, CONTENT_W*0.30, CONTENT_W*0.40, CONTENT_W*0.10]))

    story.append(p(
        'The following sections detail each hero in turn. Each hero\'s entry includes: '
        'identity, full power kit, button layout, unlock path, and design notes. Powers marked '
        '<b>Start</b> are available the moment the hero is unlocked; powers marked <b>Story</b> '
        'are unlocked by completing that hero\'s story missions; powers marked <b>Credits</b> '
        'are purchased with in-game currency earned from any mission; powers marked '
        '<b>Challenge</b> are unlocked by completing a specific gameplay challenge.'
    ))
    story.append(PageBreak())
    return story

def build_velora():
    story = []
    story.append(h1('5.1  Velora — The Speedster'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Female super-speedster, Makkari-inspired.  '
        '<b>Color:</b> Electric blue with silver accents.  '
        '<b>Personality:</b> Quick-witted, fiercely loyal, lives in the moment because to her '
        'everything else moves in slow motion.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Velora is the fastest hero in Pantheon. Her kit is built around <b>perpetual motion</b> — '
        'she has no stamina bar and can run forever. Her power fantasy is the feeling of '
        'speed itself: the world blurring, enemies frozen mid-punch, lightning crackling '
        'in her wake. All her abilities are unlocked through story progression, credit '
        'purchase, or challenge completion — suits are cosmetic only.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Jog (button 1)', 'Start', 'Normal human running speed. Used for precise positioning, indoor areas, social scenes.'],
        ['Sprint (button 2)', 'Start', 'Super speed. No stamina cost — runs indefinitely. World blurs, ambient sound drops, motion lines appear.'],
        ['Wall-Run', 'Start', 'Auto-triggered when sprinting at a wall. Velora runs up and across vertical surfaces. Disengages if she stops or hits a corner she cannot follow.'],
        ['Water-Run', 'Start', 'Auto-triggered when sprinting at water surface. Velora runs across water. If she stops, Floatation Mode engages automatically.'],
        ['Run on Buildings', 'Story mission 1', 'Auto-triggered when sprinting at a building. Velora runs up the side of skyscrapers.'],
        ['Slow Time (button 3)', 'Story mission 2', 'Toggle. Time slows to 20% for 8 seconds. Velora moves at normal speed; enemies crawl. Cooldown 12s.'],
        ['Throw Lightning (button 4)', 'Story mission 3', 'Aim with right stick, release to throw a lightning bolt. Stuns target + chains to nearby enemies. Cooldown 6s.'],
        ['Walk Through Walls (button 5)', 'Story mission 4', 'Phase through solid matter for 2 seconds. Cannot attack while phasing. Cooldown 15s.'],
        ['Tornado (hold button 4)', 'Credits: 2,500', 'Velora swings her arms at super speed, generating a tornado. Context-aware: near fire, blows it out; near enemies, ragdolls them away. Build-up 1.5s, cooldown 8s.'],
        ['Air-Run (lightning stepping stones)', 'Challenge: run on water 30s without stopping', 'Auto-toggle when sprinting in mid-air. Lightning stepping stones form beneath her feet with each step, letting her run across the sky. Disengages if she stops or jumps.'],
        ['Sparks (passive)', 'Credits: 1,000', 'Visual lightning trail behind her while sprinting. Blinds nearby enemies for 1s on close pass.'],
        ['Floatation Mode (passive)', 'Start', 'Auto-fallback: if Velora stops while water-running, she floats instead of sinking. Prevents instant drowning.'],
    ]
    story.append(table(powers, [CONTENT_W*0.28, CONTENT_W*0.22, CONTENT_W*0.50]))

    story.append(h2('Button Layout (5 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Jog)</b> &nbsp; <b>Button 2 (Sprint)</b> &nbsp; <b>Button 3 (Slow Time)</b><br/>'
        '<b>Button 4 (Lightning / hold = Tornado)</b> &nbsp; <b>Button 5 (Phase)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Velora\'s design rule: <b>no stamina, no meter, no resource</b>. The fantasy is '
        'unstoppable perpetual motion. The only thing limiting her is cooldowns on her '
        'special abilities. This means the player can patrol the city at super speed '
        'indefinitely, which is core to the speedster fantasy. Tuning will focus on the '
        'visual feedback of speed (motion blur, sound design, world freeze) rather than '
        'mechanical limits. Her two run buttons (jog vs sprint) exist so the player can '
        'choose precise movement indoors and super speed outdoors — a single button with '
        'a hold-modifier was playtested and felt worse than two discrete buttons.'
    ))

    story.append(h2('Counter-Hero (Boss)'))
    story.append(p(
        '<b>Godspeed</b> — an evil speedster who draws his speed from stolen life force. '
        'Boss fight is a slow-time race: both heroes enter slow-time simultaneously and the '
        'player must outmaneuver him through a maze of falling debris. Phase 2 removes '
        'slow-time and becomes a pure chase sequence across the city.'
    ))
    story.append(PageBreak())
    return story

def build_stormborn():
    story = []
    story.append(h1('5.2  Stormborn — The Thunder God'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Norse-inspired thunder god.  '
        '<b>Color:</b> Royal blue with silver armor, red cape.  '
        '<b>Personality:</b> Boisterous, archaic speech patterns, treats every fight as a '
        'feast tale in the making.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Stormborn\'s hammer is the center of his kit. He throws it horizontally (never '
        'vertically, per the owner\'s spec), it returns to his hand, and he can ride it '
        'for horizontal flight. Lightning is summoned from the sky or channeled through '
        'the hammer. He is the heavy-hitter of the roster — slower than most heroes but '
        'every hit lands like a freight train.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Hammer Throw (button 1)', 'Start', 'Throw hammer horizontally (—). Hammer flies straight, hits enemies, returns. Can be steered mid-flight with right stick. Cooldown 3s.'],
        ['Hammer Recall (button 2)', 'Start', 'Yank hammer back instantly. Can pull enemies caught on the hammer back toward Stormborn.'],
        ['Ride Hammer (button 3, hold)', 'Start', 'Hammer flies horizontally with Stormborn standing on it. Full directional control. Disengage to drop off.'],
        ['Lightning Strike (button 4)', 'Start', 'Summon a bolt from the sky at the targeted location. Massive AoE damage. Cooldown 10s.'],
        ['Channel Lightning through Hammer', 'Story mission 1', 'Hold button 1 to charge hammer with lightning. Next throw deals chain lightning damage.'],
        ['Hammer Control (mid-flight)', 'Story mission 2', 'Steer thrown hammer with full directional control. Can hit multiple enemies before recalling.'],
        ['Thunder Slam', 'Credits: 2,000', 'While airborne, slam down with hammer for ground-shock AoE. Staggers all enemies in 8m radius.'],
        ['Storm Call', 'Challenge: defeat 100 enemies with lightning', 'Summon a localized thunderstorm that strikes random enemies with lightning bolts for 15s. Cooldown 45s.'],
    ]
    story.append(table(powers, [CONTENT_W*0.30, CONTENT_W*0.22, CONTENT_W*0.48]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Hammer Throw / hold = Channel Lightning)</b><br/>'
        '<b>Button 2 (Recall)</b> &nbsp; <b>Button 3 (Ride Hammer, hold)</b> &nbsp; <b>Button 4 (Lightning Strike)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Stormborn\'s horizontal-only hammer throw is a hard rule from the owner. Vertical '
        'throws would feel too much like a generic ranged attack; horizontal throws give the '
        'hammer a unique silhouette (it whips past enemies at chest height) and make the '
        'steering mechanic feel like piloting a missile. Riding the hammer for flight is '
        'equally horizontal — Stormborn does not hover, he commutes. This makes his movement '
        'feel distinct from Ironclad (who hovers with repulsors) and Pulsar (who flies '
        'vertically in Superman pose).'
    ))
    story.append(PageBreak())
    return story

def build_aegis_wing():
    story = []
    story.append(h1('5.3  Aegis Wing — The Flying Shield-Fighter'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Veteran superhero with mechanical wings and a ricocheting shield.  '
        '<b>Color:</b> Tactical gray with red, white, and blue accents.  '
        '<b>Personality:</b> Mentor figure, calm under pressure, dry humor.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Aegis Wing is the roster\'s veteran — the mentor figure other heroes look up to. '
        'His kit balances aerial mobility (mechanical wings) with precise ground combat '
        '(ricocheting shield). He carries a drone sidekick (Redwing equivalent) that can '
        'be deployed for scouting or aerial support. He is the most beginner-friendly hero '
        'because his flight is forgiving and his shield auto-aims at the nearest target.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Fly (button 1, hold)', 'Start', 'Mechanical wings deploy. Full 3D flight with banking. Hold to fly, release to glide down.'],
        ['Shield Throw (button 2)', 'Start', 'Throw shield. Ricochets between up to 3 enemies. Returns to hand. Cooldown 2s.'],
        ['Shield Bash (button 3)', 'Start', 'Melee shield slam. Staggers enemies in front. Combo with shield throw for finisher.'],
        ['Drone Deploy (button 4)', 'Start', 'Redwing drone launches. Auto-targets nearest enemy, fires pellets. Returns on cooldown.'],
        ['Dive-Bomb', 'Story mission 1', 'From altitude, target an enemy and dive at them. Impact deals AoE damage.'],
        ['Shield Ricochet Control', 'Story mission 2', 'Steer shield mid-flight with right stick. Bounce off walls to hit hidden enemies.'],
        ['Redwing Mark Target', 'Credits: 1,500', 'Drone marks a target. Shield throw auto-targets marked enemy with +50% damage.'],
        ['Aerial Escort', 'Challenge: catch 10 falling civilians mid-air', 'While flying, nearby civilians automatically attach to Aegis Wing. Carry them to safety.'],
    ]
    story.append(table(powers, [CONTENT_W*0.30, CONTENT_W*0.22, CONTENT_W*0.48]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Fly, hold)</b> &nbsp; <b>Button 2 (Shield Throw)</b><br/>'
        '<b>Button 3 (Shield Bash)</b> &nbsp; <b>Button 4 (Drone)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Aegis Wing is the game\'s tutorial hero. His flight is the most forgiving (auto-stabilizes '
        'when you release the button), his shield auto-aims, and his drone adds extra damage '
        'without player attention. New players start with Aegis Wing and learn the game\'s '
        'core loop (move, fight, save civilians) before unlocking faster, more complex heroes. '
        'He is also the designated "rescue hero" — his Aerial Escort ability makes him the '
        'best at catching falling civilians from plane emergencies.'
    ))
    story.append(PageBreak())
    return story

def build_arachne():
    story = []
    story.append(h1('5.4  Arachne — The Web-Slinger'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Web-slinging urban acrobat.  '
        '<b>Color:</b> Red and black with white spider emblem.  '
        '<b>Personality:</b> Quippy young hero, mentor is Aegis Wing.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Arachne is the game\'s signature traversal hero. Her web-swinging uses real physics: '
        'the web attaches to a real building, the swing arc depends on momentum, and releasing '
        'at the right moment flings her forward. Her <b>web-wing glide</b> (per the owner\'s '
        'image reference) deploys membrane web-wings from her armpits when she jumps from a '
        'tall building, letting her glide horizontally across the city. She can also web-zip '
        'to building edges, web-yank enemies toward her, and wall-crawl on any surface.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Web-Swing (button 1, hold)', 'Start', 'Fire web at nearest building, swing. Release at apex of arc for max forward momentum. Real physics.'],
        ['Web-Shoot (button 2)', 'Start', 'Fire web projectile. Stuns enemy on hit. Can web enemies to walls/floor.'],
        ['Web-Wing Glide (button 3, hold)', 'Start', 'Deploy web-wings from armpits. Must be falling from height. Controlled descent + horizontal glide. Can dive for speed, pull up for altitude.'],
        ['Web-Yank (button 4)', 'Start', 'Web an enemy and yank them toward Arachne. Sets up melee combo. Cooldown 3s.'],
        ['Wall-Crawl', 'Start', 'Auto-triggered on contact with any wall. Arachne crawls on any surface. Combat available while crawling.'],
        ['Web-Zip to Edge', 'Story mission 1', 'Tap button 1 toward a building edge to instantly zip to it. Closes distance fast.'],
        ['Web-Shield', 'Story mission 2', 'Hold button 2 to weave a web shield in front. Blocks projectiles for 3s.'],
        ['Spider-Sense Dodge', 'Credits: 1,500', 'Passive. Spider-sense icon flashes 0.5s before enemy attack. Tap dodge button to auto-evade.'],
        ['Web-Net', 'Challenge: web 20 enemies to walls', 'Hold button 2 to charge. Releases a web net that catches and immobilizes 3 enemies in an area.'],
    ]
    story.append(table(powers, [CONTENT_W*0.28, CONTENT_W*0.22, CONTENT_W*0.50]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Web-Swing / tap = Web-Zip)</b><br/>'
        '<b>Button 2 (Web-Shoot / hold = Web-Shield / charge = Web-Net)</b><br/>'
        '<b>Button 3 (Web-Wing Glide, hold)</b> &nbsp; <b>Button 4 (Web-Yank)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Arachne\'s web-swinging must feel <b>better than Spider Fighter 3</b>. That game\'s '
        'swinging is widely criticized for feeling on-rails. Pantheon\'s swinging uses Rapier '
        'physics with real pendulum arcs — the player must time releases, manage momentum, '
        'and choose attachment points strategically. The web-wing glide (confirmed from the '
        'owner\'s reference image) adds a second traversal mode that pairs with swinging: '
        'swing for vertical momentum, release, deploy web-wings, glide horizontally for '
        'distance. This dual-mode traversal is unique to Arachne and a primary reason to '
        'play her over other heroes.'
    ))
    story.append(PageBreak())
    return story

def build_ironclad():
    story = []
    story.append(h1('5.5  Ironclad — The Tech Armor'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Genius billionaire in powered armor.  '
        '<b>Color:</b> Crimson red and gold.  '
        '<b>Personality:</b> Showman, narcissist with a heart of gold, tech-rival to Glitch.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Ironclad\'s flight is strictly horizontal after vertical launch — per owner spec, '
        'he can launch straight up but his flight mode is horizontal. An AI assistant '
        '(JARVIS equivalent) feeds him tactical information and can auto-target enemies. '
        'He fires repulsor blasts from his palms, a unibeam from his chest, and can deploy '
        'mini-Ironclad drones for support. He is the roster\'s tech specialist — best at '
        'fighting tech-faction enemies (Glitch\'s faction).'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Vertical Launch (button 1, tap)', 'Start', 'Repulsor launch straight up. Used to gain altitude. Auto-transitions to horizontal flight at apex.'],
        ['Horizontal Flight (button 1, hold)', 'Start', 'Full-speed horizontal flight. Banking turns. Cannot hover — must keep moving forward.'],
        ['Repulsor Blast (button 2)', 'Start', 'Palm-mounted energy blast. Can fire both hands simultaneously. Cooldown 1s.'],
        ['Unibeam (button 3)', 'Start', 'Chest-mounted concentrated beam. High damage, narrow. Cooldown 8s.'],
        ['AI Assist (button 4)', 'Start', 'AI marks enemies, predicts attacks, suggests targets. Toggle on/off.'],
        ['Mini-Drones (button 5)', 'Start', 'Deploy 3 mini-Ironclad drones. Auto-target enemies. Return after 20s. Cooldown 30s.'],
        ['HUD Targeting', 'Story mission 1', 'AI overlays weak points on enemies. Repulsor hits to weak points deal 2x damage.'],
        ['Auto-Targeting Missiles', 'Story mission 2', 'Hold button 2 to lock up to 5 targets. Release to fire homing missiles.'],
        ['AI Voice (character)', 'Credits: 1,000', 'AI speaks mission updates, witty banter, combat callouts. Cosmetic only but huge for flavor.'],
        ['Suit Form Shift', 'Challenge: defeat 50 enemies while flying', 'Mid-air suit reconfiguration: switch between Speed form (faster flight), Tank form (slower, shields up), and Strike form (faster repulsors) on the fly.'],
    ]
    story.append(table(powers, [CONTENT_W*0.30, CONTENT_W*0.22, CONTENT_W*0.48]))

    story.append(h2('Button Layout (5 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Vertical Launch tap / Horizontal Flight hold)</b><br/>'
        '<b>Button 2 (Repulsor / hold = Missiles)</b> &nbsp; <b>Button 3 (Unibeam)</b><br/>'
        '<b>Button 4 (AI Assist)</b> &nbsp; <b>Button 5 (Mini-Drones)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Ironclad\'s horizontal-only flight is a deliberate owner spec. Vertical hovering '
        'would make him feel too much like Pulsar or Mystic. His flight fantasy is '
        '<b>commuting at Mach 1</b> — point at a destination, accelerate, arrive. The '
        'vertical launch exists only to get him to altitude where horizontal flight makes '
        'sense. AI Assist is the second-most-important part of his kit (after flight) '
        'because it sells the "billionaire in tech armor" fantasy: the suit is doing half '
        'the work. The AI voice (cosmetic, credit-purchased) is the cherry on top.'
    ))
    story.append(PageBreak())
    return story

def build_glitch():
    story = []
    story.append(h1('5.6  Glitch — The Hacker'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Street-smart tech genius with hover-glider and drone swarm. '
        'Inspired by Spider Fighter 3\'s hacker girl "Virus."  '
        '<b>Color:</b> Cyan and black with neon-green accents.  '
        '<b>Personality:</b> Sarcastic, anti-authority, rival to Ironclad.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Glitch is the roster\'s tech-control hero. Where Ironclad <b>has</b> tech, Glitch '
        '<b>controls</b> tech. She hacks enemy drones to fight for her, deploys her own '
        'drone swarm, fires EMP pulses to disable tech, and uses a hover-glider for aerial '
        'mobility. Her invisibility cloak lets her bypass combat entirely for stealth '
        'missions. She is the best hero for infiltrating Tech Cult strongholds.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Hack (button 1)', 'Start', 'Hack an enemy tech (drone, turret, mech). It fights for Glitch for 15s. Cooldown 8s.'],
        ['Drone Swarm (button 2)', 'Start', 'Deploy 6 micro-drones. Auto-target enemies. Return after 15s. Cooldown 25s.'],
        ['EMP Pulse (button 3)', 'Start', 'AoE pulse that disables all enemy tech in 10m radius for 5s. Cooldown 15s.'],
        ['Hover-Glider (button 4, hold)', 'Start', 'Deploy hover-glider. Flies at low altitude. Slower than Ironclad but quieter.'],
        ['Cloak (button 5)', 'Start', 'Invisibility for 5s. Cannot attack while cloaked. Cooldown 20s.'],
        ['Hacked Turret Turn', 'Story mission 1', 'Hacked turrets turn on their owners. Persists until turret destroyed.'],
        ['Drone Shield', 'Story mission 2', 'Drones form a protective ring around Glitch, blocking projectiles.'],
        ['Mass Hack', 'Credits: 3,000', 'Hack all tech in 20m radius simultaneously. Cooldown 60s.'],
        ['Remote Hack', 'Challenge: hack 50 drones', 'Hack tech from any distance, no line-of-sight required. Stealth mission enabler.'],
    ]
    story.append(table(powers, [CONTENT_W*0.28, CONTENT_W*0.22, CONTENT_W*0.50]))

    story.append(h2('Button Layout (5 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Hack)</b> &nbsp; <b>Button 2 (Drone Swarm)</b> &nbsp; <b>Button 3 (EMP)</b><br/>'
        '<b>Button 4 (Hover-Glider, hold)</b> &nbsp; <b>Button 5 (Cloak)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Glitch is the stealth-mission hero. Her cloak + remote hack combo lets her complete '
        'entire missions without direct combat — hack the security system, turn the turrets, '
        'walk out. This makes her the only hero with a meaningfully different playstyle. Her '
        'rivalry with Ironclad is a story driver: two tech geniuses with opposite philosophies '
        '(he builds, she bends). The owner specifically asked to research Spider Fighter 3\'s '
        'hacker girl, which we did — Glitch inherits her drone-deployment core but expands it '
        'with the hack-anything kit that makes the archetype feel fresh.'
    ))
    story.append(PageBreak())
    return story

def build_pulsar():
    story = []
    story.append(h1('5.7  Pulsar — The Energy Blaster'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Energy-absorbing flying blaster.  '
        '<b>Color:</b> Red, blue, and gold with glowing energy patterns.  '
        '<b>Personality:</b> Confident, military-trained, carries the weight of cosmic power.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Pulsar\'s flight is vertical in Superman pose — hands forward, body horizontal, '
        'rocketing upward or forward. Her signature mechanic is <b>energy absorption</b>: '
        'incoming damage charges her absorption meter, which can be unleashed as Binary Mode '
        '(supercharged state, all abilities enhanced). She fires photon blasts from her hands '
        'and can unleash a massive energy beam. She is the roster\'s "tank-mage" — takes '
        'hits, deals massive damage, but has fewer defensive options.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Vertical Flight (button 1, hold)', 'Start', 'Superman pose flight. Hands forward, body horizontal. Full 3D movement.'],
        ['Photon Blast (button 2)', 'Start', 'Rapid-fire energy projectiles from hands. No cooldown, low damage per shot.'],
        ['Absorb (button 3, hold)', 'Start', 'Brace stance. Incoming damage charges absorption meter instead of damaging health. Cannot move while absorbing.'],
        ['Binary Mode (button 4)', 'Start', 'Unleash absorbed energy. 10s supercharged state: photon blasts become beams, flight speed doubled, damage +50%. Requires full absorption meter.'],
        ['Energy Beam', 'Story mission 1', 'Hold button 2 to fire sustained energy beam. Higher damage, drains energy meter.'],
        ['Photon Blast Salvo', 'Story mission 2', 'While flying, fire photon blasts in 360° salvo. Crowd control. Cooldown 12s.'],
        ['Absorb Explosion', 'Credits: 2,500', 'When absorption meter is full, release button 3 to explode outward, dealing absorbed damage to all nearby enemies.'],
        ['Cosmic Awareness', 'Challenge: absorb 1000 damage total', 'Passive. Mini-map shows all enemies in 50m radius.'],
    ]
    story.append(table(powers, [CONTENT_W*0.28, CONTENT_W*0.22, CONTENT_W*0.50]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Vertical Flight, hold)</b> &nbsp; <b>Button 2 (Photon Blast / hold = Beam)</b><br/>'
        '<b>Button 3 (Absorb, hold)</b> &nbsp; <b>Button 4 (Binary Mode)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Pulsar\'s absorption mechanic is what makes her feel distinct from a generic blaster. '
        'The fantasy is "I get stronger the more you hit me," which encourages aggressive '
        'play (run into the fight, absorb damage, unleash Binary Mode). Her vertical flight '
        'pose (Superman-style) is deliberately distinct from Ironclad\'s horizontal flight '
        'and Mystic\'s levitation — three flyers, three silhouettes. She is also the best '
        'hero for vehicle emergencies that involve crashing planes (catch the plane, absorb '
        'the impact).'
    ))
    story.append(PageBreak())
    return story

def build_elasto():
    story = []
    story.append(h1('5.8  Elasto — The Elastic'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Stretchy rubber-limbed genius.  '
        '<b>Color:</b> Blue uniform with white gloves and "4" emblem.  '
        '<b>Personality:</b> Nerdy, problem-solver, treats combat like a puzzle.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Elasto stretches up to 1500 feet, deforms his body into any shape, and uses his '
        'elasticity for both combat and traversal. His signature mechanic is <b>shape-shift '
        'hands</b>: he reconfigures his hands into a hammer, shield, whip, or glider on '
        'demand. He can flatten his body to glide, inflate himself as a boulder for ground '
        'slams, and slingshot allies across the map. He is the roster\'s versatile hero — '
        'jack of all trades, master of puzzle-solving.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Stretch Punch (button 1)', 'Start', 'Elongate arm to punch enemies at range (up to 30m). Returns. Cooldown 1s.'],
        ['Flatten Glide (button 2, hold)', 'Start', 'Flatten body into a parachute-like sheet. Controlled descent from any height.'],
        ['Shape-Shift Hand (button 3, cycle)', 'Start', 'Cycle hand form: Hammer (heavy melee), Shield (block), Whip (catch enemies at range), Glider (improve flatten glide).'],
        ['Slingshot (button 4)', 'Start', 'Anchor feet, stretch backward, release to fling forward. Rapid traversal. Can slingshot allies too.'],
        ['Inflate Body', 'Story mission 1', 'Inflate into a giant boulder. Roll over enemies. Ground slam on release.'],
        ['Multi-Arm', 'Story mission 2', 'Sprout 4 extra arms. Stretch-punch 5 enemies simultaneously for 5s.'],
        ['Containment Wrap', 'Credits: 2,000', 'Wrap an enemy in elastic limbs. Immobilize for 4s. Cooldown 10s.'],
        ['Slingshot Ally', 'Challenge: slingshot 20 civilians to safety', 'Slingshot any ally across the map. Used in duo missions to launch partner into battle.'],
    ]
    story.append(table(powers, [CONTENT_W*0.28, CONTENT_W*0.22, CONTENT_W*0.50]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Stretch Punch)</b> &nbsp; <b>Button 2 (Flatten Glide, hold)</b><br/>'
        '<b>Button 3 (Shape-Shift Hand, cycle)</b> &nbsp; <b>Button 4 (Slingshot)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Elasto is the most experimental hero — his shape-shifting hand mechanic is unusual '
        'for mobile games. The cycle button (tap to cycle through 4 forms) was chosen over a '
        'radial menu because radial menus are slow on touchscreens. The form is shown as a '
        'small icon on the button itself, so the player always knows what form is active. '
        'Elasto\'s fantasy is "I have a tool for every problem" — he is the puzzle-solver, '
        'the hero you bring to missions with weird mechanics (containment, civilian '
        'relocation, multi-target takedowns).'
    ))
    story.append(PageBreak())
    return story

def build_sentinel():
    story = []
    story.append(h1('5.9  Sentinel / Hollow — The Duality'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> God-tier hero with a dark alter-ego. Inspired by Sentry/Void.  '
        '<b>Color:</b> Gold and white (Sentinel) / black and purple (Hollow).  '
        '<b>Personality:</b> Sentinel is gentle, haunted, afraid of his own power. Hollow is '
        'cruel, destructive, delighted by chaos.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Sentinel is the most powerful hero in the roster — and the most dangerous to play. '
        'His <b>duality meter</b> fills as he uses his abilities. At 50%, he can toggle into '
        'Hollow form (more powerful, but drains his health). At 100%, Hollow takes over '
        'completely (player loses control for 10s; Hollow attacks everything, including '
        'allies). The fantasy is a hero holding back, and the player must choose when to '
        'unleash the Hollow. Sentinel is the central figure of the campaign story.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Flight (button 1, hold)', 'Start', 'Standard 3D flight. No special pose — Sentinel simply floats.'],
        ['Light Blast (button 2)', 'Start', 'Fires concentrated light beam. High damage, narrow. Cooldown 2s.'],
        ['Super Strength (button 3)', 'Start', 'Melee with god-tier strength. Lifts and throws cars, mechs, enemies.'],
        ['Hollow Toggle (button 4)', 'Start', 'At 50%+ duality meter, toggle into Hollow form. Hollow abilities replace Sentinel abilities. Drains health while active.'],
        ['Hollow Tendrils (Hollow form, button 2)', 'Start (in Hollow)', 'Black tendrils strike up to 5 enemies at range.'],
        ['Hollow Reality Warp (Hollow form, button 3)', 'Story mission 1', 'Bend space. Teleport short distances, reflect projectiles.'],
        ['Hollow Aura (Hollow form, button 1)', 'Story mission 2', 'Passive damage aura. All enemies in 5m take continuous damage.'],
        ['Sentinel Aura', 'Credits: 3,500', 'In Sentinel form, passive heal aura. Allies in 5m slowly regenerate health.'],
        ['Hollow Purge', 'Challenge: defeat 200 enemies in Hollow form', 'When duality meter hits 100%, instead of losing control, Hollow Purge triggers: massive AoE blast, meter resets to 0. Player keeps control.'],
    ]
    story.append(table(powers, [CONTENT_W*0.32, CONTENT_W*0.22, CONTENT_W*0.46]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Flight / Hollow Aura)</b> &nbsp; <b>Button 2 (Light Blast / Hollow Tendrils)</b><br/>'
        '<b>Button 3 (Super Strength / Hollow Reality Warp)</b> &nbsp; <b>Button 4 (Hollow Toggle)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Sentinel is the campaign\'s emotional core. His arc is about a man terrified of '
        'his own power, and the player feels that terror mechanically: every use of his '
        'abilities brings him closer to losing control. The Hollow Purge challenge reward '
        'is the most satisfying unlock in the game — it transforms Sentinel from a hero to '
        'manage into a hero to unleash. He is also the hardest hero to play well, because '
        'greed (using Hollow too long) gets the player killed. This makes him the expert-hero '
        'of the roster, the one veteran players gravitate to.'
    ))
    story.append(PageBreak())
    return story

def build_mystic():
    story = []
    story.append(h1('5.10  Mystic — The Sorcerer'))
    story.append(hr())
    story.append(p(
        '<b>Archetype:</b> Master of the mystic arts.  '
        '<b>Color:</b> Dark red cape with arcane gold trim.  '
        '<b>Personality:</b> Cryptic, dry-witted, carries secrets he should not.'
    ))

    story.append(h2('Power Kit'))
    story.append(p(
        'Mystic is the roster\'s spellcaster. His flight is vertical levitation (no flight '
        'pose, just floating upward). His signature ability is <b>portals</b>: open a portal '
        'in front of him and another anywhere in line-of-sight, walk through to teleport. '
        'He has telekinesis (lift and throw objects/enemies), time rewind (rewind the last '
        '3 seconds of gameplay), and a mirror-dimension shield that absorbs projectiles. He '
        'is the puzzle-mission hero — many of his story missions involve portal-based '
        'platforming.'
    ))

    powers = [
        ['Power', 'Unlock', 'Description'],
        ['Portal (button 1)', 'Start', 'Open portal entry (at Mystic) and exit (at aimed location). Walk through to teleport. Cooldown 5s.'],
        ['Levitate (button 2, hold)', 'Start', 'Vertical flight. Float upward, hover, drift horizontally. No speed, full control.'],
        ['Telekinesis (button 3)', 'Start', 'Lift and throw any object or enemy. Aim, lift, throw. Cooldown 4s.'],
        ['Time Rewind (button 4)', 'Start', 'Rewind the last 3 seconds of gameplay. Restore health, undo mistakes. Cooldown 60s.'],
        ['Mirror Dimension Shield', 'Story mission 1', 'Wrap self in mirror dimension. Projectiles pass through harmlessly. 5s duration.'],
        ['Portal Punch', 'Story mission 2', 'Open a portal behind an enemy, punch through it. Hits from "behind" ignore shields.'],
        ['Mass Telekinesis', 'Credits: 3,000', 'Lift all objects in 15m radius simultaneously. Throw them all at one target.'],
        ['Time Stop', 'Challenge: defeat 50 enemies with telekinesis throws', 'Stop time for 5s in 20m radius. Only Mystic can move. Cooldown 90s.'],
    ]
    story.append(table(powers, [CONTENT_W*0.30, CONTENT_W*0.22, CONTENT_W*0.48]))

    story.append(h2('Button Layout (4 buttons)'))
    story.append(callout(
        '<b>Left stick</b> = move.  <b>Right stick</b> = camera/aim.<br/>'
        '<b>Button 1 (Portal)</b> &nbsp; <b>Button 2 (Levitate, hold)</b><br/>'
        '<b>Button 3 (Telekinesis)</b> &nbsp; <b>Button 4 (Time Rewind)</b>'
    ))

    story.append(h2('Design Notes'))
    story.append(p(
        'Mystic is the puzzle-mission hero. His portal mechanic enables level design that no '
        'other hero can engage with — maze-like missions, time-pressure platforming, '
        'shield-puzzle combat. His story missions are the most mechanically distinct in the '
        'campaign. His time rewind is the only "undo" in the game and is deliberately '
        'long-cooldown (60s) so it feels like a precious resource, not a quickload. He also '
        'holds story secrets — the campaign reveals he knows more about The Hollow than '
        'anyone, and a mid-Act-2 mission forces the player to confront him about it.'
    ))
    story.append(PageBreak())
    return story

def build_hero_roster_all():
    story = []
    story.extend(build_hero_roster_intro())
    story.extend(build_velora())
    story.extend(build_stormborn())
    story.extend(build_aegis_wing())
    story.extend(build_arachne())
    story.extend(build_ironclad())
    story.extend(build_glitch())
    story.extend(build_pulsar())
    story.extend(build_elasto())
    story.extend(build_sentinel())
    story.extend(build_mystic())
    return story
