
"use client";

import { useState } from "react";

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
}

export default function useFormValidation(
  initial: Record<string, string>, 
  rules: ValidationRules
) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    Object.keys(rules).forEach((field) => {
      const value = values[field] || '';
      const rule = rules[field] || {};

      if (rule.required && !value.trim()) {
        newErrors[field] = "This field is required.";
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = "Invalid format.";
      }

      if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] = `Must be at least ${rule.minLength} characters.`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] = `Must be less than ${rule.maxLength} characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { 
    values, 
    errors, 
    handleChange, 
    validate,
    isSubmitting,
    setIsSubmitting 
  };
}