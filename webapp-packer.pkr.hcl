packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "centos" {
  project_id         = "cloudgcp-414104"  # Enclose the project_id value in double quotes
  source_image_family = "centos-stream-8"
  zone               = "us-central1-a"
  ssh_username       = "centos"
  image_name         = "custom-image-{{timestamp}}"
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "file" {
    source      = "application.zip"
    destination = "/tmp/application.zip"
  }

  provisioner "file" {
    source      = "mysqlinstall.sh"
    destination = "/tmp/mysqlinstall.sh"
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

  
  provisioner "shell" {
    script = "nodeinstall.sh"
  }

  provisioner "shell" {
    script = "mysqlinstall.sh"
  }


  provisioner "shell" {
    script = "userPerm.sh"
  }

  provisioner "shell" {
    script = "nodeapplication.sh"
  }
}

 
            
            
            
