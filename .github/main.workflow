workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Build" {
  uses = "actions/npm@v2.0.0"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@v2.0.0"
  args = "test"
}

# Filter for a new tag
action "Tag" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = "Tag"
  uses = "actions/npm@v2.0.0"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
