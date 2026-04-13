const C = {
  sand:  '#E8D5B7',
  terra: '#C17A3A',
  deep:  '#1A1208',
  ocean: '#1B4F72',
  mint:  '#48C9B0',
  coral: '#E74C3C',
  gold:  '#F4D03F',
  smoke: '#F5F0E8',
  ash:   '#8B7355',
  white: '#ffffff',
};

const CATEGORIES = ['Flight','Hotel','Food','Transport','Activities','Shopping','Other'];

const CAT_ICONS = {
  Flight:     '✈️',
  Hotel:      '🏨',
  Food:       '🍽️',
  Transport:  '🚌',
  Activities: '🎭',
  Shopping:   '🛍️',
  Other:      '💳',
};

const EMOJIS = ['✈️','🏖️','🗺️','🏔️','🌴','🗼','🎭','🌊','🏕️','🌍','🏯','🗽'];

const SAMPLE_TRIPS = [
  {
    id: 1,
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2026-04-10',
    endDate:   '2026-04-20',
    budget: 3500,
    emoji: '🗼',
    color: C.terra,
    itinerary: [
      { day: 1, title: 'Arrival & Shibuya', activities: ['Land at Narita Airport', 'Check in to hotel', 'Explore Shibuya Crossing', 'Dinner at ramen bar'] },
      { day: 2, title: 'Temples & Culture',  activities: ['Senso-ji Temple at dawn', 'Akihabara electronics district', 'TeamLab Borderless', 'Izakaya dinner'] },
      { day: 3, title: 'Mt. Fuji Day Trip',  activities: ['Shinkansen to Hakone', 'Mt. Fuji viewpoint', 'Onsen experience', 'Return to Tokyo'] },
    ],
    expenses: [
      { id: 1, category: 'Flight',     amount: 1200, date: '2026-04-10', note: 'Round trip ANA' },
      { id: 2, category: 'Hotel',      amount: 900,  date: '2026-04-10', note: '10 nights Shinjuku' },
      { id: 3, category: 'Food',       amount: 320,  date: '2026-04-11', note: 'Various restaurants' },
      { id: 4, category: 'Transport',  amount: 180,  date: '2026-04-12', note: 'IC card & bullet train' },
      { id: 5, category: 'Activities', amount: 220,  date: '2026-04-13', note: 'TeamLab & temples' },
    ],
  },
  {
    id: 2,
    name: 'Amalfi Coast',
    destination: 'Positano, Italy',
    startDate: '2026-06-15',
    endDate:   '2026-06-22',
    budget: 4200,
    emoji: '🍋',
    color: C.ocean,
    itinerary: [
      { day: 1, title: 'Positano Arrival', activities: ['Naples airport', 'Scenic drive to Positano', 'Sunset aperitivo', 'Seafood dinner'] },
      { day: 2, title: 'Boat Tour',        activities: ['Private boat rental', 'Grotta dello Smeraldo', 'Ravello village', 'Limoncello tasting'] },
    ],
    expenses: [
      { id: 1, category: 'Flight', amount: 980,  date: '2026-06-15', note: 'Rome connection' },
      { id: 2, category: 'Hotel',  amount: 1800, date: '2026-06-15', note: 'Boutique cliffside hotel' },
      { id: 3, category: 'Food',   amount: 480,  date: '2026-06-16', note: 'Fine dining & cafes' },
    ],
  },
];

module.exports = { C, CATEGORIES, CAT_ICONS, EMOJIS, SAMPLE_TRIPS };
