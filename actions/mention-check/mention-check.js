const { getInput, setFailed } = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

async function run() {
    try {
        const myToken = getInput('GITHUB_TOKEN');
        const octokit = getOctokit(myToken);

        const pullRequestNumber = context.payload.pull_request.number;

        const { data: pullRequest } = await octokit.rest.pulls.get({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pullRequestNumber,
            mediaType: {
                format: 'diff',
            },
        });

        console.log(pullRequest);
    } catch (error) {
        setFailed(error.message);
    }
}

run().catch(error => {
    console.error(error);
    process.exit(1);
});

console.log('Hello mention');
