import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

import './App.css';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import SchoolList from './SchoolList';
import School from './School';
import PlaceAutocomplete from './PlaceAutocomplete';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  ul: {
    padding: 0,
  }
}));

function App() {
  const classes = useStyles();
  const history = useHistory();
  const [placeOsmId, setPlaceOsmId] = useState();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className="App">
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <PlaceAutocomplete
              style={{ width: 300 }}
              placeOsmId={placeOsmId}
              onChange={(event, value, reason) => {
                if (value !== null) {
                  history.push(`/place/${value.osm_id}`);
                }
              }}
            />
            <Switch>
              <Route path="/place/:placeId">
                <SchoolList />
              </Route>
              <Route path="/school/:schoolId">
                <School onPlaceRetrieval={setPlaceOsmId} />
              </Route>
            </Switch>
          </Paper>
        </main>
      </div>
    </React.Fragment>
  );
}

export default App;
