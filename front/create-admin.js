const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://cobxfeidsefebkniiudr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYnhmZWlkc2VmZWJrbmlpdWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzU5MzYsImV4cCI6MjA5NDY1MTkzNn0.cqH5bURh9Hy9JnPtdiN3ZXdEp4nXrE7NqLg7P_RzM9Y";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const email = 'panggungkreator.idn@gmail.com';
  const password = 'TemanSepanggung2026';
  const username = 'adminpangkreas';

  console.log("Registering user in Auth...");
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  const user = authData.user;
  if (!user) {
    console.error("No user returned");
    return;
  }

  console.log("User created in Auth with ID:", user.id);
  console.log("Inserting profile into members table...");

  const { error: dbError } = await supabase
    .from('members')
    .insert({
      id: user.id,
      full_name: 'Admin Pangkreas',
      stage_name: 'Admin Pangkreas',
      whatsapp_number: '089999999999',
      email: email,
      username: username,
      payment_status: 'paid',
      role: 'admin'
    });

  if (dbError) {
    console.error("Database error:", dbError);
    return;
  }

  console.log("Admin account created successfully!");
}

run();
