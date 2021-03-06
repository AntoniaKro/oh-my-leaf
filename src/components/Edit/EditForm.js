import axios from 'axios';
import Close from '../common/Icon/CloseIcon';
import Icon from '../common/Icon/StyledIcon';
import Label from '../common/FormElements/Label';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ReactComponent as LoadIcon } from '../../svg/loadingIcon.svg';
import { TextInput, Textarea } from '../common/FormElements/Input';
import TypeButton from '../Create/TypeButton';
import styled from 'styled-components';
import SwapTags from '../Create/SwapTags';
import {
  Form,
  TypeButtonGroup,
  Button,
  AddImg,
  ImgPreview,
  PriceInputWrapper
} from '../common/FormElements/Forms';

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
const PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

const StyledForm = styled(Form)`
  background: white;
  overflow: scroll;
`;

const StyledFileInput = styled(TextInput)`
  color: #201f1d;
  font-size: 12px;
  margin: 5px 0;
`;

const PreviewWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const StyledLoadIcon = styled(LoadIcon)`
  height: 50px;
`;

const StyledPriceInput = styled(TextInput)`
  margin: 9px 0;
`;

const StyledClose = styled(Close)`
  position: absolute;
  left: 89%;
  top: 5px;
`;

function EditForm({ listing, onSave, onClose }) {
  const [editedListing, setEditedListing] = useState(listing);
  const [listingType, setListingType] = useState(listing.type);
  const [image, setImage] = useState(listing.img_path);
  const [isUploadSuccess, setUploadSuccess] = useState(true);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [swapTags, setSwapTags] = useState(listing.swap_tags || []);

  const types = ['give away', 'swap', 'for sale'];

  function onClickSave(event) {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const description = form.description.value;
    const price = form.price === undefined ? '' : form.price.value;

    const listingEdit = {
      title,
      description,
      type: listingType,
      img_path: image,
      price,
      swap_tags: swapTags,
      _id: editedListing._id,
      user_id: editedListing.user_id,
      createdAt: editedListing.createdAt
    };

    onSave(listingEdit);
  }

  function handleTypeButtonClick(event) {
    setListingType(event.target.value);
  }

  function onImgDelete() {
    setImage(
      'https://res.cloudinary.com/doirkiciq/image/upload/v1558965891/Sorry-noImg_iwodnp.png'
    );
    setUploadSuccess(!isUploadSuccess);
  }

  function uploadImage(event) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDNAME}/upload`;
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('upload_preset', PRESET);
    setIsImageUploading(true);
    axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' }
      })
      .then(onImageSave)
      .catch(err => console.error(err));
  }

  function onImageSave(response) {
    setIsImageUploading(false);
    setUploadSuccess(!isUploadSuccess);
    setImage(response.data.url);
  }

  function handleTagInput(event) {
    const tag = event.target.value.split(',');
    tag[0] === '' || setSwapTags([...swapTags, tag[0]]);
    event.target.value = '';
  }

  function handleTagDelete(tag) {
    const index = swapTags.indexOf(tag);
    setSwapTags([...swapTags.slice(0, index), ...swapTags.slice(index + 1)]);
  }

  return (
    <StyledForm onSubmit={onClickSave}>
      <StyledClose onClick={onClose}>x</StyledClose>
      <Label htmlFor="title">Title</Label>
      <TextInput
        onChange={event =>
          setEditedListing({ ...editedListing, title: event.target.value })
        }
        type="text"
        id="title"
        name="title"
        defaultValue={listing.title}
        required
      />
      <Label htmlFor="description">Description</Label>
      <Textarea
        onChange={event =>
          setEditedListing({
            ...editedListing,
            description: event.target.value
          })
        }
        type="textarea"
        id="description"
        name="description"
        defaultValue={listing.description}
      />
      <AddImg>
        <StyledFileInput onChange={uploadImage} type="file" name="file" />
        {isImageUploading && <StyledLoadIcon />}
        {isUploadSuccess && (
          <PreviewWrapper>
            <ImgPreview src={image} alt="uploaded image" />
            <Icon onClick={onImgDelete} className="far fa-trash-alt" />
          </PreviewWrapper>
        )}
      </AddImg>
      <Label>Listing Type</Label>
      <TypeButtonGroup>
        {types.map(type => (
          <TypeButton
            onClick={handleTypeButtonClick}
            value={type}
            key={type}
            filled={listingType}
          />
        ))}
      </TypeButtonGroup>
      {listingType === 'for sale' && (
        <PriceInputWrapper>
          <Label>Price in €</Label>
          <StyledPriceInput
            id="price"
            name="price"
            defaultValue={listing.price}
            type="number"
          />
        </PriceInputWrapper>
      )}
      {listingType === 'swap' && (
        <SwapTags
          tags={swapTags}
          onDelete={handleTagDelete}
          onInput={handleTagInput}
        />
      )}
      <Button>SAVE CHANGES</Button>
    </StyledForm>
  );
}

EditForm.propTypes = {
  listing: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func
};

export default EditForm;
