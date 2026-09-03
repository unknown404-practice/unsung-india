from typing import List, Optional
from pydantic import BaseModel


class BannerTemplateRead(BaseModel):
    id: str
    name: str
    aspect_ratio: str
    width_px: int
    height_px: int
    format_type: str
    supported_themes: List[str] = ["saffron_navy", "tricolor_minimal", "vintage_sepia"]


class BannerTemplateListResponse(BaseModel):
    templates: List[BannerTemplateRead]


class BannerRenderRequest(BaseModel):
    hero_id: str
    template_id: str = "metro_pillar"  # roadside_billboard, metro_pillar, bus_stop, college_board_a3
    language_pair: str = "en-hi"
    theme: str = "saffron_navy"
    format: str = "png"  # png or pdf
