const github = require('@actions/github');
const core = require('@actions/core');

async function run() {



    const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
    console.log(GITHUB_TOKEN);
    const octokit = github.getOctokit(GITHUB_TOKEN);
    console.log(octokit);
    console.log(process.env.GITHUB_TOKEN);

    const pullReq = context.payload.pull_request;
    const pullRequestNumber = pullReq.number;

    console.log(pullReq);


    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pullRequestNumber,
        mediaType: {
            format: 'diff',
        },
    });

    console.log(pullRequest);

}

run().catch(error => {
    console.error(error);
    process.exit(1);
});

console.log('Hello mention');
