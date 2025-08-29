import React, { useEffect, useState } from "react";

const PdfCreator = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
      fetch("http://localhost:5002/api/docuseal/token")
        .then(res => res.json())
        .then(data => setToken(data.token));
  
      const script = document.createElement("script");
      script.src = "https://cdn.docuseal.com/docuseal.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);
  
    return (
      <div>
        {token && (
          <docuseal-builder data-token={token}></docuseal-builder>
        )}
      </div>
    );
  };

export default PdfCreator;
