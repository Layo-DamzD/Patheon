"""GDD Part 4 — Mission Architecture, Enemies, Bosses, HQ, UI."""
from gdd_part1 import (
    h1, h2, h3, p, pl, callout, bullets, hr, table,
    PageBreak, CONTENT_W, Spacer, Paragraph, style_body_left
)

def build_missions():
    story = []
    story.append(h1('11. Mission Architecture (5 Layers)'))
    story.append(hr())

    story.append(h2('11.1 Story vs Mission Systems — Critical Distinction'))
    story.append(p(
        'The <b>Story Campaign</b> and the <b>Mission Architecture</b> are different things '
        'that overlap. The Story Campaign is a scripted, linear, one-time narrative of 25 '
        'missions with cutscenes, dialogue, the Director/Hollow plot, and a final choice. '
        'It takes ~15 hours to complete and is played once. The Mission Architecture is the '
        'system that GENERATES missions — and the Story is just one of five layers. The '
        'other four layers run during AND after the story, providing infinite replayability.'
    ))

    story.append(callout(
        '<b>During the story:</b> Story missions play out, but crimes keep spawning, duo '
        'missions unlock, and one assemble mission hits at Act 2 climax + another at Act 3 '
        'finale.<br/>'
        '<b>After the story:</b> The 25 story missions are done forever. But the city keeps '
        'living — crimes still spawn, duo missions rotate weekly, new assemble missions '
        'appear as live-ops events, roguelike rifts open, daily challenges refresh, NG+ '
        'unlocks. The game never "ends."'
    ))

    story.append(h2('11.2 Layer 1: Story Campaign (Linear, 25 Missions)'))
    story.append(p(
        'The story campaign is ~25 missions split across three acts. Each mission advances '
        'the plot, has scripted dialogue and cutscenes, and unlocks new heroes or abilities. '
        'Story missions cannot be replayed in normal play (NG+ unlocks replay with scaled-up '
        'enemies). Act structure: Act 1 (missions 1-8, recruitment), Act 2 (missions 9-17, '
        'faction war + Director reveal), Act 3 (missions 18-25, Hollow rises + finale '
        'choice).'
    ))

    story.append(h2('11.3 Layer 2: Crime-in-Progress (Procedural, Infinite)'))
    story.append(p(
        'See Section 10. Crimes spawn continuously in every district. Procedural variation '
        'in location, enemy count, time of day, weather, civilians, and optional objectives '
        'means the same template produces hundreds of unique-feeling missions. Crimes run '
        'during AND after the story.'
    ))

    story.append(h2('11.4 Layer 3: Duo Partner Missions (Designed Pairs)'))
    story.append(p(
        'Duo missions require two specific heroes because their powers synergize. The player '
        'controls one hero; the AI controls the other (co-op in Phase 4). Each duo mission '
        'has unique combo finishers only that pair can perform. Some duo missions are part '
        'of the story campaign; others unlock post-story and rotate weekly.'
    ))

    duos = [
        ['Mission', 'Pair', 'Why Paired'],
        ['Storm & Speed', 'Velora + Stormborn', 'Velora races ahead to disarm bombs while Stormborn handles the army.'],
        ['Tech & Magic', 'Ironclad + Mystic', 'Science vs magic. Portals + repulsors. Banter-heavy.'],
        ['Brains & Brawn', 'Glitch + Titan', 'Glitch disables security while Titan smashes through.'],
        ['Web & Wing', 'Arachne + Aegis Wing', 'Both aerial. Chase a flying villain across the city.'],
        ['Light & Dark', 'Pulsar + Sentinel', 'Energy absorber + reality warper. Cosmic-level threat.'],
        ['Stretch & Smash', 'Elasto + Titan', 'Slingshot each other for combo attacks.'],
        ['Old Soldier, Young Hero', 'Aegis Wing + Arachne', 'Mentor/mentee dynamic. Classic team-up.'],
    ]
    story.append(table(duos, [CONTENT_W*0.20, CONTENT_W*0.25, CONTENT_W*0.55]))

    story.append(h2('11.5 Layer 4: Assemble Missions (Full Team)'))
    story.append(p(
        'Assemble missions are the big set-pieces. The campaign has 3-4 of these (Act 1 '
        'climax, Act 2 climax, Act 3 finale). Post-story, assemble missions rotate as '
        'weekly live-ops events. The player swaps heroes mid-mission as the situation '
        'evolves.'
    ))

    assembles = [
        ['Mission', 'Description'],
        ['City Under Siege', 'Full villain army attacks the city. Play 3 heroes in sequence, swapping as the front shifts.'],
        ['The Void Rises', 'Hollow (dark Sentinel) escapes. All 10 heroes in multi-phase boss fight. Each phase, only certain heroes\' powers work.'],
        ['Invasion Day', 'Alien invasion. Time-limited weekly event. All players contribute to global progress.'],
        ['Mirror Dimension Collapse', 'Reality is breaking. Hero-swap every 60s. Each hero must complete a mini-objective in their domain.'],
        ['The Pantheon Protocol', 'Endgame raid. 5 phases. Each requires a different hero combination.'],
    ]
    story.append(table(assembles, [CONTENT_W*0.25, CONTENT_W*0.75]))

    story.append(h2('11.6 Layer 5: Replayability Engines'))
    story.append(p(
        'Five systems generate content forever. These run alongside Layers 1-4 and keep the '
        'game alive after the story ends. See Section 18 for full detail.'
    ))

    engines = [
        ['Engine', 'Lifespan'],
        ['Daily & Weekly Challenges', 'Infinite (refreshes daily/weekly)'],
        ['Suit Hunt (Collectathon)', '~20 hours to collect all 50-80 suits'],
        ['Roguelike Mode: "Hollow Rifts"', 'Infinite (procedurally generated floors)'],
        ['Endless Mode: "Patrol"', 'Infinite (score attack)'],
        ['New Game+ (NG+)', '+15 hours (replay story with all suits, scaled enemies)'],
    ]
    story.append(table(engines, [CONTENT_W*0.40, CONTENT_W*0.60]))

    story.append(h2('11.7 Replayability Summary'))
    story.append(p(
        'A completionist player pursuing all content will find 60+ hours of gameplay. After '
        'completion, infinite replayability remains through roguelike rifts, daily '
        'challenges, and live-ops events. The game does not "end" when the credits roll — '
        'it opens up. This directly addresses the owner\'s concern that "if they complete '
        'the game it becomes boring."'
    ))

    story.append(PageBreak())
    return story

