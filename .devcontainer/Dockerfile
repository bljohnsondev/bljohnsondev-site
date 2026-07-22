FROM mcr.microsoft.com/devcontainers/javascript-node:latest

ARG NVIM_VERSION=v0.12.1

RUN apt-get update && apt-get install -y --no-install-recommends \
    ripgrep \
    lazygit \
    mariadb-client \
    postgresql-client \
    postgresql-client-common \
    sqlite3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# installs the neovim binary
RUN ARCH=$(uname -m) && \
    case "$ARCH" in \
      x86_64)  NVIM_ARCH="x86_64" ;; \
      aarch64|arm64) NVIM_ARCH="arm64" ;; \
      *) echo "Unsupported arch: $ARCH" && exit 1 ;; \
    esac && \
    curl -LO "https://github.com/neovim/neovim/releases/download/${NVIM_VERSION}/nvim-linux-${NVIM_ARCH}.tar.gz" && \
    tar -xzf "nvim-linux-${NVIM_ARCH}.tar.gz" && \
    cp -r "nvim-linux-${NVIM_ARCH}/." /usr/local/ && \
    rm -rf "nvim-linux-${NVIM_ARCH}"*

COPY bashrc-config /tmp/bashrc-config
