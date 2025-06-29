"use server"

export async function verifyLogin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return { success: true }
  }

  return { success: false, error: "Invalid credentials" }
}
