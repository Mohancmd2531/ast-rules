import express from "express";
const router = express.Router();
import Rule from "../models/Rule.js";

// Store the combined AST in memory for now
let combinedAST = null;

// Example AST Node structure
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type; // "operator" or "operand"
    this.left = left; // Left child node for operators
    this.right = right; // Right child node for operators
    this.value = value; // Operand value (e.g., age > 30)
  }
}

// Parse the rule string and create an AST
const parseRuleString = (ruleString) => {
  console.log("Parsing rule string:", ruleString);

  try {
    const tokens = ruleString.match(/(\w+\s*[><=]\s*[\w\d']+|\(|\)|AND|OR)/g);
    console.log("Tokens generated:", tokens);

    const nodeStack = [];
    let currentNode = null;

    tokens.forEach((token) => {
      if (token === "AND" || token === "OR") {
        const operatorNode = new Node("operator", null, null, token);
        if (currentNode) {
          operatorNode.left = currentNode;
        }
        currentNode = operatorNode;
      } else if (token === "(") {
        nodeStack.push(currentNode);
        currentNode = null;
      } else if (token === ")") {
        const parentNode = nodeStack.pop();
        if (parentNode) {
          if (!parentNode.left) {
            parentNode.left = currentNode;
          } else {
            parentNode.right = currentNode;
          }
          currentNode = parentNode;
        }
      } else {
        const operandNode = new Node("operand", null, null, token.trim());
        if (
          currentNode &&
          currentNode.type === "operator" &&
          !currentNode.right
        ) {
          currentNode.right = operandNode;
        } else {
          currentNode = operandNode;
        }
      }
    });

    return currentNode;
  } catch (error) {
    console.error("Error parsing rule string:", error);
    return null;
  }
};

// Combine multiple ASTs into a single AST using OR
const combineRules = (rules) => {
  if (rules.length === 0) return null;

  let combinedAST = null;

  rules.forEach((rule) => {
    const ast = rule.ast; // Get the AST from the database object
    if (!combinedAST) {
      combinedAST = ast; // Initialize with the first AST
    } else {
      combinedAST = new Node("operator", combinedAST, ast, "OR");
    }
  });

  return combinedAST;
};

// Evaluate the AST against user data
const evaluateNode = (node, userData) => {
  if (!node) {
    console.error("Attempting to evaluate a null node.");
    return false; // Safely return false if the node is null
  }

  try {
    if (node.type === "operand") {
      const match = node.value.match(/(\w+)\s*([><=]+)\s*(.+)/);
      if (!match) {
        console.error(`Invalid operand format: ${node.value}`);
        return false; // Return false for invalid operands
      }

      const [field, operator, value] = match.slice(1);
      if (!userData.hasOwnProperty(field)) {
        console.error(`Field ${field} is missing from user data.`);
        return false; // Return false if the field doesn't exist in user data
      }

      // Evaluate based on the operator
      if (operator === ">")
        return parseInt(userData[field], 10) > parseInt(value, 10);
      if (operator === "<")
        return parseInt(userData[field], 10) < parseInt(value, 10);
      if (operator === "=") return userData[field] === value.replace(/'/g, "");
      return false;
    }

    if (node.type === "operator") {
      const leftResult = evaluateNode(node.left, userData);
      const rightResult = evaluateNode(node.right, userData);

      if (node.value === "AND") return leftResult && rightResult;
      if (node.value === "OR") return leftResult || rightResult;
    }

    return false;
  } catch (error) {
    console.error("Error during evaluation:", error);
    return false;
  }
};

// API: Add a new rule (creates an AST and stores it in the MongoDB database)
router.post("/create-rule", async (req, res) => {
  const { ruleString } = req.body;

  const ast = parseRuleString(ruleString);

  if (ast) {
    try {
      const newRule = new Rule({ ruleString, ast });
      await newRule.save(); // Save the rule to MongoDB
      res
        .status(200)
        .json({ message: "Rule added successfully", rule: newRule });
    } catch (error) {
      res.status(500).json({ error: "Error saving rule to database" });
    }
  } else {
    res.status(400).json({ error: "Error creating AST" });
  }
});

// API: Combine all rules and create a single AST
router.post("/combine-rules", async (req, res) => {
  try {
    const rules = await Rule.find(); // Fetch all rules from MongoDB

    if (rules.length === 0) {
      return res.status(400).json({ error: "No rules to combine" });
    }

    combinedAST = combineRules(rules);

    res
      .status(200)
      .json({ message: "Combined AST successfully created", combinedAST });
  } catch (error) {
    res.status(500).json({ error: "Error combining rules" });
  }
});

// API: Evaluate user data against the combined rule
router.post("/evaluate-combined", async (req, res) => {
  const { userData } = req.body;

  if (!combinedAST) {
    return res.status(400).json({ error: "No combined AST to evaluate" });
  }

  try {
    const result = evaluateNode(combinedAST, userData);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error evaluating combined rules" });
  }
});

export default router;
