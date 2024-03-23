import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
const ENV = process.env.TEST

export default async function Test() {
    const dir = path.join(process.cwd(), 'git-content')
    await git.fetch({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs' });
    console.log(dir);
    if (ENV) return <div>
        Test Page
        <div>env.TEST: {ENV}</div>
        <div>cmessage: { }</div>
    </div>;
    else return <div>This is a test page.</div>
}