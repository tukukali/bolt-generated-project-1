import React from "react";

    const Button = ({ label, onClick, variant = "default" }) => {
      const getButtonStyles = () => {
        switch (variant) {
          case "primary":
            return "bg-gradient-to-b from-lime-300 to-lime-500 text-neutral-800";
          default:
            return "bg-[#232323] text-white";
        }
      };

      return (
        <button
          className={`px-6 py-3 rounded-full font-semibold tracking-tight transition hover:opacity-90 ${getButtonStyles()}`}
          onClick={onClick}
        >
          {label}
        </button>
      );
    };

    export default Button;
