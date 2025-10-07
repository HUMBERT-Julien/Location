import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import the ChecklistItem type to resolve the module export error.
import { ChecklistItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateCleaningChecklist = async (description: string): Promise<Omit<ChecklistItem, 'id'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Génère une checklist de nettoyage standard pour un appartement en location saisonnière avec la description suivante : "${description}". Inclus les tâches pour toutes les pièces mentionnées.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "Liste des tâches de nettoyage.",
              items: {
                type: Type.STRING,
                description: "Une tâche de nettoyage spécifique.",
              },
            },
          },
          required: ["tasks"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.tasks && Array.isArray(jsonResponse.tasks)) {
      return jsonResponse.tasks.map((task: string) => ({ text: task, completed: false }));
    }
    
    return [];

  } catch (error) {
    console.error("Error generating checklist with Gemini:", error);
    throw new Error("Impossible de générer la checklist. Veuillez réessayer.");
  }
};