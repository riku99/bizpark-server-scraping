terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.11.0"
    }
  }
}

provider "google" {
  credentials = file(var.credentials_file)

  project = var.project
  region  = var.region
  zone    = var.zone
}

locals {
  deploy_target_branch = "main"
}

module "artifact-registry" {
  source               = "../modules/artifact-registry"
  project              = var.project
  location             = var.region
  artifact_registry_id = var.artifact_registry_id
}

module "service-account" {
  source  = "../modules/service-account"
  project = var.project
}

module "cloud-build" {
  source             = "../modules/cloud-build"
  region             = var.region
  target_branch      = local.deploy_target_branch
  registory_name     = var.registory_name
  news_save_endpoint = var.news_save_endpoint
}

module "cloud-scheduler" {
  source                = "../modules/cloud-scheduler"
  scraping_base_url     = var.scraping_base_url
  service-account-email = module.service-account.scraping-scheduler-invoker-email
}