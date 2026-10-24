import React from "react";
import type { OtpCore, OtpType } from "@frjoy/otp-core";

interface OtpContextProps {
  core: OtpCore;
  password?: boolean;
  type: OtpType;
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
