import apiClient from "@/component/apiClient";

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
    const response = await apiClient.get(`/notice/all`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch notice: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching notice:",
      error.response?.data || error.message
    );

    // 5. Return fallback to prevent UI crashes
    return [];
  }
}

/**
 * Fetch a single notice by ID
 * API: http://localhost:5000/api/v1/notice/getsingleNotice/:id
 */
export async function getSingleNotice(id) {
  try {
    // 1. Perform the GET request with the ID parameter
    const response = await apiClient.get(`/notice/getsingleNotice/${id}`);

    // 2. Validate response status
    if (response.status !== 200) {
      throw new Error(`Failed to fetch notice: ${response.statusText}`);
    }

    // 3. Return the data
    // Usually returns { success: true, data: { title: '...', description: '...', ... } }
    return response.data;
  } catch (error) {
    // 4. Log the error for debugging
    console.error(
      "Error fetching single notice:",
      error.response?.data || error.message
    );

    // 5. Return null so the UI can easily handle the "Not Found" or "Error" state
    return null;
  }
}

// create notice
export async function createNotice(formData) {
  try {
    const response = await apiClient.post("/notice/create", formData);

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create notice";

    console.error("Error creating notice:", errorMessage);

    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a specific notice by ID
 */
export async function deleteNotice(id) {
  try {
    const response = await apiClient.delete(`/notice/delete/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to delete notice: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting notice:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Update an existing notice by ID
 * API: http://localhost:5000/api/v1/notice/update/:id
 */
export async function updateNotice(id, updateData) {
  try {
    // 1. Perform the PUT request
    // Axios handles FormData or JSON automatically based on 'updateData'
    const response = await apiClient.put(`/notice/update/${id}`, updateData);

    // 2. Validate response
    if (response.status !== 200) {
      throw new Error(`Failed to update notice: ${response.statusText}`);
    }

    // 3. Return the response data
    return response.data;
  } catch (error) {
    // 4. Log the error
    console.error(
      "Error updating notice:",
      error.response?.data || error.message
    );

    // 5. Re-throw the error so the UI can catch it and show an alert
    throw error;
  }
}

// -----------------album related APIs -------------------
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
      throw new Error(`Failed to fetch albums: ${response.statusText}`);
    }

    // Parse it here
    return await response.json();
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { data: [] }; // Return the structure the component expects
  }
}
// create album

export async function createAlbum(formData) {
  try {
    const response = await apiClient.post("/album/create-album", formData, {
      headers: {
        // FormData এর জন্য আলাদা করে Content-Type সেট করার প্রয়োজন নেই
        // Axios এবং ব্রাউজার এটি অটোমেটিক হ্যান্ডেল করবে
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create album";
    console.error("Error creating album:", errorMessage);

    return { success: false, error: errorMessage };
  }
}
// delete album
export async function deleteAlbum(albumId) {
  try {
    const response = await apiClient.delete(`/album/delete-album/${albumId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete album";
    console.error("Error deleting album:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
// get single album
export async function getAlbumById(id) {
  try {
    const response = await apiClient.get(`/album/get-album/${id}`);
    // Based on your controller, the data is usually in response.data.data
    return { success: true, data: response.data.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch album details";
    return { success: false, error: errorMessage };
  }
}

// update album
export async function updateAlbum(id, formData) {
  try {
    const response = await apiClient.put(`/album/update-album/${id}`, formData);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update album";
    console.error("Error updating album:", errorMessage);

    return { success: false, error: errorMessage };
  }
}

/**
 * Fetch all notice categories
 * API: http://localhost:5000/api/v1/noticeCategory/all-noticeCategories
 */
export async function getAllNoticeCategories() {
  try {
    const response = await apiClient.get(
      "/noticeCategory/all-noticeCategories"
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    // Return the response data (Axios already parsed the JSON)
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching categories:",
      error.response?.data || error.message
    );
    // Returning an empty array is the safest fallback for .map()
    return [];
  }
}
/**
 * Fetch a single notice category by ID
 * API: http://localhost:5000/api/v1/noticeCategory/singlenoticeCategory/:id
 */
export async function getSingleNoticeCategory(id) {
  try {
    const response = await apiClient.get(
      `/noticeCategory/singlenoticeCategory/${id}`
    );
    if (response.status !== 200) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching single category:",
      error.response?.data || error.message
    );

    // 5. Return null so the UI can handle the "Not Found" state
    return null;
  }
}

//--------------------- management ----------------------
/**
 * Create a new management member
 * API: http://localhost:5000/api/v1/management/create-management
 */
export async function createManagement(managementData) {
  try {
    const response = await apiClient.post(
      "/management/create-management",
      managementData
    );
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Failed to create management: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error creating management:",
      error.response?.data || error.message
    );

    throw error;
  }
}
/**
 * Fetch all management members
 * API: http://localhost:5000/api/v1/management/all-management
 */
export async function getAllManagement() {
  try {
    const response = await apiClient.get("/management/all-management");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch management members: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching management list:",
      error.response?.data || error.message
    );
    return [];
  }
}
/**
 * Delete a management member by ID
 * API: http://localhost:5000/api/v1/management/delete-management/:id
 */
export async function deleteManagement(id) {
  try {
    const response = await apiClient.delete(
      `/management/delete-management/${id}`
    );

    if (response.status !== 200) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting management:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Fetch a single management member by ID
 * API: http://localhost:5000/api/v1/management/getsingle-management/:id
 */
export async function getSingleManagement(id) {
  try {
    const response = await apiClient.get(
      `/management/getsingle-management/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching single management:",
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * Update an existing management member
 * API: http://localhost:5000/api/v1/management/update-management/:id
 */
export async function updateManagement(id, managementData) {
  try {
    // We use PATCH or PUT based on your backend. Usually, update is PATCH or PUT.
    const response = await apiClient.put(
      `/management/update-management/${id}`,
      managementData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating management:",
      error.response?.data || error.message
    );
    throw error;
  }
}
