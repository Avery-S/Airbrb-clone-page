import React, { useState } from 'react'; // 修正了多余空格
import { Modal, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // 确保你已经导入useNavigate
import { fileToDataUrl } from '../helper/fileToDataUrl.jsx';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// import checkToken from '../helper/checkToken';
import { DEFAULT_THUMBNAIL_URL } from '../helper/getLinks.jsx';

export default function CreateListingModal (props) {
  const initialMetadata = {
    propertyType: '',
    numberOfBathrooms: 1,
    numberOfBeds: 1,
    amenities: [],
    houseRules: '',
  };

  const initialAddress = {
    street: '',
    city: '',
    state: '',
    postCode: '',
    country: ''
  };

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState(initialAddress); // address structure
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(DEFAULT_THUMBNAIL_URL);
  const [metadata, setMetadata] = useState(initialMetadata);
  // const navigate = useNavigate();
  const [uploadedImg, setUploadedImg] = useState('');

  // Modal close
  const handleClose = () => {
    props.onHide();
  };

  // submit create list
  const handleSubmit = (event) => {
    event.preventDefault();
    const body = {
      title,
      address,
      price,
      thumbnail,
      metadata
    }
    props.createListing(body);
    handleClose();
  };

  // 上传图片的处理函数
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setUploadedImg(dataUrl); // 将上传的图片设置为预览
        setThumbnail(dataUrl);
      } catch (error) {
        console.error(error);
        // 这里可以添加错误处理逻辑
      }
    }
  };
  // 用于清除已上传的图片
  const handleClearImage = () => {
    setUploadedImg('');
    setThumbnail(DEFAULT_THUMBNAIL_URL);
  };

  const handleMetadataChange = (e) => {
    const { id, value } = e.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [id]: value
    }));
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      amenities: checked
        ? [...prevMetadata.amenities, value]
        : prevMetadata.amenities.filter((amenity) => amenity !== value)
    }));
  };

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      size="lg"
    >

      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Address Section */}
          <div>
            <label htmlFor="street">Street:</label>
            <input
              id="street"
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="city">City:</label>
            <input
              id="city"
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="state">State:</label>
            <input
              id="state"
              type="text"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="postCode">PostCode:</label>
            <input
              id="postCode"
              type="text"
              value={address.postCode}
              onChange={(e) => setAddress({ ...address, postCode: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="country">Country:</label>
            <input
              id="country"
              type="text"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </div>
          {/* ...添加其他地址字段 */}
          {/* Price Input */}
          <div>
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Thumbnail Input */}
        <div>
          <label htmlFor="thumbnail">Thumbnail URL:</label>
          <input
            id="thumbnail"
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
            style={{ display: 'none' }} // 隐藏文本输入，因为我们会使用图片上传
          />
          <div>
            <img src={uploadedImg || DEFAULT_THUMBNAIL_URL} alt="Thumbnail" style={{ width: '100px', height: '100px' }} />
            <input accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {uploadedImg && (
              <Button variant="secondary" onClick={handleClearImage}>Clear Image</Button>
            )}
          </div>
        </div>

          {/* Metadata Inputs */}
          <div>
            <label htmlFor="propertyType">Property Type:</label>
            <select
                id="propertyType"
                value={metadata.propertyType}
                onChange={handleMetadataChange}
                required
            >
                <option value="">Select a property type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condominium">Condominium</option>
                {/* 在这里添加其他房产类型选项 */}
            </select>
            </div>
          <div>
            <label htmlFor="numberOfBathrooms">Number Of Bathrooms:</label>
            <input
                id="numberOfBathrooms"
                type="number"
                value={metadata.numberOfBathrooms}
                onChange={handleMetadataChange}
                required
            />
            </div>

          <div>
            <label htmlFor="numberOfBeds">Number Of Beds:</label>
            <input
              id="numberOfBeds"
              type="number"
              value={metadata.numberOfBeds}
              onChange={handleMetadataChange}
              required
            />
          </div>
          <div>
            <label>
                <input
                type="checkbox"
                name="amenities"
                value="Wi-Fi"
                checked={metadata.amenities.includes('Wi-Fi')}
                onChange={handleAmenitiesChange}
                />
                Wi-Fi
            </label>
            <label>
                <input
                type="checkbox"
                name="amenities"
                value="Parking"
                checked={metadata.amenities.includes('Parking')}
                onChange={handleAmenitiesChange}
                />
                Parking
            </label>
            {/* 更多设施复选框... */}
            </div>
        <div>
            <label htmlFor="houseRules">House Rules:</label>
            <input
              id="houseRules"
              type="text"
              value={metadata.street}
              onChange={handleMetadataChange}
            />
          </div>

          {/* ...添加其他元数据字段 */}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleSubmit}>Create Listing</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
