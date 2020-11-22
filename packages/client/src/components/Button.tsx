import React from "react";
import classNames from "classnames";
import { CircularProgress } from "@material-ui/core";

export const Button = ({
  loading = false,
  children,
  fullWidth,
  className,
  ...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  fullWidth: boolean;
}) => {
  const buttonClasses = classNames(
    className,
    "px-4 py-1 py-2 text-sm text-indigo-600 font-semibold rounded-md border",
    {
      "border-indigo-200 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2": !loading,
      "bg-gray-200 cursor-wait": loading,
      "w-full": fullWidth,
    },
  );

  return (
    <button {...otherProps} disabled={loading} className={`${buttonClasses}`}>
      {loading ? <CircularProgress size={24} /> : <>{children}</>}
    </button>
  );
};
