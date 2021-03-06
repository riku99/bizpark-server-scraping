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

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/mainichi"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}

resource "google_cloud_scheduler_job" "scraping_reuters_scheduler" {
  name = "scraping-reuters-scheduler"
  description      = "ロイターのスクレイピング"
  schedule         = "*/10 * * * *"
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"
  
  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/reuters"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}

resource "google_cloud_scheduler_job" "scraping_nikkei_scheduler" {
  name = "scraping-nikkei-scheduler"
  description      = "日経のスクレイピング"
  schedule         = "*/20 * * * *"
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"
  
  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/nikkei"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}

resource "google_cloud_scheduler_job" "scraping_business_insider_scheduler" {
  name = "scraping-business-insider"
  description = "ビシネスインサイダーのスクレイピング"
  schedule         = "0 */2 * * *" // 2時間毎
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/businnes-insider"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}

resource "google_cloud_scheduler_job" "scraping_asahi_scheduler" {
  name = "scraping-asahi"
  description = "朝日新聞のスクレイピング"
  schedule         = "*/20 * * * *" 
  time_zone        = "Asia/Tokyo"
  attempt_deadline = "360s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = "${var.scraping_base_url}/asahi"

    oidc_token {
      service_account_email = var.service-account-email
    }
  }
}