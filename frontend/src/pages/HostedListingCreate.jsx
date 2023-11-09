import React, { useState } from 'react'; // 修正了多余空格
import { Modal, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // 确保你已经导入useNavigate
import BACKEND_URL from '../helper/getBackendUrl';
import { fileToDataUrl } from '../helper/fileToDataUrl.jsx';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// import checkToken from '../helper/checkToken';
import MessageAlert from '../components/MessageAlert';

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

const defaultThumbnailDataUrl = 'data:image/png;base64,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'

export default function HostedListingCreate (props) {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState(initialAddress); // address structure
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(defaultThumbnailDataUrl);
  const [metadata, setMetadata] = useState(initialMetadata);
  // const navigate = useNavigate();
  const [alertType, setAlertType] = useState(null);
  const [alertContent, setAlertContent] = useState('');
  const [uploadedImg, setUploadedImg] = useState('');

  // Modal close
  const handleClose = () => {
    props.onHide();
  };

  // submit create list
  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateListing(event);
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
    setThumbnail(defaultThumbnailDataUrl);
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

  const handleCreateListing = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      console.log('into post');
      const response = await fetch(`${BACKEND_URL}/listings/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          address,
          price,
          thumbnail,
          metadata
        })
      });
      if (response.ok) {
        setAlertType('success');
        setAlertContent('Listing created successfully!');
        // 这里加一个modal关闭
      } else {
        setAlertType('danger');
        setAlertContent('There was an error creating the listing.');
        console.log('Sending request to URL:', '/listings/new');
      }
    } catch (error) {
      console.error('There was an error creating the listing:', error);
      setAlertType('danger');
      setAlertContent('Network error: Could not create listing.');
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      size="lg"
    >
        {/* 使用MessageAlert来显示警告信息 */}
      {alertContent && (
        <MessageAlert msgType={alertType} msgContent={alertContent} />
      )}

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
            <img src={uploadedImg || defaultThumbnailDataUrl} alt="Thumbnail" style={{ width: '100px', height: '100px' }} />
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
