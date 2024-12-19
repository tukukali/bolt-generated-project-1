import React from 'react';

    const StatusBar = () => {
      return (
        <div className="flex items-center py-4 pr-6 pl-10">
          <div className="flex items-center gap-1 ml-auto">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>
      );
    };

    const SignalIcon = () => (
      <svg className="w-4 h-4" viewBox="0 0 18 12" fill="none">
        <path d="M9.61538 2.88462C9.61538 2.35357 10.0459 1.92308 10.5769 1.92308H11.5385C12.0695 1.92308 12.5 2.35357 12.5 2.88462V10.5769C12.5 11.108 12.0695 11.5385 11.5385 11.5385H10.5769C10.0459 11.5385 9.61538 11.108 9.61538 10.5769V2.88462Z" fill="white"/>
      </svg>
    );

    const WifiIcon = () => (
      <svg className="w-4 h-4" viewBox="0 0 17 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.17352 2.48801C10.5452 2.48811 12.8262 3.41832 14.5451 5.08636C14.6745 5.21514 14.8814 5.21352 15.0089 5.08272L16.2461 3.80813C16.3107 3.74179 16.3467 3.65192 16.3461 3.55843C16.3456 3.46493 16.3086 3.3755 16.2433 3.30994C11.7318 -1.10331 4.6145 -1.10331 0.103041 3.30994C0.0376897 3.37546 0.000610076 3.46485 7.46089e-06 3.55835C-0.000595154 3.65185 0.035329 3.74174 0.0998304 3.80813L1.33746 5.08272C1.46486 5.21372 1.67191 5.21534 1.80126 5.08636C3.52034 3.41821 5.8016 2.488 8.17352 2.48801Z" fill="white"/>
      </svg>
    );

    const BatteryIcon = () => (
      <svg className="w-6 h-4" viewBox="0 0 22 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 1.79086 1.79086 0 4 0H18C20.2091 0 22 1.79086 22 4V9C22 11.2091 20.2091 13 18 13H4C1.79086 13 0 11.2091 0 9V4Z" fill="#808080"/>
      </svg>
    );

    export default StatusBar;
