import axios from "./axios";

export async function createAssistant(payload) {
  // payload: { name, firstMessage, voiceId, campaign, language?, serverUrl?, maxDurationSeconds?, toolIds? }
  const response = await axios.post("/vapi/assistant", payload);
  return response.data;
}

export async function updateAssistant(id, payload) {
  // payload: { name?, firstMessage?, voiceId?, campaign?, serverUrl?, maxDurationSeconds?, toolIds? }
  const response = await axios.put(`/vapi/assistant/${id}`, payload);
  return response.data;
}

export async function listAssistants() {
  const response = await axios.get("/vapi/assistant");
  return response.data;
}
