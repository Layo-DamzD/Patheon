"""
Pantheon - Game Design Document Generator
Generates a comprehensive GDD PDF using ReportLab.
"""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image, ListFlowable, ListItem, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus.tableofcontents import TableOfContents

# ============================================================
# FONT REGISTRATION
# ============================================================
FONT_DIR = '/usr/share/fonts'

# Noto Serif SC (has proper static ttf files)
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

# Latin fonts for English text
pdfmetrics.registerFont(TTFont('LibSans', f'{FONT_DIR}/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSans-Italic.ttf'))
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold', italic='LibSans-Italic')

pdfmetrics.registerFont(TTFont('LibSerif', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Italic.ttf'))
registerFontFamily('LibSerif', normal='LibSerif', bold='LibSerif-Bold', italic='LibSerif-Italic')

# ============================================================
# PALETTE (Midnight Hero - dark with gold accent)
# ============================================================
PAGE_BG       = colors.HexColor('#0c0b0a')
SECTION_BG    = colors.HexColor('#191816')
CARD_BG       = colors.HexColor('#2c2a22')
TABLE_STRIPE  = colors.HexColor('#191815')
HEADER_FILL   = colors.HexColor('#454032')
COVER_BLOCK   = colors.HexColor('#332e1f')
BORDER        = colors.HexColor('#564f37')
ICON          = colors.HexColor('#b6aa84')
ACCENT        = colors.HexColor('#debf63')   # gold
ACCENT_2      = colors.HexColor('#7d5fd6')   # purple
TEXT_PRIMARY  = colors.HexColor('#e5e4e2')
TEXT_MUTED    = colors.HexColor('#96938d')
SEM_SUCCESS   = colors.HexColor('#7db48f')
SEM_WARNING   = colors.HexColor('#c8af7e')
SEM_ERROR     = colors.HexColor('#c88079')
SEM_INFO      = colors.HexColor('#85a5c5')

# Page colors (white background for readability)
PAGE_WHITE    = colors.HexColor('#FFFFFF')
INK           = colors.HexColor('#1a1a1a')
INK_MUTED     = colors.HexColor('#555555')
RULE          = colors.HexColor('#dddddd')
TABLE_HEAD    = colors.HexColor('#1a1a1a')
TABLE_HEAD_TX = colors.HexColor('#ffffff')
TABLE_ALT     = colors.HexColor('#f5f5f0')
ACCENT_DARK   = colors.HexColor('#8a6d1f')
ACCENT_BG     = colors.HexColor('#fdf6e3')

# ============================================================
# PAGE SETUP
# ============================================================
PAGE_W, PAGE_H = A4
MARGIN_L = 22 * mm
MARGIN_R = 22 * mm
MARGIN_T = 22 * mm
MARGIN_B = 22 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# ============================================================
# STYLES
# ============================================================
styles = getSampleStyleSheet()

style_cover_title = ParagraphStyle(
    'CoverTitle', parent=styles['Title'],
    fontName='LibSerif-Bold', fontSize=64, leading=70,
    textColor=ACCENT, alignment=TA_LEFT, spaceAfter=10
)
style_cover_sub = ParagraphStyle(
    'CoverSub', parent=styles['Normal'],
    fontName='LibSans', fontSize=18, leading=24,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=8
)
style_cover_meta = ParagraphStyle(
    'CoverMeta', parent=styles['Normal'],
    fontName='LibSans', fontSize=11, leading=16,
    textColor=TEXT_MUTED, alignment=TA_LEFT
)

style_h1 = ParagraphStyle(
    'H1', parent=styles['Heading1'],
    fontName='LibSans-Bold', fontSize=22, leading=28,
    textColor=INK, spaceBefore=20, spaceAfter=10,
    keepWithNext=True
)
style_h2 = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontName='LibSans-Bold', fontSize=15, leading=20,
    textColor=ACCENT_DARK, spaceBefore=14, spaceAfter=6,
    keepWithNext=True
)
style_h3 = ParagraphStyle(
    'H3', parent=styles['Heading3'],
    fontName='LibSans-Bold', fontSize=12, leading=16,
    textColor=INK, spaceBefore=10, spaceAfter=4,
    keepWithNext=True
)

style_body = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='LibSerif', fontSize=10.5, leading=16,
    textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8
)
style_body_left = ParagraphStyle(
    'BodyLeft', parent=style_body, alignment=TA_LEFT
)
style_bullet = ParagraphStyle(
    'Bullet', parent=style_body, leftIndent=18, bulletIndent=6,
    spaceAfter=4, alignment=TA_LEFT
)
style_callout = ParagraphStyle(
    'Callout', parent=style_body,
    fontName='LibSans', fontSize=10, leading=15,
    textColor=INK, backColor=ACCENT_BG,
    borderColor=ACCENT, borderWidth=0, borderPadding=8,
    leftIndent=0, rightIndent=0, spaceBefore=8, spaceAfter=10
)
style_toc_h1 = ParagraphStyle(
    'TOCH1', fontName='LibSans-Bold', fontSize=11, leading=16,
    textColor=INK, leftIndent=0
)
style_toc_h2 = ParagraphStyle(
    'TOCH2', fontName='LibSans', fontSize=10, leading=14,
    textColor=INK_MUTED, leftIndent=16
)

