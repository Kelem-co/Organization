import { getCode } from 'country-list';
import parsePhoneNumberFromString, { isValidPhoneNumber } from 'libphonenumber-js/max';

export function normalizeCountryName(value: string) {
  const country = value.trim();

  if (!country) {
    throw new Error('Country is required.');
  }

  if (!getCode(country)) {
    throw new Error('Please choose a valid country from the country list.');
  }

  return country;
}

export function normalizeOptionalPhoneNumber(value: string, label = 'Phone number') {
  const phoneNumber = value.trim();

  if (!phoneNumber) {
    return '';
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error(`${label} must be a valid phone number.`);
  }

  return parsePhoneNumberFromString(phoneNumber)?.number ?? phoneNumber;
}

export function normalizeRequiredPhoneNumber(value: string, label = 'Phone number') {
  const phoneNumber = normalizeOptionalPhoneNumber(value, label);

  if (!phoneNumber) {
    throw new Error(`${label} is required.`);
  }

  return phoneNumber;
}
