packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos" {
  project_id          = "cloudgcp-414104"
  source_image_family = "centos-stream-8"
  zone                = "us-east1-b"
  ssh_username        = "centos"
  image_name          = "custom-image-{{timestamp}}"
  wait_to_add_ssh_keys = "60s"
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "null" {}


  provisioner "file" {
    source      = "application.zip"
    destination = "/tmp/application.zip"
  }

  
  provisioner "file" {
    source      = "nodeinstall.sh"
    destination = "/tmp/nodeinstall.sh"
  }

  provisioner "file" {
    source      = "userPerm.sh"
    destination = "/tmp/userPerm.sh"
  }

  provisioner "file" {
    source      = "nodeapplication.sh"
    destination = "/tmp/nodeapplication.sh"
  }

  provisioner "file" {
    source      = "opsAgentInstall.sh"
    destination = "/tmp/opsAgentInstall.sh"
  }

  provisioner "file" {
    source      = "opsAgentConfig.sh"
    destination = "/tmp/opsAgentConfig.sh"
  }

  provisioner "shell" {
    script = "nodeinstall.sh"
  }
  
  provisioner "shell" {
    script = "userPerm.sh"
  }

  provisioner "shell" {
    script = "nodeapplication.sh"
  }

  provisioner "shell" {
    script = "opsAgentInstall.sh"
  }

  provisioner "shell" {
    script = "opsAgentConfig.sh"
  }
}