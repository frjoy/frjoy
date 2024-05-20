import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <h1>Packages</h1>
      <ul className="text-gray-500 dark:text-gray-400 list-inside list-decimal">
        <li>
          <Link
            href={"/otp"}
            className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
          >
            OTP
          </Link>
        </li>
      </ul>
    </div>
  );
}
