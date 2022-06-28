import axios from 'axios';

export const postToNewsSaveEndpoint = async (data: any) => {
  await axios.post(process.env.NEWS_SAVE_ENDPOINT as string, data, {
    headers: {
      Authorization: `Bearer ${process.env.NEWS_SAVE_ENDPOINT_ACCESS_TOKEN}`,
    },
  });
};
