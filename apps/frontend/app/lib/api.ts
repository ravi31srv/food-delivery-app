const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getItems() {
  const res = await fetch(`${BASE_URL}/menu-items`, {
    cache: "no-store" // important for fresh data in dev
  });

  if (!res.ok) {
    throw new Error("Failed to fetch items");
  }

  return res.json();
}