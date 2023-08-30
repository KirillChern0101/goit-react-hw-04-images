import React, { useState, useEffect } from 'react';
import { fetchImages } from './apiPixaby/fetchImages';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pageNr, setPageNr] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [showButton, setShowButton] = useState(false);

  const handleSubmit = ({ query }) => {
    setCurrentSearch(query);
    setImages([]);
    setIsLoading(false);
    setPageNr(1);
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
    setShowButton(false);
  };

  const handleClickMore = () => {
    setPageNr(prevPageNr => prevPageNr + 1);
  };

  const handleImageClick = e => {
    setModalOpen(true);
    setModalAlt(e.target.alt);
    setModalImg(e.target.name);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
  };

  useEffect(() => {
    const fetchImageData = async () => {
      setIsLoading(true);

      try {
        const response = await fetchImages(currentSearch, pageNr);
        setImages(prevImages => [...prevImages, ...response.hits]);
        setShowButton(pageNr !== Math.ceil(response.total / 12));
      } finally {
        setIsLoading(false);
      }
    };

    if (currentSearch) {
      fetchImageData();
    }
  }, [currentSearch, pageNr]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <React.Fragment>
        <Searchbar handleSubmit={handleSubmit} />

        <ImageGallery onImageClick={handleImageClick} images={images} />
        {isLoading && <Loader />}
        {images.length > 0 && showButton && (
          <Button show={showButton} onClick={handleClickMore} />
        )}
      </React.Fragment>
      {modalOpen && (
        <Modal src={modalImg} alt={modalAlt} handleClose={handleModalClose} />
      )}
    </div>
  );
};

export { App };
