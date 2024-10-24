import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  ruleString: { type: String, required: true },
  ast: { type: Object, required: true }, // AST object
});

const Rule = mongoose.model("Rule", ruleSchema);
//module.exports = Rule;
export default Rule;
