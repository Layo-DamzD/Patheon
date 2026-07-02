"""GDD Part 5 — Art Direction, Story, Replayability, Roadmap, Phase 0, Appendix."""
from gdd_part1 import (
    h1, h2, h3, p, pl, callout, bullets, hr, table,
    PageBreak, CONTENT_W, Spacer, Paragraph, style_body_left
)

def build_art():
    story = []
    story.append(h1('16. Art Direction'))
    story.append(hr())

    story.append(h2('16.1 Visual Style: Stylized Realism'))
    story.append(p(
        'Pantheon\'s visual style is "stylized realism" — a middle ground between photorealism '
        '(too expensive, ages badly) and cartoon stylization (too childish for the story\'s '
        'tone). The reference frame is <b>Spider-Man: Into the Spider-Verse</b> meets '
        '<b>Insomniac\'s Spider-Man PS4</b>: realistic lighting, PBR materials, dynamic '
        'shadows, and weather effects, but characters have slightly exaggerated proportions '
        'and bold color palettes that read clearly at phone-screen sizes. This approach '
        'looks polished, runs smoothly on mobile hardware, and ages well over time.'
    ))

    story.append(h2('16.2 Comparison to Spider Fighter 3'))
    story.append(p(
        'Spider Fighter 3 is visually rough: flat textures, basic geometry, limited lighting. '
        'Pantheon will exceed it on every visual axis. The following comparison is honest — '
        'we cannot match AAA console graphics, but we can absolutely beat a $0 mobile game.'
    ))

    comparison = [
        ['Aspect', 'Spider Fighter 3', 'Pantheon', 'Verdict'],
        ['City detail', 'Flat textures, basic buildings', 'PBR materials, dynamic lighting, reflective glass, day/night', 'Pantheon wins'],
        ['Character models', 'Stylized mobile-quality', 'Stylized but higher-poly, better animations', 'Pantheon wins'],
        ['Physics', 'Basic swing, no real momentum', 'Rapier physics — true momentum, weight, ragdoll', 'Pantheon wins'],
        ['Combat feel', 'Floaty, simple', 'Hit reactions, impact frames, slow-mo finishers', 'Pantheon wins'],
        ['Crowds/civilians', 'Sparse', 'Dense crowds with panic AI (flee from crime)', 'Pantheon wins'],
        ['Traffic', 'Few cars', 'Persistent traffic + planes + trains + boats', 'Pantheon wins significantly'],
        ['Destruction', 'None', 'Destructible props (chairs, windows, cars dent)', 'Pantheon wins'],
        ['Weather', 'Static', 'Rain (wet streets reflect), fog, storms', 'Pantheon wins'],
        ['Day/night', 'Limited', 'Full cycle, crimes change by time', 'Pantheon wins'],
        ['Cutscenes', 'Minimal', 'Cinematic camera, dialogue, banter', 'Pantheon wins'],
    ]
    story.append(table(comparison, [CONTENT_W*0.18, CONTENT_W*0.27, CONTENT_W*0.40, CONTENT_W*0.15]))

    story.append(h2('16.3 Honest Limits'))
    story.append(p(
        'We will not match AAA console graphics (Spider-Man 2 PS5, etc.) — that is a $300M '
        'budget. We will not have photorealistic faces — stylized characters avoid the '
        'uncanny valley. We will exceed Spider Fighter 3\'s mobile quality easily — that '
        'game is visually rough, and Three.js with good art direction beats it without '
        'effort. The goal is "best-looking mobile superhero game," not "competitive with '
        'PS5 exclusives."'
    ))

    story.append(h2('16.4 Hero Silhouettes'))
    story.append(p(
        'Each hero must be identifiable by silhouette alone — even with the camera zoomed '
        'out. This is achieved through distinct body shapes, cape/wing/weapon outlines, and '
        'unique idle animations. Velora is lithe and leans forward (always ready to run). '
        'Stormborn is broad with a hammer at his side. Aegis Wing has wings folded behind. '
        'Arachne is crouched with webs at the ready. Ironclad is bulky with glowing palms. '
        'Glitch is slim with a drone orbiting. Pulsar hovers with energy aura. Elasto has '
        'elongated limbs. Sentinel is statuesque with a glowing aura. Mystic floats with '
        'cape billowing.'
    ))

    story.append(h2('16.5 Color Language'))
    story.append(p(
        'Each hero has a primary color that identifies them at a glance. Velora = electric '
        'blue. Stormborn = royal blue with red cape. Aegis Wing = tactical gray with '
        'red/white/blue. Arachne = red and black. Ironclad = crimson and gold. Glitch = '
        'cyan with neon green. Pulsar = red, blue, gold. Elasto = blue with white. Sentinel '
        '= gold and white (Hollow = black and purple). Mystic = dark red with gold trim. '
        'These colors are consistent across all suits — even cosmetic suits retain the '
        'hero\'s primary color identity.'
    ))

    story.append(PageBreak())
    return story

