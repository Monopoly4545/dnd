export const races = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Dragonborn",
  "Tiefling",
  "Half-Orc",
];

export const classes = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

export const alignments = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

export const backgrounds = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin",
];

export const characterLevels = Array.from(
  { length: 20 },
  (_, index) => index + 1,
);

export const abilityScores = [
  { name: "Strength", short: "STR" },
  { name: "Dexterity", short: "DEX" },
  { name: "Constitution", short: "CON" },
  { name: "Intelligence", short: "INT" },
  { name: "Wisdom", short: "WIS" },
  { name: "Charisma", short: "CHA" },
];