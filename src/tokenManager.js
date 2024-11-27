const fs = require('fs').promises;
const path = require('path');
const { getRandomIDPro } = require('./utils');

class TokenChecksumManager {
    constructor(filePath = 'token-checksums.json') {
        this.filePath = path.join(__dirname, filePath);
        this.mappings = new Map();
        this.initialized = false;
    }

    async init() {
        try {
            // 尝试读取现有文件
            const data = await fs.readFile(this.filePath, 'utf8');
            this.mappings = new Map(Object.entries(JSON.parse(data)));
        } catch (error) {
            // 如果文件不存在，创建空映射
            await this.saveToFile();
        }
        this.initialized = true;
    }

    async saveToFile() {
        const data = Object.fromEntries(this.mappings);
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    generateChecksum() {
        return `zo${getRandomIDPro({ dictType: 'max', size: 6 })}${getRandomIDPro({ dictType: 'max', size: 64 })}/${getRandomIDPro({ dictType: 'max', size: 64 })}`;
    }

    async getChecksum(authToken) {
        if (!this.initialized) {
            await this.init();
        }

        // 如果token不存在，生成新的checksum并保存
        if (!this.mappings.has(authToken)) {
            const newChecksum = this.generateChecksum();
            this.mappings.set(authToken, newChecksum);
            await this.saveToFile();
            return newChecksum;
        }

        return this.mappings.get(authToken);
    }
}

module.exports = new TokenChecksumManager(); 