export const SPOTIFY_ARTIST_ID = "15rYd2u3ct9T1W2AafyiQF";

export const spotify = {
  artist: `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}`,
  album: (id: string) => `https://open.spotify.com/album/${id}`,
  track: (id: string) => `https://open.spotify.com/track/${id}`,
  embedArtist: `https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`,
  embedTrack: (id: string) => `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`,
};
