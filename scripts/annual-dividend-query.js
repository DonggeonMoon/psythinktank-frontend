// 한국은 ANNUAL 행(연간 합계)과 PERIOD 행(기말분)이 같은 결산일에 공존하므로 섞어 합산하면 안 된다.
// 미국·일본은 PERIOD 행만 있어 최근 1년치를 합산해 연간 배당으로 본다.
function dividendLateral(symbolExpr, countryExpr) {
    return `
        LEFT JOIN LATERAL (
            SELECT CASE
                WHEN ${countryExpr} = 'KOREA' THEN (
                    SELECT value
                    FROM dividend
                    WHERE symbol = ${symbolExpr}
                      AND type = 'ANNUAL'
                      AND deleted_at IS NULL
                    ORDER BY basis_date DESC
                    LIMIT 1
                )
                ELSE (
                    SELECT SUM(value)
                    FROM dividend
                    WHERE symbol = ${symbolExpr}
                      AND type = 'PERIOD'
                      AND deleted_at IS NULL
                      AND basis_date > CURRENT_DATE - INTERVAL '1 year'
                )
            END AS value
        ) d ON true`;
}

module.exports = { dividendLateral };