# ============================================================
# HELPERS
# ============================================================
def h1(text):
    return Paragraph(text, style_h1)

def h2(text):
    return Paragraph(text, style_h2)

def h3(text):
    return Paragraph(text, style_h3)

def p(text):
    return Paragraph(text, style_body)

def pl(text):
    return Paragraph(text, style_body_left)

def callout(text):
    return Paragraph(text, style_callout)

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(it, style_bullet), value='circle') for it in items],
        bulletType='bullet', start='circle', leftIndent=18
    )

def hr():
    return HRFlowable(width='100%', thickness=0.5, color=RULE,
                      spaceBefore=4, spaceAfter=10)

def table(data, col_widths=None, header=True):
    """Build a styled table with proper wrapping."""
    if col_widths is None:
        n = len(data[0])
        col_widths = [CONTENT_W / n] * n
    # Wrap text cells in Paragraphs so they wrap
    wrapped = []
    cell_style = ParagraphStyle('Cell', fontName='LibSans', fontSize=9,
                                 leading=12, textColor=INK, alignment=TA_LEFT)
    head_style = ParagraphStyle('CellH', fontName='LibSans-Bold', fontSize=9,
                                 leading=12, textColor=TABLE_HEAD_TX, alignment=TA_LEFT)
    for ri, row in enumerate(data):
        wr = []
        for cell in row:
            if isinstance(cell, str):
                if ri == 0 and header:
                    wr.append(Paragraph(cell, head_style))
                else:
                    wr.append(Paragraph(cell, cell_style))
            else:
                wr.append(cell)
        wrapped.append(wr)
    t = Table(wrapped, colWidths=col_widths, repeatRows=1 if header else 0)
    style = [
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.4, RULE),
    ]
    if header:
        style.append(('BACKGROUND', (0,0), (-1,0), TABLE_HEAD))
        style.append(('TEXTCOLOR', (0,0), (-1,0), TABLE_HEAD_TX))
    # alternating rows
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(('BACKGROUND', (0,i), (-1,i), TABLE_ALT))
    t.setStyle(TableStyle(style))
    return t

# ============================================================
# PAGE TEMPLATES
# ============================================================
def cover_page(canvas, doc):
    """Dark cover page with gold accent."""
    canvas.saveState()
    # Full dark background
    canvas.setFillColor(PAGE_BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Gold accent block (left vertical bar)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 0, 6*mm, PAGE_H, fill=1, stroke=0)
    # Top accent line
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1)
    canvas.line(MARGIN_L, PAGE_H - 35*mm, PAGE_W - MARGIN_R, PAGE_H - 35*mm)
    # Bottom accent line
    canvas.line(MARGIN_L, 35*mm, PAGE_W - MARGIN_R, 35*mm)
    # Footer text
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont('LibSans', 9)
    canvas.drawString(MARGIN_L, 18*mm, 'CONFIDENTIAL  /  DESIGN DOCUMENT  /  v1.0')
    canvas.drawRightString(PAGE_W - MARGIN_R, 18*mm, 'AEGIS DIRECTIVE  /  THE CITADEL')
    canvas.restoreState()