def build_enemies():
    story = []
    story.append(h1('12. Enemy Factions (5)'))
    story.append(hr())

    story.append(h2('12.1 Faction Design'))
    story.append(p(
        'Pantheon features five enemy factions, each with a unique theme, lead villain, and '
        'roster of enemy types. Factions operate independently in the open world — The '
        'Syndicate runs street crime in Midtown, the Tech Cult hacks infrastructure in '
        'Chinatown, the Mystic Order summons demons in hidden temples, and so on. The story '
        'campaign reveals that all five factions are being manipulated from behind the '
        'scenes by Director Vance (the twist).'
    ))

    factions = [
        ['Faction', 'Theme', 'Lead Villain', 'District'],
        ['The Syndicate', 'Street criminals, mobsters, enforcers', 'Kingmaker (crime boss)', 'Midtown, Sand Town'],
        ['Tech Cult', 'Hackers, drones, mechs, robots', 'ZeroDay (Glitch\'s evil counterpart)', 'Chinatown, Neon District'],
        ['Mystic Order', 'Cultists, demons, summoned beasts', 'Shadow-weaver (Mystic\'s evil counterpart)', 'Mystic Quarter, hidden temples'],
        ['Cosmic Threat', 'Aliens, energy beings', 'Eclipse (Pulsar\'s evil counterpart)', 'Beach City, sky'],
        ['The Hollow', 'Dark Sentinel\'s shadow monsters', 'The Hollow (Sentinel\'s alter-ego)', 'Anywhere (event-driven)'],
    ]
    story.append(table(factions, [CONTENT_W*0.18, CONTENT_W*0.30, CONTENT_W*0.32, CONTENT_W*0.20]))

    story.append(h2('12.2 Enemy Tiers'))
    story.append(p(
        'Every faction has five tiers of enemies, from cannon fodder to mini-bosses. Tier '
        'design is consistent across factions so the player learns the visual language '
        '(tier 1 = small and weak, tier 5 = big and dangerous) and can read encounters '
        'regardless of which faction they\'re fighting.'
    ))

    tiers = [
        ['Tier', 'Example', 'Behavior', 'Threat'],
        ['1 - Minion', 'Street Thug / Drone', 'Melee, swarm, low HP', 'Low'],
        ['2 - Ranged', 'Gunner / Laser Drone', 'Stays back, shoots', 'Low-Medium'],
        ['3 - Brute', 'Enforcer / Mech', 'Slow, heavy, high HP, knockback', 'Medium'],
        ['4 - Specialist', 'Hacker (disables abilities 3s) / Shield-bearer (immune to frontal)', 'Forces tactical adaptation', 'High'],
        ['5 - Elite', 'Named mini-boss', 'Unique mechanics, drop loot', 'Very High'],
    ]
    story.append(table(tiers, [CONTENT_W*0.15, CONTENT_W*0.30, CONTENT_W*0.40, CONTENT_W*0.15]))

    story.append(h2('12.3 Faction-Specific Mechanics'))
    story.append(p(
        'Each faction has a unique combat mechanic that distinguishes encounters. This '
        'prevents all enemy fights from feeling the same and forces the player to adapt '
        'their hero choice and tactics based on which faction they\'re facing.'
    ))

    mechanics = [
        ['Faction', 'Unique Mechanic'],
        ['The Syndicate', 'Numerical superiority. Swarms of low-HP enemies. AoE heroes excel.'],
        ['Tech Cult', 'Hackable tech. Glitch can turn their own mechs against them. EMP-vulnerable.'],
        ['Mystic Order', 'Mirror dimension shifts. Reality bends during fights. Mystic-faction only fully effective.'],
        ['Cosmic Threat', 'Energy-absorbing enemies. Pulsar\'s absorption race reversed — enemies absorb her blasts.'],
        ['The Hollow', 'Duality mechanic. Enemies shift between light/dark forms. Only one form is damageable at a time.'],
    ]
    story.append(table(mechanics, [CONTENT_W*0.22, CONTENT_W*0.78]))

    story.append(PageBreak())
    return story

