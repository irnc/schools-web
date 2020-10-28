import _ from 'lodash';
import { disambigPlaces } from './PlaceAutocomplete';

const placesFixture = [
  {
    "name": "Слобода",
    "osm_id": "-7566127",
    "hierarchy": [
      "Озерицко-Слободской сельский Совет",
      "Смолевичский район",
      "Минская область"
    ]
  },
  {
    "name": "Слобода",
    "osm_id": "-7506767",
    "hierarchy": [
      "Сиротинский сельский Совет",
      "Шумилинский район",
      "Витебская область"
    ]
  },
  {
    "name": "Слобода",
    "osm_id": "-7486270",
    "hierarchy": [
      "Слободской сельский Совет",
      "Лепельский район",
      "Витебская область"
    ]
  },
  {
    "name": "Слобода",
    "osm_id": "-7446655",
    "hierarchy": [
      "Слободской сельский Совет",
      "Мозырский район",
      "Гомельская область"
    ]
  },
  {
    "name": "Слобода",
    "osm_id": "-7552064",
    "hierarchy": [
      "Слободской сельский Совет",
      "Мядельский район",
      "Минская область"
    ]
  }
];

test('creates disambiguation line for same-named places', () => {
  const res = disambigPlaces(placesFixture);

  expect(_(res).map('name').uniq().value()).toHaveLength(1);
  expect(_(res).map('disambigLine').uniq().value()).toHaveLength(5);
  expect(_(res).map('disambigLine').uniq().value()).toContain('Гомельская область');
  expect(_(res).map('disambigLine').uniq().value()).toContain('Мядельский район, Минская область');
});
