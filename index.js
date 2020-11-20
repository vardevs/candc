const core = require('@actions/core')
const github = require('@actions/github')

try {
    core.startGroup('context payload')
    core.debug(JSON.stringify(github.context.payload, undefined, 2))
    core.endGroup()

    main()
} catch (error) {
    core.setFailed(error.message)
}

async function main () {
    const exempt_users = core.getInput('exempt-users')
    const close_comment = core.getInput('close-comment')
    const gh_token = core.getInput('github-token')

    const number = github.context.payload.issue.number
    const user = github.context.payload.issue.user.login

    const exempt_list = exempt_users.split(',')

    if (exempt_list.includes(user)) {
        core.info(`${user} is allowed to create issues. Do nothing.`)
        return
    }

    const octokit = github.getOctokit(gh_token)
    const context = github.context

    try {
        await octokit.issues.createComment({
            ...context.repo,
            issue_number: number,
            body: close_comment,
        })

        await octokit.issues.update({
            ...context.repo,
            issue_number: number,
            state: 'closed'
        })

        core.info(`Closed issue ${number} from ${user}.`)
    } catch (error) {
        core.setFailed(error.message)
    }
}
