export function between(number, min, max) {
  return Number(number) <= Number(max) && Number(number) >= Number(min);
}

export function numeric(value) {
  const regex = RegExp(/(^[0-9]*\.?[0-9]*$)|(^-[0-9]*\.?[0-9]*$)/);
  return regex.test(value);
}
