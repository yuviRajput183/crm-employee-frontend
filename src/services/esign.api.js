import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const startEsign = async (channelPartnerId, forceNew = false, redirectUrl = "") => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  if (forceNew) {
      formData.append('forceNew', 'true');
  }
  if (redirectUrl) {
      formData.append('redirectUrl', redirectUrl);
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
      responseType: "blob",
      withCredentials: true
  });
  return response;
};

export const startAdminEsign = async (channelPartnerId, forceNew = false, redirectUrl = "") => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${baseURL}/esign/admin/channel-partners/${channelPartnerId}/start`, {
      forceNew,
      redirectUrl
  }, {
      headers: getHeaders(),
      withCredentials: true
  });
  return response.data;
};

export const getAdminActiveEsign = async (channelPartnerId) => {
  const response = await axios.get(`${baseURL}/esign/admin/channel-partners/${channelPartnerId}/active`, {
      headers: getHeaders(),
      withCredentials: true
  });
  return response.data;
};
