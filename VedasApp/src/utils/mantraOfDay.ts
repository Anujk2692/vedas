export interface DailyMantra {
  sanskrit: string;
  transliteration: string;
  translation: string;
  source: string;
  vedaSlug: string;
  vedaTitle: string;
  theme: string;
}

const DAILY_MANTRAS: DailyMantra[] = [
  {
    sanskrit: 'तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    transliteration: 'Tat savitur vareṇyaṃ bhargo devasya dhīmahi | Dhiyo yo naḥ pracodayāt',
    translation: 'We meditate on the glorious light of divine Savitar — may he inspire our intellect.',
    source: 'Rigveda 3.62.10 — Gayatri Mantra',
    vedaSlug: 'rigveda',
    vedaTitle: 'Rigveda',
    theme: 'Illumination & wisdom',
  },
  {
    sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवं ऋत्विजम् ।',
    transliteration: 'Agnim īḷe purohitaṃ yajñasya devaṃ ṛtvijam',
    translation: 'I praise Agni, the chosen priest, god, minister of sacrifice.',
    source: 'Rigveda 1.1.1 — Agni Sukta',
    vedaSlug: 'rigveda',
    vedaTitle: 'Rigveda',
    theme: 'Sacred fire & devotion',
  },
  {
    sanskrit: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।',
    transliteration: 'Tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam',
    translation: 'We worship the three-eyed One who nourishes all beings.',
    source: 'Yajurveda — Maha Mrityunjaya',
    vedaSlug: 'yajurveda',
    vedaTitle: 'Yajurveda',
    theme: 'Healing & protection',
  },
  {
    sanskrit: 'शान्तिर् अवतु शान्तिर् एनतु शान्तिर् अस्तु ।',
    transliteration: 'Śāntir avatu śāntir enatu śāntir astu',
    translation: 'May peace protect us, may peace flow through us, may peace be with all.',
    source: 'Atharvaveda — Shanti Mantra',
    vedaSlug: 'atharvaveda',
    vedaTitle: 'Atharvaveda',
    theme: 'Peace & harmony',
  },
  {
    sanskrit: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् ।',
    transliteration: 'Sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt',
    translation: 'The Purusha has a thousand heads, a thousand eyes, and a thousand feet.',
    source: 'Rigveda 10.90 — Purusha Sukta',
    vedaSlug: 'rigveda',
    vedaTitle: 'Rigveda',
    theme: 'Cosmic unity',
  },
  {
    sanskrit: 'पवमानः सोमो अद्रिभिः ।',
    transliteration: 'Pavamānaḥ somo adribhiḥ',
    translation: 'Soma flows purified over the stones.',
    source: 'Samaveda — Pavamana Soma',
    vedaSlug: 'samaveda',
    vedaTitle: 'Samaveda',
    theme: 'Purification & bliss',
  },
  {
    sanskrit: 'अग्ने नय सुपथा राये अस्मान् ।',
    transliteration: 'Agne naya supathā rāye asmān',
    translation: 'O Agni, lead us on the good path to prosperity.',
    source: 'Rigveda / Yajurveda',
    vedaSlug: 'yajurveda',
    vedaTitle: 'Yajurveda',
    theme: 'Guidance & prosperity',
  },
];

export function getMantraOfDay(): DailyMantra {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return DAILY_MANTRAS[dayIndex % DAILY_MANTRAS.length];
}