def build_story():
    story = []
    story.append(h1('17. Story & Campaign'))
    story.append(hr())

    story.append(h2('17.1 Setting'))
    story.append(p(
        'A modern superhero universe. Heroes have existed for ~10 years. The world knows '
        'about them. There is a secret government agency called <b>The Aegis Directive</b> '
        '(SHIELD equivalent) that coordinates hero activity. Their flying HQ is <b>The '
        'Citadel</b> — a helicarrier. The Pantheon Initiative is a formal team of 10 heroes '
        'who operate out of The Citadel, organized by Director Vance.'
    ))

    story.append(h2('17.2 The Director'))
    story.append(p(
        '<b>Director Vance</b> is the Nick Fury archetype. Gruff, one eye, wears a long '
        'coat, knows more than he tells anyone. He founded the Pantheon Initiative. He is '
        'morally grey — not a villain, but willing to make hard calls that the heroes '
        'despise. The mid-campaign twist reveals he has been secretly manipulating the '
        'factions to gather the Godstone fragments, intending to destroy the Godstone '
        '(and Sentinel with it) to permanently end the Hollow threat. His logic is sound; '
        'his methods are unforgivable. The player chooses whether to side with him at the '
        'finale.'
    ))

    story.append(h2('17.3 The Threat: The Hollow'))
    story.append(p(
        'Long ago, a cosmic entity called <b>The Hollow</b> tried to consume reality. It '
        'was defeated and sealed inside a human vessel — that vessel is <b>Sentinel</b>. '
        'The Hollow is Sentinel\'s dark half. As long as Sentinel stays balanced (good), '
        'The Hollow sleeps. But someone is trying to wake The Hollow. The campaign\'s '
        'central mystery is who, and why.'
    ))

    story.append(h2('17.4 The McGuffin: The Godstone'))
    story.append(p(
        'An ancient cosmic artifact, shattered into <b>5 fragments</b> centuries ago. Each '
        'fragment was hidden with a different faction. If all 5 are reunited, The Hollow '
        'breaks free. The 5 factions don\'t know what they truly hold — they think the '
        'fragments are just powerful relics. But Director Vance is manipulating them to '
        'gather the fragments — not to free The Hollow, but to <b>destroy</b> The Hollow '
        'permanently by destroying the Godstone. He believes killing Sentinel (and The '
        'Hollow inside him) is the only way to save the world.'
    ))

    story.append(h2('17.5 Three-Act Structure'))

    story.append(h3('Act 1: Recruitment (Missions 1-8)'))
    story.append(p(
        'Each of the 10 heroes gets a "recruitment mission" where Director Vance brings '
        'them into the Pantheon. These are solo missions with low stakes, designed to '
        'introduce each hero\'s kit. Crime-in-Progress events start appearing in the open '
        'world. The Director hints that "something" is moving in the criminal underworld. '
        'The first Godstone fragment is mentioned. The tone is light, Marvel-Cinematic.'
    ))

    story.append(h3('Act 2: The Faction War (Missions 9-17)'))
    story.append(p(
        'The 5 factions all activate at once, each making a play for power. Duo missions '
        'begin (heroes must pair up). Sentinel starts having "episodes" — blackouts, '
        'violent outbursts. The Hollow is stirring. Heroes retrieve Fragment 1, then '
        'Fragment 2... but each retrieval makes Sentinel worse. Ironclad (tech genius) '
        'discovers the Director has been lying about something. Mid-act reveal: The '
        'Director is collecting fragments on the side. The heroes fracture — some trust '
        'Vance, some don\'t. The first major Assemble mission hits at the Act 2 climax: '
        '"City Under Siege."'
    ))

    story.append(h3('Act 3: The Hollow Rises (Missions 18-25)'))
    story.append(p(
        'The Director\'s plan is exposed. Heroes fracture further — some side with him '
        '(sacrifice Sentinel), some refuse (find another way). The Hollow partially breaks '
        'free mid-Act 3. Sentinel loses control. Massive destruction. The second Assemble '
        'mission: all 10 heroes fight The Hollow together. Each phase requires a specific '
        'hero\'s power to damage The Hollow. Final mission: <b>The Choice</b>.'
    ))

    story.append(h2('17.6 The Final Choice'))
    story.append(callout(
        '<b>Option A: Destroy the Godstone.</b> Sentinel dies. The Hollow dies. World is '
        'safe forever. Bittersweet ending. Sentinel\'s funeral plays. The remaining 9 '
        'heroes carry his memory.<br/><br/>'
        '<b>Option B: Refuse to sacrifice Sentinel.</b> Heroes must find a way to balance '
        'Sentinel\'s duality permanently. Sentinel lives, but The Hollow can return someday. '
        'Hopeful but risky ending. Sentinel walks away from the team to find himself.'
    ))

    story.append(h2('17.7 Side Stories (Interwoven)'))
    side = [
        ['Hero', 'Side Arc'],
        ['Velora', 'Comes to terms with her power being a gift, not a curse. Saves the team in a key moment with her Air-Run.'],
        ['Ironclad vs Glitch', 'Tech rivalry — old money genius vs street-smart hacker. They learn to respect each other in a duo mission.'],
        ['Arachne & Aegis Wing', 'Mentor/mentee dynamic. Aegis Wing is a veteran, Arachne is the rookie.'],
        ['Sentinel', 'He\'s terrified of The Hollow. Several missions are him almost losing control. Player must play carefully.'],
        ['Mystic', 'Knows more about The Hollow than anyone. Has been holding back information. Confrontation mission mid-Act 2.'],
        ['Stormborn', 'Fish-out-of-water comedy. Boisterous thunder god in a modern city. Surprisingly wise when it matters.'],
        ['Pulsar', 'Military past catches up with her. A mission reveals her old commander is now a villain.'],
        ['Elasto', 'His family (the "Four") are referenced but never appear. Hints at a larger world.'],
    ]
    story.append(table(side, [CONTENT_W*0.20, CONTENT_W*0.80]))

    story.append(h2('17.8 Tone'))
    story.append(p(
        'The tone is Marvel Cinematic Universe energy: humor, banter, spectacle, but real '
        'stakes. Each hero has a distinct personality, they bicker, they bond. The Director '
        'is morally grey, not a villain — the player understands his logic even if they '
        'disagree. The ending is emotionally weighty, not just "yay we won." The post-credits '
        'scene hints at a new faction emerging in the shadows, teasing future content '
        '(Neon District, Mystic Quarter, etc.).'
    ))

    story.append(PageBreak())
    return story

