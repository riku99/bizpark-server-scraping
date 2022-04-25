variable "project" {}

# スクレイピング用スケジューラのためのサービスアカウント
resource "google_service_account" "scraping_scheduler_invoker" {
  display_name = "Schedler Invoker"
  account_id   = "scraping-scheduler-invoker"
}

resource "google_project_iam_member" "run_invoker" {
  role = "roles/run.invoker"
  member = "serviceAccount:${google_service_account.scraping_scheduler_invoker.email}"
  project = var.project
}

output "scraping-scheduler-invoker-email" {
  value = google_service_account.scraping_scheduler_invoker.email
}
