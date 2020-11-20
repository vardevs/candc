const core = require('@actions/core')
const github = require('@actions/github')

try {
    const exempt_users = core.getInput('exempt-users')    
    const close_comment = core.getInput('close-comment')
    const gh_token = core.getInput('github-token')

    core.setOutput('Close with comment', close_comment)

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message)
}