def build_bosses():
    story = []
    story.append(h1('13. Boss Design (10 Bosses)'))
    story.append(hr())

    story.append(h2('13.1 One Boss Per Hero'))
    story.append(p(
        'Each of the 10 heroes has a nemesis — a boss designed specifically to test that '
        'hero\'s kit. Boss fights are multi-phase (3+ phases), have a hero-specific '
        'mechanic that only that hero\'s powers can solve, and include a mid-fight '
        'suit-switch moment (cosmetic, but signals the phase change). Each boss ends with '
        'a cinematic slow-mo finisher.'
    ))

    bosses = [
        ['Boss', 'Counter-Hero', 'Boss Mechanic'],
        ['Kingmaker', 'Aegis Wing', 'Brute fight. Throws objects, summons minions. Must ricochet shield off walls to hit weak point on his back.'],
        ['ZeroDay', 'Glitch', 'Hacks your controls (buttons remap randomly for 3s). Drone swarm. EMP bursts. Must counter-hack her systems.'],
        ['Shadow-weaver', 'Mystic', 'Mirror dimension fight. Portal puzzles between phases. Must redirect her own spells through portals.'],
        ['Eclipse', 'Pulsar', 'Energy absorption race. Out-pace her or she heals. Must dodge her blasts to charge your own meter faster.'],
        ['The Hollow', 'Sentinel', 'Duality meter fight. Phases shift between Sentinel form (light weak) and Hollow form (dark weak).'],
        ['Venomfang', 'Arachne', 'Symbiote. Camouflages, counters web. Must use Spider-Sense Dodge timing to expose weak point.'],
        ['Crimson Dynamo', 'Ironclad', 'Armor duel. Must exploit weak points (joint gaps) with repulsor precision shots. AI Assist marks weak points.'],
        ['Godspeed', 'Velora', 'Speed duel. Slow-time race through falling debris maze. Phase 2: pure chase across the city.'],
        ['Trickster', 'Stormborn', 'Illusions + clones. Must find the real Trickster among 5 clones. Hammer throw reveals the real one.'],
        ['Titan-Killer', 'Elasto / Sentinel', 'Giant mech. Shadow-of-the-Colossus-style climb-on-body fight. Destroy joints from inside.'],
    ]
    story.append(table(bosses, [CONTENT_W*0.18, CONTENT_W*0.18, CONTENT_W*0.64]))

    story.append(h2('13.2 Boss Fight Design Rules'))
    story.append(bullets([
        '<b>Multi-phase (3+ phases)</b> — each phase has different mechanics. Phase transitions trigger at HP thresholds (66%, 33%).',
        '<b>Hero-specific mechanic</b> — only the counter-hero\'s kit can complete a key phase. Other heroes can fight but cannot finish.',
        '<b>Cinematic finisher</b> — final blow triggers a slow-mo cinematic. Unique per boss. Reusable in NG+.',
        '<b>No health sponges</b> — bosses have meaningful HP but phases are about mechanics, not DPS checks.',
        '<b>Limited adds</b> — bosses summon minions in controlled waves. Never overwhelming. Minions are phase transitions, not constant.',
        '<b>Checkpoint per phase</b> — if player dies at phase 2, they restart at phase 2, not phase 1.',
    ]))

    story.append(h2('13.3 Final Boss: The Hollow (Assemble Mission)'))
    story.append(p(
        'The campaign\'s final boss is The Hollow — Sentinel\'s dark half fully unleashed. '
        'This is an assemble mission where all 10 heroes participate across 5 phases. Each '
        'phase, only certain heroes\' powers can damage The Hollow. The player swaps heroes '
        'between phases. The finale choice (destroy the Godstone vs preserve Sentinel) '
        'plays after the final phase.'
    ))

    story.append(PageBreak())
    return story

