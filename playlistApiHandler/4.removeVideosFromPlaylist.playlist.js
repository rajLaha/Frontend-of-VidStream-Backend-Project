import { URL } from '../export/export.variable.js';

const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const response = await fetch(
    `${URL}/api/v1/playlists/remove/${videoId}/${playlistId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export { removeVideoFromPlaylist };
