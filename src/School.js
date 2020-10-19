import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import _ from 'lodash';
import { VIEW_FORM_ID, REFERENCE_ID_FORM_FIELD } from './config';
import * as data from './data';

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
      <p>{geo?.lat},{geo?.lon}</p>
      <p>{location}</p>
      <p>
        <a href={getLinkToForm(schoolId)}>Добавить ресурс</a>
      </p>
      <ul>
        {resources.map((r, i) => (
          <li key={i}>{r.url}</li>
        ))}
      </ul>
    </div>
  )
}

function getLinkToForm(referenceId) {
  return `https://docs.google.com/forms/d/e/${VIEW_FORM_ID}/viewform?entry.${REFERENCE_ID_FORM_FIELD}=${referenceId}`;
}