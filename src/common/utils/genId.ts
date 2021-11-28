export const genId = (digits = 9) => {
  return parseInt(
    (String(Date.now()).slice(-5) + Math.random())
      .replace('.', '')
      .substr(3, digits),
  );
};
