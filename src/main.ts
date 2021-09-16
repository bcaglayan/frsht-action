/* eslint-disable i18n-text/no-en */

import * as actions from './actions/index'
import * as core from '@actions/core'
import { exec } from '@actions/exec'

/** 
import { isYarnRepo } from './actions/helper'
const NPM_INSTALL_COMMAND = 'npm install --save-dev @thundra/core'
const YARN_INSTALL_COMMAND = 'yarn add --dev @thundra/core'
*/

const thundraPackage = './__tmp_/@thundra'

const apikey: string = core.getInput('apikey')
const project_id: string = core.getInput('project_id')
const framework: string = core.getInput('framework')

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

core.exportVariable('THUNDRA_APIKEY', apikey)
core.exportVariable('THUNDRA_AGENT_TEST_PROJECT_ID', project_id)

async function run(): Promise<void> {
    try {
        core.info(`[Thundra] Initializing the Thundra Action....`)

        await exec(`sh -c "cp -R ${thundraPackage} ./node_modules"`)

        // const thundraInstallCmd = isYarnRepo() ? YARN_INSTALL_COMMAND : NPM_INSTALL_COMMAND

        // await exec(thundraInstallCmd, [], { ignoreReturnCode: true })

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
