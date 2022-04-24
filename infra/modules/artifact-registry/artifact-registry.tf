variable project {}
variable location {}
variable artifact_registry_id {}

resource "google_artifact_registry_repository" "scraping-server-image" {
  provider = google-beta

  project       = var.project
  location      = var.location
  repository_id = var.artifact_registry_id
  description   = "スクレイピングサーバーdocker imageレジストリ"
  format        = "DOCKER"
}

output "module_name" {
  value = google_artifact_registry_repository.scraping-server-image
}