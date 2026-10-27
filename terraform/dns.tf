# DNS for the Software Factory docs site.
#
# software-factory.vulnetix.com -> GitHub Pages.
#
# Must NOT be proxied. GitHub Pages issues its own certificate for the custom
# domain and can only do so when it sees the real CNAME; behind the Cloudflare
# proxy the issuance never completes.
#
# Keep in step with public/CNAME. Pages reads that file to decide which domain
# it serves, and .github/workflows/pages.yml asserts it after every build.

resource "cloudflare_dns_record" "software_factory" {
  zone_id = var.cloudflare_zone_id
  name    = "software-factory.vulnetix.com" # provider v5 stores the FQDN; a bare label plans a diff on every run
  type    = "CNAME"
  content = var.github_pages_target
  proxied = false # Pages cannot issue its certificate behind the proxy
  ttl     = 300

  comment = "Keep in sync with public/CNAME in Vulnetix/software-factory."
}