def build_replayability():
    story = []
    story.append(h1('18. Replayability Systems'))
    story.append(hr())

    story.append(h2('18.1 The "Boring After Completion" Problem'))
    story.append(p(
        'The owner identified the core problem: "if they complete the game it becomes '
        'boring." This is the failure mode of every linear superhero game. Pantheon solves '
        'it with five replayability engines that activate after story completion. These '
        'systems generate content forever, ensuring the game is never "done."'
    ))

    story.append(h2('18.2 Engine 1: Daily & Weekly Challenges'))
    story.append(bullets([
        '<b>Daily Hero Challenge</b> — Play 1 specific hero, complete 3 random crimes. Reward: 300-500 Credits. Refreshes every 24 hours.',
        '<b>Weekly Duo Challenge</b> — Specific hero pair, harder mission. Reward: 1000-1500 Credits + cosmetic. Refreshes every 7 days.',
        '<b>Weekly Assemble</b> — Co-op (or solo with AI), big reward. Refreshes every 7 days.',
        '<b>Hero of the Week</b> — One hero gets bonus XP all week. Encourages rotating the roster.',
    ]))

    story.append(h2('18.3 Engine 2: Suit Hunt (Collectathon)'))
    story.append(p(
        '50-80 suits total at launch, unlocked through story, missions, collectibles, '
        'challenges, and milestones. Hidden collectibles in the open world reward '
        'exploration. Specific challenge completions reward mastery. This is weeks of '
        'gameplay for a completionist, and every suit is a meaningful visual reward '
        '(cosmetic only, per Section 6).'
    ))

    story.append(h2('18.4 Engine 3: Roguelike Mode — "Hollow Rifts"'))
    story.append(p(
        'Endgame mode. Portals open in the city. Enter one to access a procedurally '
        'generated dungeon with 10 floors. Pick a hero at entry. Every 3 floors, pick a '
        'buff (more speed, more damage, etc.). If you die, you lose the run. Boss at floor '
        '10. Leaderboards track deepest runs. Hollow Rifts are the primary endgame content '
        'for solo players.'
    ))

    story.append(h2('18.5 Engine 4: Endless Mode — "Patrol"'))
    story.append(p(
        'Free-roam the city with no mission tracker. Crimes spawn infinitely. See how long '
        'you last without going down. Score attack. Leaderboards. This is the "zen mode" '
        'for players who just want to swing/fly/run around the city and beat up bad guys '
        'indefinitely.'
    ))

    story.append(h2('18.6 Engine 5: New Game+ (NG+)'))
    story.append(p(
        'After finishing the story, replay with: all suits unlocked from start, enemies '
        'scaled up, new dialogue and banter (heroes reference the playthrough), "Director\'s '
        'Cut" harder story missions. NG+ is for players who want to replay the story with '
        'all toys unlocked. NG+ completion is the true 100% marker.'
    ))

    story.append(h2('18.7 Future: Living City (Live-Ops)'))
    story.append(p(
        'Post-launch (if the owner continues development), weekly villain events would have '
        'a specific villain take over part of the city for a week. Seasonal events '
        '(Halloween horror-themed crimes, Christmas snowy city) refresh the world. This '
        'requires ongoing content creation and is therefore optional for a personal project. '
        'The four replayability engines above are sufficient for endless play without '
        'live-ops.'
    ))

    story.append(h2('18.8 Total Content Estimate'))
    total = [
        ['System', 'Lifespan'],
        ['Story missions', '~15 hours'],
        ['Crime-in-Progress (procedural)', 'Infinite'],
        ['Duo missions (7 designed)', '~10 hours'],
        ['Assemble missions', '~5 hours + replayable'],
        ['Suit hunt (50-80 suits)', '~20 hours'],
        ['Roguelike "Hollow Rifts"', 'Infinite'],
        ['Daily/weekly challenges', 'Infinite'],
        ['NG+', '+15 hours'],
        ['Total for completionist', '60+ hours'],
        ['Forever-content (post-completion)', 'Infinite'],
    ]
    story.append(table(total, [CONTENT_W*0.55, CONTENT_W*0.45]))

    story.append(PageBreak())
    return story

