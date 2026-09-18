import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini SDK
// Note: Requires GEMINI_API_KEY in .env.local
const ai = new GoogleGenAI({});

export async function POST(request: Request) {
  try {
    const { problemDescription, location, hasEvidence } = await request.json();

    if (!problemDescription || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
      You are the AI Civic Assistant for India.
      A citizen has reported a problem.
      
      Location Provided:
      - State: ${location.state}
      - District: ${location.district}
      - Town/Village: ${location.town || location.formattedAddress}
      
      Problem Description:
      "${problemDescription}"
      
      Evidence provided: ${hasEvidence ? 'Yes' : 'No'}
      
      Task:
      Extract the requested details and draft a formal, respectful complaint letter on behalf of the citizen. Do not invent government departments or officials. Use standard Indian administrative structures (e.g. Municipal Corporation, Gram Panchayat).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "The general problem category" },
            problemSummary: { type: Type.STRING, description: "A short problem summary" },
            location: { type: Type.STRING, description: "The specific location of the issue" },
            state: { type: Type.STRING, description: "The Indian state" },
            district: { type: Type.STRING, description: "The district name" },
            municipalityOrPanchayat: { type: Type.STRING, description: "The local body name" },
            recommendedAuthority: { type: Type.STRING, description: "The likely responsible government authority" },
            urgency: { type: Type.STRING, description: "The urgency of the issue (Low, Medium, High, Critical)" },
            formalComplaint: { type: Type.STRING, description: "A formal complaint letter" }
          },
          required: [
            "category", 
            "problemSummary", 
            "location", 
            "state", 
            "district", 
            "municipalityOrPanchayat", 
            "recommendedAuthority",
            "urgency",
            "formalComplaint"
          ]
        }
      }
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error("Gemini returned empty text");
    }
    
    const geminiResult = JSON.parse(aiText);

    // Map to the format the frontend expects to avoid breaking the UI
    const analysis = {
      identifiedCategory: geminiResult.category,
      identifiedProblem: geminiResult.problemSummary,
      urgency: geminiResult.urgency,
      responsibleAuthority: geminiResult.recommendedAuthority,
      authorityJurisdiction: geminiResult.municipalityOrPanchayat,
      officialPortalName: geminiResult.recommendedAuthority + " Grievance Portal",
      suggestedComplaintText: geminiResult.formalComplaint
    };

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        officialPortalUrl: "https://example.gov.in", // Placeholder URL as requested not to fabricate real URLs
        requiredEvidence: ["Photograph", "GPS Location"]
      }
    });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      error: 'AI Analysis Failed',
      details: error.message || 'An unknown error occurred while processing the request.'
    }, { status: 500 });
  }
}
