"use client";
import { useState, useRef, useEffect } from "react";
import { api, getAuth, Interaction, Medicine } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  type?: "info" | "warning" | "danger" | "success";
}

// Real AI integration - add your API key to .env.local as NEXT_PUBLIC_OPENAI_API_KEY
const AI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const AI_API_URL = "https://api.openai.com/v1/chat/completions";

async function askAI(question: string, history: Message[]): Promise<string | null> {
  if (!AI_API_KEY) return null;

  try {
    const conversation = history.slice(-10).map((m) => ({
      role: m.role,
      content: m.text,
    }));

    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are PillWise, a helpful health assistant for a medicine interaction checker app in Pakistan. " +
              "Answer questions about medicines, drug interactions, side effects, dosage, allergies, and general health. " +
              "Keep answers concise, accurate, and include a disclaimer to consult healthcare professionals for serious concerns. " +
              "Use emoji and formatting to make responses engaging. If asked about specific medicine interactions, advise consulting a doctor.",
          },
          ...conversation,
          { role: "user", content: question },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export default function HealthChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I'm your PillWise Health Assistant. Ask me anything about medicines, interactions, or health topics!\n\nExamples:\n• Can I take Panadol with Brufen?\n• What are the side effects of Augmentin?\n• Is aspirin safe with blood pressure medicine?",
      type: "info",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const generateResponse = async (question: string): Promise<string> => {
    // Try real AI first if API key is set
    if (AI_API_KEY) {
      const aiResponse = await askAI(question, messages);
      if (aiResponse) return aiResponse;
    }

    const lower = question.toLowerCase();

    // Check for medicine interaction queries
    if (lower.includes("with") || lower.includes("together") || lower.includes("combine") || lower.includes("interaction")) {
      const medicines = await api.getMedicines().catch(() => [] as Medicine[]);
      const foundMeds = medicines.filter((m) => lower.includes(m.name.toLowerCase()));

      if (foundMeds.length >= 2) {
        try {
          const interactions = (await api.checkInteractions(foundMeds.map((m) => m.id))) as Interaction[];
          if (interactions.length === 0) {
            return `✅ Good news! I found no known interactions between ${foundMeds.map((m) => m.name).join(" and ")}.\n\nHowever, always consult your doctor or pharmacist before combining any medicines.`;
          }
          const dangerous = interactions.filter((i) => i.severity === "Dangerous");
          const mild = interactions.filter((i) => i.severity === "Mild");

          let response = "";
          if (dangerous.length > 0) {
            response += `🔴 **DANGEROUS INTERACTION FOUND!**\n\n`;
            dangerous.forEach((i) => {
              response += `**${i.medicine1Name} + ${i.medicine2Name}**\n`;
              response += `${i.description || "Potentially dangerous interaction"}\n`;
              if (i.advice) response += `💡 ${i.advice}\n`;
              response += `\n`;
            });
          }
          if (mild.length > 0) {
            response += `🟡 **Mild Interactions:**\n\n`;
            mild.forEach((i) => {
              response += `**${i.medicine1Name} + ${i.medicine2Name}**\n`;
              response += `${i.description || "Mild interaction"}\n`;
              if (i.advice) response += `💡 ${i.advice}\n`;
              response += `\n`;
            });
          }
          response += `⚠️ Always consult your healthcare provider for personalized advice.`;
          return response;
        } catch {
          // Fall through to generic response
        }
      }
    }

    // Side effects queries
    if (lower.includes("side effect")) {
      return `💊 **Common Medicine Side Effects**\n\nHere are general guidelines:\n\n**Painkillers (Panadol, Brufen):**\n• Nausea, stomach pain\n• Dizziness\n• With food to reduce stomach issues\n\n**Antibiotics:**\n• Stomach upset\n• Diarrhea\n• Allergic reactions (rare)\n\n**Antihistamines:**\n• Drowsiness\n• Dry mouth\n\n⚠️ For specific medicine side effects, search the medicine in our database for complete information.\n\nThis is not medical advice - always consult a healthcare professional.`;
    }

    // Allergy queries
    if (lower.includes("allerg")) {
      return `🤧 **Allergy Information**\n\n**Common Drug Allergies:**\n• Penicillin (most common)\n• Sulfa drugs\n• Aspirin\n• NSAIDs (ibuprofen, naproxen)\n\n**Signs of drug allergy:**\n• Rash or hives\n• Swelling\n• Difficulty breathing\n• Anaphylaxis (severe)\n\n⚠️ If you experience any severe reaction, seek emergency medical help immediately!\n\n💡 Add your allergies to your PillWise profile for automatic warnings.`;
    }

    // Dosage queries
    if (lower.includes("dose") || lower.includes("dosage") || lower.includes("how much") || lower.includes("how many")) {
      return `💊 **General Dosage Guidelines**\n\n**Adults:**\n• Panadol: 500mg-1000mg every 4-6 hours (max 4g/day)\n• Brufen: 200mg-400mg every 4-6 hours\n• Aspirin: 75mg-300mg daily\n\n**Children (weight-based):**\n• Panadol: 10-15mg/kg every 4-6 hours\n• Brufen: 5-10mg/kg every 6-8 hours\n\n⚠️ Always follow your doctor's prescription. These are general guidelines only.\n\nUse our Dosage Calculator for personalized recommendations based on age and weight!`;
    }

    // Food/meal queries
    if (lower.includes("food") || lower.includes("meal") || lower.includes("eat") || lower.includes("empty stomach")) {
      return `🍽️ **Food & Medicine Guide**\n\n**Take WITH food:**\n• Brufen/Ibuprofen (reduces stomach irritation)\n• Antibiotics (reduces nausea)\n• Iron supplements\n• Most anti-inflammatory drugs\n\n**Take ON EMPTY stomach:**\n• Some antibiotics (amoxicillin)\n• Pantoprazole/Omeprazole (30 min before meal)\n• Thyroid medicines\n\n**Avoid with:**\n• Dairy (certain antibiotics)\n• Grapefruit (many medicines)\n• Alcohol (most medicines)\n• Caffeine (some medicines)\n\n⚠️ Always check specific medicine instructions.`;
    }

    // General health advice
    if (lower.includes("advice") || lower.includes("tips") || lower.includes("healthy")) {
      return `🏥 **Medicine Safety Tips**\n\n1️⃣ **Always tell your doctor** about ALL medicines you take\n2️⃣ **Never share** prescription medicines\n3️⃣ **Check expiration dates** regularly\n4️⃣ **Store medicines** in cool, dry places\n5️⃣ **Complete the full course** of antibiotics\n6️⃣ **Don't crush** enteric-coated tablets\n7️⃣ **Keep a list** of your medicines (use PillWise!)\n8️⃣ **Ask your pharmacist** about over-the-counter interactions\n\n💡 Use PillWise to automatically check for dangerous interactions!`;
    }

    // Default response
    return `I understand you're asking about "${question}"\n\nHere's what I can help with:\n\n🔍 **Check interactions** - Ask "Can I take X with Y?"\n💊 **Side effects** - Ask "What are side effects of X?"\n🍽️ **Food interactions** - Ask "Should I take X with food?"\n📏 **Dosage** - Ask "What's the dosage for X?"\n🤧 **Allergies** - Ask about drug allergies\n\n💡 You can also search our medicine database for detailed information about any specific medicine.\n\n⚠️ I provide general information only. For medical emergencies or serious concerns, always consult a healthcare professional.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await generateResponse(userMsg.text);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: response,
        type: response.includes("DANGEROUS") ? "danger" : response.includes("Good news") ? "success" : "info",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I couldn't process that. Please try again.",
        type: "warning",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Can I take Panadol with Brufen?",
    "Side effects of Augmentin?",
    "Should I take medicine with food?",
    "General health tips",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen
            ? "bg-slate-700 rotate-0"
            : "bg-gradient-medical hover:scale-110 animate-pulse-glow"
        }`}
        style={isOpen ? {} : { boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
      >
        <span className="text-2xl">{isOpen ? "✕" : "🤖"}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 md:bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md animate-fade-in-up">
          <div className="glass-card border-slate-700/50 overflow-hidden flex flex-col" style={{ height: "500px" }}>
            {/* Header */}
            <div className="bg-gradient-medical p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Health Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-medical text-white rounded-br-md"
                        : msg.type === "danger"
                        ? "severity-dangerous text-slate-200 rounded-bl-md"
                        : msg.type === "success"
                        ? "severity-safe text-slate-200 rounded-bl-md"
                        : "bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="text-xs glass-card px-3 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-800/50 bg-slate-900/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about medicines..."
                  className="input-field flex-1 px-4 py-2.5 rounded-xl text-white text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="btn-primary px-4 py-2.5 rounded-xl text-white font-medium disabled:opacity-50 flex-shrink-0"
                >
                  {loading ? (
                    <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    "→"
                  )}
                </button>
              </form>
              <p className="text-[10px] text-slate-600 text-center mt-2">
                Not medical advice. Always consult a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
