import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const startEsign = async (channelPartnerId, file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  if (file) {
      formData.append('document', file);
  }

  const response = await axios.post(`${baseURL}/esign/channel-partners/${channelPartnerId}/start`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
      },
      withCredentials: true
  });
  return response.data;
};

export const getActiveEsign = async (channelPartnerId) => {
  const response = await axios.get(`${baseURL}/esign/channel-partners/${channelPartnerId}/active`, {
      headers: getHeaders(),
      withCredentials: true
  });
  return response.data;
};

export const getEsignStatus = async (esignId) => {
  const response = await axios.get(`${baseURL}/esign/${esignId}/status`, {
      headers: getHeaders(),
      withCredentials: true
  });
  return response.data;
};

export const getSignedDocument = async (esignId) => {
  const response = await axios.get(`${baseURL}/esign/${esignId}/document`, {
      headers: getHeaders(),
      withCredentials: true
  });
  return response.data;
};