def build_roadmap():
    story = []
    story.append(h1('19. Phase Roadmap (0-4)'))
    story.append(hr())

    story.append(h2('19.1 Phased Development'))
    story.append(p(
        'Pantheon is built in five phases. Each phase ends with a playable build that the '
        'owner can install on their phone and test. The vibe-coder workflow (play, report '
        'feel issues, AI tunes) operates continuously within each phase.'
    ))

    phases = [
        ['Phase', 'Scope', 'End State', 'Owner Playtime'],
        ['Phase 0', 'Prototype: 1 hero, 1 district, 1 crime type', 'Velora in Midtown. Jog, sprint, wall-run, water-run, slow-time, lightning. Basic enemy. Bank robbery crime.',
         'First playable. Proves the core feel.'],
        ['Phase 1', '3-Hero Switcher', 'Add Ironclad + Arachne. Hero-select menu. Each has unique movement + combat. Two more crime types.',
         'Three distinct playstyles. Core loop proven.'],
        ['Phase 2', 'Full Roster', 'All 10 heroes playable, each with unique kit. All 4 districts. All crime types. Vehicle emergencies.',
         'Full game breadth. No story yet.'],
        ['Phase 3', 'Content', 'Full campaign (25 missions). All 5 factions. All 10 bosses. HQ. Hero Phone. Suits. Progression.',
         'Complete game. Story plays start to finish.'],
        ['Phase 4', 'Advanced', 'Hero-swap mid-mission. Team-up combos. Destructible environment. Roguelike rifts. NG+.',
         'Things Spider Fighter 3 doesn\'t have.'],
    ]
    story.append(table(phases, [CONTENT_W*0.10, CONTENT_W*0.25, CONTENT_W*0.45, CONTENT_W*0.20]))

    story.append(h2('19.2 Phase Dependencies'))
    story.append(p(
        'Phases are strictly sequential — each builds on the previous. No skipping ahead. '
        'Phase 0 must feel right before Phase 1 begins (if the speedster doesn\'t feel '
        'good, the whole game is in trouble). Phase 1 must prove the hero-variety fantasy '
        'before committing to all 10 heroes in Phase 2. This staged approach prevents '
        'building content on a broken foundation.'
    ))

    story.append(PageBreak())
    return story

