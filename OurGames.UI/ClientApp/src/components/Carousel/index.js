import React, { useState, useEffect } from 'react';
import { Slide, Button } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';

export default function Carousel({ items }) {
  const [itemsControl, setItemsControl] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [slideImage, setSlideImage] = useState({ in: true, direction: 'left' });

  useEffect(() => {
    const newItems = [];

    for (let i = 0; i < items.length; i++) {
      const e = items[i];
      newItems.push({
        id: i + 1,
        isFirst: i === 0,
        isLast: i === items.length - 1,
        ...e
      });
    }

    setItemsControl(newItems);
    setCurrentItem(newItems[0]);
  }, [items]);

  function handleBackClick() {
    setSlideImage({ in: false, direction: 'right' });
    // setTurnImage(true);

    if (currentItem.isFirst)
      setCurrentItem(itemsControl[itemsControl.length - 1]);
    else setCurrentItem(itemsControl.find(e => e.id === currentItem.id - 1));
  }

  function handleNextClick() {
    setSlideImage({ in: false, direction: 'left' });

    if (currentItem.isLast) setCurrentItem(itemsControl[0]);
    else setCurrentItem(itemsControl.find(e => e.id === currentItem.id + 1));
  }

  useEffect(() => {
    const direction = slideImage.direction === 'left' ? 'right' : 'left';

    setTimeout(() => {
      setSlideImage({ in: true, direction });
    }, 500);
  }, [currentItem]);

  return (
    <div className="w-100 d-flex overflow-hidden">
      <Button onClick={handleBackClick} className="carousel-controls">
        <ArrowBackIos />
      </Button>

      <Slide in={slideImage.in} direction={slideImage.direction}>
        <div className="w-100">
          {currentItem &&
            (currentItem.type === 'video' ? (
              <iframe
                src={currentItem.src.replace('watch?v=', 'embed/')}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                width="100%"
                height="500"
                title="video"
              />
            ) : (
              <img src={currentItem.src} alt="" />
            ))}
        </div>
      </Slide>
      <Button onClick={handleNextClick} className="carousel-controls">
        <ArrowForwardIos />
      </Button>
    </div>
  );
}
