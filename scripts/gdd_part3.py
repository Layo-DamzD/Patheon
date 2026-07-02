"""GDD Part 3 — Suits, Abilities, World, Vehicles, Crimes."""
from gdd_part1 import (
    h1, h2, h3, p, pl, callout, bullets, hr, table,
    PageBreak, CONTENT_W, Spacer, Paragraph, style_body_left
)

def build_suits():
    story = []
    story.append(h1('6. Suit System (Cosmetic Only)'))
    story.append(hr())

    story.append(h2('6.1 Design Rule: Suits Do Not Change Abilities'))
    story.append(p(
        'A hard design rule, set by the owner: <b>suits are cosmetic only</b>. A suit does '
        'not unlock new abilities, change stats, or alter gameplay. The owner wears what '
        'looks cool. Ability progression is handled entirely through the Ability Progression '
        'System (Section 7), which is independent of suits. This avoids the design trap of '
        '"the best suit is the one I don\'t like the look of" — players can wear their '
        'favorite suit without gameplay penalty.'
    ))

    story.append(h2('6.2 How Suits Are Acquired'))
    story.append(p(
        'Suits are acquired through five channels, ensuring that every playstyle has a path '
        'to cosmetic rewards. None of these paths involve real-money purchase (the game is a '
        'personal project with no monetization). All suits are equally cosmetic — there is no '
        '"rarity" tier that implies one suit is better than another.'
    ))

    suit_acquisition = [
        ['Channel', 'How', 'Example'],
        ['Story Progression', 'Unlocked automatically by reaching story beats', 'Velora\'s "Classic" suit (unlocked at hero unlock)'],
        ['Mission Rewards', 'Completing specific missions with optional objectives', 'Arachne\'s "Stealth Suit" (complete mission 4 undetected)'],
        ['Collectibles', 'Finding hidden tokens in the open world', 'Ironclad\'s "Bleeding Edge" suit (find all 10 tech tokens in Midtown)'],
        ['Challenge Completion', 'Completing hero-specific gameplay challenges', 'Sentinel\'s "Hollow Form" suit (defeat 200 enemies in Hollow form)'],
        ['Milestones', 'Reaching gameplay milestones', 'Pulsar\'s "Binary Form" suit (absorb 10,000 damage total)'],
    ]
    story.append(table(suit_acquisition, [CONTENT_W*0.20, CONTENT_W*0.40, CONTENT_W*0.40]))

    story.append(h2('6.3 Suit Count Per Hero'))
    story.append(p(
        'Each hero has a target of <b>5-8 suits</b> at launch, totaling 50-80 suits across '
        'the roster. This is a substantial collectathon goal for the owner. Suits are the '
        'primary long-term cosmetic reward. Each suit can be previewed in the HQ Wardrobe '
        'before equipping.'
    ))

    story.append(h2('6.4 Suit Selection UI'))
    story.append(p(
        'Suits can be changed in two places: (1) the <b>HQ Wardrobe</b> at The Citadel, '
        'where the full roster is previewed in 3D; and (2) the <b>Hero Phone Suit Selector</b>, '
        'accessible mid-mission, which plays a 2-second transformation animation and applies '
        'the new suit. Mid-mission suit swaps are instant — no penalty, no cooldown — '
        'because suits do not affect gameplay.'
    ))

    story.append(PageBreak())
    return story

