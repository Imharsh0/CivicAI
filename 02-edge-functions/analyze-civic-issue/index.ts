// ==============================================================================
// CIVICAI SUPABASE EDGE FUNCTION: analyze-civic-issue
// Vision AI processing for Indian Civic Issues detection & scoring
// ==============================================================================

// @ts-ignore Deno resolves URL imports at runtime; standard TypeScript does not.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  image_url?: string;
  image_base64?: string;
  city?: string;
  category_hint?: string;
}

interface CivicAIResponse {
  issue_type: string;
  category: string;
  confidence: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  priority_level: "P1" | "P2" | "P3" | "P4";
  priority_score: number;
  explanation: string;
  safety_impact: string;
  suggested_action: string;
  is_demo: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image_url, image_base64, city = "Delhi" }: AnalysisRequest = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("AI_API_KEY");

    // If API key is present and we have image data, call external Vision AI
    if (apiKey && (image_url || image_base64)) {
      try {
        const systemPrompt = `You are CivicAI Vision Engine, an expert municipal civil engineer inspecting civic infrastructure issues across Indian cities.
Analyze the provided image and detect any civic or infrastructure problem (potholes, garbage dumping, water logging, broken streetlights, broken benches, sewage leak, fallen trees, damaged footpaths).
Output ONLY valid JSON with keys:
{
  "issue_type": "Specific name like Large Pothole, Overflowing Dustbin, Water Pipe Burst, Broken Street Light",
  "category": "One of: Road Infrastructure, Solid Waste Management, Water & Drainage, Lighting & Electricity, Public Infrastructure, Environment & Greenery, Other",
  "confidence": 85 to 98 (integer percentage),
  "severity": "One of: Critical, High, Medium, Low",
  "priority_level": "One of: P1, P2, P3, P4",
  "priority_score": 35 to 98 (integer 0-100),
  "explanation": "2-line technical reason of problem and hazard to Indian pedestrians/vehicles",
  "safety_impact": "Direct safety hazard statement",
  "suggested_action": "Immediate civic authority response needed"
}`;

        // External Gemini Vision call
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        let inlineDataPart = null;
        if (image_base64) {
          const cleanBase64 = image_base64.replace(/^data:image\/\w+;base64,/, "");
          inlineDataPart = {
            inline_data: {
              mime_type: "image/jpeg",
              data: cleanBase64
            }
          };
        }

        const payload: any = {
          contents: [{
            parts: [
              { text: systemPrompt },
              ...(inlineDataPart ? [inlineDataPart] : [{ text: `Image URL to analyze: ${image_url}` }])
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        };

        const res = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const geminiData = await res.json();
          const contentText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contentText) {
            const parsed = JSON.parse(contentText);
            const response: CivicAIResponse = {
              ...parsed,
              is_demo: false
            };
            return new Response(JSON.stringify(response), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200
            });
          }
        }
      } catch (externalErr) {
        console.warn("External Vision AI failed, falling back to intelligent demo engine", externalErr);
      }
    }

    // High Quality Zero-Config Demo Mode Fallback
    const demoAnalyses: CivicAIResponse[] = [
      {
        issue_type: "Hazardous Deep Pothole",
        category: "Road Infrastructure",
        confidence: 94,
        severity: "Critical",
        priority_level: "P1",
        priority_score: 91,
        explanation: "Deep crater detected on major roadway exceeding 12cm depth. High two-wheeler skid and wheel misalignment hazard.",
        safety_impact: "Severe accident risk during monsoon and low-light evening hours.",
        suggested_action: "Immediate cold-mix bitumen patching and perimeter safety cordon.",
        is_demo: true
      },
      {
        issue_type: "Overflowing Community Garbage Dump",
        category: "Solid Waste Management",
        confidence: 92,
        severity: "High",
        priority_level: "P2",
        priority_score: 83,
        explanation: "Waste container overflow with bio-degradable refuse spilling across pedestrian walkway. Vector hazard.",
        safety_impact: "Public health hazard and stray animal accumulation obstructing traffic.",
        suggested_action: "Dispatch compactor truck and sanitize collection perimeter.",
        is_demo: true
      },
      {
        issue_type: "Water Distribution Main Leakage",
        category: "Water & Drainage",
        confidence: 95,
        severity: "Critical",
        priority_level: "P1",
        priority_score: 89,
        explanation: "Pressurized clean potable water fountain erupting from sub-surface valve, causing road sub-base erosion.",
        safety_impact: "Water wastage and localized waterlogging creating road subsidence.",
        suggested_action: "Isolate sector valve and dispatch emergency pipeline repair crew.",
        is_demo: true
      },
      {
        issue_type: "Exposed Streetlight Wiring & Damaged Pole",
        category: "Lighting & Electricity",
        confidence: 89,
        severity: "High",
        priority_level: "P2",
        priority_score: 78,
        explanation: "Base inspection cover missing with live insulated conductors exposed within arm's reach of footpath.",
        safety_impact: "Electrocution danger for pedestrians during rainfall.",
        suggested_action: "De-energize circuit, seal terminal cover, and verify grounding resistance.",
        is_demo: true
      }
    ];

    // Pick analysis deterministically or random
    const randomIndex = Math.floor(Math.random() * demoAnalyses.length);
    const demoResult = demoAnalyses[randomIndex];

    return new Response(JSON.stringify(demoResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        error: "Unable to process civic image analysis",
        details: error?.message || "Unknown error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
