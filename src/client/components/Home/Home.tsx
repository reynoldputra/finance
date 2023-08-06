import React from "react";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className="w-full min-h-screen flex flex-col p-10">
      <h1 className="font-bold text-3xl">Dashboard</h1>
    </div>
  );
};
