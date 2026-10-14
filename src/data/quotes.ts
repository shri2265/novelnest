export interface Quote {
  text: string;
  source: string;
  sourceType: "poem" | "novel" | "book" | "letters" | "unknown";
}

export const QUOTES: Quote[] = [
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    source: "Suggested by a hundred libraries, borrowed by a hundred hearts",
    sourceType: "unknown",
  },
  {
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    source: "Pride and Prejudice",
    sourceType: "novel",
  },
  {
    text: "There is no charm equal to tenderness of heart.",
    source: "Emma",
    sourceType: "novel",
  },
  {
    text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counsellors.",
    source: "A favourite of the Nest, passed around like weather",
    sourceType: "unknown",
  },
  {
    text: "Only in silence the word, only in dark the light, only in dying life: bright the hawk's flight on the empty sky.",
    source: "A Wizard of Earthsea",
    sourceType: "novel",
  },
  {
    text: "It is good to have an end to journey toward; but it is the journey that matters, in the end.",
    source: "The Left Hand of Darkness",
    sourceType: "novel",
  },
  {
    text: "You pierce my soul. I am half agony, half hope.",
    source: "Persuasion",
    sourceType: "letters",
  },
  {
    text: "All that we see or seem is but a dream within a dream.",
    source: "A Dream Within a Dream",
    sourceType: "poem",
  },
];

export function quoteOfTheDay(): Quote {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return QUOTES[dayNumber % QUOTES.length];
}

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
