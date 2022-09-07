"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
chai_1.default.use(chai_as_promised_1.default);
const expect = chai_1.default.expect;
describe("ITablelandController", function () {
    let accounts;
    let tables;
    let foos;
    let bars;
    let controller;
    let allowAllController;
    beforeEach(async function () {
        accounts = await hardhat_1.ethers.getSigners();
        // Deploy tables
        tables = (await (await hardhat_1.ethers.getContractFactory("TablelandTables")).deploy());
        await tables.deployed();
        await (await tables.initialize("https://foo.xyz/")).wait();
        // Deploy test erc721 contracts
        foos = (await (await hardhat_1.ethers.getContractFactory("TestERC721Enumerable")).deploy());
        await foos.deployed();
        bars = (await (await hardhat_1.ethers.getContractFactory("TestERC721AQueryable")).deploy());
        await bars.deployed();
        // Deploy test controllers
        controller = (await (await hardhat_1.ethers.getContractFactory("TestTablelandController")).deploy());
        await controller.deployed();
        allowAllController = (await (await hardhat_1.ethers.getContractFactory("TestAllowAllTablelandController")).deploy());
        await allowAllController.deployed();
        // Setup controller
        await (await controller.setFoos(foos.address)).wait();
        await (await controller.setBars(bars.address)).wait();
    });
    it("Should set controller for a table", async function () {
        var _a, _b, _c, _d;
        // Test setting controller fails if table does not exist
        const owner = accounts[4];
        await expect(tables
            .connect(owner)
            .setController(owner.address, ethers_1.BigNumber.from(1), accounts[3].address)).to.be.revertedWith("OwnerQueryForNonexistentToken");
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        // Test caller must be table owner
        const notOwner = accounts[5];
        const eoaController = accounts[6];
        await expect(tables
            .connect(owner)
            .setController(notOwner.address, tableId, eoaController.address)).to.be.revertedWith("Unauthorized");
        // Test only owner can set controller
        await expect(tables
            .connect(notOwner)
            .setController(owner.address, tableId, eoaController.address)).to.be.revertedWith("Unauthorized");
        // Test setting controller to an EOA address
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, eoaController.address);
        receipt = await tx.wait();
        let [setControllerEvent] = (_b = receipt.events) !== null && _b !== void 0 ? _b : [];
        expect(setControllerEvent.args.tableId).to.equal(createEvent.args.tableId);
        expect(setControllerEvent.args.controller).to.equal(eoaController.address);
        // Test that runSQL is now locked down to this EOA address
        // (not even owner should be able to run SQL now)
        const runStatement = "insert into testing values (0);";
        await expect(tables.connect(owner).runSQL(owner.address, tableId, runStatement)).to.be.revertedWith("Unauthorized");
        tx = await tables
            .connect(eoaController)
            .runSQL(eoaController.address, tableId, runStatement);
        await tx.wait();
        // Test setting controller to a contract address
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, allowAllController.address);
        receipt = await tx.wait();
        [setControllerEvent] = (_c = receipt.events) !== null && _c !== void 0 ? _c : [];
        expect(setControllerEvent.args.tableId).to.equal(createEvent.args.tableId);
        expect(setControllerEvent.args.controller).to.equal(allowAllController.address);
        // Test that anyone can run SQL through contract controller
        const caller = accounts[7];
        tx = await tables
            .connect(caller)
            .runSQL(caller.address, tableId, runStatement);
        receipt = await tx.wait();
        const [runEvent] = (_d = receipt.events) !== null && _d !== void 0 ? _d : [];
        expect(runEvent.args.caller).to.equal(caller.address);
        expect(runEvent.args.isOwner).to.equal(false);
        expect(runEvent.args.tableId).to.equal(tableId);
        expect(runEvent.args.statement).to.equal(runStatement);
        expect(runEvent.args.policy.allowInsert).to.equal(true);
        expect(runEvent.args.policy.allowUpdate).to.equal(true);
        expect(runEvent.args.policy.allowDelete).to.equal(true);
        expect(runEvent.args.policy.whereClause).to.equal("");
        expect(runEvent.args.policy.withCheck).to.equal("");
        expect(runEvent.args.policy.updatableColumns.length).to.equal(0);
    });
    it("Should get controller for a table", async function () {
        var _a;
        const owner = accounts[4];
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        const receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        const eoaController = accounts[6];
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, eoaController.address);
        await tx.wait();
        expect(await tables.getController(tableId)).to.equal(eoaController.address);
    });
    it("Should unset controller for a table", async function () {
        var _a, _b;
        const owner = accounts[4];
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        const eoaController = accounts[6];
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, eoaController.address);
        await tx.wait();
        expect(await tables.getController(tableId)).to.equal(eoaController.address);
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, hardhat_1.ethers.constants.AddressZero);
        receipt = await tx.wait();
        const [setControllerEvent] = (_b = receipt.events) !== null && _b !== void 0 ? _b : [];
        expect(setControllerEvent.args.controller).to.equal(hardhat_1.ethers.constants.AddressZero);
        expect(await tables.getController(tableId)).to.equal(hardhat_1.ethers.constants.AddressZero);
    });
    it("Should lock controller for a table", async function () {
        var _a;
        // Test locking controller fails if table does not exist
        const owner = accounts[4];
        await expect(tables.connect(owner).lockController(owner.address, ethers_1.BigNumber.from(1))).to.be.revertedWith("OwnerQueryForNonexistentToken");
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        // Test caller must be table owner
        const notOwner = accounts[5];
        await expect(tables.connect(owner).lockController(notOwner.address, tableId)).to.be.revertedWith("Unauthorized");
        // Test only owner can lock controller
        await expect(tables.connect(notOwner).lockController(owner.address, tableId)).to.be.revertedWith("Unauthorized");
        const eoaController = accounts[6];
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, eoaController.address);
        await tx.wait();
        expect(await tables.getController(tableId)).to.equal(eoaController.address);
        tx = await tables.connect(owner).lockController(owner.address, tableId);
        receipt = await tx.wait();
        // Test controller can no longer be set
        await expect(tables
            .connect(owner)
            .setController(owner.address, tableId, eoaController.address)).to.be.revertedWith("Unauthorized");
        // Test controller cannot be locked again
        await expect(tables.connect(owner).lockController(owner.address, tableId)).to.be.revertedWith("Unauthorized");
    });
    it("Should set and lock controller for a table with contract owner", async function () {
        var _a;
        const owner = accounts[4];
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        // Test contract owner can lock controller
        const contractOwner = accounts[0];
        const eoaController = accounts[6];
        tx = await tables
            .connect(contractOwner)
            .setController(owner.address, tableId, eoaController.address);
        await tx.wait();
        expect(await tables.getController(tableId)).to.equal(eoaController.address);
        tx = await tables
            .connect(contractOwner)
            .lockController(owner.address, tableId);
        receipt = await tx.wait();
        // Test controller can no longer be set
        await expect(tables
            .connect(contractOwner)
            .setController(owner.address, tableId, eoaController.address)).to.be.revertedWith("Unauthorized");
        // Test controller cannot be locked again
        await expect(tables.connect(contractOwner).lockController(owner.address, tableId)).to.be.revertedWith("Unauthorized");
    });
    it("Should be able to gate run SQL with controller contract", async function () {
        var _a, _b, _c;
        const owner = accounts[4];
        let tx = await tables.createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        tx = await tables
            .connect(owner)
            .setController(owner.address, tableId, controller.address);
        await tx.wait();
        // Test that run SQL on table is gated by ether
        const runStatement = "insert into testing values (0);";
        const caller = accounts[5];
        await expect(tables.connect(caller).runSQL(caller.address, tableId, runStatement)).to.be.revertedWith("InsufficientValue");
        // Test that run SQL on table is gated by Foo and Bar ownership
        const value = hardhat_1.ethers.utils.parseEther("1");
        await expect(tables.connect(caller).runSQL(caller.address, tableId, runStatement, {
            value,
        })).to.be.revertedWith("Unauthorized");
        // Test balance was reverted
        expect(await hardhat_1.ethers.provider.getBalance(tables.address)).to.equal(ethers_1.BigNumber.from(0));
        expect(await hardhat_1.ethers.provider.getBalance(controller.address)).to.equal(ethers_1.BigNumber.from(0));
        // Mint a Foo
        tx = await foos.connect(caller).mint();
        await tx.wait();
        // Still gated (need a Bar too)
        await expect(tables.connect(caller).runSQL(caller.address, tableId, runStatement, {
            value,
        })).to.be.revertedWith("Unauthorized");
        // Mint a Bar
        tx = await bars.connect(caller).mint();
        await tx.wait();
        // Caller should be able to run SQL now
        tx = await tables
            .connect(caller)
            .runSQL(caller.address, tableId, runStatement, { value });
        receipt = await tx.wait();
        let [runEvent] = (_b = receipt.events) !== null && _b !== void 0 ? _b : [];
        expect(runEvent.args.caller).to.equal(caller.address);
        expect(runEvent.args.isOwner).to.equal(false);
        expect(runEvent.args.tableId).to.equal(tableId);
        expect(runEvent.args.statement).to.equal(runStatement);
        expect(runEvent.args.policy.allowInsert).to.equal(false);
        expect(runEvent.args.policy.allowUpdate).to.equal(true);
        expect(runEvent.args.policy.allowDelete).to.equal(false);
        expect(runEvent.args.policy.whereClause).to.equal("foo_id in (0) and bar_id in (0)");
        expect(runEvent.args.policy.withCheck).to.equal("baz > 0");
        expect(runEvent.args.policy.updatableColumns.length).to.equal(1);
        expect(runEvent.args.policy.updatableColumns).to.include("baz");
        // Test balance was taken by controller
        expect(await hardhat_1.ethers.provider.getBalance(tables.address)).to.equal(ethers_1.BigNumber.from(0));
        expect(await hardhat_1.ethers.provider.getBalance(controller.address)).to.equal(value);
        // Mint some more
        tx = await foos.connect(caller).mint();
        await tx.wait();
        tx = await bars.connect(caller).mint();
        await tx.wait();
        tx = await bars.connect(caller).mint();
        await tx.wait();
        // Where clause should reflect all owned tokens
        tx = await tables
            .connect(caller)
            .runSQL(caller.address, tableId, runStatement, { value });
        receipt = await tx.wait();
        [runEvent] = (_c = receipt.events) !== null && _c !== void 0 ? _c : [];
        expect(runEvent.args.caller).to.equal(caller.address);
        expect(runEvent.args.isOwner).to.equal(false);
        expect(runEvent.args.tableId).to.equal(tableId);
        expect(runEvent.args.statement).to.equal(runStatement);
        expect(runEvent.args.policy.allowInsert).to.equal(false);
        expect(runEvent.args.policy.allowUpdate).to.equal(true);
        expect(runEvent.args.policy.allowDelete).to.equal(false);
        expect(runEvent.args.policy.whereClause).to.equal("foo_id in (0,1) and bar_id in (0,1,2)");
        expect(runEvent.args.policy.withCheck).to.equal("baz > 0");
        expect(runEvent.args.policy.updatableColumns.length).to.equal(1);
        expect(runEvent.args.policy.updatableColumns).to.include("baz");
    });
});
