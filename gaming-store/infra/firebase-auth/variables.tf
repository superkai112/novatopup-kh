variable "project_id" {
  description = "Firebase/Google Cloud project ID."
  type        = string
  default     = "kaixqtopup21"
}

variable "enable_google_sign_in" {
  description = "Whether to configure Google as an Identity Platform sign-in provider."
  type        = bool
  default     = false
}

variable "google_oauth_client_id" {
  description = "OAuth 2.0 web client ID for Google sign-in."
  type        = string
  default     = ""
}

variable "google_oauth_client_secret" {
  description = "OAuth 2.0 web client secret. Terraform stores this in state; protect state access."
  type        = string
  sensitive   = true
  default     = ""
}
