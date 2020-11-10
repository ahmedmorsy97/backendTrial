export const isRealString = (str) => {
  return typeof str === "string" && str.trim().length > 0;
};
