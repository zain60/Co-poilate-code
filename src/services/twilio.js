import axios from "./axios";

export async function getAvailableNumbers(params) {
  // params: { country }
  const response = await axios.get("/twilio/available-numbers", { params, timeout: 20000 });
  return response.data;
}

export async function purchaseNumber(payload) {
  // payload: { phoneNumber }
  const response = await axios.post("/twilio/purchase-number", payload);
  return response.data;
}

export async function listPurchasedNumbers() {
  const response = await axios.get("/twilio/numbers");
  return response.data;
}
