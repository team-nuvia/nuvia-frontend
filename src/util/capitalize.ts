export const capitalize = (str: string) => {
  return str.replace(/\w+/g, (char) => char[0].toUpperCase() + char.slice(1));
};
