export const genId = (digits = 9) => {
  return parseInt(
    (String(Date.now()).slice(-5) + Math.random())
      .replace('.', '')
      .substr(3, digits),
  );
};

export const genFileName = (name) => {
  const [title, ...other] = name.split('.');
  return (
    title +
    '-' +
    parseInt(Date.now() * Math.random() + '') +
    '.' +
    other.join('.')
  );
};
