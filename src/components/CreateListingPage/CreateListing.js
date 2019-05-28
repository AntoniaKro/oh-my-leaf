import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Input, Textarea } from '../../misc/Input';
import Label from '../../misc/Label';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled(Input)`
  border: 2px solid #abc38e;
  height: 32px;
  margin: 10px 0;
`;

const StyledTextarea = styled(Textarea)`
  height: 150px;
  margin: 10px 0;
`;

const StyledInputButtonGroup = styled.div``;

const StyledInputButton = styled(Input)`
  background-color: ${props => (props.filling ? '#ffd084' : 'transparent')};
  border: 2px solid #ffd084;
  margin: 8px;
`;

const StyledButton = styled.button`
  background-color: #abc38e;
  border-radius: 11px;
  font-family: 'PT Mono', monospace;
  font-size: 20px;
  margin-top: 15px;
  padding: 9px;
`;

function CreateListing({ handlePublish, history }) {
  const [listingType, setListingType] = useState('give away');

  function onPublish(event) {
    event.preventDefault();
    const form = event.target;
    const title = event.target.title.value;
    const description = event.target.description.value;
    handlePublish(title, description, listingType);
    form.reset();
    history.push('/');
  }

  function handleTypeButtonClick(event) {
    const type = event.target.value;
    setListingType(type);
  }

  return (
    <StyledForm onSubmit={onPublish}>
      <Label htmlFor="title">Title</Label>
      <StyledInput
        type="text"
        placeholder="type title here..."
        id="title"
        name="title"
      />
      <Label htmlFor="description">Description</Label>
      <StyledTextarea
        type="textarea"
        placeholder="type description here..."
        id="description"
        name="description"
      />
      <Label>Listing Type</Label>
      <StyledInputButtonGroup>
        <StyledInputButton
          onClick={handleTypeButtonClick}
          type="button"
          value="give away"
          filling={listingType === 'give away' ? true : false}
        />
        <StyledInputButton
          onClick={handleTypeButtonClick}
          type="button"
          value="swap"
          filling={listingType === 'swap' ? true : false}
        />
        <StyledInputButton
          onClick={handleTypeButtonClick}
          type="button"
          value="for sale"
          filling={listingType === 'for sale' ? true : false}
        />
      </StyledInputButtonGroup>
      <StyledButton>PUBLISH</StyledButton>
    </StyledForm>
  );
}
CreateListing.propTypes = {
  handlePublish: PropTypes.func,
  history: PropTypes.object
};
export default CreateListing;