def body_page(canvas, doc):
    """Body page with header and footer."""
    canvas.saveState()
    # Header
    canvas.setFillColor(INK_MUTED)
    canvas.setFont('LibSans', 8.5)
    canvas.drawString(MARGIN_L, PAGE_H - 12*mm, 'PANTHEON  /  Game Design Document')
    canvas.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 12*mm, 'v1.0  /  Confidential')
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN_L, PAGE_H - 14*mm, PAGE_W - MARGIN_R, PAGE_H - 14*mm)
    # Footer
    canvas.setFillColor(INK_MUTED)
    canvas.setFont('LibSans', 8.5)
    canvas.drawString(MARGIN_L, 12*mm, 'Aegis Directive  /  The Citadel')
    canvas.drawRightString(PAGE_W - MARGIN_R, 12*mm, f'Page {doc.page}')
    canvas.line(MARGIN_L, 14*mm, PAGE_W - MARGIN_R, 14*mm)
    canvas.restoreState()

# ============================================================
# CONTENT BUILDERS
# ============================================================
def build_cover():
    """Cover page content."""
    story = []
    story.append(Spacer(1, 50*mm))
    story.append(Paragraph('PANTHEON', style_cover_title))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('Game Design Document', style_cover_sub))
    story.append(Paragraph('Assemble. Rise. Endure.', style_cover_sub))
    story.append(Spacer(1, 80*mm))
    meta = [
        '<b>Document</b>:  Game Design Document v1.0',
        '<b>Project</b>:  Pantheon (mobile superhero action game)',
        '<b>Platform</b>:  PWA (iOS / Android installable)  /  future native port',
        '<b>Tech Stack</b>:  Three.js + React Three Fiber + Rapier physics',
        '<b>Status</b>:  Design lock, ready for Phase 0 prototype',
        '<b>Prepared by</b>:  Super Z (AI design lead)',
        '<b>For</b>:  Project Owner (Vibe Coder)',
    ]
    for m in meta:
        story.append(Paragraph(m, style_cover_meta))
        story.append(Spacer(1, 2*mm))
    story.append(PageBreak())
    return story

def build_toc():
    """Table of contents."""
    story = []
    story.append(h1('Table of Contents'))
    story.append(hr())
    story.append(Spacer(1, 4*mm))
    toc_data = [
        ('1.  Executive Summary', '4'),
        ('2.  Vision & Goals', '5'),
        ('3.  Tech Stack & Platform Strategy', '6'),
        ('4.  Game Identity & Brand', '8'),
        ('5.  Hero Roster (10 Heroes)', '9'),
        ('     5.1  Velora (Speedster)', '10'),
        ('     5.2  Stormborn (Thunder God)', '11'),
        ('     5.3  Aegis Wing (Flying Shield-Fighter)', '12'),
        ('     5.4  Arachne (Web-Slinger)', '13'),
        ('     5.5  Ironclad (Tech Armor)', '14'),
        ('     5.6  Glitch (Hacker)', '15'),
        ('     5.7  Pulsar (Energy Blaster)', '16'),
        ('     5.8  Elasto (Elastic)', '17'),
        ('     5.9  Sentinel / Hollow (Duality)', '18'),
        ('    5.10  Mystic (Sorcerer)', '19'),
        ('6.  Suit System (Cosmetic Only)', '20'),
        ('7.  Ability Progression System', '21'),
        ('8.  World & Locations', '23'),
        ('9.  Vehicle Emergencies', '25'),
        ('10. Crime System', '27'),
        ('11. Mission Architecture (5 Layers)', '29'),
        ('12. Enemy Factions (5)', '32'),
        ('13. Boss Design (10 Bosses)', '34'),
        ('14. HQ & Hero Phone Systems', '36'),
        ('15. UI & Controls (Hero-Specific)', '38'),
        ('16. Art Direction', '40'),
        ('17. Story & Campaign', '41'),
        ('18. Replayability Systems', '45'),
        ('19. Phase Roadmap (0-4)', '47'),
        ('20. Phase 0 Detailed Plan', '48'),
        ('21. Monetization Strategy', '50'),
        ('22. Appendix: Hero Power Reference', '51'),
    ]
    toc_table = Table(
        [[Paragraph(t, style_toc_h1 if not t.startswith('     ') else style_toc_h2),
          Paragraph(p, style_toc_h2)] for t, p in toc_data],
        colWidths=[CONTENT_W * 0.85, CONTENT_W * 0.15]
    )
    toc_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(toc_table)
    story.append(PageBreak())
    return story

