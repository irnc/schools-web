import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useRouteMatch,
} from 'react-router-dom';
import * as data from './data';

const useStyles = makeStyles((theme) => ({
  option: {
    flexDirection: 'column',
    alignItems: 'start',
  },
  disambigLine: {
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
  }
}));

export function disambigPlaces(places) {
  return _(places)
    .groupBy('name')
    .mapValues(sameNamedPlaces => {
      if (sameNamedPlaces.length === 1) {
        return sameNamedPlaces;
      }

      const area = level => place => place.hierarchy[place.hierarchy.length - level];
      const counts = level => _.countBy(sameNamedPlaces, area(level));

      return sameNamedPlaces.map((place) => {
        const disambigLine = [];
        let level = 1;

        while (level <= place.hierarchy.length) {
          const levelArea = area(level)(place);

          disambigLine.push(levelArea);

          if (counts(level)[levelArea] === 1) {
            break;
          }

          level += 1;
        }

        return { disambigLine: disambigLine.reverse().join(', '), ...place };
      });
    })
    .values()
    .flatten()
    .value();
};

export default function (props) {
  const [places, setPlaces] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    data.fetchPlaces().then(places => {
      setPlaces(disambigPlaces(places));
    });
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
      classes={{ option: classes.option }}
      options={places}
      getOptionLabel={(option) => option.name}
      renderOption={(option) => (
        <> 
          {option.name}
          { option.disambigLine && <span className={classes.disambigLine}>{option.disambigLine}</span>}
        </>
      )}
      value={place}
      renderInput={(params) => <TextField {...params} label="Населённый пункт" variant="outlined" />}
      {...autocompleteProps}
    />
  );
}
