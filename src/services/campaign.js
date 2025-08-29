import axios from "./axios";

export async function createCampaign(payload) {
  // payload: { name, phoneNumber, assistantId, accountSid, authToken }
  const response = await axios.post("/campaigns", payload);
  return response.data;
}

export async function listCampaigns() {
  const response = await axios.get("/campaigns");
  return response.data;
}


