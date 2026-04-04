import { GoogleGenAI } from "@google/genai";
import { Patient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function calculateUrgencyScore(patient: Patient): Promise<number> {
  try {
    const prompt = `
      Analyze the following patient data and provide an urgency score from 0 to 100.
      0 means stable, 100 means critical emergency.
      
      Patient Name: ${patient.full_name}
      Age: ${patient.age || 62}
      Triage Status: ${patient.triage_status}
      Compliance Rate: ${patient.complianceRate || 0}%
      Latest Shift Note: ${patient.current_shift_note || 'N/A'}
      Latest Alert: ${patient.latest_alert_title || 'None'}
      
      Consider:
      1. Compliance rate (lower is more urgent).
      2. Shift note sentiment and clinical observations.
      3. Active alerts and their severity.
      4. Triage status.
      
      Return ONLY the numerical score.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const score = parseInt(response.text?.trim() || "0");
    return isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error("Error calculating urgency score:", error);
    return 0; // Fallback
  }
}
