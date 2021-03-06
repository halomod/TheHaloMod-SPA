import { between, numeric, defined } from '@/utils/validators.js';

describe('Between Validator', () => {
  test('returns correct result regardless of whether params are string ints or numbers', () => {
    expect(between(0, 5, 10)).toBe(false);
    expect(between(11, '5', '10')).toBe(false);
    expect(between('7', 5, 10)).toBe(true);
    expect(between('5', '5', '10')).toBe(true);
  });

  test('returns false when value is less range', () => {
    expect(between(0, 5, 10)).toBe(false);
  });

  test('returns false when value is greater than range', () => {
    expect(between(11, 5, 10)).toBe(false);
  });

  test('returns true when value is in range', () => {
    expect(between(7, 5, 10)).toBe(true);
  });

  test('treats range min and range max as inclusive', () => {
    expect(between(5, 5, 10)).toBe(true);
    expect(between(10, 5, 10)).toBe(true);
  });

  test('handles case with \'e\' exponent indicator', () => {
    expect(between('10e5', '10e5', '10e10')).toBe(true);
    expect(between('10e4', '10e5', '10e10')).toBe(false);
    expect(between('10e11', '10e5', '10e10')).toBe(false);
  });
});

describe('Numeric Validator', () => {
  test('returns false if value has two decimals', () => {
    expect(numeric('0.0.1')).toBe(false);
  });

  test('returns true if value is valid number', () => {
    expect(numeric('-24.5')).toBe(true);
    expect(numeric('-12')).toBe(true);
    expect(numeric('0')).toBe(true);
    expect(numeric('12')).toBe(true);
    expect(numeric('24.5')).toBe(true);
  });

  test('returns false if value has leading 0s, excepting decimal 0.* case', () => {
    expect(numeric('004')).toBe(false);
    expect(numeric('0.12')).toBe(true);
  });

  test('returns true if number has exponent like 1e10', () => {
    expect(numeric('1.0e+10')).toBe(true);
    expect(numeric('1.0e10')).toBe(true);
  });

  test('returns false if \'e\' is used in an invalid way', () => {
    expect(numeric('1e10e10')).toBe(false);
    expect(numeric('e10')).toBe(false);
  });
});

describe('Defined Validator', () => {
  test('returns false if value is null', () => {
    expect(defined(null)).toBe(false);
  });

  test('returns false if value is empty string', () => {
    expect(defined('')).toBe(false);
  });

  test('returns true if value is number or non-empty string', () => {
    expect(defined(5)).toBe(true);
    expect(defined('5')).toBe(true);
  });
});
