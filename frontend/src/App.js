import React, { useState } from "react";
import "./App.css"; // Make sure to import the CSS file

const App = () => {
  const [rule, setRule] = useState("");
  const [userData, setUserData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [astMessage, setAstMessage] = useState("");
  const [rules, setRules] = useState([]); // To keep track of all rules

  // Function to create the rule by sending the rule string to the backend
  const createRule = async () => {
    try {
      const response = await fetch("/api/create-rule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleString: rule }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAstMessage(`Error: ${errorData.error}`);
        return;
      }

      setRules((prevRules) => [...prevRules, rule]); // Store the rule locally
      setAstMessage("Rule successfully created!");
      setRule(""); // Clear input field
    } catch (error) {
      console.error("Error creating rule:", error);
      setAstMessage("Error creating rule");
    }
  };

  // Function to combine rules and create a single AST
  const combineRules = async () => {
    if (rules.length === 0) {
      setAstMessage("No rules to combine.");
      return;
    }

    try {
      const response = await fetch("/api/combine-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAstMessage(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setAstMessage("Combined AST successfully created!"); // Add additional AST handling if needed
    } catch (error) {
      console.error("Error combining rules:", error);
      setAstMessage("Error combining rules");
    }
  };

  // Function to evaluate the combined rule with user data
  const evaluateCombinedRule = async () => {
    if (rules.length === 0) {
      setEvaluationResult("Please create at least one rule first.");
      return;
    }

    try {
      const response = await fetch("/api/evaluate-combined", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
      });
      const data = await response.json();
      setEvaluationResult(data.result ? "True" : "False");
    } catch (error) {
      console.error("Error evaluating combined rule:", error);
      setEvaluationResult("Error evaluating rule");
    }
  };

  // Handle input changes for rule string and user data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="app-container">
      <h1>Rule Engine with AST</h1>

      {/* Input for Rule String */}
      <div className="rule-section">
        <h2>Create Rule</h2>
        <input
          type="text"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter rule string"
          className="input-box"
        />
        <div className="button-container">
          <button onClick={createRule} className="button">
            Create Rule
          </button>
          <button onClick={combineRules} className="button">
            Combine Rules
          </button>
        </div>
        {astMessage && <p className="message">{astMessage}</p>}
      </div>

      {/* Inputs for User Data */}
      <div className="evaluation-section">
        <h2>Evaluate Combined Rule</h2>
        <div className="input-group">
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            className="input-box"
          />
          <input
            type="text"
            name="department"
            value={userData.department}
            onChange={handleInputChange}
            placeholder="Enter department"
            className="input-box"
          />
          <input
            type="number"
            name="salary"
            value={userData.salary}
            onChange={handleInputChange}
            placeholder="Enter salary"
            className="input-box"
          />
          <input
            type="number"
            name="experience"
            value={userData.experience}
            onChange={handleInputChange}
            placeholder="Enter experience"
            className="input-box"
          />
        </div>
        <button onClick={evaluateCombinedRule} className="button">
          Evaluate Combined Rule
        </button>
      </div>

      {/* Display Evaluation Result */}
      <div className="result-section">
        <h2>Evaluation Result</h2>
        {evaluationResult !== null && <p>Result: {evaluationResult}</p>}
      </div>
    </div>
  );
};

export default App;
