from django.contrib import admin
from .models import Banner, AboutSection, WhatWeDoItem, JourneyEntry, Program, Story

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "updated")
    list_editable = ("order", "is_active")
    search_fields = ("title", "caption")


class WhatWeDoItemInline(admin.TabularInline):
    model = WhatWeDoItem
    extra = 1
    fields = ("title", "description", "order", "is_active")


class JourneyEntryInline(admin.TabularInline):
    model = JourneyEntry
    extra = 1
    fields = ("year", "text", "order", "is_active")


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ("heading", "is_active")
    list_editable = ("is_active",)
    fieldsets = (
        ("Top Info", {"fields": ("heading", "description", "image")}),
        ("Stats", {"fields": (
            ("stat1_number","stat1_label"),
            ("stat2_number","stat2_label"),
            ("stat3_number","stat3_label"),
            ("stat4_number","stat4_label"),
        )}),
        ("Mission", {"fields": ("mission_title","mission_description","mission_image")}),
        ("Vision",  {"fields": ("vision_title","vision_description","vision_image")}),
        ("Values",  {"fields": ("values_title","values_description","values_image")}),
        ("CTAs",    {"fields": ("cta_primary_label","cta_primary_href",
                                "cta_secondary_label","cta_secondary_href")}),
        ("Status",  {"fields": ("is_active",)}),
    )
    inlines = [WhatWeDoItemInline, JourneyEntryInline]


# Optional: browse them separately too
@admin.register(WhatWeDoItem)
class WhatWeDoItemAdmin(admin.ModelAdmin):
    list_display = ("title","about","order","is_active")
    list_filter = ("about","is_active")
    search_fields = ("title","description")

@admin.register(JourneyEntry)
class JourneyEntryAdmin(admin.ModelAdmin):
    list_display = ("year","about","order","is_active")
    list_filter = ("about","is_active")
    search_fields = ("year","text")

from django.contrib import admin
from .models import NewsItem

@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "published_at", "is_active", "order")
    list_filter = ("is_active", "tag")
    search_fields = ("title", "body")
    ordering = ("order",)

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "order", "is_active")
    list_filter = ("is_active", "tag")
    search_fields = ("title", "desc", "body")
    ordering = ("order",)
    
    
@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "order", "is_active")
    list_filter  = ("is_active", "tag")
    search_fields = ("title", "desc", "body")
    ordering = ("order",)