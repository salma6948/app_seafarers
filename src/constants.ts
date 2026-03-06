import { CheckIn, Resource } from './types';

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Deep Sea Breathing',
    category: 'Mindfulness',
    duration: '5 min',
    description: 'A guided breathing exercise to calm the nervous system during rough weather.',
    type: 'audio',
  },
  {
    id: '2',
    title: 'Managing Homesickness',
    category: 'CBT',
    duration: '10 min read',
    description: 'Cognitive techniques to handle the emotional weight of being away from family.',
    type: 'text',
  },
  {
    id: '3',
    title: 'Engine Room Wind-down',
    category: 'Sleep',
    duration: '15 min',
    description: 'White noise and guided imagery to help you sleep despite ship vibrations.',
    type: 'audio',
  },
  {
    id: '4',
    title: 'Conflict Resolution at Sea',
    category: 'CBT',
    duration: '8 min read',
    description: 'Practical steps for de-escalating tension in tight crew quarters.',
    type: 'text',
  }
];

export const MOCK_HISTORY: CheckIn[] = [
  { id: '1', date: '2026-02-15', mood: 4, sleep: 3, stress: 2, fatigue: 3 },
  { id: '2', date: '2026-02-16', mood: 3, sleep: 2, stress: 4, fatigue: 5 },
  { id: '3', date: '2026-02-17', mood: 2, sleep: 3, stress: 5, fatigue: 4 },
  { id: '4', date: '2026-02-18', mood: 3, sleep: 4, stress: 3, fatigue: 3 },
  { id: '5', date: '2026-02-19', mood: 4, sleep: 4, stress: 2, fatigue: 2 },
  { id: '6', date: '2026-02-20', mood: 5, sleep: 5, stress: 1, fatigue: 1 },
  { id: '7', date: '2026-02-21', mood: 4, sleep: 4, stress: 2, fatigue: 2 },
];
