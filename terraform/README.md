# terraform

DNS and Pages configuration for software-factory.vulnetix.com.

- `dns.tf`: the unproxied CNAME `software-factory.vulnetix.com` -> `vulnetix.github.io`.
- `pages.tf`: the repository's Pages settings (workflow build, custom domain), imported on 2026-10-27.

State is in `s3://vdb-manager-terraform-state/software-factory-site/terraform.tfstate`.

```sh
# A token with DNS edit on the vulnetix.com zone. The CLOUDFLARE_API_KEY in a
# normal shell can read the zone but not edit it; the token in
# vdb-manager/.dev.vars can.
export TF_VAR_cloudflare_api_token=...
# The github provider manages the Pages block, so it needs an org admin token.
export TF_VAR_github_token=$(gh auth token -u 0x73746F66)
terraform init
terraform plan
```

A plan should show no changes. If it proposes destroying the Pages block, stop: `prevent_destroy` is there because unbinding the domain takes the site down until the certificate is issued again.
