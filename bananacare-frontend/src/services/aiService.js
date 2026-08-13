import api from "../api/axios";

// Send banana leaf image to Spring Boot.
// Spring Boot should communicate with the FastAPI AI service.
export const diagnoseBananaLeaf = async (
    plantationId,
    imageFile
) => {
    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await api.post(
        `/diagnoses/plantation/${plantationId}`,
        formData
    );

    return response.data;
};