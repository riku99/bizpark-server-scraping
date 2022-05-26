variable "scraping_base_url" {}
variable "service-account-email" {}

resource "google_cloud_scheduler_job" "scraping_jiji_scheduler" {
  name             = "scraping-jiji-scheduler"
  description      = "時事通信社のスクレイピング"
  schedule         = "*/10 * * * *"
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/jiji"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}

resource "google_cloud_scheduler_job" "scraping_mainichi_scheduler" {
  name = "scraping-mainichi-scheduler"
  description      = "毎日新聞のスクレイピング"
  schedule         = "*/10 * * * *"
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"
  
  retry_config {
    retry_count = 1
  }
}