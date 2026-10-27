# GitHub Pages configuration for Vulnetix/software-factory.
#
# Pages was enabled with the GitHub API when the repository was created, so
# Terraform adopts it by import rather than creating it:
#
#   terraform import 'github_repository_pages.software_factory[0]' software-factory
#
# That import was done on 2026-10-27, so manage_pages defaults to true. The
# provider needs TF_VAR_github_token, an org admin token.

resource "github_repository_pages" "software_factory" {
  count = var.manage_pages ? 1 : 0

  repository = "software-factory"

  # .github/workflows/pages.yml deploys with actions/deploy-pages.
  build_type = "workflow"
  cname      = "software-factory.vulnetix.com"

  lifecycle {
    prevent_destroy = true
  }
}
