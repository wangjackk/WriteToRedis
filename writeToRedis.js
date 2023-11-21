"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const redis = new ioredis_1.Redis();
const KEY = 'pcsUsage';
class PC {
    constructor(id, name, usage, work) {
        this.id = id;
        this.name = name;
        this.usage = usage;
        this.work = work;
    }
}
function updatePC(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        const workValue = pc.work === null ? "null" : pc.work;
        yield redis.hset(`pc:${pc.id}`, 'name', pc.name, 'usage', pc.usage, 'work', workValue);
        yield redis.zadd(KEY, pc.usage, `pc:${pc.id}`);
    });
}
function workA(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        pc.work = 'workA';
        yield updatePC(pc);
        console.log(`PC ${pc.id} started workA`);
        yield new Promise(resolve => setTimeout(resolve, 1000)); // 延时1秒
        pc.work = 'null';
        yield updatePC(pc);
    });
}
function workB(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        pc.work = 'workB';
        yield updatePC(pc);
        console.log(`PC ${pc.id} started workB`);
        yield new Promise(resolve => setTimeout(resolve, 1000)); // 延时2秒
        pc.work = 'null';
        yield updatePC(pc);
    });
}
function workC(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        pc.work = 'workC';
        yield updatePC(pc);
        console.log(`PC ${pc.id} started workC`);
        yield new Promise(resolve => setTimeout(resolve, 1000)); // 延时3秒
        pc.work = 'null';
        yield updatePC(pc);
    });
}
//模拟空闲
function workD(pc) {
    return __awaiter(this, void 0, void 0, function* () {
        pc.work = 'null';
        yield updatePC(pc);
        console.log(`PC ${pc.id} is in null`);
        yield new Promise(resolve => setTimeout(resolve, 1000)); // 延时2.5秒
        pc.work = 'null';
        yield updatePC(pc);
    });
}
function simulateRandomWork(pcId) {
    return __awaiter(this, void 0, void 0, function* () {
        const pc = new PC(pcId, `PC${pcId}`, Math.floor(Math.random() * 100), 'null');
        const works = [workA, workB, workC, workD];
        const work = works[Math.floor(Math.random() * works.length)];
        yield work(pc);
        yield updatePC(pc);
        console.log(`PC ${pc.id} finished ${pc.work || 'work'}, usage: ${pc.usage}`);
    });
}
// 测试模拟工作
setInterval(() => simulateRandomWork(0), 1500);
setInterval(() => simulateRandomWork(1), 1500);
