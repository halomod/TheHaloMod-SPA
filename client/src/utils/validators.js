export function between(number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const tempStr = String(number);
  if (tempStr.indexOf('e') > -1) {
    const retNum = Number(tempStr.split('e')[0]) * (10 ** Number(tempStr.split('e')[1]));
    return Number(retNum) <= Number(max) && Number(retNum) >= Number(min);
  }
  return Number(number) <= Number(max) && Number(number) >= Number(min);
}

export function numeric(value) {
  const regex = RegExp(/-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?/g);
  const result = regex.exec(String(value));
  return (result[result.index] === String(value));
}

export function defined(value) {
  if ((value !== null) && (value !== '')) {
    return true;
  }
  return false;
}
