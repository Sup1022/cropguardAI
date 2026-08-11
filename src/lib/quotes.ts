export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: 'The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings.', author: 'Masanobu Fukuoka' },
  { text: 'Agriculture is the most healthful, most useful, and most noble employment of man.', author: 'George Washington' },
  { text: 'Farming looks mighty easy when your plow is a pencil and you are a thousand miles from the corn field.', author: 'Dwight D. Eisenhower' },
  { text: 'To forget how to dig the earth and to tend the soil is to forget ourselves.', author: 'Mahatma Gandhi' },
  { text: 'The farmer has to be an optimist or he wouldn\'t still be a farmer.', author: 'Will Rogers' },
  { text: 'Agriculture is the foundation of manufactures. The prosperity of the farmer is the prosperity of the nation.', author: 'Alexander Hamilton' },
  { text: 'Good farmers, who take care of the land, are the best citizens.', author: 'Wendell Berry' },
  { text: 'Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness.', author: 'Thomas Jefferson' },
  { text: 'The land is the only thing in the world worth working for, worth fighting for, worth dying for.', author: 'Margaret Mitchell' },
  { text: 'When tillage begins, other arts follow. The farmers, therefore, are the founders of human civilization.', author: 'Daniel Webster' },
  { text: 'He who plants a tree plants hope.', author: 'Lucy Larcom' },
  { text: 'A good farmer is nothing more nor less than a handyman with a sense of humus.', author: 'E.B. White' },
];

export function randomQuote(exclude?: string): Quote {
  let pool = QUOTES;
  if (exclude) pool = QUOTES.filter((q) => q.text !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
