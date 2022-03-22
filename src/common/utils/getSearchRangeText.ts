const count = 200;
const prevMaxCount = 100;
export default function getSearchRangeText(content: string, words): string {
  content = formatContent(content);
  const pattern = new RegExp('([^。.]+)' + words + '(.+)');
  const matches = content.match(pattern);
  if (!matches) return content.substr(0, count);
  let prev = matches[1];

  while (prev.length > prevMaxCount) {
    const prevPattern = /[^，,]+(.+)/;
    const prevMatches = prev.match(prevPattern);
    if (!prevMatches) break;
    prev = prevMatches[1].substr(1);
  }
  const last = matches[2];
  let str = prev + words + last;
  str = str.substr(0, count);
  return str;
}

function formatContent(content) {
  return content.replaceAll('\n', '').replaceAll('#', '');
}
