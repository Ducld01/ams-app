if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "Please define value for NEXT_PUBLIC_API_URL in your env file."
  );
}

export const ASM_ORIGIN = process.env.NEXT_PUBLIC_API_URL;