def build_phase0():
    story = []
    story.append(h1('20. Phase 0 Detailed Plan'))
    story.append(hr())

    story.append(h2('20.1 Goal: Prove the Feel'))
    story.append(p(
        'Phase 0 has one job: prove that controlling Velora feels good. If sprinting through '
        'the city, running up walls, and slowing time to lightning-throw a thug is fun, the '
        'whole project is worth continuing. If it feels floaty, laggy, or unsatisfying, we '
        'stop and tune until it does. No new heroes, no story, no progression — just the '
        'core feel of one hero in one district.'
    ))

    story.append(h2('20.2 Scope'))

    scope = [
        ['Element', 'Included in Phase 0', 'Notes'],
        ['Hero', 'Velora only', 'Jog, Sprint, Wall-Run, Water-Run, Slow Time, Throw Lightning'],
        ['District', 'Midtown only', 'Small city block. ~10 buildings. 1 water feature for water-run test.'],
        ['Crime Type', 'Bank robbery only', '1 crime template. Spawns every 2 min.'],
        ['Enemy Type', 'Street Thug (tier 1)', 'Idle → chase → attack AI. No ranged. No brutes.'],
        ['Controls', 'Touch joystick + 5 buttons', 'Velora\'s button layout (Section 5.1).'],
        ['UI', 'Minimal HUD', 'Health bar, mini-map, mission tracker. No phone UI yet.'],
        ['Progression', 'None', 'All Velora abilities unlocked from start. No Credits. No suits.'],
        ['Story', 'None', 'No cutscenes, no dialogue. Pure gameplay sandbox.'],
        ['Suits', '1 (Classic) only', 'No suit selector.'],
        ['Save System', 'None', 'Refresh resets progress. Not needed for prototype.'],
    ]
    story.append(table(scope, [CONTENT_W*0.18, CONTENT_W*0.32, CONTENT_W*0.50]))

    story.append(h2('20.3 Build Steps'))
    story.append(bullets([
        '<b>Step 1: Project scaffold</b> — Next.js + R3F + Rapier + nipplejs. Deploy empty scene to Vercel.',
        '<b>Step 2: City block</b> — Procedurally place 10 buildings. Add water feature. Add ground plane. Basic PBR materials.',
        '<b>Step 3: Velora model</b> — Mixamo humanoid rig. Idle/run/jog animations. Third-person camera follow.',
        '<b>Step 4: Touch controls</b> — nipplejs left/right joysticks. 5 action buttons. Test input latency.',
        '<b>Step 5: Jog + Sprint</b> — Movement physics. Jog = walk speed. Sprint = super speed with motion blur.',
        '<b>Step 6: Wall-Run</b> — Collision detection on walls. Modified gravity while wall-running. Auto-disengage at corners.',
        '<b>Step 7: Water-Run</b> — Collision detection on water surface during sprint. Floatation Mode fallback.',
        '<b>Step 8: Slow Time</b> — Time-scale toggle. Velora unaffected. Visual filter (desaturation, vignette).',
        '<b>Step 9: Throw Lightning</b> — Aim with right stick. Projectile physics. Stun on hit.',
        '<b>Step 10: Enemy AI</b> — Street Thug. Spawn at bank. Idle until player approaches. Chase. Melee attack.',
        '<b>Step 11: Bank robbery crime</b> — Spawns every 2 min. Player defeats thugs. Crime resolves. Credits not awarded (no progression yet).',
        '<b>Step 12: Polish pass</b> — Tune speeds, camera distance, motion blur intensity, lightning range, enemy HP. Iterate based on feel.',
        '<b>Step 13: Deploy + install</b> — Push to Vercel. Owner installs PWA on phone. Plays. Reports feel issues.',
        '<b>Step 14: Tune loop</b> — Owner reports "X feels wrong." AI adjusts constants. Redeploy. Repeat until feel is right.',
    ]))

    story.append(h2('20.4 Success Criteria'))
    story.append(p(
        'Phase 0 is complete when the owner can install the PWA on their phone and answer '
        '"yes" to all of these questions:'
    ))
    story.append(bullets([
        'Does sprinting through Midtown feel exhilarating? (Motion blur, sound, world-blur all working)',
        'Does wall-running feel natural? (Auto-engages when I sprint at a wall, disengages when I stop)',
        'Does water-running feel like a flex? (Skim across the surface, slow-time to appreciate it)',
        'Does slow-time feel powerful? (Enemies crawl, I move normally, lightning throw is satisfying)',
        'Does the camera feel good? (Right distance, smooth follow, no clipping through walls)',
        'Are the touch controls responsive? (No lag on button presses, joystick feels precise)',
        'Is the frame rate acceptable? (No stutter during sprint, no drop during slow-time)',
    ]))

    story.append(h2('20.5 What Phase 0 Does NOT Include'))
    story.append(bullets([
        'No other heroes (Ironclad, Arachne, etc. come in Phase 1).',
        'No other districts (Chinatown, Sand Town, Beach City come in Phase 2).',
        'No story, no cutscenes, no dialogue (Phase 3).',
        'No suits beyond the default (Phase 3).',
        'No progression system, no Credits, no upgrades (Phase 3).',
        'No vehicle emergencies (Phase 2).',
        'No bosses (Phase 3).',
        'No Hero Phone UI (Phase 3).',
        'No HQ / The Citadel (Phase 3).',
    ]))

    story.append(PageBreak())
    return story

