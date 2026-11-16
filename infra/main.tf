terraform {
  required_version = ">= 1.5.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/dockerDesktopLinuxEngine"
}

resource "docker_container" "api_filmes" {
  name  = "api-filmes"
  image = "api-filmes:1.0"

  ports {
    internal = 3000
    external = 3001
    ip       = "127.0.0.1"
  }
}

output "url_api" {
  description = "Endereco da API de filmes"
  value       = "http://localhost:3001/filmes"
}