def build_hq_phone():
    story = []
    story.append(h1('14. HQ & Hero Phone Systems'))
    story.append(hr())

    story.append(h2('14.1 The Citadel (HQ)'))
    story.append(p(
        'The Citadel is the Pantheon HQ — a helicarrier hovering above the city. It serves '
        'as the hub between missions. The player accesses it from the Hero Phone (instant '
        'fast-travel) or by flying up to it in the open world. The Citadel contains several '
        'rooms, each with a specific function.'
    ))

    rooms = [
        ['Room', 'Function'],
        ['Wardrobe', 'Try on/switch suits, see unlock requirements, preview in 3D.'],
        ['Ability Console', 'Spend Credits on upgrades, respec for free, view challenge progress.'],
        ['War Room', 'Pick story missions, see world map with active crime hotspots, accept weekly challenges.'],
        ['Hero Roster', 'Switch active hero. View all unlocked heroes. See unlock requirements for locked heroes.'],
        ['Training Room', 'Practice each hero\'s kit against bots. Tutorial mode. Combo practice.'],
        ['Vault', 'Collectibles, lore documents, concept art, cutscene replay.'],
        ['AI Console', 'Talk to AI assistant for tips, hero recommendations for missions, lore questions.'],
        ['Briefing Room', 'Story cutscenes play here. Director gives mission briefings.'],
    ]
    story.append(table(rooms, [CONTENT_W*0.20, CONTENT_W*0.80]))

    story.append(h2('14.2 Hero Phone'))
    story.append(p(
        'The Hero Phone is the diegetic UI accessible mid-game. Tapping the phone button '
        '(top-right corner of screen) overlays the phone UI without pausing the game. The '
        'phone contains several apps, each with a specific function. The phone is the '
        'primary way to interact with mission systems without returning to The Citadel.'
    ))

    apps = [
        ['App', 'Function'],
        ['Mission Alerts', 'Crime-in-progress notifications. Accept/decline. Filter by district or difficulty.'],
        ['Suit Selector', 'Quick-swap suit mid-mission. 2-second transformation animation. No gameplay effect.'],
        ['City Map', 'Live map with active crime hotspots, vehicle schedules (planes/trains/boats), and fast-travel.'],
        ['HQ Comms', 'Director briefings. Hero-to-hero comms in duo missions. Call for HQ support (rare, mission-specific).'],
        ['Stats & Skill Tree', 'View hero stats, upgrade tree, challenge progress.'],
        ['Daily/Weekly Challenges', 'View active challenges, progress, rewards.'],
        ['Hero Roster', 'Switch active hero mid-mission (with 5-second cooldown).'],
    ]
    story.append(table(apps, [CONTENT_W*0.25, CONTENT_W*0.75]))

    story.append(h2('14.3 Phone Design Rules'))
    story.append(bullets([
        '<b>Never pauses the game</b> — opening the phone is a tactical decision. The world keeps moving.',
        '<b>Always one tap away</b> — phone button is permanently in the top-right corner. Never hidden.',
        '<b>Quick-actions</b> — most-used functions (suit swap, hero swap, accept mission) are one tap deep.',
        '<b>Voice alerts</b> — Director speaks mission alerts aloud. Phone shows them as text too.',
        '<b>Hero-to-hero comms</b> — in duo missions, the partner hero speaks through the phone. Banter plays here.',
    ]))

    story.append(PageBreak())
    return story

