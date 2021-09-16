import { exec } from '@actions/exec'

import fs from 'fs'

export function isYarnRepo(): boolean {
    return fs.existsSync('yarn.lock')
}

export async function runTests(command: string, args: string[], envVariables = {}): Promise<number> {
    return exec(command, args, {
        env: {
            ...process.env,
            ...envVariables
        }
    })
}