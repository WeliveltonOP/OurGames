import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@material-ui/core';

export default function Sidebar({ onOptionCick, items, selected }) {
  return (
    <Collapse className="float-left h-100 sidebar-sticky mr-3" in={true}>
      <Paper className="h-100" square>
        <div style={{ position: 'sticky', top: '100px' }}>
          <Typography
            className="px-2 pt-2"
            variant="overline"
            component="strong"
          >
            Categorias
          </Typography>
          <List>
            {items.map((e, i) =>
              i === 0 ? (
                <ListItem
                  onClick={() => onOptionCick()}
                  key={i}
                  className={'li-action ' + (selected === 0 && ' active')}
                >
                  <ListItemText>Todos</ListItemText>
                </ListItem>
              ) : (
                <ListItem
                  onClick={() => onOptionCick(e.value)}
                  className={'li-action ' + (selected === e.value && ' active')}
                  key={e.value}
                >
                  <ListItemText>{e.label}</ListItemText>
                </ListItem>
              )
            )}
          </List>
        </div>
      </Paper>
    </Collapse>
  );
}
