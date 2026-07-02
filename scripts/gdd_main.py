"""
Pantheon GDD — Main Runner.
Generates the complete Game Design Document PDF.
"""
import sys, os
sys.path.insert(0, '/home/z/my-project/scripts')

from gdd_part1 import (
    build_cover, build_toc, build_executive_summary, build_vision_goals,
    build_tech_stack, build_identity
)
from gdd_part2 import build_hero_roster_all
from gdd_part3 import (
    build_suits, build_abilities, build_world, build_vehicles, build_crimes
)
from gdd_part4 import (
    build_missions, build_enemies, build_bosses, build_hq_phone, build_ui
)
from gdd_part5 import (
    build_art, build_story, build_replayability, build_roadmap,
    build_phase0, build_appendix, build_closing
)
from gdd_part1 import cover_page, body_page, MARGIN_L, MARGIN_R, MARGIN_T, MARGIN_B, PAGE_W, PAGE_H

from reportlab.lib.pagesizes import A4
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, NextPageTemplate
from reportlab.platypus.doctemplate import PageBreak

OUTPUT = '/home/z/my-project/download/Pantheon_GDD.pdf'

def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=MARGIN_L, rightMargin=MARGIN_R,
        topMargin=MARGIN_T, bottomMargin=MARGIN_B,
        title='Pantheon — Game Design Document',
        author='Super Z (AI design lead) for the Project Owner',
        subject='Pantheon mobile superhero game design document v1.0',
        creator='Z.ai',
    )

    # Frames
    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id='cover',
                        leftPadding=MARGIN_L, rightPadding=MARGIN_R,
                        topPadding=MARGIN_T, bottomPadding=MARGIN_B,
                        showBoundary=0)
    body_frame = Frame(MARGIN_L, MARGIN_B, PAGE_W - MARGIN_L - MARGIN_R,
                       PAGE_H - MARGIN_T - MARGIN_B, id='body',
                       leftPadding=0, rightPadding=0,
                       topPadding=0, bottomPadding=0,
                       showBoundary=0)

    cover_template = PageTemplate(id='cover', frames=[cover_frame], onPage=cover_page)
    body_template = PageTemplate(id='body', frames=[body_frame], onPage=body_page)

    doc.addPageTemplates([cover_template, body_template])

    story = []
    # Cover page (uses cover template)
    story.extend(build_cover())
    # Switch to body template for the rest
    story.append(NextPageTemplate('body'))
    story.append(PageBreak())  # ensure template switch
    # Body content
    story.extend(build_toc())
    story.extend(build_executive_summary())
    story.extend(build_vision_goals())
    story.extend(build_tech_stack())
    story.extend(build_identity())
    story.extend(build_hero_roster_all())
    story.extend(build_suits())
    story.extend(build_abilities())
    story.extend(build_world())
    story.extend(build_vehicles())
    story.extend(build_crimes())
    story.extend(build_missions())
    story.extend(build_enemies())
    story.extend(build_bosses())
    story.extend(build_hq_phone())
    story.extend(build_ui())
    story.extend(build_art())
    story.extend(build_story())
    story.extend(build_replayability())
    story.extend(build_roadmap())
    story.extend(build_phase0())
    story.extend(build_appendix())
    story.extend(build_closing())

    doc.build(story)
    print(f'PDF generated: {OUTPUT}')
    sz = os.path.getsize(OUTPUT) / 1024
    print(f'Size: {sz:.1f} KB')

if __name__ == '__main__':
    main()