def build_abilities():
    story = []
    story.append(h1('7. Ability Progression System'))
    story.append(hr())

    story.append(h2('7.1 Three Channels of Ability Unlock'))
    story.append(p(
        'Abilities are unlocked through three independent channels. Every hero uses all three '
        'channels, so the player always has multiple progression tracks active. The hybrid '
        'system avoids the failure modes of pure approaches: pure-mission unlocks feel slow '
        'and gate the fun; pure-currency unlocks feel grindy. The hybrid approach keeps the '
        'player always near a meaningful unlock.'
    ))

    channels = [
        ['Channel', 'What It Unlocks', 'Why It Exists'],
        ['Story Missions', 'Each hero\'s core kit and signature abilities. ~4 unlocks per hero.',
         'Creates narrative payoff. Story beats feel rewarding because they grant new toys.'],
        ['In-Game Currency (Credits)', 'Side abilities, upgrades, and customization. Earned from any mission.',
         'Gives the player choice in their build. Makes side crimes worth doing. Player-directed progression.'],
        ['Challenge Unlocks', 'Special abilities tied to specific gameplay feats.',
         'Skill-based unlocks feel earned. Rewards mastery of a hero.'],
    ]
    story.append(table(channels, [CONTENT_W*0.22, CONTENT_W*0.38, CONTENT_W*0.40]))

    story.append(h2('7.2 Credits — In-Game Currency'))
    story.append(p(
        'Credits are earned from every mission. The payout scales with mission difficulty '
        'and optional objectives. Credits are spent at the HQ Ability Console or via the Hero '
        'Phone. There is no real-money purchase of Credits — the game has no monetization. '
        'Credits are also used for suit purchases from the Wardrobe (cosmetic only) and for '
        'upgrading existing abilities (e.g., +10% damage, -15% cooldown).'
    ))

    credit_sources = [
        ['Mission Type', 'Payout Range', 'Notes'],
        ['Story mission (first completion)', '500-1000', 'One-time. Higher payouts for longer missions.'],
        ['Crime-in-Progress (easy)', '50-150', 'Repeatable. Fast spawns.'],
        ['Crime-in-Progress (medium)', '150-300', 'Repeatable.'],
        ['Crime-in-Progress (hard)', '300-500', 'Repeatable.'],
        ['Duo mission (first completion)', '800-1200', 'One-time per designed duo.'],
        ['Assemble mission', '1500-2500', 'Big payouts.'],
        ['Daily challenge', '300-500', 'Once per day.'],
        ['Weekly challenge', '1000-1500', 'Once per week.'],
        ['Roguelike rift (per floor cleared)', '100/floor', 'Endgame grind.'],
    ]
    story.append(table(credit_sources, [CONTENT_W*0.40, CONTENT_W*0.25, CONTENT_W*0.35]))

    story.append(h2('7.3 Upgrade Trees'))
    story.append(p(
        'Each hero has an upgrade tree with three branches: <b>Power</b> (more damage), '
        '<b>Speed</b> (faster cooldowns, faster movement), and <b>Utility</b> (extra effects, '
        'longer durations, larger areas). Upgrades cost Credits and require the base ability '
        'to be unlocked first. Each ability has 3 upgrade tiers. The owner can respec at the '
        'HQ Ability Console for free — no penalty for experimentation.'
    ))

    story.append(h2('7.4 Challenge Unlocks'))
    story.append(p(
        'Challenge unlocks are the most prestigious abilities in the game. They require the '
        'player to demonstrate mastery of a hero. Examples include Velora\'s Air-Run (run on '
        'water for 30s without stopping), Sentinel\'s Hollow Purge (defeat 200 enemies in '
        'Hollow form), and Mystic\'s Time Stop (defeat 50 enemies with telekinesis throws). '
        'These abilities are intentionally the most powerful in each hero\'s kit — the reward '
        'for mastery is a meaningful power spike.'
    ))

    story.append(PageBreak())
    return story

