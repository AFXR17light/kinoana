import path from 'path'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import fs from 'fs'
const USE_LOCAL = process.env.USE_LOCAL
const GIT_URL = process.env.GIT_URL
const GIT_USERNAME = process.env.GIT_USERNAME;
const GIT_TOKEN = process.env.GIT_TOKEN

export default async function Test() {
    const dir = path.join(process.cwd(), 'git-test')
    // await git.fetch({ fs, http, dir, url: GIT_URL, onAuth: () => ({ username: GIT_USERNAME, password: GIT_TOKEN }) });
    // console.log(dir);
    if (USE_LOCAL) return <div>
        Test Page (Local)
    </div>;
    else return <div>This is a test page.</div>
}