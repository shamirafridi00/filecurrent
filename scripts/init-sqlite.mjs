import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const root = process.cwd()
const dbDirectory = path.join(root, '.data')
const dbPath = process.env.SQLITE_DATABASE_PATH || path.join(dbDirectory, 'filecurrent.sqlite')
const schemaPath = path.join(root, 'sqlite', 'schema.sql')

if (!existsSync(dbDirectory)) {
  mkdirSync(dbDirectory, { recursive: true })
}

const db = new DatabaseSync(dbPath)
db.exec(readFileSync(schemaPath, 'utf8'))

const profile = db
  .prepare('SELECT email, full_name, plan, docs_used_this_month FROM profiles WHERE id = ?')
  .get('local-user')

console.log(`SQLite database ready at ${dbPath}`)
console.log(profile)
