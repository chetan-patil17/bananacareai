import api from "./api";

// CREATE PLANTATION
export const createPlantation = async (plantationData) => {
    const response = await api.post("/plantations", plantationData);
    return response.data;
};

// GET ALL PLANTATIONS OF A FARM
export const getPlantationsByFarm = async (farmId) => {
    const response = await api.get(`/plantations/farm/${farmId}`);
    return response.data;
};

// GET SINGLE PLANTATION
export const getPlantationById = async (plantationId) => {
    const response = await api.get(`/plantations/${plantationId}`);
    return response.data;
};

// UPDATE PLANTATION
export const updatePlantation = async (
    plantationId,
    plantationData
) => {
    const response = await api.put(
        `/plantations/${plantationId}`,
        plantationData
    );

    return response.data;
};