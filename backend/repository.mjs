/** Only parameterized SQL and deliberately redacted views are exposed. */
export function createRepository(sql) {
  const list=(view,columns)=>({limit,after})=>sql.query(
    `SELECT ${columns} FROM infra_api.${view} WHERE ($1::uuid IS NULL OR id>$1::uuid) ORDER BY id LIMIT $2`,[after,limit+1]);
  return Object.freeze({
    facilities:list('facilities','id,canonical_name AS name,locality,state,country,lifecycle'),
    signals:list('signals','id,headline,category,geography,event_at,published_at,expires_at,source_url,observed_at,retrieved_at,provider'),
    offers:list('offers','id,facility_id,canonical_name AS name,locality,state,product,critical_it_mw,delivery_date,verified_at,expires_at'),
    async listScenarios(subject,org,{limit,after}) {
      return sql.query('SELECT id,name,created_at FROM infra_api.list_scenarios($1,$2::uuid,$3,$4::uuid)',[subject,org,limit,after]);
    },
    async saveScenario(subject,input,key) {
      const rows=await sql.query('SELECT infra_api.save_scenario($1,$2::uuid,$3,$4::jsonb,$5::uuid) AS id',
        [subject,input.organizationId,input.name,JSON.stringify(input.requirements),key]);
      if(!rows[0]?.id) throw new Error('No durable scenario receipt'); return rows[0].id;
    },
    async submitIntake(input,key) {
      const rows=await sql.query('SELECT infra_api.submit_intake($1,$2,$3,$4,$5::jsonb,$6::uuid) AS id',
        [input.kind,input.name,input.email,input.company,JSON.stringify(input.payload),key]);
      if(!rows[0]?.id) throw new Error('No durable inquiry receipt'); return rows[0].id;
    },
    async readiness(){ await sql.query('SELECT id FROM infra_api.facilities LIMIT 0'); }
  });
}
