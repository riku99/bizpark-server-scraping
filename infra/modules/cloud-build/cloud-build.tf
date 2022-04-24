variable "region" {}
variable "target_branch" {}


resource "google_cloudbuild_trigger" "deploy-bizpark-scraping-server" {
  name        = "deploy-bizpark-scraping-server"
  description = "スクレイピング用サーバーをCloud Runへデプロイする"

  github {
    owner = "riku99"
    name  = "bizpark-server-scraping"
    push {
      branch = var.target_branch
    }
  }

  filename = "./cloudbuild.yml"
}