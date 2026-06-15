// Server-only: resolves a Korean address to coordinates via the Google Geocoding API.
// Used so the customer app's nearby-store search can find the store on a map.

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || !address) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=kr&language=ko`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.results?.[0]?.geometry?.location) {
      return null;
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch {
    return null;
  }
}
