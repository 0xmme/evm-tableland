"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
chai_1.default.use(chai_as_promised_1.default);
const expect = chai_1.default.expect;
describe("TablelandTablesProxy", function () {
    let accounts;
    let Factory;
    beforeEach(async function () {
        accounts = await hardhat_1.ethers.getSigners();
        Factory = await hardhat_1.ethers.getContractFactory("TablelandTables");
    });
    it("Should have set implementation owner to deployer address", async function () {
        const tables = await deploy(Factory, "https://foo.xyz/");
        const owner = await tables.owner();
        expect(owner).to.equal(accounts[0].address);
    });
    it("Should only allow owner to upgrade", async function () {
        const tables1 = await deploy(Factory, "https://foo.xyz/");
        const badUpdater = accounts[1];
        const Factory2 = await hardhat_1.ethers.getContractFactory("TablelandTables", badUpdater);
        await expect(update(tables1, Factory2)).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should not re-deploy proxy or implementation if unchanged", async function () {
        const tables1 = await deploy(Factory, "https://foo.xyz/");
        const tables2 = await update(tables1, Factory);
        expect(await hardhat_1.upgrades.erc1967.getImplementationAddress(tables1.address)).to.equal(await hardhat_1.upgrades.erc1967.getImplementationAddress(tables2.address));
        expect(tables1.address).to.equal(tables2.address);
    });
    it("Should be able to deploy multiple proxies with different baseURI", async function () {
        const tables1 = await deploy(Factory, "https://foo.xyz/");
        const tables2 = await deploy(Factory, "https://bar.xyz/");
        const owner = accounts[1];
        const createStatement = "create table testing (int a);";
        let tx = await tables1
            .connect(owner)
            .createTable(owner.address, createStatement);
        await tx.wait();
        tx = await tables2
            .connect(owner)
            .createTable(owner.address, createStatement);
        await tx.wait();
        expect(await tables1.tokenURI(1)).to.include("https://foo.xyz/");
        expect(await tables2.tokenURI(1)).to.include("https://bar.xyz/");
    });
    it("Should allow implementation to be upgraded", async function () {
        const tables1 = await deploy(Factory, "https://foo.xyz/");
        const impl1 = await hardhat_1.upgrades.erc1967.getImplementationAddress(tables1.address);
        const owner = accounts[1];
        const tx = await tables1
            .connect(owner)
            .createTable(owner.address, "create table testing (int a);");
        await tx.wait();
        const Factory2 = await hardhat_1.ethers.getContractFactory("TestTablelandTablesUpgrade");
        const tables2 = await update(tables1, Factory2);
        const impl2 = await hardhat_1.upgrades.erc1967.getImplementationAddress(tables2.address);
        // Test implementation was upgraded
        expect(impl1).to.not.equal(impl2);
        expect(tables1.address).to.equal(tables2.address);
        // Test storage has not changed
        expect(await tables2.balanceOf(owner.address)).to.equal(ethers_1.BigNumber.from(1));
    });
    it("Should allow existing controllers to function after upgrade", async function () {
        var _a, _b, _c;
        const tables1 = await deploy(Factory, "https://foo.xyz/");
        // Deploy test erc721 contracts
        const foos = (await (await hardhat_1.ethers.getContractFactory("TestERC721Enumerable")).deploy());
        await foos.deployed();
        const bars = (await (await hardhat_1.ethers.getContractFactory("TestERC721AQueryable")).deploy());
        await bars.deployed();
        // Deploy test controllers
        const controller = (await (await hardhat_1.ethers.getContractFactory("TestTablelandController")).deploy());
        await controller.deployed();
        // Setup controller
        await (await controller.setFoos(foos.address)).wait();
        await (await controller.setBars(bars.address)).wait();
        // Create table
        const owner = accounts[1];
        let tx = await tables1
            .connect(owner)
            .createTable(owner.address, "create table testing (int a);");
        let receipt = await tx.wait();
        const [, createEvent] = (_a = receipt.events) !== null && _a !== void 0 ? _a : [];
        const tableId = createEvent.args.tableId;
        // Set controller
        tx = await tables1
            .connect(owner)
            .setController(owner.address, tableId, controller.address);
        await tx.wait();
        // Mint required tokens
        const caller = accounts[2];
        tx = await foos.connect(caller).mint();
        await tx.wait();
        tx = await bars.connect(caller).mint();
        await tx.wait();
        // Run sql
        const runStatement = "insert into testing values (0);";
        const value = hardhat_1.ethers.utils.parseEther("1");
        tx = await tables1
            .connect(caller)
            .runSQL(caller.address, tableId, runStatement, { value });
        receipt = await tx.wait();
        let [runEvent] = (_b = receipt.events) !== null && _b !== void 0 ? _b : [];
        expect(runEvent.args.caller).to.equal(caller.address);
        expect(runEvent.args.isOwner).to.equal(false);
        expect(runEvent.args.tableId).to.equal(tableId);
        expect(runEvent.args.statement).to.equal(runStatement);
        expect(runEvent.args.policy).to.not.equal(undefined);
        const Factory2 = await hardhat_1.ethers.getContractFactory("TestTablelandTablesUpgrade");
        const tables2 = await update(tables1, Factory2);
        // Run sql again against new tables implementation
        tx = await tables2
            .connect(caller)
            .runSQL(caller.address, tableId, runStatement, { value });
        receipt = await tx.wait();
        [runEvent] = (_c = receipt.events) !== null && _c !== void 0 ? _c : [];
        expect(runEvent.args.caller).to.equal(caller.address);
        expect(runEvent.args.isOwner).to.equal(false);
        expect(runEvent.args.tableId).to.equal(tableId);
        expect(runEvent.args.statement).to.equal(runStatement);
        expect(runEvent.args.policy).to.not.equal(undefined);
        // Run sql one more time with caller that does not own required tokens
        const caller2 = accounts[3];
        await expect(tables2
            .connect(caller2)
            .runSQL(caller2.address, tableId, runStatement, { value })).to.be.revertedWith("Unauthorized");
    });
});
async function deploy(Factory, baseURI) {
    const tables = (await hardhat_1.upgrades.deployProxy(Factory, [baseURI], {
        kind: "uups",
    }));
    return await tables.deployed();
}
async function update(proxy, Factory) {
    const tables = (await hardhat_1.upgrades.upgradeProxy(proxy.address, Factory, {
        kind: "uups",
    }));
    return await tables.deployed();
}
