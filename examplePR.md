This is an exampke of a PR from REPO B 

Now when mentioned PR #123 gets merged in repo A we want the checkbox to be filled in repo B 

To do this we are going to assume that we work within the repoB, write a github actions that checks the status of this PR in REpo A , is it is closed and merged , we check the box else we do not do anything 


we are going to use github actions toolkit 
 "dependencies": {
    "@actions/core": "^1.10.1",
    "@actions/github": "^6.0.0"
  }
## Pull Request Task List

- [ ] Implement feature XYZ

### Dependencies
- [ ] Mentioned PR: #PR_NUMBER (LinkToPRepoA)
