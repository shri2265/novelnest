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
    text: "The sea does not apologise for its gates. It simply opens, depth by depth, and asks the small boats to be brave.",
    source: "The Lightkeeper's Daughter, ch. 9",
    sourceType: "novel",
  },
  {
    text: "Some miracles need only flour, water, salt, and someone who remembers the heat.",
    source: "Bread & Other Miracles",
    sourceType: "poem",
  },
  {
    text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counsellors.",
    source: "A favourite of the Nest, passed around like weather",
    sourceType: "unknown",
  },
  {
    text: "Light is only delayed news from somewhere else, and gardens are how we answer it.",
    source: "On the Light of Distant Gardens",
    sourceType: "book",
  },
  {
    text: "Maps were invented by people too impatient to wait for the future, and too hopeful to distrust the horizon.",
    source: "The Map to Nowhere",
    sourceType: "novel",
  },
  {
    text: "A letter is a bridge built from the one side only, on the faith that someone is waiting on the other.",
    source: "Letters from the Border",
    sourceType: "letters",
  },
  {
    text: "There is no friend as loyal as a book.",
    source: "Written into the spine of a well-worn copy in the Nest",
    sourceType: "unknown",
  },
];

export function quoteOfTheDay(): Quote {
  const dayNumber = Math.floor(Date.now() / 86400000);
  return QUOTES[dayNumber % QUOTES.length];
}

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}