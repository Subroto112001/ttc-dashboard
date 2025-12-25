// getall albums
export async function getAllAlbums() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/album/get-allalbums`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch albums: ${response.statusText}`);
    }

      const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching albums:", error);
    return []; // Return empty array to prevent UI crashes
  }
}

// get all management
export async function getAllmanagement() {
  try {
    const response = await fetch(
      ` http://localhost:5000/api/v1/management/all-management`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch management: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching management:", error);
    return [];
  }
}

// get all notice
export async function getAllnotice() {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/notice/all`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch notice: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching notice:", error);
    return [];
  }
}