def build_world():
    story = []
    story.append(h1('8. World & Locations'))
    story.append(hr())

    story.append(h2('8.1 Multi-District Open World'))
    story.append(p(
        'Pantheon features a multi-district open world, larger than Spider Fighter 3\'s '
        'single map. Four districts are available at launch, each with its own visual '
        'identity, crime patterns, and hero-affinity. Districts are connected seamlessly — '
        'the player can run, fly, swing, or drive between them without loading screens '
        '(border crossings have a brief 1-second transition). Fast-travel between districts '
        'is available via the Hero Phone map.'
    ))

    districts = [
        ['District', 'Theme', 'Architecture', 'Crime Pattern', 'Hero Affinity'],
        ['Midtown', 'Downtown skyscrapers, business district',
         'Tall glass towers, dense streets, corporate plazas',
         'Bank heists, corporate espionage, villain attacks',
         'Ironclad, Arachne, Aegis Wing'],
        ['Chinatown', 'Dense streets, neon signs, markets',
         'Narrow alleys, low buildings, lanterns, food stalls',
         'Store robberies, gang wars, smuggling rings',
         'Arachne, Glitch, Mystic'],
        ['Sand Town', 'Desert edge, dusty, scrapyards',
         'Low industrial buildings, junk piles, dust storms',
         'Bandit raids, weapons deals, vehicle chases',
         'Aegis Wing, Stormborn, Elasto'],
        ['Beach City', 'Coastline, piers, boardwalks',
         'Hotels, beachfront, docks, lighthouses',
         'Boat hijackings, smuggling, sea-based threats',
         'Pulsar, Aegis Wing, Velora (water-run)'],
    ]
    story.append(table(districts, [CONTENT_W*0.12, CONTENT_W*0.20, CONTENT_W*0.22, CONTENT_W*0.25, CONTENT_W*0.21]))

    story.append(h2('8.2 Living World Systems'))
    story.append(p(
        'Each district is a living world with persistent systems running independently of the '
        'player. Traffic flows on schedules, civilians go about routines, day cycles into '
        'night, and crimes spawn based on time-of-day patterns (more street crimes at night, '
        'more corporate crimes during business hours). The player is never the only thing '
        'happening in the city — the city has its own life.'
    ))

    living_systems = [
        ['System', 'Description'],
        ['Day/Night Cycle', 'Full 24-hour cycle compressed to 2 hours real-time. Crimes and ambient behavior shift with time.'],
        ['Weather', 'Rain (wet reflective streets), fog, clear, storms. Weather affects visibility and some abilities.'],
        ['Traffic', 'Cars, buses, trucks flow on streets following traffic AI. Accidents cause jams. Getaway cars spawn from traffic.'],
        ['Pedestrians', 'Dense crowds. Panicked flee from crimes. Some become victims needing rescue.'],
        ['Trains', 'Bullet trains run on elevated tracks on fixed schedules. Cross-district transit.'],
        ['Boats', 'Cargo ships, ferries, smuggling boats traverse coastline and rivers.'],
        ['Planes', 'Passenger jets fly overhead on flight paths. Always visible in the sky.'],
        ['Police', 'NPC police respond to crimes independently. Will engage enemies but be outmatched. Heroes assist.'],
    ]
    story.append(table(living_systems, [CONTENT_W*0.25, CONTENT_W*0.75]))

    story.append(h2('8.3 Future Districts (Post-Launch)'))
    story.append(bullets([
        '<b>Neon District</b> — Cyberpunk-themed. Glitch\'s home turf. Holographic ads, vertical streets, drone traffic.',
        '<b>Mystic Quarter</b> — Floating temples, weird physics, inverted gravity zones. Mystic\'s domain.',
        '<b>Industrial Zone</b> — Factories, smog, smokestacks. Titan and Elasto playground.',
        '<b>North Ridge</b> — Snowy mountains. Year-round winter event zone.',
        '<b>Mirror Dimension</b> — Endgame roguelike zone. Reality is broken. Only Mystic (and post-game, others) can enter.',
    ]))

    story.append(h2('8.4 The Citadel (HQ)'))
    story.append(p(
        'The Citadel is the Pantheon HQ — a SHIELD-style helicarrier hovering above the city. '
        'It serves as the player\'s hub between missions. From The Citadel, the player '
        'accesses the Wardrobe (suit selection), Ability Console (upgrades), War Room '
        '(mission select), Hero Roster (hero switch), Training Room (practice against bots), '
        'Vault (collectibles and lore), and AI Console (tips and dialogue). The Citadel is '
        'also where story cutscenes play and where the Director briefs the player.'
    ))

    story.append(PageBreak())
    return story

