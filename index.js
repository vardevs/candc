const core = require('@actions/core')
const github = require('@actions/github')

try {
    main()
} catch (error) {
    core.setFailed(error.message)
}

async function main () {
    const exempt_users = core.getInput('exempt-users').split(',')
    const close_comment = core.getInput('close-comment')
    const gh_token = core.getInput('github-token')

    const number = github.context.payload.issue.number
    const user = github.context.payload.issue.user

    if (exempt_users.includes(user)) {
        core.info(`${user} is exempt, leaving issue open.`)
        return
    }

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)

    const octokit = github.getOctokit(gh_token)
    const context = github.context

    try {
        await octokit.issues.createComment({
            ...context,
            body: close_comment,
        })

        await octokit.issues.edit({
            ...context,
            state: 'closed'
        })
    } catch (error) {
        core.setFailed(error.message)
    }

    core.info(`Closed issue ${number} from ${user}.`)
}
