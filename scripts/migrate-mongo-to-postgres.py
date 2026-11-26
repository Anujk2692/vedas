#!/usr/bin/env python3
"""
Copy all data from legacy MongoDB (vedas_service_db / all_service_db) into PostgreSQL (sanatan_db / all_service_db).

Usage:
  pip install pymongo psycopg2-binary
  MONGO_URI="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/vedas_service_db" \
  POSTGRES_URL="postgresql://sanatan:PASS@HOST/sanatan_db?sslmode=require" \
  python3 scripts/migrate-mongo-to-postgres.py
"""

import json
import os
import sys
import uuid

try:
    from pymongo import MongoClient
except ImportError:
    print("Missing pymongo. Install with: pip install pymongo psycopg2-binary")
    sys.exit(1)

try:
    import psycopg2
    from psycopg2.extras import execute_batch
except ImportError:
    print("Missing psycopg2-binary. Install with: pip install pymongo psycopg2-binary")
    sys.exit(1)


MONGO_URI = os.environ.get("MONGO_URI") or os.environ.get("SPRING_DATA_MONGODB_URI")
MONGO_DB = os.environ.get("MONGO_DB") or os.environ.get("SPRING_DATA_MONGODB_DATABASE") or "vedas_service_db"
POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("SPRING_DATASOURCE_URL") or os.environ.get("DATABASE_URL")

if not MONGO_URI:
    print("Error: Set MONGO_URI (or SPRING_DATA_MONGODB_URI) environment variable.")
    sys.exit(1)
if not POSTGRES_URL:
    print("Error: Set POSTGRES_URL (or SPRING_DATASOURCE_URL) environment variable.")
    sys.exit(1)

if POSTGRES_URL.startswith("jdbc:"):
    POSTGRES_URL = POSTGRES_URL[len("jdbc:"):]


def to_json(val):
    if val is None:
        return None
    return json.dumps(val, ensure_ascii=False)


def str_id(doc, id_map=None):
    raw = str(doc.get("_id", "")) or str(uuid.uuid4())
    if id_map is not None:
        return id_map.setdefault(raw, raw)
    return raw


