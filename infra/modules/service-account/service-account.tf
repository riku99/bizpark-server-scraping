# スクレイピング用スケジューラのためのサービスアカウント
resource "google_service_account" "scraping_scheduler_invoker" {
  display_name = "Schedler Invoker"
  account_id   = "scraping-scheduler-invoker"
}

output "scraping-scheduler-invoker-email" {
  value = google_service_account.scraping_scheduler_invoker.email
}
