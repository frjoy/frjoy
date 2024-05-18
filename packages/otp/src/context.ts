import React from "react";
import { OTPInputClass } from "./controller";

interface OtpContextProps {
  refs: OTPInputClass;
  addRef: (ref: HTMLInputElement) => void;
  otp: { [id: string]: string };
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  password?: boolean;
  type: "text" | "number" | "any";
  pattern?: string;
}

export const OtpContext = React.createContext<OtpContextProps | undefined>(
  undefined
);

export const useOtpContext = () => {
  const context = React.useContext(OtpContext);
  if (!context) {
    throw new Error("useOtpContext must be used within an OtpProvider");
  }
  return context;
};