def migrate():
    mongo = MongoClient(MONGO_URI, serverSelectionTimeoutMS=15000)
    db = mongo[MONGO_DB]
    pg = psycopg2.connect(POSTGRES_URL)
    pg.autocommit = False
    cur = pg.cursor()

    try:
        # 1. languages
        langs = list(db["languages"].find({}))
        if langs:
            rows = [
                (
                    str_id(d),
                    d.get("code"),
                    d.get("name"),
                    d.get("nativeName"),
                    d.get("script"),
                    bool(d.get("rtl", False)),
                    bool(d.get("active", True)),
                )
                for d in langs
            ]
            execute_batch(
                cur,
                """
                INSERT INTO languages (id, code, name, native_name, script, rtl, active)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (code) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated languages: {len(rows)}")

        # 2. vedas
        vedas = list(db["vedas"].find({}))
        if vedas:
            rows = [
                (
                    str_id(d),
                    d.get("slug"),
                    int(d.get("order", 0)),
                    d.get("scriptureType"),
                    d.get("sanskritName"),
                    d.get("transliteration"),
                    to_json(d.get("titles")),
                    to_json(d.get("descriptions")),
                    d.get("coverImageUrl"),
                    int(d.get("chapterCount", 0)),
                    int(d.get("verseCount", 0)),
                    bool(d.get("active", True)),
                    to_json(d.get("overviews")),
                    to_json(d.get("significances")),
                    to_json(d.get("structures")),
                    to_json(d.get("historicalContexts")),
                    to_json(d.get("periods")),
                    to_json(d.get("divisionNames")),
                    int(d.get("divisionCount", 0)),
                    int(d.get("mantraCount", 0)),
                    to_json(d.get("compositionTypes")),
                    to_json(d.get("branches")),
                    to_json(d.get("specialFeatures")),
                    to_json(d.get("primaryDeities")),
                    to_json(d.get("keyThemes")),
                    to_json(d.get("famousSages")),
                    to_json(d.get("philosophies")),
                    to_json(d.get("ritualsAndPractices")),
                    to_json(d.get("famousHymns")),
                    to_json(d.get("learningGuides")),
                    to_json(d.get("coreConcepts")),
                    to_json(d.get("modernRelevance")),
                    to_json(d.get("relatedTexts")),
                    to_json(d.get("pronunciationGuides")),
                    d.get("pdfUrl"),
                    d.get("pdfSourceName"),
                    to_json(d.get("pdfTitles")),
                )
                for d in vedas
            ]
            execute_batch(
                cur,
                """
                INSERT INTO vedas (
                    id, slug, sort_order, scripture_type, sanskrit_name, transliteration,
                    titles, descriptions, cover_image_url, chapter_count, verse_count, active,
                    overviews, significances, structures, historical_contexts, periods,
                    division_names, division_count, mantra_count, composition_types, branches,
                    special_features, primary_deities, key_themes, famous_sages, philosophies,
                    rituals_and_practices, famous_hymns, learning_guides, core_concepts,
                    modern_relevance, related_texts, pronunciation_guides,
                    pdf_url, pdf_source_name, pdf_titles
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                ON CONFLICT (slug) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated vedas: {len(rows)}")

        # 3. chapters
        chapters = list(db["chapters"].find({}))
        if chapters:
            rows = [
                (
                    str_id(d),
                    str(d.get("vedaId", "")),
                    int(d.get("number", 0)),
                    d.get("sanskritName"),
                    d.get("transliteration"),
                    to_json(d.get("titles")),
                    to_json(d.get("summaries")),
                    int(d.get("verseCount", 0)),
                    d.get("audioUrl"),
                    d.get("videoUrl"),
                    int(d.get("durationSeconds", 0)),
                    to_json(d.get("overviews")),
                    to_json(d.get("divisionLabels")),
                    int(d.get("suktaCount", 0)),
                    int(d.get("mantraCount", 0)),
                    to_json(d.get("attributedSages")),
                    to_json(d.get("keyThemes")),
                    to_json(d.get("notableSuktas")),
                )
                for d in chapters
            ]
            execute_batch(
                cur,
                """
                INSERT INTO chapters (
                    id, veda_id, item_number, sanskrit_name, transliteration, titles, summaries,
                    verse_count, audio_url, video_url, duration_seconds, overviews, division_labels,
                    sukta_count, mantra_count, attributed_sages, key_themes, notable_suktas
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated chapters: {len(rows)}")

        # 4. verses
        verses = list(db["verses"].find({}))
        if verses:
            rows = [
                (
                    str_id(d),
                    str(d.get("vedaId", "")),
                    str(d.get("chapterId", "")),
                    int(d.get("number", 0)),
                    d.get("sanskrit"),
                    d.get("transliteration"),
                    to_json(d.get("translations")),
                    to_json(d.get("commentaries")),
                    d.get("audioUrl"),
                    d.get("videoUrl"),
                    int(d.get("audioDurationSeconds", 0)),
                    d.get("suktaReference"),
                    to_json(d.get("rishis")),
                )
                for d in verses
            ]
            execute_batch(
                cur,
                """
                INSERT INTO verses (
                    id, veda_id, chapter_id, item_number, sanskrit, transliteration,
                    translations, commentaries, audio_url, video_url, audio_duration_seconds,
                    sukta_reference, rishis
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                rows,
                page_size=200,
            )
            print(f"Migrated verses: {len(rows)}")

        # 5. media
        media = list(db["media"].find({}))
        if media:
            rows = [
                (
                    str_id(d),
                    d.get("title"),
                    d.get("type"),
                    d.get("vedaId"),
                    d.get("chapterId"),
                    d.get("verseId"),
                    d.get("url"),
                    d.get("thumbnailUrl"),
                    int(d.get("durationSeconds", 0)),
                    d.get("languageCode"),
                    d.get("reciter"),
                    to_json(d.get("descriptions")),
                    bool(d.get("featured", False)),
                )
                for d in media
            ]
            execute_batch(
                cur,
                """
                INSERT INTO media (
                    id, title, type, veda_id, chapter_id, verse_id, url, thumbnail_url,
                    duration_seconds, language_code, reciter, descriptions, featured
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated media: {len(rows)}")

        # 6. aartis
        aartis = list(db["aartis"].find({}))
        if aartis:
            rows = [
                (
                    str_id(d),
                    d.get("slug"),
                    int(d.get("order", 0)),
                    d.get("deityType"),
                    d.get("sanskritName"),
                    d.get("transliteration"),
                    to_json(d.get("titles")),
                    to_json(d.get("descriptions")),
                    d.get("coverImageUrl"),
                    d.get("pdfUrl"),
                    d.get("audioUrl"),
                    d.get("videoUrl"),
                    int(d.get("audioDurationSeconds", 0)),
                    int(d.get("videoDurationSeconds", 0)),
                    d.get("reciter"),
                    to_json(d.get("lines")),
                    to_json(d.get("recordings")),
                    bool(d.get("active", True)),
                )
                for d in aartis
            ]
            execute_batch(
                cur,
                """
                INSERT INTO aartis (
                    id, slug, sort_order, deity_type, sanskrit_name, transliteration,
                    titles, descriptions, cover_image_url, pdf_url, audio_url, video_url,
                    audio_duration_seconds, video_duration_seconds, reciter, lines, recordings, active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated aartis: {len(rows)}")

        # 7. topics
        topics = list(db["topics"].find({}))
        if topics:
            rows = [
                (
                    str_id(d),
                    d.get("slug"),
                    int(d.get("order", 0)),
                    d.get("icon"),
                    to_json(d.get("titles")),
                    to_json(d.get("descriptions")),
                    to_json(d.get("summaries")),
                    to_json(d.get("simpleExplanations")),
                    to_json(d.get("detailedExplanations")),
                    to_json(d.get("relatedScriptureSlugs")),
                    bool(d.get("active", True)),
                )
                for d in topics
            ]
            execute_batch(
                cur,
                """
                INSERT INTO topics (
                    id, slug, sort_order, icon, titles, descriptions, summaries,
                    simple_explanations, detailed_explanations, related_scripture_slugs, active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated topics: {len(rows)}")

        # 8. study_paths
        paths = list(db["study_paths"].find({}))
        if paths:
            rows = [
                (
                    str_id(d),
                    d.get("slug"),
                    int(d.get("order", 0)),
                    d.get("level"),
                    d.get("durationLabel"),
                    d.get("icon"),
                    to_json(d.get("titles")),
                    to_json(d.get("descriptions")),
                    to_json(d.get("steps")),
                    bool(d.get("active", True)),
                )
                for d in paths
            ]
            execute_batch(
                cur,
                """
                INSERT INTO study_paths (
                    id, slug, sort_order, level, duration_label, icon,
                    titles, descriptions, steps, active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated study_paths: {len(rows)}")

        # 9. external_resources
        resources = list(db["external_resources"].find({}))
        if resources:
            rows = [
                (
                    str_id(d),
                    d.get("slug"),
                    int(d.get("order", 0)),
                    d.get("type"),
                    d.get("url"),
                    d.get("sourceName"),
                    to_json(d.get("titles")),
                    to_json(d.get("descriptions")),
                    d.get("scriptureSlug"),
                    d.get("topicSlug"),
                    bool(d.get("active", True)),
                )
                for d in resources
            ]
            execute_batch(
                cur,
                """
                INSERT INTO external_resources (
                    id, slug, sort_order, type, url, source_name,
                    titles, descriptions, scripture_slug, topic_slug, active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (slug) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated external_resources: {len(rows)}")

        # 10. user_bookmarks
        bookmarks = list(db["user_bookmarks"].find({}))
        if bookmarks:
            rows = [
                (
                    str_id(d),
                    d.get("deviceId"),
                    d.get("itemId"),
                    d.get("type"),
                    d.get("title"),
                    d.get("sanskrit"),
                    d.get("subtitle"),
                    d.get("chapterId"),
                    d.get("vedaTitle"),
                    int(d.get("savedAt", 0)),
                )
                for d in bookmarks
            ]
            execute_batch(
                cur,
                """
                INSERT INTO user_bookmarks (
                    id, device_id, item_id, type, title, sanskrit,
                    subtitle, chapter_id, veda_title, saved_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (device_id, item_id) DO NOTHING
                """,
                rows,
            )
            print(f"Migrated user_bookmarks: {len(rows)}")

        pg.commit()
        print("Migration completed successfully.")
    except Exception as exc:
        pg.rollback()
        print(f"Migration failed: {exc}")
        raise
    finally:
        cur.close()
        pg.close()
        mongo.close()


if __name__ == "__main__":
    migrate()
