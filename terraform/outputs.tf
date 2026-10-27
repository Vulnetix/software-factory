output "site_url" {
  description = "Public URL of the docs site."
  value       = "https://software-factory.vulnetix.com/"
}

output "site_record" {
  description = "The managed CNAME, for confirming it matches public/CNAME."
  value = {
    name    = cloudflare_dns_record.software_factory.name
    type    = cloudflare_dns_record.software_factory.type
    content = cloudflare_dns_record.software_factory.content
    proxied = cloudflare_dns_record.software_factory.proxied
  }
}
