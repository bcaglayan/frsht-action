import * as exec from '@actions/exec'

import fs from 'fs'

import { satisfies } from 'semver'

export const isValidVersion = (versionScr: string, versionTrg: string): boolean => {
    return satisfies(versionScr, versionTrg)
}

export function isYarnRepo(): boolean {
    return fs.existsSync('yarn.lock')
}

export async function runTests(command: string, args: string[], envVariables = {}): Promise<number> {
    return exec.exec(command, args, {
        env: {
            ...process.env,
            ...envVariables
        }
    })
}
