const github = require('@actions/github');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {


    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    const repository = 'thomasStbr/notify-mentioned-PR';


    const openPullRequests = listRemotePR(octokit, owner, repo, false);

    openPullRequests.forEach((pr) => {
        const { mentionedPRNumber, mentionedPROwner, mentionedPRRepo } = extractMentionedPRInfo(pr.body);

        console.log(`Mentioned PR Number: ${mentionedPRNumber}`);
        console.log(`Mentioned PR Owner: ${mentionedPROwner}`);
        console.log(`Mentioned PR Repository: ${mentionedPRRepo}`);

        console.log("PR is closed ? ", isPRClosed(octokit, mentionedPROwner, mentionedPRRepo, mentionedPRNumber));



    });



    //listRemotePR(octokit, "thomasStbr", "notify-mentioned-PR");



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



    return pullRequests;
}

async function isPRClosed(octokit, repoOwner, repoName, prNumber) {
    try {
        // Get information about the specific pull request
        const { data: pullRequest } = await octokit.pulls.get({
            owner: repoOwner,
            repo: repoName,
            pull_number: prNumber,
        });

        // Check if the pull request state is "closed"
        return pullRequest.state === 'closed';
    } catch (error) {
        console.error(`Error checking the state of PR #${prNumber}:`, error.message);
        throw error;
    }
}


function extractMentionedPRInfo(body) {
    // Regular expression to match the mentioned PR information
    const regex = /Mentioned PR: #(\d+) \((https:\/\/github\.com\/([^\/]+)\/([^\/]+))\)/;
    const match = body.match(regex);

    if (match) {
        const mentionedPRNumber = match[1];
        const mentionedPROwner = match[3];
        const mentionedPRRepo = match[4];

        return { mentionedPRNumber, mentionedPROwner, mentionedPRRepo };
    }

    return {};
}

run().catch(error => {
    console.error(error);
    process.exit(1);
});

console.log('Hello mention');
