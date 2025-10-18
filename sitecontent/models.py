from django.db import models

# ====== Banner (Hero Slider) ======
class Banner(models.Model):
    title = models.CharField(max_length=150)
    caption = models.TextField(blank=True)
    image = models.ImageField(upload_to="banners/")
    mobile_image = models.ImageField(upload_to="banners/", blank=True, null=True)
    cta_label = models.CharField(max_length=60, blank=True)
    cta_href  = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ("order", "id")
    def __str__(self):
        return f"{self.title} (#{self.order})"


# ====== About Section (Site Configuration) ======
class AboutSection(models.Model):
    # Top area
    heading = models.CharField(max_length=100, default="About Us")
    description = models.TextField()
    image = models.ImageField(upload_to="about/")

    # Stats (4 quick numbers)
    stat1_number = models.CharField(max_length=20, blank=True)
    stat1_label  = models.CharField(max_length=100, blank=True)
    stat2_number = models.CharField(max_length=20, blank=True)
    stat2_label  = models.CharField(max_length=100, blank=True)
    stat3_number = models.CharField(max_length=20, blank=True)
    stat3_label  = models.CharField(max_length=100, blank=True)
    stat4_number = models.CharField(max_length=20, blank=True)
    stat4_label  = models.CharField(max_length=100, blank=True)

    # Mission / Vision / Values
    mission_title = models.CharField(max_length=200, blank=True)
    mission_description = models.TextField(blank=True)
    mission_image = models.ImageField(upload_to="about/mvv/", blank=True, null=True)

    vision_title = models.CharField(max_length=200, blank=True)
    vision_description = models.TextField(blank=True)
    vision_image = models.ImageField(upload_to="about/mvv/", blank=True, null=True)

    values_title = models.CharField(max_length=200, blank=True)
    values_description = models.TextField(blank=True)
    values_image = models.ImageField(upload_to="about/mvv/", blank=True, null=True)

    # Call-to-action buttons
    cta_primary_label  = models.CharField(max_length=60, blank=True)
    cta_primary_href   = models.CharField(max_length=200, blank=True)
    cta_secondary_label = models.CharField(max_length=60, blank=True)
    cta_secondary_href  = models.CharField(max_length=200, blank=True)

    # on/off
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"About Section (active={self.is_active})"

    class Meta:
        verbose_name = "About Section"
        verbose_name_plural = "About Section"


# Unlimited “What We Do” cards (linked to AboutSection)
class WhatWeDoItem(models.Model):
    about = models.ForeignKey(AboutSection, related_name="whatwedo_items", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    class Meta:
        ordering = ("order", "id")
    def __str__(self):
        return self.title


# Unlimited “Our Journey” timeline entries (linked to AboutSection)
class JourneyEntry(models.Model):
    about = models.ForeignKey(AboutSection, related_name="journey_entries", on_delete=models.CASCADE)
    year = models.CharField(max_length=10)              # e.g. "2019"
    text = models.CharField(max_length=300)             # one line
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    class Meta:
        ordering = ("order", "id")
    def __str__(self):
        return f"{self.year}: {self.text[:40]}…"

from django.db import models

class NewsItem(models.Model):
    tag = models.CharField(max_length=40, default="NEWS", blank=True)
    tag_color = models.CharField(max_length=40, blank=True)  # example: "bg-purple-600 text-white"
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    image = models.ImageField(upload_to="news/")
    published_at = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "-published_at", "-id")

    def __str__(self):
        return self.title

class Program(models.Model):
    tag = models.CharField(max_length=40)  # EDUCATION / HEALTH / etc.
    tag_color = models.CharField(max_length=40, blank=True)  # e.g. "bg-green-500 text-white"
    title = models.CharField(max_length=120)
    desc = models.TextField()
    body = models.TextField(blank=True)
    image = models.ImageField(upload_to="programs/")  # Image at the top of each card
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Program"
        verbose_name_plural = "Programs"

    def __str__(self):
        return self.title
    
class Story(models.Model):
    tag = models.CharField(max_length=40, default="STORY")
    tag_color = models.CharField(max_length=40, blank=True)
    title = models.CharField(max_length=160)
    desc = models.TextField()
    body = models.TextField(blank=True)
    image = models.ImageField(upload_to="stories/")
    href = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)