import sequelize from './db/db'

afterAll(async () => { await sequelize.close() })
