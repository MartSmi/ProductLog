const isNullOrUndefined = prop => prop === null
  || prop === undefined;
const isEmptyString = prop => isNullOrUndefined(prop)
  || prop === '';
const capitalize = word =>
  word.charAt(0).toUpperCase() +
  word.slice(1).toLowerCase();

function titleFromName(name) {
  if (isEmptyString(name)) {
    return '';
  }

  return name.split(/(?=[A-Z])|\s/).map(s => capitalize(s)).join(' ')
}

export {
  isNullOrUndefined,
  isEmptyString,
  capitalize,
  titleFromName,
}