def build_vehicles():
    story = []
    story.append(h1('9. Vehicle Emergencies'))
    story.append(hr())

    story.append(h2('9.1 Vehicle Systems Make the World Feel Alive'))
    story.append(p(
        'Vehicle emergencies are a major differentiator from Spider Fighter 3, which has no '
        'meaningful vehicle gameplay. In Pantheon, planes fly overhead constantly, trains '
        'run on schedules, boats traverse the coastline, and ground vehicles fill the '
        'streets. Any of these vehicles can become an emergency at any time. The player '
        'receives a phone alert, chooses whether to respond, and travels to the scene. '
        'Vehicle emergencies are higher-stakes than street crimes because they involve '
        'civilians in immediate danger and often have timers.'
    ))

    story.append(h2('9.2 Plane Emergencies'))
    story.append(p(
        'Planes spawn every ~10 minutes somewhere in the sky, flying normally between '
        'airports. When an emergency triggers, the player has 60-90 seconds to reach the '
        'plane before it crashes. Flying heroes (Ironclad, Pulsar, Sentinel, Aegis Wing) '
        'can intercept; Velora can air-run to reach them; others must use alternative '
        'methods (Arachne web-zip to a tall building, then web-wing glide to intercept).'
    ))

    plane_emergencies = [
        ['Emergency Type', 'Mechanic', 'Best Heroes'],
        ['Hijacked passenger jet', 'Storm the cockpit mid-flight, fight hijackers, retake controls, land safely.',
         'Ironclad, Aegis Wing, Arachne'],
        ['Engine failure', 'Catch the plane before it crashes. Hold it aloft while it restarts. Strength check.',
         'Pulsar (absorb impact), Sentinel, Stormborn'],
        ['Villain attacking from outside', 'Aerial dogfight. Engage villain on the plane\'s hull. Avoid damaging the plane.',
         'Ironclad, Pulsar, Stormborn'],
        ['Cargo door open, civilians falling', 'Catch falling civilians mid-air. Time-pressure. Multiple civilians.',
         'Aegis Wing (Aerial Escort), Arachne (web-yank), Velora (air-run)'],
        ['Bomb on board', 'Defuse bomb + evacuate passengers. Two simultaneous objectives.',
         'Any hero (defuse) + Aegis Wing (evac)'],
    ]
    story.append(table(plane_emergencies, [CONTENT_W*0.22, CONTENT_W*0.50, CONTENT_W*0.28]))

    story.append(h2('9.3 Train Emergencies'))
    story.append(p(
        'Trains run on elevated tracks connecting districts. They follow fixed schedules '
        'visible on the Hero Phone map. Train emergencies are time-sensitive — the train '
        'keeps moving while the emergency unfolds, and the player must keep up.'
    ))

    train_emergencies = [
        ['Emergency Type', 'Mechanic'],
        ['Hijacked bullet train', 'Fight through cars, defeat hijackers, stop train before derailment.'],
        ['Bomb on board', 'Defuse + evacuate. Train keeps moving. Civilian timer.'],
        ['Train about to collide', 'Push train to a stop. Strength check (Titan, Stormborn, Sentinel).'],
        ['Villain on top of train', 'Top-of-train fight scene. Wind resistance, low ceiling tunnels.'],
        ['Track obstruction', 'Clear the track ahead of the train. Race against the train.'],
    ]
    story.append(table(train_emergencies, [CONTENT_W*0.30, CONTENT_W*0.70]))

    story.append(h2('9.4 Boat Emergencies'))
    story.append(p(
        'Boats traverse the coastline and rivers. Cargo ships, ferries, smuggling boats, '
        'and yachts each have different emergency types. Boat emergencies are the slowest '
        'vehicle emergencies — boats take longer to reach and longer to resolve.'
    ))

    boat_emergencies = [
        ['Emergency Type', 'Mechanic'],
        ['Piracy / hijacking on cargo ship', 'Takedown pirates, secure crew. Multi-stage.'],
        ['Sinking ship', 'Rescue civilians before ship goes down. Plunge timer.'],
        ['Smuggler boats evading', 'Chase + intercept. Aegis Wing flyover, Velora water-run, Arachne web-yank from bridge.'],
        ['Sea monster / Kraken summon', 'Boss fight at sea. Mystic-faction villain.'],
        ['Oil spill', 'Contain spill before it reaches shore. Velora tornado blows oil back.'],
    ]
    story.append(table(boat_emergencies, [CONTENT_W*0.30, CONTENT_W*0.70]))

    story.append(h2('9.5 Ground Vehicle Emergencies'))
    story.append(p(
        'Ground vehicles are the most common vehicle emergency. Cars, trucks, buses, and '
        'motorcycles fill the streets and frequently become crime scenes. These are the '
        'fastest vehicle emergencies to resolve — usually under 2 minutes.'
    ))

    ground_emergencies = [
        ['Emergency Type', 'Mechanic'],
        ['Bank robbery getaway chase', 'Stop the getaway car. Ram, intercept, or land on it.'],
        ['Armored truck heist', 'Protect the truck from multiple attackers. Tower-defense style.'],
        ['Villain convoy', 'Multiple vehicles. Take them all down in sequence.'],
        ['Bus hostage situation', 'Board the bus, neutralize hijackers, no civilian casualties.'],
        ['School bus in danger', 'Highest-priority emergency. Timer is short. Escort the bus to safety.'],
    ]
    story.append(table(ground_emergencies, [CONTENT_W*0.30, CONTENT_W*0.70]))

    story.append(h2('9.6 Travel Time Matters'))
    story.append(p(
        'A critical design rule: <b>travel time to vehicle emergencies is part of the '
        'gameplay</b>. Plane emergencies favor flying heroes because they can reach the sky '
        'fastest. Boat emergencies favor flyers or Velora (water-run). Train emergencies '
        'favor Velora (catch up to the moving train) or Arachne (web-swing alongside). This '
        'means no single hero is best for all vehicle emergencies — the player is encouraged '
        'to switch heroes based on the emergency type, which is core to the roster fantasy.'
    ))

    story.append(PageBreak())
    return story

