"use client";

import { SearchSection } from "@/components/search/SearchSection";
import FunctionalWrapper from "../chat/shared_chat_search/FunctionalWrapper";
import React, { useState } from "react";

export default function WrappedSearch({
  searchTypeDefault,
  initiallyToggled,
}: {
  searchTypeDefault: string;
  initiallyToggled: boolean;
}) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [withLLMAnswer, setWithLLMAnswer] = useState(false);
  //const 

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const callLocalAPI =  async () => {
    setLoading(true);
    setError("");

    let bodyIn = {
      question: text,
      withLLMAnswer : withLLMAnswer
    };
    //bouton
    setLoading(true)

    fetch('http://10.4.117.25:5205/q-a', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
        },
        //mode : "no-cors",
        body :  JSON.stringify( bodyIn),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); 
        })
        .then(data => {
          //console.log('Response:', data); 
          setAnswer(data.response.response)
          setMetadata(data.sources)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error:', error); 
        });
  };

  const afficheAnswer =  async () => {
    if (text.trim() === "") {
      setError("Entre une question.");
      return;
    }
    await callLocalAPI();
  };

  const buildDiv =  (data:any) => {
    let div = <div style={{width:"100%",marginBottom:"2px",border:"1px solid black"}}><b>Doc:</b> {data.doc}<br></br><b>URI:</b> {data.uri}</div>;
    return div;
  }

  const handleCheckboxChange = (event:any) => {
    setWithLLMAnswer(event.target.checked);
  };

  return (
    <FunctionalWrapper
      initiallyToggled={initiallyToggled}
      content={(toggledSidebar, toggle) => (
        <>
          <h1 style={{ position: "absolute", top: "250px", left: "300px" }}>
            Test
          </h1>

          <label style={{ position: "absolute", top: "280px", left: "300px" }}>Question:</label>
          <textarea
            id="Q"
            value={text}
            onChange={handleChange}
            rows={5}
            cols={40}
            style={{ position: "absolute", top: "300px", left: "300px" , border:"1px solid black",}}
          />

          <label style={{ position: "absolute", top: "430px", left: "300px" }}>Reponse:</label>
          <textarea
            id="A"
            style={{ position: "absolute", top: "450px", left: "300px",border:"1px solid black", }}
            value={answer}
            rows={5}
            cols={40}
            readOnly
          />
          {error && <div style={{ color: "red", position: "absolute", top: "500px", left: "300px" }}>{error}</div>}

          <button
            onClick={afficheAnswer}
            style={{
              position: "absolute",
              top: "650px",
              left: "350px",
              padding: "12px 24px",  
                fontSize: "16px",      
                fontWeight: "600",     
                backgroundColor: "#007BFF",  
                color: "#fff",        
                border: "none",        
                borderRadius: "8px",  
                cursor: "pointer",     
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)", 
                textAlign: "center",  
                width: "auto",         
                maxWidth: "250px",    
                margin: "10px 0",
            }}
          >
            {loading ? "Loading..." : "Get Reponse"}
          </button>

          <label style={{ position: "absolute", top: "670px", left: "530px" }}>LLM response:</label>
          <input 
            type="checkbox" 
            style={{
                position: "absolute",
                top: "670px",
                left: "650px",
                height:"40px",
                width:"40px"
              }} 
              checked={withLLMAnswer}
              onChange={handleCheckboxChange}
            />

          <label style={{ position: "absolute", top: "330px", left: "700px" }}>Sources:</label>
            <div style={{
              position: "absolute",
              top: "350px",
              left: "700px",
              border:"1px solid black",
              width:"600px",
              height:"300px",
              overflowY:"scroll",
              padding:"2px",
              display:"flex",
              flexDirection:"column"
            }}>
      
                    {metadata.length > 0 ? (
                        metadata.map((source, index) => (
                        <div key={index}>
                            {buildDiv(source)}
                        </div>
                        ))
                    ) : (
                        <p>Pas de data</p> 
                    )}
            </div>

        </>
      )}
    />
  );
}