import type { ReactNode, ReactElement } from 'react';

type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type Hours = `${number}${number}`;
type Minutes = `${number}${number}`;
type Seconds = `${number}${number}`;

export type ISODate = `${Year}-${Month}-${Day}T${Hours}:${Minutes}:${Seconds}Z`;

export type AppProviderType = (params: { children: ReactNode }) => ReactElement;

export enum TaskType {
  VOICE = 'voice',
  TEXT = 'text',
}

export enum TaskPlatform {
  CALL = 'call',
  EMAIL = 'email',
  FACEBOOK_CHAT = 'facebook_chat',
  WEBSITE_CHAT = 'website_chat',
}
