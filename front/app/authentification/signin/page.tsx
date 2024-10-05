"use client";

// Importation des modules externes
import axios from "axios";
import DOMPurify from "dompurify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Importation des modules absolus
import { CredentialsForm } from "@/app/components/authentification/CredentialForm";

// Interface pour représenter la structure du token décodé
interface DecodedToken {
  role: any;
}

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input);
  };

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await axios.post("/api/auth/signin", {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (response.status === 200) {
        const token = Cookies.get("authToken") || "";
          console.log(token);
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);

          if (typeof decodedToken !== "object" || !decodedToken) {
            throw new Error("Invalid token format.");
          }

          // Extraire le rôle de l'utilisateur
          const userRole = sanitizeInput(decodedToken.role.role_name || "");
          if (userRole === "Admin") {
            router.push("/dashboard/admin");
          } else {
            setError("You are not authorized to access the admin dashboard.");
          }
        } else {
          setError("JWT token not found in cookies.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An unexpected error occurred: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <CredentialsForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
