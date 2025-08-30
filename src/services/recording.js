import axios from "./axios";

export async function listRecordings(params) {
  // params: { page, perPage, sortBy, sortOrder, search }
  const response = await axios.get("/vapi/recordings", { params });
  return response.data;
}