def build_executive_summary():
    story = []
    story.append(h1('1. Executive Summary'))
    story.append(hr())

    story.append(p(
        '<b>Pantheon</b> is an original-IP 3D superhero action game for mobile devices, '
        'inspired by the genre conventions of titles such as Spider Fighter 3 but engineered '
        'to exceed them in scope, depth, and replayability. The game features a roster of ten '
        'playable heroes, each with a unique movement kit and combat identity, set across a '
        'living open-world city with multiple districts, vehicle-based emergencies, and a '
        'five-layer mission architecture designed to keep players engaged long after the '
        'main story concludes.'
    ))

    story.append(p(
        'The project is led by a single developer (self-described "vibe coder") with no '
        'prior programming experience, paired with an AI design and engineering assistant. '
        'The game is built as a personal project for the owner\'s own enjoyment — there is '
        'no commercial release plan and no monetization. The technical strategy is therefore '
        'singular: build the entire game in Three.js as an installable Progressive Web App '
        '(PWA), enabling rapid iteration and direct AI-assisted code generation within the '
        'design session. The owner plays, gives feedback by feel, and the AI tunes constants. '
        'No engine switching, no app-store pipeline, no monetization overhead — just the '
        'purest path from idea to playable.'
    ))

    story.append(p(
        'The game differentiates itself from Spider Fighter 3 in five key ways: (1) a roster '
        'of ten heroes rather than a single protagonist, each with hero-specific control '
        'layouts and ability kits; (2) a multi-district open world with persistent traffic, '
        'trains, boats, and planes that generate their own emergencies; (3) a five-layer '
        'mission architecture combining linear story, procedural crimes, designed duo '
        'missions, full-assemble set-pieces, and endless replayability systems; (4) a '
        'cosmetic-only suit system with ability progression handled through missions, '
        'currency, and challenges; (5) a morally weighty three-act campaign with multiple '
        'endings and a real emotional core.'
    ))

    story.append(callout(
        '<b>Tagline:</b> "Pantheon: Assemble."  '
        '<b>Genre:</b> 3D superhero action, open-world.  '
        '<b>Platform:</b> Mobile-first PWA (installable, no app store).  '
        '<b>Audience:</b> The owner (personal project).  '
        '<b>Competitive frame:</b> Spider Fighter 3, Marvel Future Fight, '
        'Spider-Man PS4 (mobile-condensed).'
    ))

    story.append(h2('Core Design Pillars'))
    story.append(bullets([
        '<b>Hero Variety</b> — Ten heroes must feel mechanically distinct, not reskinned. Each has unique movement, combat, and a hero-specific button layout.',
        '<b>Living World</b> — The city is never static. Planes fly overhead, trains run on schedules, boats dock at piers, and any of them can become an emergency at any moment.',
        '<b>Endless Replayability</b> — The game cannot "end." Story completion unlocks deeper systems: roguelike rifts, daily challenges, suit hunts, NG+, and live-ops events.',
        '<b>Vibe-Coder Friendly</b> — Every system is designed to be tunable by feel. The owner plays, gives feedback ("running too floaty"), and the AI adjusts constants.',
        '<b>Marvel-Safe Original IP</b> — All heroes, villains, and locations are original archetypes inspired by but legally distinct from existing comic properties.',
    ]))

    story.append(PageBreak())
    return story

