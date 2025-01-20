export function getDateOffset(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * -60000);
}
