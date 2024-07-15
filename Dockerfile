FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive


RUN apt-get update && \
    apt-get install -y zsh \
    build-essential \
    valgrind \
    clang \
    clang-format \
    cmake \
    git \
    curl \
    libcurl4-openssl-dev 


SHELL ["/bin/zsh", "-c"]


RUN [ ! -d "/root/.oh-my-zsh" ] && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true && \
    [ ! -d "/root/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" ] && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git /root/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting || true && \
    [ ! -d "/root/.oh-my-zsh/custom/plugins/zsh-autosuggestions" ] && git clone https://github.com/zsh-users/zsh-autosuggestions.git /root/.oh-my-zsh/custom/plugins/zsh-autosuggestions || true && \
    sed -i 's/plugins=(git)/plugins=(git z common-aliases node npm rand-quote sudo colored-man-pages colorize cp zsh-syntax-highlighting zsh-autosuggestions copyfile history dirhistory)/' /root/.zshrc


RUN ln -sf /usr/bin/clang /usr/bin/cc && \
    ln -sf /usr/bin/clang++ /usr/bin/c++


RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app
