const github = require('@actions/github');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {


    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    const repository = 'thomasStbr/notify-mentioned-PR';

    listRemotePR(octokit, "thomasStbr", "notify-mentioned-PR");

    listRemotePR(octokit, owner, repo, false);

}
async function listRemotePR(octokit, repoOwner, repoName, closed = true) {

    // List closed pull requests
    const { data: pullRequests } = await octokit.pulls.list({
        owner: repoOwner,
        repo: repoName,
        state: closed ? 'closed' : 'open',
    });

    pullRequests.forEach((pr) => {
        console.log(`PR #${pr.number}: ${pr.title}`);
        console.log(`  Description: ${pr.body}`);
        console.log('---');
    });
}



run().catch(error => {
    console.error(error);
    process.exit(1);
});

console.log('Hello mention');
