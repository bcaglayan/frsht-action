import * as semver from 'semver'

export const isValidVersion = (versionScr: string, versionTrg: string): boolean => {
    return semver.satisfies(versionScr, versionTrg)
}
