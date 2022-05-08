import { countries } from './countries';

export const getCountryById = (id) => {
  return countries.find((country) => country.id === id);
};