def build_vision_goals():
    story = []
    story.append(h1('2. Vision & Goals'))
    story.append(hr())

    story.append(h2('Vision Statement'))
    story.append(p(
        'Pantheon exists to give mobile players the feeling of being part of a superhero '
        'team — not just controlling one hero, but switching between ten distinct power '
        'fantasies, each fully realized. Where Spider Fighter 3 gives you one hero with '
        'limited moves, Pantheon gives you ten heroes with deep kits, a city that breathes, '
        'and a campaign that asks something real of the player at the end. The game respects '
        'the player\'s time by never gating fun behind grind, and respects the player\'s '
        'intelligence by giving them a story with actual weight.'
    ))

    story.append(h2('Design Goals'))
    story.append(p(
        'The following goals are non-negotiable design constraints. Every feature decision '
        'must serve at least one of these goals; features that serve none are cut.'
    ))

    goals = [
        ['Goal', 'Description', 'Success Metric'],
        ['G1: Hero Depth',
         'Each of 10 heroes has a unique movement kit and combat identity. No two heroes share a button layout.',
         'Player can name each hero\'s unique mechanic after 10 minutes of play.'],
        ['G2: City Liveness',
         'Persistent traffic (cars, trains, boats, planes) with their own emergency spawns. Day/night cycle affects crime patterns.',
         'Player encounters a vehicle emergency organically every 15 minutes of patrol.'],
        ['G3: Replayability',
         'Game has 5 replayability engines: procedural crimes, roguelike rifts, daily challenges, suit hunts, NG+.',
         'Average player session length > 30 min after story completion.'],
        ['G4: Mobile-First Feel',
         'Touch controls (joystick + buttons) feel responsive. Hero-specific button counts (4-5). No virtual D-pad.',
         'Input-to-action latency < 80ms on mid-range phones.'],
        ['G5: Story Weight',
         'Three-act campaign with morally grey Director, hero duality arc (Sentinel/Hollow), and a final choice.',
         'Player remembers the ending choice 1 week after finishing.'],
        ['G6: Vibe-Coder Workflow',
         'All tuning constants centralized in config files. Owner can play, give feedback, AI adjusts in < 5 min.',
         'Owner never needs to read or write code to tune the game.'],
    ]
    story.append(table(goals, [CONTENT_W*0.15, CONTENT_W*0.55, CONTENT_W*0.30]))

    story.append(h2('Anti-Goals (What We Are NOT Building)'))
    story.append(bullets([
        '<b>Not a Marvel-licensed game.</b> Original IP only. No Disney characters, names, or trademarks.',
        '<b>Not a gacha game.</b> No pay-to-win hero summons. All heroes unlocked through story progression.',
        '<b>Not an MMO.</b> Single-player with optional co-op in Phase 4. No always-online requirement.',
        '<b>Not AAA-graphics.</b> Stylized realism, not photorealism. We compete on gameplay depth, not visual fidelity.',
        '<b>Not a 100-hour campaign.</b> Story is ~15 hours. Depth comes from replayability systems, not bloat.',
    ]))

    story.append(PageBreak())
    return story

