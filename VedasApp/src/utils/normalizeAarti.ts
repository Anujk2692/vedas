import type {AartiDetail, AartiSummary} from '../api/types';

type RawAarti = Partial<AartiSummary> & Partial<AartiDetail> & {[key: string]: unknown};

function readFlag(raw: RawAarti, flag: 'hasPdf' | 'hasAudio' | 'hasVideo', urlKey: keyof AartiDetail): boolean {
  const explicit = raw[flag];
  if (typeof explicit === 'boolean') {
    return explicit;
  }
  const url = raw[urlKey];
  return typeof url === 'string' && url.trim().length > 0;
}

export function normalizeAartiSummary(raw: unknown): AartiSummary {
  const item = raw as RawAarti;
  return {
    id: String(item.id ?? ''),
    slug: String(item.slug ?? ''),
    order: Number(item.order ?? 0),
    deityType: (item.deityType as AartiSummary['deityType']) ?? 'DEVTA',
    sanskritName: String(item.sanskritName ?? ''),
    transliteration: String(item.transliteration ?? ''),
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    coverImageUrl: String(item.coverImageUrl ?? ''),
    hasPdf: readFlag(item, 'hasPdf', 'pdfUrl'),
    hasAudio: readFlag(item, 'hasAudio', 'audioUrl'),
    hasVideo: readFlag(item, 'hasVideo', 'videoUrl'),
  };
}

export function normalizeAartiDetail(raw: unknown): AartiDetail {
  const item = raw as RawAarti;
  const summary = normalizeAartiSummary(item);
  const lines = Array.isArray(item.lines)
    ? item.lines.map(line => ({
        sanskrit: String(line?.sanskrit ?? ''),
        transliteration: String(line?.transliteration ?? ''),
        translation: String(line?.translation ?? ''),
      }))
    : [];
  let recordings = Array.isArray(item.recordings)
    ? item.recordings.map(rec => ({
        id: String(rec?.id ?? ''),
        type: (rec?.type === 'VIDEO' ? 'VIDEO' : 'AUDIO') as 'AUDIO' | 'VIDEO',
        title: String(rec?.title ?? ''),
        singer: String(rec?.singer ?? ''),
        style: String(rec?.style ?? ''),
        url: String(rec?.url ?? ''),
        durationSeconds: Number(rec?.durationSeconds ?? 0),
      }))
    : [];

  const audioUrl = String(item.audioUrl ?? '');
  const videoUrl = String(item.videoUrl ?? '');
  const reciter = String(item.reciter ?? '');

  if (recordings.length === 0) {
    if (audioUrl.trim()) {
      recordings.push({
        id: 'primary-audio',
        type: 'AUDIO',
        title: summary.title,
        singer: reciter || 'Traditional Singer',
        style: 'Primary recording',
        url: audioUrl,
        durationSeconds: Number(item.audioDurationSeconds ?? 0),
      });
    }
    if (videoUrl.trim()) {
      recordings.push({
        id: 'primary-video',
        type: 'VIDEO',
        title: `${summary.title} — Video`,
        singer: reciter || 'Traditional',
        style: 'Ceremonial video',
        url: videoUrl,
        durationSeconds: Number(item.videoDurationSeconds ?? 0),
      });
    }
  }

  return {
    ...summary,
    pdfUrl: String(item.pdfUrl ?? ''),
    audioUrl,
    videoUrl,
    audioDurationSeconds: Number(item.audioDurationSeconds ?? 0),
    videoDurationSeconds: Number(item.videoDurationSeconds ?? 0),
    reciter,
    lines,
    recordings: recordings.filter(r => r.url.trim().length > 0),
  };
}
