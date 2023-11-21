import { Redis } from "ioredis";

const redis = new Redis();
const KEY: string = 'pcsUsage';

class PC {
    id: number;
    name: string;
    usage: number;
    work: string;

    constructor(id: number, name: string, usage: number, work: string) {
        this.id = id;
        this.name = name;
        this.usage = usage;
        this.work = work;
    }
}

async function updatePC(pc: PC) {
    const workValue = pc.work === null ? "null" : pc.work;
    await redis.hset(`pc:${pc.id}`, 'name', pc.name, 'usage', pc.usage, 'work', workValue);
    await redis.zadd(KEY, pc.usage, `pc:${pc.id}`);
}

async function workA(pc: PC) {
    pc.work = 'workA';
    await updatePC(pc);
    console.log(`PC ${pc.id} started workA`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 延时1秒
    pc.work = 'null';
    await updatePC(pc);
}

async function workB(pc: PC) {
    pc.work = 'workB';
    await updatePC(pc);
    console.log(`PC ${pc.id} started workB`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 延时2秒
    pc.work = 'null';
    await updatePC(pc);
}

async function workC(pc: PC) {
    pc.work = 'workC';
    await updatePC(pc);
    console.log(`PC ${pc.id} started workC`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 延时3秒
    pc.work = 'null';
    await updatePC(pc);
}

//模拟空闲
async function workD(pc: PC) {
    pc.work = 'null';
    await updatePC(pc);
    console.log(`PC ${pc.id} is in null`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 延时2.5秒
    pc.work = 'null';
    await updatePC(pc)
}

async function simulateRandomWork(pcId: number) {
    const pc = new PC(pcId, `PC${pcId}`, Math.floor(Math.random() * 100), 'null');
    const works = [workA, workB, workC, workD];
    const work = works[Math.floor(Math.random() * works.length)];

    await work(pc);
    await updatePC(pc);
    console.log(`PC ${pc.id} finished ${pc.work || 'work'}, usage: ${pc.usage}`);
}

// 测试模拟工作
setInterval(() => simulateRandomWork(0), 1500);
setInterval(() => simulateRandomWork(1), 1500);
