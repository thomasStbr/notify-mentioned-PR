## Usage

This GitHub Actions workflow, named `notify-mentioned-PR`, utilizes the `action/notify-check` to verify if any pull request in the current repository contains references to another repository's pull request using a specific syntax (e.g., `[ ] Mentioned PR: #PR_NUMBER (LinkToRepoA)`). If such references are found, the workflow checks the linked repository to determine if the mentioned pull request has been closed. If closed, the workflow transforms the pull request message to:

```markdown
[x] Mentioned PR: #PR_NUMBER (LinkToRepoA)
```

### GitHub Action

The project includes a GitHub Action named `mention-check`, defined in the `actions/mention-check/action.yml` file. It operates in a Node environment and utilizes the Octokit module to connect to and extract information from the GitHub repository.

### Testing the Action

A GitHub workflow (`mention-check.yml`) is available in the `.github/workflows` directory. This workflow employs the `mention-check` action to test its functionality. You can refer to the workflow file for details on how the action is tested.

This workflow is triggered every hour and can also be triggered manually.

## License

This project is licensed under the [LICENSE NAME] - see the [LICENSE.md](LICENSE.md) file for details.