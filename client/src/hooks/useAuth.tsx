import { useAuthStore } from "@/store/useAuthStore";
import { useState, ChangeEvent } from "react";
import { useToast } from "./use-toast";
import {
  handleSignUp,
  handleLogin as loginUser,
} from "@/services/authServices";
import { useLocation } from "wouter";
import { UserCredential } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";

export const useAuth = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { setIsAuth, setUserDetails, setIsOpen } = useAuthStore();

  const [userCredential, setUserCredential] = useState<UserCredential>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateFields("signin")) return;

    const { email, password } = userCredential;
    setIsSubmitting(true);

    try {
      const {data: response} = await loginUser({ email, password });
      setUserDetails(response.user);
      setIsAuth(true);

      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      });
      setIsOpen(false);
      navigate("/create");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!validateFields("signin")) return;
    const { email, password, firstName, lastName  } = userCredential;
    setIsSubmitting(true);

    try {
      const userData = {
        email,
        password,
        name: `${firstName} ${lastName}`,
      };

      const {data: response} = await handleSignUp(userData);
      setUserDetails(response.user);
      setIsAuth(true);

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      setIsOpen(false);
      navigate("/create");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFields = (flow: "signin" | "signup") => {
    const { email, password, firstName, lastName, confirmPassword, agreeToTerms } = userCredential;

    if(flow === "signup"){
      if (!email || !password || !firstName || !lastName || !confirmPassword) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (!agreeToTerms) {
        toast({
          title: "Terms Agreement Required",
          description:
            "You must agree to the Terms of Service and Privacy Policy.",
          variant: "destructive",
        });
        return false;
      }
    } else{
        if (!email || !password) {
          toast({
            title: "Missing Fields",
            description: "Please enter both email and password.",
            variant: "destructive",
          });
          return false;
        }
    }

    return true;
  }

  const userInputHandler = (
    e: ChangeEvent<HTMLInputElement> | { target: { name: string; checked?: CheckedState; value?: string } }
  ) => {
    const { name, value, checked } = e.target;
    
    setUserCredential(prev => ({
      ...prev,
      [name]: value === undefined ? checked : value
    }));
  };

  return {
    userCredential,
    setUserCredential,
    isSubmitting,
    handleLoginSubmit,
    handleRegisterSubmit,
    userInputHandler,
  };
};
