import api from "../api/axios";

// Get diagnosis history for one plantation
export const getDiagnosisHistory = async (plantationId) => {
    const response = await api.get(
        `/diagnoses/plantation/${plantationId}`
    );

    return response.data;
};

// Get diagnosis summary for one plantation
export const getDiagnosisSummary = async (plantationId) => {
    const response = await api.get(
        `/diagnoses/plantation/${plantationId}/summary`
    );

    return response.data;
};