def build_ui():
    story = []
    story.append(h1('15. UI & Controls (Hero-Specific)'))
    story.append(hr())

    story.append(h2('15.1 Touch Controls Architecture'))
    story.append(p(
        'Pantheon uses a twin-stick touch control scheme: a left virtual joystick (move) '
        'and a right virtual joystick (camera/aim), both implemented with nipplejs. Action '
        'buttons are DOM elements arranged in a semicircle around the right joystick. The '
        'number of action buttons varies by hero — Velora has 5, Stormborn has 4, '
        'Ironclad has 5, etc. This hero-specific button count is a deliberate design rule.'
    ))

    story.append(h2('15.2 Why Hero-Specific Button Counts'))
    story.append(p(
        'A common mobile-game mistake is forcing all heroes into a fixed 4-button layout '
        '(A/B/X/Y). This leads to one of two failures: either some heroes have dead buttons '
        '(bad — feels unfinished) or some heroes cram too many abilities onto too few '
        'buttons via hold/tap modifiers (bad — feels fiddly). Pantheon\'s solution is to '
        'let each hero have the button count their kit demands. Velora needs 5 because she '
        'has Jog AND Sprint as separate buttons (per owner spec). Stormborn needs only 4 '
        'because his kit is elegant. The player learns each hero\'s layout in the Training '
        'Room before field deployment.'
    ))

    story.append(h2('15.3 Universal UI Elements'))
    story.append(p(
        'Regardless of which hero is active, certain UI elements are always present and '
        'always in the same location. This creates a consistent frame that the player can '
        'rely on while the hero-specific buttons change.'
    ))

    ui_elements = [
        ['Element', 'Location', 'Function'],
        ['Left Joystick', 'Bottom-left', 'Move (always).'],
        ['Right Joystick', 'Bottom-right', 'Camera + aim (always).'],
        ['Hero Portrait + Health', 'Top-left', 'Hero face, health bar, duality meter (if Sentinel).'],
        ['Mini-Map', 'Top-right', 'Live district map with crime hotspots.'],
        ['Mission Tracker', 'Below mini-map', 'Current mission objective + distance.'],
        ['Phone Button', 'Top-right corner', 'Always accessible. Opens phone UI.'],
        ['Action Buttons', 'Arc around right joystick', 'Hero-specific. 4-5 buttons.'],
        ['Pause Button', 'Top-left corner', 'Pauses game. Settings. Quit.'],
    ]
    story.append(table(ui_elements, [CONTENT_W*0.22, CONTENT_W*0.25, CONTENT_W*0.53]))

    story.append(h2('15.4 Button Layouts Per Hero'))
    story.append(p(
        'Each hero\'s button layout is documented in their hero section (Section 5). The '
        'layouts are designed so that the most-used abilities are easiest to reach (closest '
        'to the right joystick), and situational abilities are further out. Hold-to-modify '
        'buttons (e.g., Ironclad\'s "tap = Vertical Launch, hold = Horizontal Flight") are '
        'used sparingly — only when the two abilities are clearly related.'
    ))

    story.append(h2('15.5 Input Latency Budget'))
    story.append(p(
        'Touch input latency is the single most important performance metric for a mobile '
        'action game. Pantheon targets <60ms input-to-action latency. The right joystick '
        '(camera) is the most latency-sensitive — any delay causes motion sickness. Action '
        'buttons allow 80ms (slightly less critical). All input is processed on the main '
        'thread, before rendering, to avoid frame-delay.'
    ))

    story.append(PageBreak())
    return story
