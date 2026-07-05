#!/usr/bin/env python3
"""
Regenerate vedas-backend/src/main/resources/gita/gita-verses.json
from the open gita/gita dataset (https://github.com/gita/gita).

Usage:
  python3 scripts/import-gita.py
  python3 scripts/import-gita.py --output path/to/gita-verses.json
  python3 scripts/import-gita.py --cache-dir /tmp/gita-data
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

REPO_BASE = "https://raw.githubusercontent.com/gita/gita/main/data"
DEFAULT_OUTPUT = (
    Path(__file__).resolve().parent.parent
    / "vedas-backend/src/main/resources/gita/gita-verses.json"
)
VERSE_MARK = re.compile(r"।।[\d\.]+।।")
WHITESPACE = re.compile(r"\s+")


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {url} -> {dest}")
    with urllib.request.urlopen(url, timeout=60) as response:
        dest.write_bytes(response.read())


def load_dataset(cache_dir: Path) -> tuple[list[dict], list[dict]]:
    verse_path = cache_dir / "verse.json"
    translation_path = cache_dir / "translation.json"

    if not verse_path.exists():
        download(f"{REPO_BASE}/verse.json", verse_path)
    if not translation_path.exists():
        download(f"{REPO_BASE}/translation.json", translation_path)

    with verse_path.open(encoding="utf-8") as handle:
        verses = json.load(handle)
    with translation_path.open(encoding="utf-8") as handle:
        translations = json.load(handle)
    return verses, translations


def clean_sanskrit(text: str | None) -> str:
    text = (text or "").replace("\n", " ")
    text = VERSE_MARK.sub("", text)
    return WHITESPACE.sub(" ", text).strip()


def clean_transliteration(text: str | None) -> str:
    return WHITESPACE.sub(" ", (text or "").replace("\n", " ")).strip()


def clean_translation(text: str | None) -> str:
    text = (text or "").strip()
    text = VERSE_MARK.sub("", text)
    return WHITESPACE.sub(" ", text).strip()


def pick_translations(translations: list[dict]) -> tuple[dict[int, str], dict[int, str]]:
    """First English (language_id=1) and Hindi (language_id=2) entry per verse."""
    english: dict[int, str] = {}
    hindi: dict[int, str] = {}
    for row in translations:
        verse_id = row["verse_id"]
        language_id = row.get("language_id")
        description = clean_translation(row.get("description"))
        if not description:
            continue
        if language_id == 1 and verse_id not in english:
            english[verse_id] = description
        elif language_id == 2 and verse_id not in hindi:
            hindi[verse_id] = description
    return english, hindi


def build_records(verses: list[dict], translations: list[dict]) -> list[dict]:
    english, hindi = pick_translations(translations)
    records: list[dict] = []

    for verse in sorted(
        verses, key=lambda item: (item["chapter_number"], item["verse_number"])
    ):
        chapter = verse["chapter_number"]
        number = verse["verse_number"]
        verse_id = verse["id"]
        records.append(
            {
                "chapter": chapter,
                "verse": number,
                "sa": clean_sanskrit(verse.get("text")),
                "tr": clean_transliteration(verse.get("transliteration")),
                "en": english.get(verse_id, ""),
                "hi": hindi.get(verse_id, ""),
                "enCom": f"Bhagavad Gita Chapter {chapter}, Verse {number}",
                "hiCom": f"श्रीमद्भगवद्गीता अध्याय {chapter}, श्लोक {number}",
            }
        )
    return records


def summarize(records: list[dict]) -> None:
    missing_en = sum(1 for row in records if not row["en"])
    missing_hi = sum(1 for row in records if not row["hi"])
    chapters = len({row["chapter"] for row in records})
    print(f"Verses: {len(records)} across {chapters} chapters")
    print(f"Missing EN: {missing_en}, Missing HI: {missing_hi}")
    if records:
        sample = records[0]
        print(
            f"Sample ch{sample['chapter']}.{sample['verse']}: "
            f"{sample['sa'][:60]}..."
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Import Bhagavad Gita verses from gita/gita")
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output JSON path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--cache-dir",
        type=Path,
        default=Path("/tmp/gita-gita-data"),
        help="Directory to cache downloaded source JSON",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build records but do not write output file",
    )
    args = parser.parse_args()

    verses, translations = load_dataset(args.cache_dir)
    records = build_records(verses, translations)
    summarize(records)

    if args.dry_run:
        print("Dry run — no file written.")
        return 0

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as handle:
        json.dump(records, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
