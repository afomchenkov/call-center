export const LANGUAGES = [
  'English',
  'French',
  'German',
  'Spanish',
  'Portuguese',
  'Russian',
  'Chinese',
  'Turkish',
  'Japanese',
  'Arabic',
  'Italian',
];

export const DATE_FORMAT_1 = 'dd MMM yyyy / HH:MM';

export const LANGUAGE_CODES: Record<string, string> = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Spanish: 'es',
  Portuguese: 'pt',
  Russian: 'ru',
  Chinese: 'zh',
  Turkish: 'tr',
  Japanese: 'ja',
  Arabic: 'ar',
  Italian: 'it',
};

export const AVAILABLE_CHANNELS = [
  { name: 'Website Chat', value: 'website_chat' },
  { name: 'Facebook Chat', value: 'facebook_chat' },
  { name: 'Email', value: 'email' },
  { name: 'Call', value: 'call' },
] as const;
