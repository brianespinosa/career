import { track as vercelTrack } from '@vercel/analytics';

type TrackProperties = Record<string, string | number | boolean | null>;

export function track(name: string, properties?: TrackProperties): void {
  vercelTrack(name, properties);
}
