import type CSEM from '@/data/cs-em.json';
import type CSPS from '@/data/cs-ps.json';
import type CSTSE from '@/data/cs-tse.json';
import type EM from '@/data/em.json';
import type EMML from '@/data/em-ml.json';
import type IC from '@/data/ic.json';
import type ICMML from '@/data/ic-ml.json';

type EMKeys = keyof typeof EM;
type ICKeys = keyof typeof IC;
type EMMLKeys = keyof typeof EMML;
type ICMMLKeys = keyof typeof ICMML;
type CSPSKeys = keyof typeof CSPS;
type CSTSEKeys = keyof typeof CSTSE;
type CSEMKeys = keyof typeof CSEM;
type EMDetails = (typeof EM)[EMKeys];
type ICDetails = (typeof IC)[ICKeys];
type EMMLDetails = (typeof EMML)[EMMLKeys];
type ICMMLDetails = (typeof ICMML)[ICMMLKeys];
type CSPSDetails = (typeof CSPS)[CSPSKeys];
type CSTSEDetails = (typeof CSTSE)[CSTSEKeys];
type CSEMDetails = (typeof CSEM)[CSEMKeys];
type ICRecord = Record<ICKeys, ICDetails>;
type EMRecord = Record<EMKeys, EMDetails>;
type EMMLRecord = Record<EMMLKeys, EMMLDetails>;
type ICMMLRecord = Record<ICMMLKeys, ICMMLDetails>;
type CSPSRecord = Record<CSPSKeys, CSPSDetails>;
type CSTSERecord = Record<CSTSEKeys, CSTSEDetails>;
type CSEMRecord = Record<CSEMKeys, CSEMDetails>;
export type LevelRecord =
  | ICRecord
  | EMRecord
  | EMMLRecord
  | ICMMLRecord
  | CSPSRecord
  | CSTSERecord
  | CSEMRecord;
export type LevelKeys =
  | EMKeys
  | ICKeys
  | EMMLKeys
  | ICMMLKeys
  | CSPSKeys
  | CSTSEKeys
  | CSEMKeys;
export type LevelDetails =
  | EMDetails
  | ICDetails
  | EMMLDetails
  | ICMMLDetails
  | CSPSDetails
  | CSTSEDetails
  | CSEMDetails;
