import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { List, ListItemIcon, ListItemText } from '@material-ui/core';
import TelegramIcon from '@material-ui/icons/Telegram';
import LinkIcon from '@material-ui/icons/Link';
import _ from 'lodash';
import { VIEW_FORM_ID, REFERENCE_ID_FORM_FIELD } from './config';
import * as data from './data';
import ListItemLink from './components/ListItemLink';

function PrettyLink(props) {
  const { url, description } = props.resource;
  const telegramPrefix = 'https://t.me/';

  if (url.startsWith(telegramPrefix)) {
    const channel = `@${url.substr(telegramPrefix.length)}`;

    return (
      <>
        <ListItemIcon>
          <TelegramIcon />
        </ListItemIcon>
        <ListItemText primary={channel} secondary={description}></ListItemText>
      </>
    )
  } else {
    return (
      <>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary={url} secondary={description}></ListItemText>
      </>
    );
  }
}

export default function School(props) {
  const [place, setPlace] = useState();
  const [group, setGroup] = useState([]);
  const [geo, setGeo] = useState();
  const [resources, setResources] = useState([]);
  const { schoolId } = useParams();
  const { onPlaceRetrieval } = props;

  useEffect(() => {
    const fetchSchool = async () => {
      const school = await data.fetchSchool(schoolId);
  
      setPlace(school.place);
      setGroup(school.group);
      setGeo(school.geo);
  
      // We should use place provided by server, it is used to match agaings
      // places list generated on server.
      onPlaceRetrieval(school.place.osm_id);
    };
  
    const fetchResources = async () => {
      try {
        const resources = await data.fetchResources(schoolId);
        setResources(resources);
      } catch (err) {
        // silence errors as resources file could be missing.
      }
    };

    fetchSchool();
    fetchResources();
  }, [schoolId, onPlaceRetrieval]);

  const location = _(group)
    .orderBy(p => Number(p.place_admin_level), 'desc')
    .map('place_name')
    .join(', ');

  return (
    <div>
      { place &&
        <Link to={`/place/${place.osm_id}`}>Назад к списку школ</Link>
      }
      <h1>{group[0]?.school_name}</h1>

      <iframe
        title={`${group[0]?.school_name} на карте`}
        width="100%" height="250" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
        src={geo?.bbox && `https://www.openstreetmap.org/export/embed.html?bbox=${geo?.bbox}&amp;layer=mapnik`}
        style={{ border: '1px solid black' }}></iframe><br/>
      <small><a href={`https://www.openstreetmap.org/#map=17/${geo?.lat}/${geo?.lon}`}>Показать большую карту</a></small>

      <p>{location}</p>
      <p>
        <a href={getLinkToForm(schoolId)}>Добавить ресурс</a>
      </p>
      <List>
        {resources.map((r, i) => (
          <ListItemLink key={i} href={r.url}>
            <PrettyLink resource={r} />
          </ListItemLink>
        ))}
      </List>
    </div>
  )
}

function getLinkToForm(referenceId) {
  return `https://docs.google.com/forms/d/e/${VIEW_FORM_ID}/viewform?entry.${REFERENCE_ID_FORM_FIELD}=${referenceId}`;
}
