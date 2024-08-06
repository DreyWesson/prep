#include <iostream>
#include <string>
#include <list>
#include <cstring>
#include <cstdlib>
#include <unistd.h>
#include <netdb.h>
#include <sys/socket.h>
#include <netinet/in.h>

struct Client {
    int fd;
    int id;
    std::string msg;
};

class Server {
public:
    int sockfd;
    int max_fd;
    int port;
    int counter;
    fd_set readfds, writefds, active_fds;
    struct sockaddr_in addr;
    std::list<Client> clients;

    Server(int port);
    ~Server();
    void fatalError();
    int extract_message(std::string &buf, std::string &msg);
    void freeClient(Client &client);
    Client* addClient(int fd);
    Client* findClient(int fd);
    void removeClient(int fd);
    void deleteAll();
    void sendNotification(int fd, const std::string &msg);
    void sendMessage(Client &client);
    void deregisterClient(int fd, int cli_id);
    void processMessage(int fd);
    void registerClient(int fd);
    void acceptRegistration();
    void monitorFDs();
    void handleConnections();
    void bindAndListen();
    void configAddr();
    void createSock();
};

Server::Server(int port) : sockfd(-1), max_fd(-1), port(port), counter(0) {
    FD_ZERO(&active_fds);
    FD_ZERO(&readfds);
    FD_ZERO(&writefds);
}

Server::~Server() {
    deleteAll();
}

void Server::fatalError() {
    deleteAll();
    std::cerr << "Fatal error" << std::endl;
    exit(1);
}

// int Server::extract_message(std::string &buf, std::string &msg) {
//     size_t pos = buf.find('\n');
//     if (pos == std::string::npos) return 0;

//     msg = buf.substr(0, pos + 1);
//     buf = buf.substr(pos + 1);
//     return 1;
// }
int Server::extract_message(std::string &buf, std::string &msg) {
    size_t newline_pos = buf.find('\n');
    if (newline_pos != std::string::npos) {
        // Extract the message up to and including the newline character
        msg = buf.substr(0, newline_pos + 1);
        // Remove the extracted part from the buffer
        buf.erase(0, newline_pos + 1);
        return 1;
    }
    return 0; // No complete message found
}

void Server::freeClient(Client &client) {
    if (client.fd > 0) close(client.fd);
}

Client* Server::addClient(int fd) {
    Client client;
    client.fd = fd;
    client.id = counter++;
    client.msg = "";
    clients.push_back(client);
    return &clients.back();
}

Client* Server::findClient(int fd) {
    for (std::list<Client>::iterator it = clients.begin(); it != clients.end(); ++it) {
        if (it->fd == fd) return &(*it);
    }
    return 0;
}

void Server::removeClient(int fd) {
    for (std::list<Client>::iterator it = clients.begin(); it != clients.end(); ++it) {
        if (it->fd == fd) {
            freeClient(*it);
            clients.erase(it);
            break;
        }
    }
}

void Server::deleteAll() {
    for (std::list<Client>::iterator it = clients.begin(); it != clients.end(); ++it) {
        freeClient(*it);
    }
    clients.clear();
    if (sockfd > 0) {
        close(sockfd);
        sockfd = -1;
    }
}

void Server::sendNotification(int fd, const std::string &msg) {
    for (std::list<Client>::iterator it = clients.begin(); it != clients.end(); ++it) {
        if (FD_ISSET(it->fd, &writefds) && it->fd != fd) {
            if (send(it->fd, msg.c_str(), msg.size(), 0) < 0) fatalError();
        }
    }
}

void Server::sendMessage(Client &client) {
    std::string msg;
    while (extract_message(client.msg, msg)) {
        if (FD_ISSET(client.fd, &writefds)) {
            std::string buf = "client " + std::to_string(client.id) + ": ";
            sendNotification(client.fd, buf);
            sendNotification(client.fd, msg);
        }
    }
}

void Server::deregisterClient(int fd, int cli_id) {
    std::string buf = "server: client " + std::to_string(cli_id) + " just left\n";
    sendNotification(fd, buf);
    FD_CLR(fd, &active_fds);
    removeClient(fd);
}

void Server::processMessage(int fd) {
    char buf[4096];
    Client *client = findClient(fd);
    if (!client) return;

    int read_bytes = recv(fd, buf, sizeof(buf) - 1, 0);
    if (read_bytes <= 0) {
        deregisterClient(fd, client->id);
    } else {
        buf[read_bytes] = '\0';
        client->msg += std::string(buf);
        sendMessage(*client);
    }
}

void Server::registerClient(int fd) {
    Client *client = addClient(fd);
    if (!client) fatalError();

    FD_SET(client->fd, &active_fds);
    if (client->fd > max_fd) max_fd = client->fd;

    std::string buf = "server: client " + std::to_string(client->id) + " just arrived\n";
    sendNotification(fd, buf);
}

void Server::acceptRegistration() {
    struct sockaddr_in cli;
    socklen_t len = sizeof(cli);
    int fd = accept(sockfd, (struct sockaddr *)&cli, &len);
    if (fd < 0) fatalError();
    registerClient(fd);
}

void Server::monitorFDs() {
    if (select(max_fd + 1, &readfds, &writefds, NULL, NULL) < 0) fatalError();

    for (int fd = 0; fd <= max_fd; fd++) {
        if (FD_ISSET(fd, &readfds)) {
            if (fd == sockfd) {
                acceptRegistration();
            } else {
                processMessage(fd);
            }
        }
    }
}

void Server::handleConnections() {
    while (true) {
        readfds = active_fds;
        writefds = active_fds;
        monitorFDs();
    }
}

void Server::bindAndListen() {
    if (bind(sockfd, (const struct sockaddr *)&addr, sizeof(addr)) < 0) fatalError();
    if (listen(sockfd, SOMAXCONN) < 0) fatalError();
}

void Server::configAddr() {
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    addr.sin_port = htons(port);
}

void Server::createSock() {
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) fatalError();

    FD_SET(sockfd, &active_fds);
    max_fd = sockfd;
}

int main(int ac, char **av) {
    if (ac != 2) {
        std::cerr << "Wrong number of arguments" << std::endl;
        exit(1);
    }

    int port = std::atoi(av[1]);
    if (port <= 0 || port > 65535) {
        exit(1);
    }

    Server serv(port);
    serv.createSock();
    serv.configAddr();
    serv.bindAndListen();
    serv.handleConnections();

    return 0;
}
