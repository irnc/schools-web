import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useRouteMatch,
} from 'react-router-dom';
import * as data from './data';

export default function (props) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    data.fetchPlaces().then(setPlaces);
  }, []);

  const { placeOsmId, ...autocompleteProps } = props;
  const match = useRouteMatch({
    path: "/place/:placeId",
    strict: true,
    sensitive: true
  });

  const schoolMatch = useRouteMatch({
    path: "/school/:schoolId",
    strict: true,
    sensitive: true
  });

  let place;

  if (match) {
    place = _.find(places, { osm_id: match.params.placeId });
  } else if (schoolMatch) {
    if (placeOsmId) {
      place = _.find(places, { osm_id: placeOsmId });
    }
  }

  if (place === undefined) {
    // null should be used instead of undefined to render
    // Autocomplete in controlled state from the first
    // render.
    place = null;
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      options={places}
      getOptionLabel={(option) => option.name}
      value={place}
      renderInput={(params) => <TextField {...params} label="Населённый пункт" variant="outlined" />}
      {...autocompleteProps}
    />
  );
}