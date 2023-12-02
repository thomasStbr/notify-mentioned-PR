const github = require('@actions/github');
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {


    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const repository = 'thomasStbr/notify-mentioned-PR';

    // List closed pull requests
    octokit.pulls.list({
        owner: repository.split('/')[0],
        repo: repository.split('/')[1],
        state: 'closed'
    })
        .then(response => {
            const closedPullRequests = response.data;
            closedPullRequests.forEach(pullRequest => {
                console.log(`Pull Request #${pullRequest.number}: ${pullRequest.title}`);
            });
        })
        .catch(error => {
            console.error('Error listing pull requests:', error.message);
        });


}

run().catch(error => {
    console.error(error);
    process.exit(1);
});

console.log('Hello mention');
