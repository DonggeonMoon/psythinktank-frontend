const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function getCriteria(client, country) {
    const benchmarkSymbol = {
        'KOREA': '005930',
        'USA': 'AAPL',
        'JAPAN': '7203'
    }[country];

    const res = await client.query({
        text: `
            SELECT 
                (SELECT date FROM stock_price WHERE symbol = $1 AND date <= CURRENT_DATE - INTERVAL '1 week' ORDER BY date DESC LIMIT 1) as date_recent,
                (SELECT date FROM stock_price WHERE symbol = $1 AND date <= CURRENT_DATE - INTERVAL '1 year' ORDER BY date DESC LIMIT 1) as date_past
        `,
        values: [benchmarkSymbol]
    });
    return res.rows[0];
}

async function fetchData(client, country, criteria) {
    const { date_recent, date_past } = criteria;

    if (!date_recent || !date_past) {
        console.warn(`⚠️ [${country}] 기준 날짜를 찾을 수 없습니다. (데이터 부족)`);
        return [];
    }

    const query = {
        text: `
            SELECT
                e.symbol,
                s.local_name as stock_name,
                e.growth,
                d.value as dividend,
                spb.adjust_close as recent_price,
                spa.adjust_close as previous_price,
                ROUND(((spb.adjust_close - spa.adjust_close) / NULLIF(spa.adjust_close, 0) * 100)::numeric, 2) as price_growth,
                TO_CHAR(spb.date, 'YYYY-MM-DD') as basis_date
            FROM employees e
                     INNER JOIN stock s ON e.symbol = s.symbol
                     INNER JOIN dividend d ON e.symbol = d.symbol
                     INNER JOIN stock_price spb ON e.symbol = spb.symbol AND spb.date = $2
                     INNER JOIN stock_price spa ON e.symbol = spa.symbol AND spa.date = $3
            WHERE s.country = $1
              AND e.basis_date = (SELECT MAX(basis_date) FROM employees WHERE symbol = e.symbol)
              AND e.growth > 10
              AND d.value > 0
              AND spa.adjust_close > 0
              AND ((spb.adjust_close - spa.adjust_close) / spa.adjust_close * 100) < 0
            ORDER BY e.growth DESC LIMIT 50;
        `,
        values: [country, date_recent, date_past],
    };

    const res = await client.query(query);
    return res.rows;
}

async function run() {
    const client = new Client({
        host: '127.0.0.1',
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log("🚀 DB 연결 성공 (Port: 5432)");

        const dataDir = path.join(__dirname, '../src/data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        const targets = [
            { code: 'KOREA', file: 'stocks-korea.json' },
            { code: 'USA', file: 'stocks-usa.json' },
            { code: 'JAPAN', file: 'stocks-japan.json' }
        ];

        for (const t of targets) {
            console.log(`🔍 [${t.code}] 기준 정보 조회 중...`);
            const criteria = await getCriteria(client, t.code);

            console.log(`📅 기준 날짜: 최근(${criteria.date_recent}), 과거(${criteria.date_past}), 데이터(${criteria.latest_basis})`);

            const rows = await fetchData(client, t.code, criteria);
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