const github = require('@actions/github');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {


    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    const repository = 'thomasStbr/notify-mentioned-PR';


    const openPullRequests = await listRemotePR(octokit, owner, repo, false);

    openPullRequests.forEach(async (pr) => {
        const { mentionedPRNumber, mentionedPROwner, mentionedPRRepo } = extractMentionedPRInfo(pr.body);

        console.log(`Mentioned PR Number: ${mentionedPRNumber}`);
        console.log(`Mentioned PR Owner: ${mentionedPROwner}`);
        console.log(`Mentioned PR Repository: ${mentionedPRRepo}`);
        const prIsClosed = await isPRClosed(octokit, mentionedPROwner, mentionedPRRepo, mentionedPRNumber);
        console.log("PR is closed ? ", prIsClosed);

        if (prIsClosed) {
            checkMentionedPRCheckbox(octokit, owner, repo, pr.number, mentionedPRNumber, mentionedPROwner, mentionedPRRepo);
        }



    });


    console.log("END");


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

async function checkMentionedPRCheckbox(octokit, repoOwner, repoName, localPRNumber, mentionedPRNumber, mentionedRepoOwner, mentionedRepoName) {
    try {
        const { data: currentPR } = await octokit.pulls.get({
            owner: repoOwner,
            repo: repoName,
            pull_number: localPRNumber,
        });

        const checkboxText = `Mentioned PR: #${mentionedPRNumber} (https://github.com/${mentionedRepoOwner}/${mentionedRepoName})`;

        const updatedBody = currentPR.body.replace(`- [ ] ${checkboxText}`, `- [x] ${checkboxText}`);
        await octokit.pulls.update({
            owner: repoOwner,
            repo: repoName,
            pull_number: localPRNumber,
            body: updatedBody,
        });
    } catch (error) {
        console.error(`Error updating local PR #${localPRNumber}:`, error.message);
        throw error;
    }
}


async function isPRClosed(octokit, repoOwner, repoName, prNumber) {
    try {
        const { data: pullRequest } = await octokit.pulls.get({
            owner: repoOwner,
            repo: repoName,
            pull_number: prNumber,
        });

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
