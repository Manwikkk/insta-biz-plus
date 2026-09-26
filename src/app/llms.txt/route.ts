import { readFile } from 'node:fs/promises'
import path from 'node:path'

// The audited copy of https://www.instabizweb.com/llms.txt (website-content/other/llms.md), with the site's own edits.
export const dynamic = 'force-static'

export async function GET() {
  const body = await readFile(path.join(process.cwd(), 'src', 'content', 'generated', 'llms.txt'), 'utf8')
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
