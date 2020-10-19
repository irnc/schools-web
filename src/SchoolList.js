import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader } from '@material-ui/core';
import _ from 'lodash';
import './App.css';
import {
  Link,
  useParams
} from 'react-router-dom';
import * as data from './data';

const useStyles = makeStyles((theme) => ({
  ul: {
    padding: 0,
  }
}));

export default function SchoolList(props) {
  const classes = useStyles();
  const [schools, setSchools] = useState([]);
  let { placeId } = useParams();

  useEffect(() => {
    data.fetchPlace(placeId).then(setSchools);
  }, [placeId]);

  const groups = _.groupBy(schools, (school) => {
    if (school.school_name.match(/лицей/i)) {
      return 'Лицей';
    }

    if (school.school_name.match(/гимназия/i)) {
      return 'Гимназия';
    }

    if (school.school_name.match(/(сш|средняя школа|с\/ш)/i)) {
      return 'Средняя школа';
    }

    return 'Школа';
  });

  const orderedGroups = [
    'Лицей',
    'Гимназия',
    'Средняя школа',
    'Школа',
  ]

  return (
    <List component="nav" aria-label="shool list" subheader={<li />}>
      {orderedGroups.map((group, i) => {
        const schools = groups[group];
        if (!schools || schools.length === 0) {
          return null;
        }

        return (
          <li key={`section-${i}`}>
            <ul className={classes.ul}>
              <ListSubheader>{group}</ListSubheader>
              {_.orderBy(schools, normalizeSchoolName).map(school => (
                <ListItem button key={school.school_osm_id}>
                  <Link to={`/school/${school.school_osm_id}`}>
                    <ListItemText primary={school.school_name || 'Школа'} />
                  </Link>
                </ListItem>
              ))}
            </ul>
          </li>
        )
      })}
    </List>
  );
}

function normalizeSchoolName(school) {
  const name = school.school_name.replace(/(лицей|гимназия|школа|средняя|сш|с\/ш|№)/ig, '').trim();
  const int = parseInt(name);

  // Return 0, not name, so numbers are always compared to numbers, otherwise there would string-number comparison, breaking numeric order.
  return isNaN(int) ? 0 : int;
}
