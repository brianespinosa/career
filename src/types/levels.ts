import type EM from '@/data/em.json';
import type IC from '@/data/ic.json';

export type EMKeys = keyof typeof EM;
export type ICKeys = keyof typeof IC;
export type EMDetails = (typeof EM)[EMKeys];
export type ICDetails = (typeof IC)[ICKeys];
export type ICRecord = Record<ICKeys, ICDetails>;
export type EMRecord = Record<EMKeys, EMDetails>;
export type LevelRecord = ICRecord | EMRecord;
export type LevelKeys = EMKeys | ICKeys;
export type LevelDetails = EMDetails | ICDetails;