def build_tech_stack():
    story = []
    story.append(h1('3. Tech Stack & Platform Strategy'))
    story.append(hr())

    story.append(h2('3.1 Strategy: Three.js PWA, End-to-End'))
    story.append(p(
        'Pantheon is a personal project, built for the owner\'s own enjoyment. There is no '
        'commercial release, no app-store listing, no monetization. This simplifies the '
        'technical strategy enormously: the entire game is built in Three.js as an '
        'installable Progressive Web App (PWA). The PWA installs to the phone\'s home screen '
        'with an icon, runs offline once cached, and feels native — but requires no app-store '
        'pipeline, no review process, no native build tools. The AI assistant can write and '
        'iterate on code directly within the design session, and the owner plays the result '
        'immediately. This is the purest path from idea to playable.'
    ))

    story.append(h2('3.2 Stack Breakdown'))
    story.append(p(
        'The stack is chosen for three properties: (1) the AI can write it directly in this '
        'design session, (2) it runs at 60 FPS on mid-range phones, and (3) every layer is '
        'tunable by feel — the owner never needs to read code to adjust how the game plays. '
        'All gameplay constants live in a single config file that the AI edits on demand.'
    ))

    stack_pwa = [
        ['Layer', 'Technology', 'Why'],
        ['Rendering', 'Three.js + React Three Fiber', 'Industry standard for web 3D. R3F enables declarative scene graph, fast iteration.'],
        ['Physics', 'Rapier (WASM)', 'Fast Rust-based physics. True momentum, ragdoll, collision response.'],
        ['Touch Input', 'nipplejs + custom buttons', 'Battle-tested virtual joystick. Buttons are simple DOM elements, easy to tune.'],
        ['App Shell', 'Next.js 16 + PWA manifest', 'Installable, offline-capable, instant previews on every code change.'],
        ['State', 'Zustand', 'Lightweight, no boilerplate. Easy for vibe-coder to read and request changes.'],
        ['Audio', 'Howler.js', 'Mobile-friendly audio with sprite support. Handles iOS lock-screen quirks.'],
        ['Animations', 'Three.js AnimationMixer + mixamo rigs', 'Standard humanoid rig. Free animation library covers all hero moves.'],
        ['Persistence', 'localStorage + IndexedDB', 'Save progress, suit unlocks, settings. Survives app close.'],
        ['Deployment', 'Vercel (free tier)', 'Instant previews on every change. Shareable URLs. Owner can play from any device.'],
        ['Tuning Config', 'Single TypeScript config file', 'All gameplay constants (speed, damage, cooldowns) in one file. AI edits, owner plays.'],
    ]
    story.append(table(stack_pwa, [CONTENT_W*0.18, CONTENT_W*0.30, CONTENT_W*0.52]))

    story.append(h2('3.3 PWA vs Native — Why PWA Wins for a Personal Project'))
    story.append(p(
        'For a commercial mobile game, native (or Godot-exported native) would be the right '
        'call: app-store distribution, in-app purchases, push notifications, deep OS '
        'integration. For a personal project, none of that matters. What matters is: can the '
        'owner play it on their phone in under five minutes from "AI, build this"? The PWA '
        'path wins decisively on that metric. The owner opens a URL, taps "Add to Home '
        'Screen," and the game is installed. No Xcode, no Android Studio, no signing '
        'certificates, no review process. The tradeoff — slightly less native feel, no '
        'App Store presence — is irrelevant for a game only the owner will play.'
    ))

    story.append(h2('3.4 Performance Targets (Mobile)'))
    story.append(p(
        'Performance is non-negotiable. A superhero game lives or dies on responsiveness — '
        'if sprinting as Velora feels laggy, the whole fantasy collapses. The following '
        'targets are the floor; if the build drops below them, the AI optimizes before '
        'adding any new feature.'
    ))

    perf = [
        ['Metric', 'Target', 'Hard Floor'],
        ['Frame rate (mid-range phone)', '60 FPS', '30 FPS'],
        ['Frame rate (low-end phone)', '30 FPS', '24 FPS'],
        ['Input-to-action latency', '< 60 ms', '< 100 ms'],
        ['Load time (cold)', '< 5 s', '< 10 s'],
        ['Load time (hot)', '< 1 s', '< 3 s'],
        ['Install size', '< 150 MB', '< 300 MB'],
        ['RAM usage', '< 800 MB', '< 1.2 GB'],
    ]
    story.append(table(perf, [CONTENT_W*0.45, CONTENT_W*0.30, CONTENT_W*0.25]))

    story.append(h2('3.5 Vibe-Coder Workflow'))
    story.append(p(
        'The owner has no programming experience and no intention of reading code. The '
        'workflow is therefore: the owner plays the latest build, identifies anything that '
        'feels wrong ("running too floaty," "camera too close," "lightning doesn\'t go far '
        'enough," "enemies too spongy"), and reports it in plain language. The AI translates '
        'the feedback into a constant change in the tuning config, redeploys, and the owner '
        'plays again. This loop is designed to complete in under five minutes per iteration. '
        'No code review, no merge conflicts, no debugging — just feel, report, tune, replay.'
    ))

    story.append(PageBreak())
    return story

