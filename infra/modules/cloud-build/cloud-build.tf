variable "region" {}
variable "target_branch" {}
variable "registory_name" {}
variable "news_save_endpoint" {}

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
  substitutions = {
    _ARTIFACT_REPOSITORY_IMAGE_NAME = var.registory_name
    _REGION                         = var.region
    _NEWS_SAVE_ENDPOINT = var.news_save_endpoint
  }
}