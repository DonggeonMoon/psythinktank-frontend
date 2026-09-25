const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const CHUNK_SIZE = 50;

function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function clearOldChunks(dataDir, prefix) {
    fs.readdirSync(dataDir)
        .filter((f) => f.startsWith(`${prefix}-`) && f.endsWith('.json'))
        .forEach((f) => fs.unlinkSync(path.join(dataDir, f)));
}

function writeChunks(dataDir, prefix, rows) {
    clearOldChunks(dataDir, prefix);

    const chunks = chunk(rows, CHUNK_SIZE);
    if (chunks.length === 0) {
        console.warn(`⚠️ [${prefix}] 데이터가 없어 청크 파일을 만들지 않습니다.`);
        return;
    }
    chunks.forEach((rowsChunk, idx) => {
        const file = path.join(dataDir, `${prefix}-${idx}.json`);
        fs.writeFileSync(file, JSON.stringify(rowsChunk, null, 2));
    });
    console.log(`✅ [${prefix}] ${rows.length}건 -> ${chunks.length}개 파일 (파일당 최대 ${CHUNK_SIZE}건)`);
}

async function fetchStockDetails(client, country) {
    const query = {
        text: `
            WITH nps_symbols AS (
                SELECT DISTINCT symbol
                FROM share
                WHERE holder_name LIKE '%국민연금공단%'
            )
            SELECT
                s.symbol,
                s.market,
                COALESCE(s.korean_name, s.english_name) AS stock_name,
                s.overview,
                e.growth,
                d.value AS dividend,
                sp.close AS recent_price,
                TO_CHAR(sp.date, 'YYYY-MM-DD') AS basis_date,
                (nps.symbol IS NOT NULL) AS nps_holding
            FROM stock s
            LEFT JOIN LATERAL (
                SELECT growth
                FROM employees
                WHERE symbol = s.symbol
                ORDER BY basis_date DESC
                LIMIT 1
            ) e ON true
            LEFT JOIN dividend d ON d.symbol = s.symbol
            LEFT JOIN LATERAL (
                SELECT close, date
                FROM stock_price
                WHERE symbol = s.symbol
                ORDER BY date DESC
                LIMIT 1
            ) sp ON true
            LEFT JOIN nps_symbols nps ON nps.symbol = s.symbol
            WHERE s.country = $1
            ORDER BY s.symbol;
        `,
        values: [country],
    };

    const res = await client.query(query);
    return res.rows;
}

async function fetchShareholders(client) {
    const res = await client.query(`
        SELECT id, TO_CHAR(date, 'YYYY-MM-DD') AS date, holder_name, symbol, value
        FROM share
        ORDER BY symbol, date DESC;
    `);
    return res.rows;
}

async function fetchInvestors(client) {
    const res = await client.query(`
        SELECT id, symbol, TO_CHAR(base_date, 'YYYY-MM-DD') AS base_date, investor_count, avg_price
        FROM naver_pay_investors
        WHERE deleted_at IS NULL
        ORDER BY symbol, base_date DESC;
    `);
    return res.rows;
}

async function run() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log(`🚀 DB 연결 성공)`);

        const dataDir = path.join(__dirname, '../src/data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        const targets = [
            { code: 'KOREA', prefix: 'stock-details-korea' },
            { code: 'USA', prefix: 'stock-details-usa' },
            { code: 'JAPAN', prefix: 'stock-details-japan' },
        ];

        for (const t of targets) {
            console.log(`🔍 [${t.code}] 종목 상세 조회 중...`);
            const rows = await fetchStockDetails(client, t.code);
            console.log(`📊 [${t.code}] 조회된 종목 수: ${rows.length}`);
            writeChunks(dataDir, t.prefix, rows);
        }

        console.log("🔍 주주 정보 조회 중...");
        const shareRows = await fetchShareholders(client);
        console.log(`📊 주주 정보 조회 건수: ${shareRows.length}`);
        writeChunks(dataDir, 'shareholders', shareRows);

        console.log("🔍 주주 수 정보 조회 중...");
        const investorRows = await fetchInvestors(client);
        console.log(`📊 주주 수 정보 조회 건수: ${investorRows.length}`);
        writeChunks(dataDir, 'investors', investorRows);

    } catch (err) {
        console.error("❌ 에러 발생:", err.message);
        process.exitCode = 1;
    } finally {
        await client.end();
        console.log("🔌 DB 연결 종료");
    }
}

run();
