from django.contrib import admin
from django import forms
from .models import (
    BannerSlide, AboutSection, Program, ImpactStat, Story, News, ContactMessage, ContactInfo
)

# ---------- AboutSection: simple plain-text fields ----------
class AboutSectionForm(forms.ModelForm):
    highlight_words = forms.CharField(
        required=False,
        help_text='Enter comma-separated values (e.g. education, health, environment)',
        widget=forms.TextInput(attrs={"placeholder": "education, health, environment"}),
        label="Highlight words",
    )

    points = forms.CharField(
        required=False,
        help_text='Enter one point per line (e.g. Education Support, Healthcare Access, etc.)',
        widget=forms.Textarea(attrs={"rows": 4, "placeholder": "Education Support\nHealthcare Access\nEnvironment Action"}),
        label="Points (simple list)",
    )

    class Meta:
        model = AboutSection
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Show stored lists as text in admin
        if isinstance(self.instance.highlight_words, list):
            self.fields["highlight_words"].initial = ", ".join(self.instance.highlight_words)
        if isinstance(self.instance.points, list):
            # If it's a list of strings, join by newlines
            if all(isinstance(p, str) for p in self.instance.points):
                self.fields["points"].initial = "\n".join(self.instance.points)
            # If it's list of dicts (old data), show titles
            elif all(isinstance(p, dict) for p in self.instance.points):
                self.fields["points"].initial = "\n".join(p.get("title", "") for p in self.instance.points if p.get("title"))

    def clean_highlight_words(self):
        # Convert "education, health" -> ["education", "health"]
        raw = self.cleaned_data.get("highlight_words", "")
        words = [w.strip() for w in raw.split(",") if w.strip()]
        return words

    def clean_points(self):
        # Convert multiple lines into list of strings
        raw = self.cleaned_data.get("points", "")
        points_list = [p.strip() for p in raw.splitlines() if p.strip()]
        return points_list


# ---------- All other admin classes (unchanged) ----------
from django.contrib import admin
from .models import BannerSlide

@admin.register(BannerSlide)
class BannerSlideAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "order", "is_active", "cta_text", "cta_href")
    list_editable = ("order", "is_active")
    search_fields = ("title", "subtitle", "cta_text", "cta_href")
    list_filter = ("is_active",)



@admin.register(AboutSection)
class AboutAdmin(admin.ModelAdmin):
    form = AboutSectionForm
    list_display = ("heading", "updated_at")


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("order", "is_active")


@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "suffix", "order")
    list_editable = ("value", "suffix", "order")


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active")
    list_editable = ("order", "is_active")


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "published")
    list_filter = ("published", "date")
    prepopulated_fields = {"slug": ("title",)}





@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "subject", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at")

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("email", "phone", "updated_at")