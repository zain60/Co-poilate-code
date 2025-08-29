import axiosInstance from "./axios";

const getCaseTypeParam = () => {
  return localStorage.getItem("currentPage") === "intake"
    ? "intake"
    : "ongoing";
};

// intakes page
export const getAllIntakes = async () => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`intakes/all?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "Get intakes failed");
  }
};

export const getLienResolutionCases = async (userId) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`cases/lien-resolution-cases/${userId}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "Get lien resolution cases failed");
  }
};

export const getAllProvider = async () => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`users/providers?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "fetching cases failed");
  }
};

export const createCase = async (payload) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`cases/create?caseType=${caseType}`, payload);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "An error occurred");
  }
};

export const updateCase = async (payload) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.put(`cases/${payload?.id}?caseType=${caseType}`, payload);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "An error occurred");
  }
};

export const acceptCase = async (payload) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`cases/accept?caseType=${caseType}`, payload);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "An error occurred");
  }
};

export const getAllCases = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`cases/allcases/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "fetching cases failed");
  }
};

export const getSingleCase = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`cases/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "fetching single cases failed"
    );
  }
};

export const deleteSingleCase = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.delete(`cases/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "delete case failed");
  }
};

export const deleteArchivedCase = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.delete(`archive/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "delete archived case failed");
  }
};

export const deleteTask = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.delete(`tasks/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "delete task failed");
  }
};

export const addDoctorToCase = async (model) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`cases/add-provider?caseType=${caseType}`, model);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "add provider to case failed"
    );
  }
};

export const addTaskToCase = async (model) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(
      `tasks/create?caseType=${caseType}`,
      model,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "task create failed");
  }
};

export const editTask = async (model, taskId) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.put(
      `tasks/${taskId}?caseType=${caseType}`,
      model,
      { timeout: 30000 }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "task edit failed");
  }
};

export const getTaskbyCaseId = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`tasks/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "fetching task failed");
  }
};

export const submitTaskResponse = async (payload, caseType) => {
  try {
    const response = await axiosInstance.put(`cases/updateCaseAnswers/${payload?.caseId}?caseType=${caseType}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "Failed to submit task response");
  }
};

// Archive a case
export const archiveCase = async (model) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`archive/archived?caseType=${caseType}`, model);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "archiving case failed");
  }
};

export const unArchiveCase = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.delete(`archive/unarchive/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "unarchiving case failed");
  }
};

export const getAllarchiveCase = async (id) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.get(`archive/${id}?caseType=${caseType}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "archiving case failed");
  }
};

export const sendLienOffer = async (payload) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`lien-offers/create?caseType=${caseType}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "send lien offer failed");
  }
};

// invite doctor
export const inviteNewDoctor = async (model) => {
  const caseType = getCaseTypeParam();
  try {
    const response = await axiosInstance.post(`invite/doctor?caseType=${caseType}`, model);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "task create failed");
  }
};

export const updateUser = async (id, model) => {
  try {
    const response = await axiosInstance.put(`users/${id}`, model);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || "archiving case failed");
  }
};

