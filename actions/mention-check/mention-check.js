const github = require('@actions/github');

async function run() {

    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    print(octokit);
    print(process.env.GITHUB_TOKEN);

    const pullRequestNumber = context.payload.pull_request.number;

    print(pullRequest);

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
