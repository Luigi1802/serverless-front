import axios from "axios";

// Création d'une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour récupérer la liste des fichiers du serveur Azure
export const fetchFiles = async () => {
    try {
      const response = await api.get('/csv/files');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      throw error;
    }
};

// Fonction pour récupérer la liste des fichiers du serveur Azure
export const fetchFileData = async (filename: string) => {
    try {
      const response = await api.get(`/file/${filename}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      throw error;
    }
};

// Fonction pour récupérer la liste des fichiers du serveur Azure
export const deleteFile = async (filename: string) => {
  try {
    const response = await api.delete(`/csv/delete/${filename}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

// Fonction pour récupérer la liste des fichiers du serveur Azure
export const addFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/csv/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error(error);
  }
};