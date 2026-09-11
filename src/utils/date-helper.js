export function getCurrentDate() {
  const date = new Date();

  let day = date.getDate();
  if (day < 10) {
    day = `0-${day}`;
  }

  let month = date.getMonth();
  if (day < 10) {
    day = `0-${day}`;
  }

  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}