def build_crimes():
    story = []
    story.append(h1('10. Crime System'))
    story.append(hr())

    story.append(h2('10.1 Procedural Crime-in-Progress (Layer 2)'))
    story.append(p(
        'The Crime-in-Progress system is the game\'s procedural content engine. Crimes spawn '
        'continuously in every district, ranging from minor street crimes to major supervillain '
        'sightings. The player receives phone alerts and can choose which to respond to. '
        'Each crime is procedurally varied: location, enemy count, time of day, weather, '
        'civilian count, and optional objectives all roll randomly within templates. The same '
        'template produces hundreds of unique-feeling encounters.'
    ))

    story.append(h2('10.2 Crime Catalog'))
    crimes = [
        ['Crime', 'District', 'Difficulty', 'Hero Fit'],
        ['Bank robbery', 'Midtown', 'Medium', 'Any'],
        ['Store robbery', 'Chinatown, Beach City', 'Easy', 'Any'],
        ['Fire starting (arsonist)', 'Any residential', 'Easy-Medium', 'Velora (tornado), Aegis Wing'],
        ['Getaway car chase', 'Any', 'Easy', 'Velora, Arachne'],
        ['Gang fight', 'Chinatown, Sand Town', 'Easy', 'Any'],
        ['Bomb threat', 'Any', 'Medium', 'Any'],
        ['Hostage situation', 'Any', 'Medium', 'Any'],
        ['Tech heist', 'Midtown', 'Medium', 'Glitch, Ironclad'],
        ['Boat piracy', 'Beach City', 'Medium-Hard', 'Aegis Wing, Pulsar'],
        ['Plane emergency', 'Sky', 'Hard', 'Ironclad, Pulsar, Sentinel'],
        ['Train emergency', 'Cross-district', 'Medium-Hard', 'Velora, Arachne'],
        ['Supervillain sighting', 'Any', 'Hard', 'Duo'],
        ['Portal breach', 'Any', 'Hard', 'Duo'],
        ['Factory sabotage', 'Industrial (future)', 'Medium', 'Titan, Elasto'],
        ['Cult ritual', 'Mystic Quarter (future)', 'Hard', 'Mystic, Sentinel'],
        ['Helicopter hijack', 'Any', 'Medium-Hard', 'Ironclad, Aegis Wing'],
        ['Tsunami warning', 'Beach City', 'Hard', 'Pulsar, Stormborn'],
        ['Power grid attack', 'Midtown', 'Medium', 'Ironclad, Glitch'],
        ['School bus in danger', 'Any', 'Medium (priority)', 'Any'],
        ['Ambulance escort', 'Any', 'Easy', 'Any'],
    ]
    story.append(table(crimes, [CONTENT_W*0.25, CONTENT_W*0.22, CONTENT_W*0.20, CONTENT_W*0.33]))

    story.append(h2('10.3 Crime Spawning Logic'))
    story.append(p(
        'Crimes spawn on a tick — every 30-90 seconds, a new crime spawns somewhere in the '
        'open world. The crime type is weighted by district (bank robberies more likely in '
        'Midtown, store robberies in Chinatown, boat piracy in Beach City) and time of day '
        '(more street crimes at night, more corporate crimes by day). Up to 5 crimes can be '
        'active simultaneously. If the player ignores a crime, it eventually resolves itself '
        '(police handle it) or fails (civilians harmed) — the world does not wait for the '
        'player.'
    ))

    story.append(h2('10.4 Optional Objectives'))
    story.append(p(
        'Every crime has 1-3 optional objectives that grant bonus Credits and contribute to '
        'challenge unlocks. Examples: "Complete without taking damage," "Rescue all '
        'civilians," "Defeat all enemies in under 60 seconds," "Use only melee attacks." '
        'Optional objectives are the primary replay incentive for crimes — completing the '
        'same crime with all optional objectives grants 3x the Credits.'
    ))

    story.append(PageBreak())
    return story
