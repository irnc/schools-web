import React from 'react';
import { ListItem } from '@material-ui/core';

export default function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
