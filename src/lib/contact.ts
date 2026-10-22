import { z } from "zod";

export const interests = ["Rings", "Bespoke Watch", "Bespoke Strap", "Other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().min(1, "Please enter your email").email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30, "Phone number is too long").regex(/^[\d\s+()-]*$/, "Please enter a valid phone number").optional().or(z.literal("")),
  interest: z.enum(interests, { errorMap: () => ({ message: "Please choose an option" }) }),
  message: z.string().trim().min(1, "Please enter a message").max(2000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;
