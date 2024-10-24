import chai from "chai"; // Import chai
import chaiHttp from "chai-http"; // Import chai-http
import { app } from "../server.js"; // Import the app from your server

// Use chai-http middleware
chai.use(chaiHttp);
const { expect } = chai; // Destructure expect from chai

describe("Rule Engine Tests", () => {
  it("should create a rule and verify the AST", (done) => {
    chai
      .request(app)
      .post("/api/create-rule")
      .send({ ruleString: "age > 30" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.rule).to.have.property("ruleString", "age > 30");
        expect(res.body.rule.ast).to.have.property("type", "operand");
        expect(res.body.rule.ast).to.have.property("value", "age > 30");
        done();
      });
  });

  it("should combine rules and verify the combined AST", (done) => {
    chai
      .request(app)
      .post("/api/combine-rules")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("combinedAST");
        expect(res.body.combinedAST.value).to.equal("OR");
        done();
      });
  });

  it("should evaluate combined rule and return true for valid user data", (done) => {
    const userData = { age: 35, salary: 60000, department: "HR" };
    chai
      .request(app)
      .post("/api/evaluate-combined")
      .send({ userData })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("result", true);
        done();
      });
  });

  it("should evaluate combined rule and return false for invalid user data", (done) => {
    const userData = { age: 25, salary: 40000, department: "Marketing" };
    chai
      .request(app)
      .post("/api/evaluate-combined")
      .send({ userData })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("result", false);
        done();
      });
  });
});
