import type { GenreTag } from "../types";

export const GENRES: GenreTag[] = [
  { id: "romance", name: "Romance", description: "Love stories, second chances, slow-burn hearts.", count: 248 },
  { id: "fantasy", name: "Fantasy", description: "Doors to other worlds, magic in the margins.", count: 312 },
  { id: "mystery", name: "Mystery", description: "Quiet towns with loud secrets.", count: 174 },
  { id: "thriller", name: "Thriller", description: "Bad decisions, ticking clocks, last pages.", count: 139 },
  { id: "science-fiction", name: "Science Fiction", description: "Tomorrows that feel like home — or warning.", count: 158 },
  { id: "historical-fiction", name: "Historical Fiction", description: "The past, remembered in whispers.", count: 121 },
  { id: "young-adult", name: "Young Adult", description: "First loves, last summers, growing pains.", count: 287 },
  { id: "horror", name: "Horror", description: "Creaks in the ceiling, shadows with names.", count: 96 },
  { id: "adventure", name: "Adventure", description: "Maps that promise more than land.", count: 143 },
  { id: "literary-fiction", name: "Literary Fiction", description: "Small lives, examined closely.", count: 132 },
  { id: "poetry", name: "Poetry", description: "The shortest distance between two feelings.", count: 88 },
  { id: "short-stories", name: "Short Stories", description: "A whole world before the tea cools.", count: 74 },
];

export const GENRE_NAMES = new Map(GENRES.map((g) => [g.id, g.name]));