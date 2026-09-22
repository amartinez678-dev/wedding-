"use client";

import React from "react";

type WeddingLoaderProps = {
  size?: number;
  text?: string;
  className?: string;
};

export default function WeddingLoader({
  size = 240,
  text = "Loading our forever...",
  className = "",
}: WeddingLoaderProps) {
  return (
    <div
      className={`wedding-loader ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={size}
        height={size * 0.58}
        viewBox="0 0 400 230"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <g className="alex">
          <circle cx="0" cy="70" r="19" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M0 90 L0 145" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M0 105 L24 127" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M0 105 L-18 128" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <g className="alex-legs">
            <path className="alex-leg-one" d="M0 145 L-18 184" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path className="alex-leg-two" d="M0 145 L20 184" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>

        <g className="amber">
          <path d="M-17 63 C-13 42 18 43 20 65 C23 82 32 86 38 83" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <circle cx="0" cy="70" r="19" fill="white" stroke="currentColor" strokeWidth="5" />
          <path d="M0 91 L-24 150 L24 150 Z" fill="white" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
          <path d="M0 105 L-24 127" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M0 105 L18 126" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <g className="amber-legs">
            <path className="amber-leg-one" d="M-8 150 L-15 184" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path className="amber-leg-two" d="M8 150 L18 184" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>

        <g className="heart" transform="translate(0 -24)">
          <path d="M200 45 C190 31 166 38 170 57 C173 70 188 79 200 89 C212 79 227 70 230 57 C234 38 210 31 200 45 Z" fill="#c98f96">
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              keyTimes="0;0.55;0.68;0.88;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <path d="M90 190 H310" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".15" />
      </svg>

      {text && <div className="loader-text">{text}</div>}

      <style jsx>{`
        .wedding-loader {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #1e1e1e;
        }

        .alex {
          transform: translate(75px, 0);
          animation: alexWalk 4s ease-in-out infinite;
          transform-origin: center;
        }

        .amber {
          transform: translate(325px, 0);
          animation: amberWalk 4s ease-in-out infinite;
          transform-origin: center;
        }

        .heart {
          transform-box: fill-box;
          transform-origin: center;
        }

        .alex-legs,
        .amber-legs {
          transform-box: fill-box;
          transform-origin: center top;
        }

        .alex-legs {
          animation: alexLegs 0.38s ease-in-out infinite alternate;
        }

        .amber-legs {
          animation: amberLegs 0.38s ease-in-out infinite alternate;
        }

        .loader-text {
          margin-top: 2px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.65;
        }

        @keyframes alexWalk {
          0% { transform: translate(75px, 0); }
          50% { transform: translate(178px, 0); }
          65%, 85% { transform: translate(182px, 0); }
          100% { transform: translate(75px, 0); }
        }

        @keyframes amberWalk {
          0% { transform: translate(325px, 0); }
          50% { transform: translate(222px, 0); }
          65%, 85% { transform: translate(218px, 0); }
          100% { transform: translate(325px, 0); }
        }

        @keyframes alexLegs {
          from { transform: rotate(-5deg); }
          to { transform: rotate(5deg); }
        }

        @keyframes amberLegs {
          from { transform: rotate(5deg); }
          to { transform: rotate(-5deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .alex,
          .amber,
          .heart,
          .alex-legs,
          .amber-legs {
            animation: none;
          }

          .alex { transform: translate(182px, 0); }
          .amber { transform: translate(218px, 0); }
          .heart path { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
