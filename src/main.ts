/* eslint-disable i18n-text/no-en */

import * as actions from './actions/index'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import Path from 'path'

import * as semver from 'semver'

import { isYarnRepo, isValidVersion } from './actions/helper'

import { MIN_THUNDRA_AGENT_VERSION } from './actions/constants'

// const thundraPackage = '__tmp__/@thundra'

const workspace = process.env.GITHUB_WORKSPACE

const apikey: string = core.getInput('apikey')
const project_id: string = core.getInput('project_id')
const framework: string = core.getInput('framework')
const agent_version: string = core.getInput('agent_version')

const thundraDep = agent_version ? `@thundra/core@${agent_version}` : '@thundra/core'
const NPM_INSTALL_COMMAND = `npm install --save-dev ${thundraDep}`
const YARN_INSTALL_COMMAND = `yarn add --dev ${thundraDep}`

if (!apikey) {
    core.warning('Thundra API Key is not present. Exiting early...')
    core.warning('Instrumentation failed.')

    process.exit(core.ExitCode.Success)
}

if (!project_id) {
    core.warning('Thundra Project ID is not present. Exiting early...')
    core.warning('Instrumentation failed.')

    process.exit(core.ExitCode.Success)
}

if (!actions.isValidFramework(framework) || !actions.isValidFramework(framework.toLowerCase())) {
    core.warning('Framework must be take one of these values: jest...')

    process.exit(core.ExitCode.Success)
}

if (agent_version && semver.lt(agent_version, MIN_THUNDRA_AGENT_VERSION)) {
    core.setFailed(`Thundra Java Agent prior to 2.7.0 doesn't work with this action`)
}

core.exportVariable('THUNDRA_APIKEY', apikey)
core.exportVariable('THUNDRA_AGENT_TEST_PROJECT_ID', project_id)

async function run(): Promise<void> {
    try {
        core.info(`[Thundra] Initializing the Thundra Action....`)

        if (!workspace) {
            core.warning('There is no defined workspace')

            process.exit(core.ExitCode.Success)
        }

        const dir = Path.resolve(workspace)

        const packagePath = Path.join(dir, 'package.json')

        const packageJson = await import(packagePath)

        const jestDep = packageJson.devDependencies.jest || packageJson.dependencies.jest
        if (!jestDep) {
            core.warning('jest must be added in project')

            process.exit(core.ExitCode.Success)
        }

        core.warning('jest version is')

        core.warning(jestDep.toString())

        const jestCircusDep = packageJson.devDependencies['jest-circus'] || packageJson.dependencies['jest-circus']
        if (!jestCircusDep) {
            core.warning(`jest circus will be installed`)
            await exec.exec(`npm install --save-dev jest-circus@${jestDep}`, [], { ignoreReturnCode: true })
        }

        const thundraInstallCmd = isYarnRepo() ? YARN_INSTALL_COMMAND : NPM_INSTALL_COMMAND

        await exec.exec(thundraInstallCmd, [], { ignoreReturnCode: true })

        // await exec.exec(`sh -c "rm -rf node_modules/@thundra/"`)

        // await exec.exec(`sh -c "cp -R ${thundraPackage} node_modules"`)

        core.info(`[Thundra] @thundra/core installed`)

        const action: Function | undefined = actions.getAction(framework)
        if (!action) {
            core.warning(`There is no defined action for framework: ${framework}`)

            process.exit(core.ExitCode.Success)
        }

        await action()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        core.setFailed(error.message)
    }
}

run()
