const dir = 'https://raw.githubusercontent.com/irnc/schools-data/master';

const fetchJson = async (path) => {
  const res = await fetch(`${dir}/data/${path}.json`);
  return res.json();
}

export const fetchPlaces = () => {
  return fetchJson('places');
};

export const fetchPlace = (placeId) => {
  return fetchJson(`places/${placeId}`);
};

export const fetchSchool = (schoolId) => {
  return fetchJson(`schools/${schoolId}`);
};

export const fetchResources = async (schoolId) => {
  const resources = 'https://raw.githubusercontent.com/irnc/schools-resources/master';
  const res = await fetch(`${resources}/data/resources/${schoolId}.json`);
  return res.json();
};