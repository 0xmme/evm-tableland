"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const hardhat_1 = require("hardhat");
chai_1.default.use(chai_as_promised_1.default);
const expect = chai_1.default.expect;
describe("SQLHelpers", function () {
    let lib;
    beforeEach(async function () {
        const Lib = await hardhat_1.ethers.getContractFactory("SQLHelpers");
        lib = (await Lib.deploy());
        await lib.deployed();
    });
    it("Should return a name from a prefix", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toNameFromId("_test_&$%()#@!*_123__", 101)).to.equal("_test_&$%()#@!*_123___31337_101");
    });
    it("Should return a valid CREATE statement from schema", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toCreateFromSchema("test_101", "id int, name text, desc text")).to.equal("CREATE TABLE test_101_31337 (id int, name text, desc text)");
    });
    it("Should return a valid INSERT statement from columns and values", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toInsert("test_101", 1, "id, name, desc", "2, 'test', 'information'")).to.equal("INSERT INTO test_101_31337_1 (id, name, desc) VALUES (2, 'test', 'information')");
    });
    it("Should return a valid UPDATE statement from columns, setters, and filters", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toUpdate("test_101", 1, "name='update_test', desc='updated!'", "id=2")).to.equal("UPDATE test_101_31337_1 SET name='update_test', desc='updated!' WHERE id=2");
    });
    it("Should return a valid UPDATE statement from columns and setters", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toUpdate("test_101", 1, "name='update_all_test', desc='updated!'", "")).to.equal("UPDATE test_101_31337_1 SET name='update_all_test', desc='updated!'");
    });
    it("Should return a valid DELETE statement from filters", async function () {
        await expect(
        // This is not a valid name in Tableland but tests string concat.
        await lib.toDelete("test_101", 1, "id=2")).to.equal("DELETE FROM test_101_31337_1 WHERE id=2");
    });
});
