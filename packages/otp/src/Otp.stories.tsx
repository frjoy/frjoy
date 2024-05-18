import React from "react";
import * as OTP from ".";

export default { title: "OTP" };

export const Default = () => {
  const [value, setValue] = React.useState("");
  return (
    <div>
      <h1>Unstyled default OTP</h1>
      <OTP.Root onChange={setValue}>
        <OTP.Input />
        <OTP.Input />
        <OTP.Input />
        <OTP.Input />
      </OTP.Root>
      {value && <p>OTP: {value}</p>}
    </div>
  );
};