def build_appendix():
    story = []
    story.append(h1('21. Appendix: Hero Power Reference'))
    story.append(hr())

    story.append(h2('21.1 Quick Reference Table'))
    story.append(p(
        'A condensed reference of every hero\'s power kit. For full details, see Section 5. '
        'This table is intended as a quick lookup during gameplay tuning.'
    ))

    ref = [
        ['Hero', 'Movement', 'Combat', 'Special', 'Buttons'],
        ['Velora', 'Sprint, wall-run, water-run, air-run', 'Lightning throw, tornado', 'Slow time, walk through walls', '5'],
        ['Stormborn', 'Ride hammer (horizontal flight)', 'Hammer throw (horizontal), lightning strike', 'Storm call, thunder slam', '4'],
        ['Aegis Wing', 'Fly (mechanical wings)', 'Shield throw (ricochet), shield bash', 'Drone deploy, dive-bomb', '4'],
        ['Arachne', 'Web-swing, web-wing glide, wall-crawl', 'Web-shoot, web-yank', 'Web-zip, web-shield, spider-sense', '4'],
        ['Ironclad', 'Horizontal flight (vertical launch only)', 'Repulsor, unibeam, missiles', 'AI assist, mini-drones', '5'],
        ['Glitch', 'Hover-glider flight', 'Hack, drone swarm, EMP', 'Cloak (invisibility)', '5'],
        ['Pulsar', 'Vertical flight (Superman pose)', 'Photon blast, energy beam', 'Absorb, Binary Mode', '4'],
        ['Elasto', 'Flatten glide, slingshot', 'Stretch punch, shape-shift hand', 'Inflate body, multi-arm', '4'],
        ['Sentinel/Hollow', 'Flight (levitate)', 'Light blast / Hollow tendrils', 'Hollow Toggle (duality meter)', '4'],
        ['Mystic', 'Levitate (vertical flight)', 'Telekinesis, portal punch', 'Portal, time rewind, time stop', '4'],
    ]
    story.append(table(ref, [CONTENT_W*0.13, CONTENT_W*0.22, CONTENT_W*0.22, CONTENT_W*0.28, CONTENT_W*0.10]))

    story.append(h2('21.2 Boss Quick Reference'))
    boss_ref = [
        ['Boss', 'Counter-Hero', 'Key Mechanic'],
        ['Kingmaker', 'Aegis Wing', 'Brute + summons. Ricochet shield to hit back weak point.'],
        ['ZeroDay', 'Glitch', 'Hacks your controls. Counter-hack her.'],
        ['Shadow-weaver', 'Mystic', 'Mirror dimension. Portal puzzles.'],
        ['Eclipse', 'Pulsar', 'Energy absorption race. Out-pace her.'],
        ['The Hollow', 'Sentinel', 'Duality phases. Light/dark form damageable.'],
        ['Venomfang', 'Arachne', 'Symbiote. Camouflages. Spider-sense timing.'],
        ['Crimson Dynamo', 'Ironclad', 'Armor duel. Weak points at joints.'],
        ['Godspeed', 'Velora', 'Speed duel. Slow-time race + chase.'],
        ['Trickster', 'Stormborn', 'Illusions + clones. Find the real one.'],
        ['Titan-Killer', 'Elasto / Sentinel', 'Giant mech. Climb-on-body fight.'],
    ]
    story.append(table(boss_ref, [CONTENT_W*0.20, CONTENT_W*0.20, CONTENT_W*0.60]))

    story.append(h2('21.3 District Quick Reference'))
    district_ref = [
        ['District', 'Theme', 'Hero Affinity'],
        ['Midtown', 'Downtown skyscrapers', 'Ironclad, Arachne, Aegis Wing'],
        ['Chinatown', 'Dense streets, neon', 'Arachne, Glitch, Mystic'],
        ['Sand Town', 'Desert, scrapyards', 'Aegis Wing, Stormborn, Elasto'],
        ['Beach City', 'Coastline, piers', 'Pulsar, Aegis Wing, Velora'],
        ['Neon District (future)', 'Cyberpunk', 'Glitch'],
        ['Mystic Quarter (future)', 'Floating temples', 'Mystic'],
        ['Industrial Zone (future)', 'Factories', 'Elasto'],
        ['North Ridge (future)', 'Snowy mountains', 'Event zone'],
        ['Mirror Dimension (future)', 'Endgame', 'Mystic (then others)'],
    ]
    story.append(table(district_ref, [CONTENT_W*0.28, CONTENT_W*0.32, CONTENT_W*0.40]))

    story.append(h2('21.4 Glossary'))
    glossary = [
        ['Term', 'Definition'],
        ['Aegis Directive', 'The SHIELD-equivalent government agency coordinating hero activity.'],
        ['The Citadel', 'The Pantheon HQ. A helicarrier.'],
        ['Director Vance', 'Leader of Aegis Directive. Morally grey. Mid-campaign twist antagonist.'],
        ['The Hollow', 'Cosmic entity sealed inside Sentinel. His dark alter-ego.'],
        ['Godstone', 'Ancient artifact shattered into 5 fragments. Reunited = Hollow breaks free.'],
        ['Duality Meter', 'Sentinel\'s resource. Fills as he uses abilities. At 100%, Hollow takes over.'],
        ['Credits', 'In-game currency. Earned from missions. Spent on upgrades. No real-money purchase.'],
        ['Hero Phone', 'Diegetic UI accessible mid-game. Mission alerts, suit selector, map, comms.'],
        ['Assemble Mission', 'A mission where the player swaps between multiple heroes mid-mission.'],
        ['Duo Mission', 'A mission requiring two specific heroes. Player controls one, AI controls the other.'],
        ['Hollow Rift', 'Endgame roguelike mode. Procedurally generated 10-floor dungeons.'],
        ['PWA', 'Progressive Web App. Installable web page that feels native. Pantheon\'s deployment format.'],
        ['Vibe-Coder Workflow', 'Owner plays, reports feel issues in plain language, AI tunes constants, repeat.'],
    ]
    story.append(table(glossary, [CONTENT_W*0.25, CONTENT_W*0.75]))

    return story

def build_closing():
    """Final closing page - no artificial end markers, just a final note."""
    story = []
    story.append(PageBreak())
    story.append(h1('Document Notes'))
    story.append(hr())
    story.append(p(
        'This Game Design Document captures the design of Pantheon as discussed and agreed '
        'between the owner and the AI design lead across multiple design sessions. It is a '
        'living document — as the owner plays the Phase 0 prototype and provides feedback, '
        'this document will be updated to reflect design changes. The next step is to '
        'initialize the Three.js project scaffold and begin Phase 0 development.'
    ))
    story.append(p(
        'All design decisions in this document exist to serve the player fantasy of '
        'controlling ten distinct superheroes in a living, breathing city. If a future '
        'feature does not serve that fantasy, it does not belong in Pantheon.'
    ))
    return story
