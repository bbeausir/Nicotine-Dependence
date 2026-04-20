import { z } from 'zod';

export const ageBandIds = [
  'under_18',
  '18_24',
  '25_34',
  '35_44',
  '45_plus',
] as const;

export const genderIds = ['female', 'male', 'prefer_not_to_say'] as const;

export const attributionIds = [
  'x',
  'therapist',
  'google',
  'facebook',
  'instagram',
  'tiktok',
] as const;

export const almostThereSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Enter your name')
    .max(60, 'Keep it under 60 characters'),
  ageBand: z.enum(ageBandIds).optional(),
  gender: z.enum(genderIds).optional(),
  attribution: z.enum(attributionIds).optional(),
});

export type AlmostThereAnswers = z.infer<typeof almostThereSchema>;

export const almostThereCopy = {
  displayName: {
    title: 'Name',
    prompt: 'What should we call you?',
    placeholder: 'Enter your name',
  },
  ageBand: {
    title: 'Age',
    prompt: 'Age',
    optional: true,
    options: [
      { id: 'under_18', label: 'Under 18' },
      { id: '18_24', label: '18-24' },
      { id: '25_34', label: '25-34' },
      { id: '35_44', label: '35-44' },
      { id: '45_plus', label: '45+' },
    ],
  },
  gender: {
    title: 'Gender',
    prompt: 'Gender',
    optional: true,
    options: [
      { id: 'female', label: 'Female' },
      { id: 'male', label: 'Male' },
      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  attribution: {
    title: 'Where did you hear about us?',
    prompt: 'Where did you hear about us?',
    optional: true,
    options: [
      { id: 'x', label: 'X' },
      { id: 'therapist', label: 'Therapist' },
      { id: 'google', label: 'Google' },
      { id: 'facebook', label: 'Facebook' },
      { id: 'instagram', label: 'Instagram' },
      { id: 'tiktok', label: 'TikTok' },
    ],
  },
} as const;
