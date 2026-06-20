export function isAuthenticVedicMedia(url?: string | null): boolean {
  if (!url) {
    return false;
  }
  return url.includes('archive.org') && !url.includes('soundhelix');
}

export function mediaQualityLabel(url?: string | null): string | null {
  if (!isAuthenticVedicMedia(url)) {
    return null;
  }
  return 'Traditional Patha · Clear Pronunciation';
}
