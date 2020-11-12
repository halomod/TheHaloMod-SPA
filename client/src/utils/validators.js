export function between(number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  return Number(number) <= Number(max) && Number(number) >= Number(min);
}

export function numeric(value) {
  const regex = RegExp(/(^[0-9]*\.?[0-9]*$)|(^-[0-9]*\.?[0-9]*$)/);
  return regex.test(String(value));
}
