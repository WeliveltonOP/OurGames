import React from 'react';
import GamesListItem from '../GamesListItem';
import { formatRawValue } from '../../utils/funcs';

// import { Container } from './styles';

export default function GamesList({ items, onFavorite, ...props }) {
  return (
    <div className="my-3 px-3 grid justify-content-center" {...props}>
      {items.map(item => (
        <GamesListItem
          key={item.id}
          id={item.id}
          name={item.name}
          developer={item.developer}
          src={item.backgroundLink}
          thumbnail={item.thumbnailLink}
          isFavorite={item.isFavorite}
          price={formatRawValue(item.price, 'R$')}
          onFavorite={e => {
            e.stopPropagation();
            onFavorite(item.id);
          }}
        />
      ))}
    </div>
  );
}
