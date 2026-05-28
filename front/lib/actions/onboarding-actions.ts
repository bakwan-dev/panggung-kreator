"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import Groq from "groq-sdk";

type OnboardingPayload = {
  full_name: string;
  stage_name: string;
  birth_place: string;
  birth_date: string;
  whatsapp_number: string;
  instagram_username: string;
  occupation: string;
};

export async function submitOnboardingData(payload: OnboardingPayload) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Get current user session
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return { success: false, error: "Sesi tidak ditemukan atau kadaluarsa. Silakan login kembali." };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Check if user already exists in members table
    const { data: existingMember } = await supabase
      .from("members")
      .select("id")
      .eq("id", userId)
      .single();

    let dbError;
    let generatedDescription = "";

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `Buatkan deskripsi singkat dan elegan (maksimal 3 kalimat) dalam bahasa Indonesia tentang seorang kreator dengan nama panggung "${payload.stage_name}". Dia lahir di ${payload.birth_place} pada tanggal ${payload.birth_date}. Pekerjaannya saat ini adalah ${payload.occupation}. Buat deskripsinya profesional, kreatif, dan cocok untuk profil portfolio. Jangan menggunakan kata sapaan atau penjelasan tambahan, langsung berikan deskripsinya.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 150,
      });

      generatedDescription = chatCompletion.choices[0]?.message?.content?.trim() || "";
    } catch (groqError) {
      console.error("Groq generation failed:", groqError);
      generatedDescription = `${payload.occupation} yang berbakat dari ${payload.birth_place}. Dikenal dengan nama panggung ${payload.stage_name}.`;
    }

    if (existingMember) {
      // Update existing record
      const { error } = await supabase
        .from("members")
        .update({
          full_name: payload.full_name,
          stage_name: payload.stage_name,
          birth_place: payload.birth_place,
          birth_date: payload.birth_date,
          whatsapp_number: payload.whatsapp_number,
          instagram_username: payload.instagram_username,
          occupation: payload.occupation,
          description: generatedDescription,
          email: userEmail,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
      dbError = error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from("members")
        .insert({
          id: userId,
          full_name: payload.full_name,
          stage_name: payload.stage_name,
          birth_place: payload.birth_place,
          birth_date: payload.birth_date,
          whatsapp_number: payload.whatsapp_number,
          instagram_username: payload.instagram_username,
          occupation: payload.occupation,
          description: generatedDescription,
          email: userEmail,
        });
      dbError = error;
    }

    if (dbError) {
      console.error("Database error:", dbError);
      return { success: false, error: dbError.message };
    }

    return { success: true };

  } catch (error) {
    console.error("Onboarding submission error:", error);
    return { success: false, error: "Terjadi kesalahan internal server." };
  }
}
