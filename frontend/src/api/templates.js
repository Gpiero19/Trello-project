import axiosInstance from "./axiosInstance";

export async function getTemplates() {
  try {
    const response = await axiosInstance.get("/templates");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch templates", err);
  }
}

export async function getTemplateById(templateId) {
  try {
    const response = await axiosInstance.get(`/templates/${templateId}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch template", err);
  }
}

export async function createTemplate(templateData) {
  try {
    const response = await axiosInstance.post("/templates", templateData);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create template", err);
  }
}

export async function useTemplate(templateId) {
  try {
    const response = await axiosInstance.post(`/templates/${templateId}/use`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to use template", err);
  }
}

export async function updateTemplate(templateId, templateData) {
  try {
    const response = await axiosInstance.put(`/templates/${templateId}`, templateData);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update template", err);
  }
}

export async function deleteTemplate(templateId) {
  try {
    const response = await axiosInstance.delete(`/templates/${templateId}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to delete template", err);
  }
}