def build_identity():
    story = []
    story.append(h1('4. Game Identity & Brand'))
    story.append(hr())

    story.append(h2('4.1 Name: Pantheon'))
    story.append(p(
        'The name <b>Pantheon</b> was selected from six candidates. "Pantheon" evokes a hall '
        'of heroes, a gathering of gods — appropriate for a game with ten playable heroes '
        'whose power level borders on the divine. It is short (three syllables), pronounceable '
        'in English and most major languages, available as a likely trademark in the games '
        'category, and pairs naturally with the tagline "Assemble." The name signals scope '
        '(ten heroes, not one) and tone (mythic, not street-level).'
    ))

    story.append(h2('4.2 Visual Identity: Midnight Hero Palette'))
    story.append(p(
        'The brand palette is "Midnight Hero" — a deep midnight blue-black background with '
        'a single gold accent. This choice signals premium quality (dark UI is associated '
        'with high-end mobile games like Marvel Contest of Champions), makes hero colors '
        'pop during gameplay (each hero retains their own palette), and looks refined on '
        'phone screens where bright UIs fatigue the eye. The accent gold is warmer than '
        'pure yellow (#debf63), evoking museum lighting rather than warning signage.'
    ))

    palette_table = [
        ['Role', 'Color', 'Hex', 'Usage'],
        ['Background', 'Midnight', '#0c0b0a', 'App background, splash screen'],
        ['Surface', 'Charcoal', '#191816', 'Cards, panels, modals'],
        ['Accent', 'Gold', '#debf63', 'Buttons, highlights, key data'],
        ['Accent 2', 'Mystic Purple', '#7d5fd6', 'Mystic/Sentinel hero accent'],
        ['Text Primary', 'Off-White', '#e5e4e2', 'Body text on dark'],
        ['Text Muted', 'Gray', '#96938d', 'Secondary text'],
        ['Success', 'Sage', '#7db48f', 'Mission complete'],
        ['Warning', 'Amber', '#c8af7e', 'Incoming damage'],
        ['Error', 'Brick', '#c88079', 'Critical health'],
    ]
    story.append(table(palette_table, [CONTENT_W*0.20, CONTENT_W*0.20, CONTENT_W*0.20, CONTENT_W*0.40]))

    story.append(h2('4.3 Logo Concept'))
    story.append(p(
        'The Pantheon logo is a wordmark: "PANTHEON" in a condensed serif (Playfair Display '
        'or similar), all-caps, gold on midnight. A circular emblem of ten interlocking '
        'chevrons (one per hero) sits above or beside the wordmark, evoking both a pantheon '
        'dome and a hero-roster crest. The emblem is also the in-game icon and the loading '
        'spinner.'
    ))

    story.append(h2('4.4 Tone of Voice'))
    story.append(p(
        'The game speaks in the register of the Marvel Cinematic Universe: witty banter in '
        'calm moments, weighty stakes in serious ones. Heroes bicker, joke, and reference '
        'each other\'s weaknesses. The Director speaks in clipped military phrases. Mission '
        'briefings are professional but human. Error messages and UI copy avoid generic '
        'phrasing — instead of "Mission Failed," the UI says "Civilians lost. Regroup at '
        'The Citadel." This voice extends to marketing copy and store listing.'
    ))

    story.append(PageBreak())
    return story

# Continue in part 2 (hero roster)...
