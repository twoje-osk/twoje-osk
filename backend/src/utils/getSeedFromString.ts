export const getSeedFromString = (text: string): number =>
  text.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
