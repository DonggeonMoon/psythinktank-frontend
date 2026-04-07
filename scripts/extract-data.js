const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function fetchData(client, country) {
    const query = {
        text: `
            SELECT
                e.symbol,
                s.local_name as stock_name,
                e.growth,
                spb.adjust_close as recent_price,
                ROUND(((spb.adjust_close - spa.adjust_close) / NULLIF(spa.adjust_close, 0) * 100)::numeric, 2) as price_growth,
                TO_CHAR(spb.date, 'YYYY-MM-DD') as basis_date
            FROM employees e
                     INNER JOIN stock s ON e.symbol = s.symbol
                     INNER JOIN dividend d ON e.symbol = d.symbol
                     INNER JOIN stock_price spb ON e.symbol = spb.symbol AND spb.date = CURRENT_DATE - INTERVAL '1 week'
                     INNER JOIN stock_price spa ON e.symbol = spa.symbol AND spa.date = CURRENT_DATE - INTERVAL '1 year'
            WHERE e.growth > 10
              AND s.country = $1
              AND d.value > 0
              AND spa.adjust_close > 0 -- 💡 0으로 나누기 방지
              AND ((spb.adjust_close - spa.adjust_close) / spa.adjust_close * 100) < 0
            ORDER BY e.growth DESC LIMIT 50;
        `,
        values: [country],
    };

    const res = await client.query(query);
    return res.rows;
}

async function run() {
    const client = new Client({
        host: '127.0.0.1',
        port: 5433, // 💡 터널링 포트 5433으로 변경 확인!
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log("🚀 원격 DB 연결 성공 (Port: 5433)");

        const dataDir = path.join(__dirname, '../src/data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        const targets = [
            { code: 'KOREA', file: 'stocks-korea.json' },
            { code: 'USA', file: 'stocks-usa.json' },
            { code: 'JAPAN', file: 'stocks-japan.json' }
        ];

        for (const t of targets) {
            const rows = await fetchData(client, t.code);
            console.log(`📊 [${t.code}] 가져온 데이터 개수: ${rows.length}`);
            fs.writeFileSync(path.join(dataDir, t.file), JSON.stringify(rows, null, 2));
            console.log(`✅ ${t.file} 저장 완료`);
        }

    } catch (err) {
        console.error("❌ 에러 발생:", err.message);
    } finally {
        await client.end();
        console.log("🔌 DB 연결 종료");
    }
}

run();