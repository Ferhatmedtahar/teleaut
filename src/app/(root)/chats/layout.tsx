import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>sidebar will be here</div>
      {children}
    </div>
  );
}

export default layout;
