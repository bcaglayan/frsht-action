import * as core from '@actions/core'
// import * as exec from '@actions/exec'

const apikey: string = core.getInput('apikey')
const project_id: string = core.getInput('project_id')
// const framework: string = core.getInput('framework')
// const environemnt: string = core.getInput('environemnt')
// const command: string = core.getInput('command')

// if (!apikey) {
//     core.warning('Thundra API Key is not present. Exiting early...')
//     core.warning('Instrumentation failed.')

//     process.exit(core.ExitCode.Success)
// }

// if (!project_id) {
//     core.warning('Thundra Project ID is not present. Exiting early...')
//     core.warning('Instrumentation failed.')

//     process.exit(core.ExitCode.Success)
// }

// Setting environment variables programmatically
core.exportVariable('THUNDRA_APIKEY', apikey)
core.exportVariable('THUNDRA_AGENT_TEST_PROJECT_ID', project_id)

async function run(): Promise<void> {
    try {
        core.info(`[Thundra] Initializing the Thundra Action...`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        core.setFailed(error.message)
    }
}

run()
